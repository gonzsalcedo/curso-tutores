"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { getCourses, Course } from "@/lib/firestoreService";

export default function StudentCoursesDashboard() {
  const { user, loading, signOut, isAdmin } = useAuth();
  const router = useRouter();

  const [courses, setCourses] = useState<Course[]>([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/cursos/login");
      return;
    }

    async function load() {
      setFetching(true);
      try {
        const allCourses = await getCourses();
        setCourses(allCourses);
      } catch (err) {
        console.error("Error loading courses:", err);
      } finally {
        setFetching(false);
      }
    }

    if (user) {
      load();
    }
  }, [user, loading, router]);

  if (loading || fetching) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Topbar */}
      <header className="border-b border-slate-800/80 bg-slate-900/90 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/cursos" className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-sm shadow-md">
              🎓
            </div>
            <span className="font-bold text-white text-base tracking-tight">Mis Cursos</span>
          </Link>

          <div className="flex items-center gap-3">
            {isAdmin && (
              <Link
                href="/admin"
                className="text-xs font-bold text-blue-400 bg-blue-500/10 border border-blue-500/20 px-3 py-1.5 rounded-lg hover:bg-blue-500/20 transition-colors"
              >
                Panel Maestro
              </Link>
            )}

            <span className="hidden sm:inline-block text-xs text-slate-400 font-medium">
              {user?.email}
            </span>

            <button
              onClick={() => signOut()}
              className="text-xs font-semibold text-slate-400 hover:text-white px-2.5 py-1.5 rounded-lg border border-slate-800 hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Salir
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-10 space-y-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Bienvenido a tu Academia Digital 🚀
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Selecciona un programa para continuar donde lo dejaste
          </p>
        </div>

        {courses.length === 0 ? (
          <div className="p-12 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-4">
            <div className="text-4xl">🎓</div>
            <h3 className="text-white font-bold text-lg">Cursos en preparación</h3>
            <p className="text-slate-400 text-xs max-w-md mx-auto">
              El maestro está terminando de cargar los módulos y videos. Pronto estarán disponibles aquí.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div
                key={course.id}
                className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-6 transition-all flex flex-col justify-between space-y-6 shadow-xl group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-4xl p-2.5 rounded-2xl bg-slate-800/80 border border-slate-700">
                      {course.emoji || "🎓"}
                    </span>
                    <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      Acceso Activo
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">
                    {course.title}
                  </h3>
                  <p className="text-slate-400 text-xs mt-2 line-clamp-3 leading-relaxed">
                    {course.description || "Aprende a escalar tus cursos con automatización y contenido de alto valor."}
                  </p>
                </div>

                <div className="space-y-3 pt-4 border-t border-slate-800">
                  <Link
                    href={`/cursos/${course.id}`}
                    className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs text-center transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20"
                  >
                    <span>Continuar Lecciones</span>
                    <span>→</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
