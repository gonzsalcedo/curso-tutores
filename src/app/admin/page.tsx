"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getCourses, getStudents, Course, Student } from "@/lib/firestoreService";

export default function AdminDashboardPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [coursesData, studentsData] = await Promise.all([
          getCourses(),
          getStudents(),
        ]);
        setCourses(coursesData);
        setStudents(studentsData);
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const totalAlumnos = students.length;
  const totalCursos = courses.length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Hola, Gonzalo 👋
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Aquí tienes el resumen operativo de tu academia digital
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/courses"
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-lg shadow-blue-600/30 transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
          >
            <span>+ Crear Nuevo Curso</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[#111827] border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Alumnos Inscritos</span>
            <span className="text-lg">👥</span>
          </div>
          <div className="text-3xl font-black text-white">{totalAlumnos}</div>
          <p className="text-xs text-emerald-400 mt-2 flex items-center gap-1">
            <span>●</span> Acceso activo a la plataforma
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-[#111827] border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Cursos Creados</span>
            <span className="text-lg">📚</span>
          </div>
          <div className="text-3xl font-black text-white">{totalCursos}</div>
          <p className="text-xs text-blue-400 mt-2 flex items-center gap-1">
            <span>●</span> En plataforma
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-[#111827] border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Alojamiento Bunny.net</span>
            <span className="text-lg">🐰</span>
          </div>
          <div className="text-2xl font-black text-white">Stream Activo</div>
          <p className="text-xs text-slate-400 mt-2">
            Librería #623568 conectada
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-[#111827] border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Pasarela de Pago</span>
            <span className="text-lg">💳</span>
          </div>
          <div className="text-2xl font-black text-emerald-400">Stripe</div>
          <p className="text-xs text-slate-400 mt-2">
            Cuenta: Ya Es Buena
          </p>
        </div>
      </div>

      {/* Cursos Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">Tus Cursos</h2>
          <Link href="/admin/courses" className="text-xs text-blue-400 hover:text-blue-300 font-semibold">
            Gestionar todos →
          </Link>
        </div>

        {courses.length === 0 ? (
          <div className="p-8 rounded-2xl bg-[#111827] border border-slate-800 text-center space-y-4">
            <div className="text-4xl">🚀</div>
            <div>
              <h3 className="text-white font-bold text-base">Aún no has dado de alta tu primer curso</h3>
              <p className="text-slate-400 text-sm max-w-md mx-auto mt-1">
                Puedes inicializar el temario para &ldquo;Curso Digital Escalable&rdquo; y subir tus lecciones en video a Bunny.net de inmediato.
              </p>
            </div>
            <Link
              href="/admin/courses"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-all"
            >
              Crear Programa Digital
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {courses.map((course) => (
              <div
                key={course.id}
                className="p-5 rounded-2xl bg-[#111827] border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between space-y-4 group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-3xl p-2 rounded-xl bg-slate-800/60 border border-slate-700/50">
                      {course.emoji || "🎓"}
                    </span>
                    <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      Publicado
                    </span>
                  </div>
                  <h3 className="font-bold text-white text-base group-hover:text-blue-400 transition-colors">
                    {course.title}
                  </h3>
                  <p className="text-slate-400 text-xs mt-1.5 line-clamp-2 leading-relaxed">
                    {course.description || "Sin descripción"}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <Link
                    href={`/admin/courses/${course.id}`}
                    className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1"
                  >
                    <span>Editar Módulos y Videos</span>
                    <span>→</span>
                  </Link>
                  <Link
                    href={`/cursos/${course.id}`}
                    target="_blank"
                    className="text-xs text-slate-400 hover:text-white"
                  >
                    Ver como alumno
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Alumnos recientes */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">Alumnos Recientes</h2>
          <Link href="/admin/students" className="text-xs text-blue-400 hover:text-blue-300 font-semibold">
            Ver directorio completo →
          </Link>
        </div>

        <div className="bg-[#111827] border border-slate-800 rounded-2xl overflow-hidden">
          {students.length === 0 ? (
            <div className="p-6 text-center text-slate-400 text-sm">
              No hay alumnos registrados aún. En cuanto compren por Stripe o les des acceso manual aparecerán aquí.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-900/50 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
                  <tr>
                    <th className="px-5 py-3.5">Email</th>
                    <th className="px-5 py-3.5">Cursos Activos</th>
                    <th className="px-5 py-3.5">Fecha</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-medium">
                  {students.slice(0, 5).map((student) => (
                    <tr key={student.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="px-5 py-4 text-white font-semibold flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center text-xs text-slate-300">
                          {student.email.charAt(0).toUpperCase()}
                        </div>
                        <span>{student.email}</span>
                      </td>
                      <td className="px-5 py-4">
                        <span className="px-2 py-1 rounded-md bg-blue-500/10 text-blue-400 text-[11px] font-semibold border border-blue-500/20">
                          {student.enrolledCourses?.length || 1} curso(s)
                        </span>
                      </td>
                      <td className="px-5 py-4 text-slate-400">
                        {new Date(student.createdAt).toLocaleDateString("es-MX", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
