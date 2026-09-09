"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import {
  getCourse,
  getModules,
  getLessons,
  getStudentProgress,
  toggleLessonCompletion,
  Course,
  Module,
  Lesson,
} from "@/lib/firestoreService";

export default function VirtualClassroomPage({ params }: { params: Promise<{ courseId: string }> }) {
  const resolvedParams = use(params);
  const courseId = resolvedParams.courseId;

  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [course, setCourse] = useState<Course | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [lessonsMap, setLessonsMap] = useState<Record<string, Lesson[]>>({});
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/cursos/login");
      return;
    }

    async function loadCurriculum() {
      setLoading(true);
      try {
        const [c, mods, prog] = await Promise.all([
          getCourse(courseId),
          getModules(courseId),
          user ? getStudentProgress(user.uid, courseId) : null,
        ]);

        setCourse(c);
        setModules(mods);

        const lMap: Record<string, Lesson[]> = {};
        let firstLesson: Lesson | null = null;

        for (const m of mods) {
          const modLessons = await getLessons(courseId, m.id);
          lMap[m.id] = modLessons;
          if (!firstLesson && modLessons.length > 0) {
            firstLesson = modLessons[0];
          }
        }
        setLessonsMap(lMap);

        if (prog) {
          setCompletedLessons(prog.completedLessons || []);
          if (prog.lastLessonId) {
            // Find last accessed lesson
            for (const mId in lMap) {
              const match = lMap[mId].find((l) => l.id === prog.lastLessonId);
              if (match) {
                firstLesson = match;
                break;
              }
            }
          }
        }

        setActiveLesson(firstLesson);
      } catch (err) {
        console.error("Error loading classroom:", err);
      } finally {
        setLoading(false);
      }
    }

    if (user) {
      loadCurriculum();
    }
  }, [user, authLoading, courseId, router]);

  const handleToggleComplete = async (lessonId: string) => {
    if (!user) return;
    const updated = await toggleLessonCompletion(user.uid, courseId, lessonId);
    setCompletedLessons(updated);
  };

  // Calcular progreso total
  const allLessons = Object.values(lessonsMap).flat();
  const totalCount = allLessons.length;
  const completedCount = completedLessons.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Navegación anterior / siguiente
  const currentIndex = allLessons.findIndex((l) => l.id === activeLesson?.id);
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex >= 0 && currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col h-screen overflow-hidden">
      {/* Topbar */}
      <header className="h-14 border-b border-slate-800 bg-slate-900/90 backdrop-blur-md px-4 flex items-center justify-between shrink-0 z-30">
        <div className="flex items-center gap-3">
          <Link
            href="/cursos"
            className="text-xs font-semibold text-slate-400 hover:text-white px-2 py-1 rounded-lg border border-slate-800 hover:bg-slate-800 transition-colors flex items-center gap-1"
          >
            <span>← Mis Cursos</span>
          </Link>
          <div className="h-4 w-px bg-slate-800 hidden sm:block"></div>
          <span className="text-xs font-bold text-white truncate max-w-xs sm:max-w-md">
            {course?.title || "Curso Digital Escalable"}
          </span>
        </div>

        <div className="flex items-center gap-4">
          {/* Progress bar */}
          <div className="hidden md:flex items-center gap-2">
            <span className="text-[11px] font-semibold text-slate-400">Progreso:</span>
            <div className="w-28 bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-emerald-500 h-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
            <span className="text-[11px] font-bold text-emerald-400 font-mono">{progressPercent}%</span>
          </div>

          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors flex items-center gap-1.5"
          >
            <span>{sidebarOpen ? "Ocultar Temario" : "Ver Temario"}</span>
            <span>📑</span>
          </button>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Video & Lesson Content Area */}
        <div className="flex-1 flex flex-col overflow-y-auto bg-slate-950">
          {activeLesson ? (
            <div className="max-w-5xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
              {/* Video Player Container (Bunny.net Stream) */}
              <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black shadow-2xl border border-slate-800">
                {activeLesson.videoUrl ? (
                  <iframe
                    src={activeLesson.videoUrl}
                    loading="lazy"
                    style={{ border: 0, position: "absolute", top: 0, left: 0, height: "100%", width: "100%" }}
                    allow="accelerometer;gyroscope;autoplay;encrypted-media;picture-in-picture;"
                    allowFullScreen
                  />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center text-slate-400">
                    <div className="text-4xl mb-2">🎬</div>
                    <p className="font-semibold text-sm">Esta lección aún no tiene video asignado.</p>
                    <p className="text-xs text-slate-500 mt-1">El maestro la publicará muy pronto.</p>
                  </div>
                )}
              </div>

              {/* Lesson Controls & Info */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white">
                    {activeLesson.title}
                  </h2>
                  {activeLesson.duration && (
                    <p className="text-xs text-slate-400 mt-1">⏱️ Duración: {activeLesson.duration}</p>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleToggleComplete(activeLesson.id)}
                    className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 cursor-pointer ${
                      completedLessons.includes(activeLesson.id)
                        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                        : "bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700"
                    }`}
                  >
                    <span>{completedLessons.includes(activeLesson.id) ? "✓ Completada" : "○ Marcar como completada"}</span>
                  </button>
                </div>
              </div>

              {/* Navigation buttons */}
              <div className="flex items-center justify-between pt-2">
                {prevLesson ? (
                  <button
                    onClick={() => setActiveLesson(prevLesson)}
                    className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white text-xs font-semibold transition-colors flex items-center gap-2"
                  >
                    <span>← Lección Anterior</span>
                  </button>
                ) : (
                  <div></div>
                )}

                {nextLesson && (
                  <button
                    onClick={() => setActiveLesson(nextLesson)}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md shadow-blue-600/20 transition-all flex items-center gap-2 ml-auto"
                  >
                    <span>Siguiente Lección →</span>
                  </button>
                )}
              </div>

              {/* Lesson Notes */}
              {activeLesson.description && (
                <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Notas y Recursos de la Lección
                  </h3>
                  <div className="text-sm text-slate-300 whitespace-pre-wrap leading-relaxed">
                    {activeLesson.description}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400">
              <div className="text-5xl mb-3">🎓</div>
              <h3 className="text-lg font-bold text-white">No hay lecciones disponibles en este momento</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm">
                Selecciona otra sección o contacta a soporte para más detalles.
              </p>
            </div>
          )}
        </div>

        {/* Sidebar Curriculum */}
        {sidebarOpen && (
          <aside className="w-80 sm:w-96 border-l border-slate-800 bg-slate-900 flex flex-col shrink-0 overflow-y-auto z-20">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between sticky top-0 bg-slate-900 z-10">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Temario del Curso
              </h3>
              <span className="text-[11px] font-mono text-slate-400">
                {completedCount}/{totalCount}
              </span>
            </div>

            <div className="p-3 space-y-4 flex-1">
              {modules.map((mod, modIdx) => {
                const modLessons = lessonsMap[mod.id] || [];

                return (
                  <div key={mod.id} className="space-y-1.5">
                    <div className="px-2 py-1 text-xs font-bold text-slate-300 flex items-center justify-between">
                      <span className="truncate">{mod.title}</span>
                      <span className="text-[10px] text-slate-500 font-mono">M{modIdx + 1}</span>
                    </div>

                    <div className="space-y-1">
                      {modLessons.map((lesson) => {
                        const isSelected = activeLesson?.id === lesson.id;
                        const isDone = completedLessons.includes(lesson.id);

                        return (
                          <button
                            key={lesson.id}
                            onClick={() => setActiveLesson(lesson)}
                            className={`w-full text-left p-2.5 rounded-xl text-xs transition-all flex items-start gap-2.5 ${
                              isSelected
                                ? "bg-blue-600 text-white font-bold shadow-md shadow-blue-600/30"
                                : "text-slate-300 hover:bg-slate-800/80"
                            }`}
                          >
                            <span
                              onClick={(e) => {
                                e.stopPropagation();
                                handleToggleComplete(lesson.id);
                              }}
                              className={`mt-0.5 w-4 h-4 rounded-full flex items-center justify-center text-[10px] shrink-0 border cursor-pointer ${
                                isDone
                                  ? isSelected
                                    ? "bg-white text-blue-600 border-white"
                                    : "bg-emerald-500 text-slate-950 border-emerald-500 font-black"
                                  : isSelected
                                  ? "border-white/50 text-transparent"
                                  : "border-slate-600 text-transparent hover:border-slate-400"
                              }`}
                            >
                              ✓
                            </span>
                            <div className="flex-1 truncate">
                              <p className="truncate">{lesson.title}</p>
                              {lesson.duration && (
                                <p className={`text-[10px] mt-0.5 ${isSelected ? "text-blue-200" : "text-slate-500"}`}>
                                  {lesson.duration}
                                </p>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
