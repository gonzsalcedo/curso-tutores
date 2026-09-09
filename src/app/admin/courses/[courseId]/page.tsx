"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import {
  getCourse,
  getModules,
  getLessons,
  createModule,
  updateModule,
  deleteModule,
  createLesson,
  updateLesson,
  deleteLesson,
  Course,
  Module,
  Lesson,
} from "@/lib/firestoreService";

export default function CourseCurriculumPage({ params }: { params: Promise<{ courseId: string }> }) {
  const resolvedParams = use(params);
  const courseId = resolvedParams.courseId;

  const [course, setCourse] = useState<Course | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [lessonsMap, setLessonsMap] = useState<Record<string, Lesson[]>>({});
  const [loading, setLoading] = useState(true);

  // Modals state
  const [moduleModalOpen, setModuleModalOpen] = useState(false);
  const [editingModule, setEditingModule] = useState<Module | null>(null);
  const [moduleTitle, setModuleTitle] = useState("");

  const [lessonModalOpen, setLessonModalOpen] = useState(false);
  const [targetModuleId, setTargetModuleId] = useState<string>("");
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [lessonTitle, setLessonTitle] = useState("");
  const [lessonDescription, setLessonDescription] = useState("");
  const [lessonVideoUrl, setLessonVideoUrl] = useState("");
  const [lessonDuration, setLessonDuration] = useState("");

  // Video Uploading to Bunny State
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState("");

  // Active preview
  const [previewVideoUrl, setPreviewVideoUrl] = useState<string | null>(null);

  const loadAll = async () => {
    setLoading(true);
    try {
      const c = await getCourse(courseId);
      setCourse(c);

      const mods = await getModules(courseId);
      setModules(mods);

      const lessonsRecord: Record<string, Lesson[]> = {};
      for (const m of mods) {
        lessonsRecord[m.id] = await getLessons(courseId, m.id);
      }
      setLessonsMap(lessonsRecord);
    } catch (err) {
      console.error("Error loading curriculum:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, [courseId]);

  // ---------- Module Handlers ----------
  const handleSaveModule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!moduleTitle.trim()) return;

    if (editingModule) {
      await updateModule(courseId, editingModule.id, { title: moduleTitle });
    } else {
      await createModule(courseId, { title: moduleTitle, order: modules.length });
    }
    setModuleModalOpen(false);
    setModuleTitle("");
    setEditingModule(null);
    loadAll();
  };

  const handleDeleteModule = async (moduleId: string, title: string) => {
    if (!confirm(`¿Eliminar módulo "${title}" y todas sus lecciones?`)) return;
    await deleteModule(courseId, moduleId);
    loadAll();
  };

  // ---------- Lesson Handlers ----------
  const openCreateLesson = (moduleId: string) => {
    setTargetModuleId(moduleId);
    setEditingLesson(null);
    setLessonTitle("");
    setLessonDescription("");
    setLessonVideoUrl("");
    setLessonDuration("");
    setUploadStatus("");
    setLessonModalOpen(true);
  };

  const openEditLesson = (moduleId: string, lesson: Lesson) => {
    setTargetModuleId(moduleId);
    setEditingLesson(lesson);
    setLessonTitle(lesson.title);
    setLessonDescription(lesson.description || "");
    setLessonVideoUrl(lesson.videoUrl || "");
    setLessonDuration(lesson.duration || "");
    setUploadStatus("");
    setLessonModalOpen(true);
  };

  const handleSaveLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lessonTitle.trim() || !targetModuleId) return;

    const currentLessons = lessonsMap[targetModuleId] || [];

    if (editingLesson) {
      await updateLesson(courseId, targetModuleId, editingLesson.id, {
        title: lessonTitle,
        description: lessonDescription,
        videoUrl: lessonVideoUrl,
        duration: lessonDuration,
      });
    } else {
      await createLesson(courseId, targetModuleId, {
        title: lessonTitle,
        description: lessonDescription,
        videoUrl: lessonVideoUrl,
        duration: lessonDuration,
        order: currentLessons.length,
      });
    }

    setLessonModalOpen(false);
    loadAll();
  };

  const handleDeleteLesson = async (moduleId: string, lessonId: string, title: string) => {
    if (!confirm(`¿Eliminar la lección "${title}"?`)) return;
    await deleteLesson(courseId, moduleId, lessonId);
    loadAll();
  };

  // ---------- Bunny.net Video Upload Handler ----------
  const handleFileUploadToBunny = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingVideo(true);
    setUploadProgress(10);
    setUploadStatus("1/3 Inicializando video en biblioteca de Bunny.net...");

    try {
      // 1. Obtener upload URL y Video ID desde nuestra API
      const initRes = await fetch("/api/upload-video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: lessonTitle || file.name }),
      });

      if (!initRes.ok) throw new Error("Fallo al crear video en Bunny");
      const { videoId, uploadUrl, apiKey, embedUrl } = await initRes.json();

      setUploadProgress(30);
      setUploadStatus(`2/3 Transfiriendo archivo (${(file.size / (1024 * 1024)).toFixed(1)} MB) a Bunny.net...`);

      // 2. Subida directa del cliente a Bunny.net sin consumir recursos de Vercel
      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("PUT", uploadUrl);
        xhr.setRequestHeader("AccessKey", apiKey);
        xhr.setRequestHeader("Content-Type", "application/octet-stream");

        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const percent = 30 + Math.round((event.loaded / event.total) * 65);
            setUploadProgress(percent);
          }
        };

        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) resolve();
          else reject(new Error(`Error de subida Bunny: ${xhr.statusText}`));
        };

        xhr.onerror = () => reject(new Error("Error de red al subir archivo a Bunny"));
        xhr.send(file);
      });

      setUploadProgress(100);
      setUploadStatus("✅ ¡Video subido con éxito a Bunny.net Stream!");
      setLessonVideoUrl(embedUrl);
    } catch (err: any) {
      console.error(err);
      setUploadStatus(`❌ Error: ${err.message || "Fallo en la subida"}`);
    } finally {
      setUploadingVideo(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-1">
            <Link href="/admin/courses" className="hover:text-white">
              Cursos
            </Link>
            <span>/</span>
            <span className="text-white">{course?.title}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-3">
            <span>{course?.emoji || "🎓"}</span>
            <span>{course?.title}</span>
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            Organiza los módulos, lecciones y videos alojados en Bunny.net
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href={`/cursos/${courseId}`}
            target="_blank"
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors flex items-center gap-1.5"
          >
            <span>Ver como Alumno</span>
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
          </Link>
          <button
            onClick={() => {
              setEditingModule(null);
              setModuleTitle("");
              setModuleModalOpen(true);
            }}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md shadow-blue-600/30 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <span>+ Añadir Módulo</span>
          </button>
        </div>
      </div>

      {/* Video Preview Modal */}
      {previewVideoUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xs">
          <div className="bg-[#111827] border border-slate-800 rounded-2xl max-w-3xl w-full p-4 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs font-bold text-slate-300">Reproductor Bunny.net Stream</span>
              <button
                onClick={() => setPreviewVideoUrl(null)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕ Cerrar
              </button>
            </div>
            <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black">
              <iframe
                src={previewVideoUrl}
                loading="lazy"
                style={{ border: 0, position: "absolute", top: 0, height: "100%", width: "100%" }}
                allow="accelerometer;gyroscope;autoplay;encrypted-media;picture-in-picture;"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}

      {/* Curriculum List */}
      {modules.length === 0 ? (
        <div className="p-12 rounded-2xl bg-[#111827] border border-slate-800 text-center space-y-4">
          <div className="text-4xl">📂</div>
          <h3 className="text-white font-bold text-base">Este curso aún no tiene módulos</h3>
          <p className="text-slate-400 text-xs max-w-md mx-auto">
            Crea tu primer módulo (ej. &ldquo;Módulo 1: La Oferta Educativa Irresistible&rdquo;) para empezar a agregar lecciones con video.
          </p>
          <button
            onClick={() => {
              setEditingModule(null);
              setModuleTitle("");
              setModuleModalOpen(true);
            }}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all"
          >
            Crear Primer Módulo
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {modules.map((mod, modIdx) => {
            const lessons = lessonsMap[mod.id] || [];

            return (
              <div
                key={mod.id}
                className="bg-[#111827] border border-slate-800 rounded-2xl overflow-hidden shadow-lg"
              >
                {/* Module Header */}
                <div className="p-4 sm:p-5 bg-slate-900/60 border-b border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center text-xs font-bold">
                      {modIdx + 1}
                    </span>
                    <h3 className="font-bold text-white text-base">{mod.title}</h3>
                    <span className="text-[11px] text-slate-400 px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700">
                      {lessons.length} lección(es)
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openCreateLesson(mod.id)}
                      className="px-3 py-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white text-xs font-semibold border border-blue-500/30 transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <span>+ Añadir Lección</span>
                    </button>
                    <button
                      onClick={() => {
                        setEditingModule(mod);
                        setModuleTitle(mod.title);
                        setModuleModalOpen(true);
                      }}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors text-xs"
                      title="Editar título del módulo"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDeleteModule(mod.id, mod.title)}
                      className="p-1.5 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors text-xs"
                      title="Eliminar módulo"
                    >
                      🗑️
                    </button>
                  </div>
                </div>

                {/* Lessons in Module */}
                <div className="p-4 space-y-2.5">
                  {lessons.length === 0 ? (
                    <div className="py-6 text-center text-slate-500 text-xs">
                      No hay lecciones en este módulo. Haz clic en &ldquo;+ Añadir Lección&rdquo; para agregar una.
                    </div>
                  ) : (
                    lessons.map((lesson, lessonIdx) => (
                      <div
                        key={lesson.id}
                        className="p-3.5 rounded-xl bg-slate-900/40 border border-slate-800/80 hover:border-slate-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-mono text-slate-500">
                            {modIdx + 1}.{lessonIdx + 1}
                          </span>
                          <div>
                            <h4 className="font-semibold text-white text-sm group-hover:text-blue-400 transition-colors">
                              {lesson.title}
                            </h4>
                            <div className="flex items-center gap-2 mt-1">
                              {lesson.duration && (
                                <span className="text-[11px] text-slate-400">⏱️ {lesson.duration}</span>
                              )}
                              {lesson.videoUrl ? (
                                <span className="text-[10px] text-emerald-400 px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 font-semibold">
                                  Video Bunny.net Conectado
                                </span>
                              ) : (
                                <span className="text-[10px] text-amber-400 px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/20 font-semibold">
                                  Falta Video
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 self-end sm:self-auto">
                          {lesson.videoUrl && (
                            <button
                              onClick={() => setPreviewVideoUrl(lesson.videoUrl)}
                              className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 text-xs font-medium transition-colors flex items-center gap-1 cursor-pointer"
                            >
                              <span>▶️ Ver</span>
                            </button>
                          )}
                          <button
                            onClick={() => openEditLesson(mod.id, lesson)}
                            className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 text-xs font-medium transition-colors cursor-pointer"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => handleDeleteLesson(mod.id, lesson.id, lesson.title)}
                            className="p-1 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 text-xs cursor-pointer"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Módulo */}
      {moduleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-[#111827] border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">
                {editingModule ? "Editar Módulo" : "Nuevo Módulo"}
              </h3>
              <button onClick={() => setModuleModalOpen(false)} className="text-slate-400 hover:text-white">
                ✕
              </button>
            </div>
            <form onSubmit={handleSaveModule} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Título del Módulo
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Módulo 1: Fundamentos y Embudos"
                  value={moduleTitle}
                  onChange={(e) => setModuleTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-hidden focus:border-blue-500"
                />
              </div>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setModuleModalOpen(false)}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-all"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Lección con Subidor Bunny.net */}
      {lessonModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="bg-[#111827] border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">
                {editingLesson ? "Editar Lección" : "Nueva Lección"}
              </h3>
              <button onClick={() => setLessonModalOpen(false)} className="text-slate-400 hover:text-white">
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveLesson} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Título de la Lección
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Cómo estructurar tu oferta en 1 página"
                  value={lessonTitle}
                  onChange={(e) => setLessonTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-hidden focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Duración estimada
                </label>
                <input
                  type="text"
                  placeholder="Ej. 12 min"
                  value={lessonDuration}
                  onChange={(e) => setLessonDuration(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-hidden focus:border-blue-500"
                />
              </div>

              {/* Bunny Video Upload Section */}
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span>🐰 Video Bunny.net Stream</span>
                  </label>
                  <span className="text-[10px] text-slate-400 font-mono">Librería #623568</span>
                </div>

                {/* Subir archivo directo a Bunny */}
                <div>
                  <label className="block text-xs text-slate-400 mb-2">
                    Subir video desde tu computadora (se procesa y aloja en Bunny.net):
                  </label>
                  <input
                    type="file"
                    accept="video/*"
                    disabled={uploadingVideo}
                    onChange={handleFileUploadToBunny}
                    className="block w-full text-xs text-slate-400 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-600/20 file:text-blue-300 hover:file:bg-blue-600/30 file:cursor-pointer cursor-pointer"
                  />
                </div>

                {uploadingVideo && (
                  <div className="space-y-1.5 pt-1">
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-blue-500 h-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                    <p className="text-[11px] text-blue-400 font-mono">{uploadStatus}</p>
                  </div>
                )}

                {uploadStatus && !uploadingVideo && (
                  <p className="text-[11px] text-emerald-400 font-medium">{uploadStatus}</p>
                )}

                <div className="pt-2 border-t border-slate-800">
                  <label className="block text-[11px] text-slate-400 mb-1">
                    O pega la URL de Embed de Bunny.net manualmente:
                  </label>
                  <input
                    type="text"
                    placeholder="https://iframe.mediadelivery.net/embed/623568/..."
                    value={lessonVideoUrl}
                    onChange={(e) => setLessonVideoUrl(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-600 font-mono focus:outline-hidden focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Notas o descripción de la lección
                </label>
                <textarea
                  rows={3}
                  placeholder="Puntos clave, plantillas y enlaces para los alumnos..."
                  value={lessonDescription}
                  onChange={(e) => setLessonDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-hidden focus:border-blue-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setLessonModalOpen(false)}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={uploadingVideo}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-all disabled:opacity-50"
                >
                  Guardar Lección
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
