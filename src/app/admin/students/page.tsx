"use client";

import { useEffect, useState } from "react";
import { getStudents, getCourses, grantCourseAccess, revokeCourseAccess, Student, Course } from "@/lib/firestoreService";

export default function AdminStudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Modal
  const [showModal, setShowModal] = useState(false);
  const [emailToGrant, setEmailToGrant] = useState("");
  const [courseToGrant, setCourseToGrant] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [sData, cData] = await Promise.all([getStudents(), getCourses()]);
      setStudents(sData);
      setCourses(cData);
      if (cData.length > 0) {
        setCourseToGrant(cData[0].id);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleGrantAccess = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailToGrant.trim() || !courseToGrant) return;
    setSubmitting(true);
    try {
      await grantCourseAccess(emailToGrant.trim(), courseToGrant);
      setShowModal(false);
      setEmailToGrant("");
      await loadData();
    } catch (err) {
      console.error("Error granting access:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleRevoke = async (email: string, courseId: string) => {
    if (!confirm(`¿Revocar acceso al curso "${courseId}" para ${email}?`)) return;
    await revokeCourseAccess(email, courseId);
    await loadData();
  };

  const filtered = students.filter((s) =>
    s.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Directorio de Alumnos
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Gestiona accesos manuales o revisa los alumnos que han comprado por Stripe
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-lg shadow-blue-600/30 transition-all hover:scale-105 active:scale-95 flex items-center gap-2 cursor-pointer w-fit"
        >
          <span>+ Dar Acceso Manual</span>
        </button>
      </div>

      {/* Search and stats bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative max-w-md w-full">
          <input
            type="text"
            placeholder="Buscar por correo electrónico..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#111827] border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-hidden focus:border-blue-500"
          />
          <span className="absolute left-3.5 top-3 text-slate-500 text-sm">🔍</span>
        </div>
        <div className="text-xs text-slate-400">
          Total de alumnos: <span className="font-bold text-white">{students.length}</span>
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#111827] border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-sm">
            No se encontraron alumnos con el criterio de búsqueda.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900/60 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
                <tr>
                  <th className="px-6 py-4">Alumno</th>
                  <th className="px-6 py-4">Cursos Asignados</th>
                  <th className="px-6 py-4">Fecha de Registro</th>
                  <th className="px-6 py-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-medium">
                {filtered.map((student) => (
                  <tr key={student.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-blue-400">
                          {student.email.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-white text-sm">{student.email}</p>
                          {student.displayName && (
                            <p className="text-[11px] text-slate-400">{student.displayName}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1.5">
                        {(student.enrolledCourses || []).map((cId) => (
                          <span
                            key={cId}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-500/10 text-blue-400 text-[11px] font-semibold border border-blue-500/20"
                          >
                            <span>{cId}</span>
                            <button
                              onClick={() => handleRevoke(student.email, cId)}
                              className="text-slate-500 hover:text-red-400 transition-colors"
                              title="Revocar curso"
                            >
                              ✕
                            </button>
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-400">
                      {new Date(student.createdAt).toLocaleDateString("es-MX", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => {
                          setEmailToGrant(student.email);
                          setShowModal(true);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
                      >
                        + Curso
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Dar Acceso */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-[#111827] border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">Dar Acceso Manual a un Alumno</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white">
                ✕
              </button>
            </div>

            <form onSubmit={handleGrantAccess} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Correo Electrónico del Alumno
                </label>
                <input
                  type="email"
                  required
                  placeholder="alumno@ejemplo.com"
                  value={emailToGrant}
                  onChange={(e) => setEmailToGrant(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-hidden focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Seleccionar Curso
                </label>
                <select
                  value={courseToGrant}
                  onChange={(e) => setCourseToGrant(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-hidden focus:border-blue-500"
                >
                  <option value="curso-tutores">Curso Tutores (Default)</option>
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-all disabled:opacity-50"
                >
                  {submitting ? "Asignando..." : "Asignar Acceso"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
