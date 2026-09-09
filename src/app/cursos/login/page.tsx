"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function StudentLoginPage() {
  const { user, loading, signInWithGoogle, signInWithEmail, resetPassword } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [signingIn, setSigningIn] = useState(false);
  const [isCheckoutSuccess, setIsCheckoutSuccess] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("checkout") === "success") {
        setIsCheckoutSuccess(true);
      }
    }
  }, []);

  useEffect(() => {
    if (!loading && user) {
      router.push("/cursos");
    }
  }, [user, loading, router]);

  const handleGoogleLogin = async () => {
    setError("");
    setSuccess("");
    setSigningIn(true);
    const res = await signInWithGoogle();
    if (res.success) {
      router.push("/cursos");
    } else {
      setError(res.error || "No se pudo iniciar sesión con Google. Inténtalo de nuevo.");
      setSigningIn(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Por favor ingresa tu correo y contraseña.");
      return;
    }
    setError("");
    setSuccess("");
    setSigningIn(true);
    const res = await signInWithEmail(email, password);
    if (res.success) {
      router.push("/cursos");
    } else {
      setError(res.error || "Error de autenticación. Verifica tus datos.");
      setSigningIn(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setError("Por favor escribe tu correo electrónico en el recuadro para enviarte el enlace.");
      return;
    }
    setError("");
    setSuccess("");
    setSigningIn(true);
    const res = await resetPassword(email);
    if (res.success) {
      setSuccess(res.message || "¡Correo de recuperación enviado con éxito!");
    } else {
      setError(res.error || "No pudimos enviar el correo. Verifica que esté bien escrito.");
    }
    setSigningIn(false);
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] text-white flex flex-col items-center justify-center px-6 py-12">
      <div className="max-w-sm w-full text-center">
        {/* Logo / Badge */}
        <Link href="/" className="inline-flex items-center justify-center w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 shadow-xl shadow-blue-500/20 hover:scale-105 transition-transform">
          <span className="text-3xl">🎓</span>
        </Link>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-2 tracking-tight">
          Área de Alumnos
        </h1>
        <p className="text-slate-400 text-sm mb-8">
          Inicia sesión para acceder a tu programa digital
        </p>

        {isCheckoutSuccess && (
          <div className="mb-6 p-5 rounded-2xl bg-gradient-to-br from-emerald-500/20 via-teal-500/10 to-slate-900 border border-emerald-500/40 text-left shadow-xl shadow-emerald-500/10 animate-fade-in">
            <div className="flex items-center gap-3 mb-2">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 text-base">
                🎉
              </span>
              <h3 className="font-bold text-white text-base">
                ¡Inscripción confirmada con éxito!
              </h3>
            </div>
            <p className="text-emerald-200/90 text-xs leading-relaxed mb-3">
              Tu plaza y acceso de por vida al <strong>Programa Digital</strong> han quedado activados. Entra con el correo con el que te inscribiste o usa tu cuenta de Google.
            </p>
            <div className="text-[11px] text-emerald-300/80 bg-emerald-950/60 px-3 py-2 rounded-lg border border-emerald-500/25 flex items-center gap-2">
              <span>📩</span>
              <span>También te enviamos un correo con los detalles y comprobante de tu compra.</span>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-4 p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-medium text-left leading-relaxed">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-medium text-left leading-relaxed">
            {success}
          </div>
        )}

        {/* Email & Password Form */}
        <form onSubmit={handleEmailAuth} className="mb-4 space-y-3.5 text-left">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Correo Electrónico
            </label>
            <input
              type="email"
              placeholder="Tu correo (el que usaste al pagar)"
              className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-white placeholder:text-slate-500 text-sm focus:outline-hidden focus:border-blue-500 transition-colors"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Contraseña
            </label>
            <input
              type="password"
              placeholder="Tu contraseña"
              className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-white placeholder:text-slate-500 text-sm focus:outline-hidden focus:border-blue-500 transition-colors"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={signingIn}
            className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-600/30 transition-all disabled:opacity-50 cursor-pointer"
          >
            {signingIn ? "Cargando..." : "Entrar a mis Cursos"}
          </button>
        </form>

        {/* New student / forgot password card (Igual a AlepianoStudio) */}
        <div className="mb-6 text-center bg-slate-900/60 p-4 rounded-xl border border-slate-800/80">
          <p className="text-slate-400 text-xs mb-2 font-medium">
            ¿Eres alumno nuevo o no tienes contraseña?
          </p>
          <button
            onClick={handleForgotPassword}
            type="button"
            className="text-blue-400 hover:text-blue-300 text-xs font-bold transition-colors underline decoration-blue-400/40 underline-offset-4 cursor-pointer"
          >
            Crear o recuperar tu contraseña aquí
          </button>
        </div>

        {/* Separator */}
        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-800"></div>
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="px-3 bg-[#0B0F19] text-slate-500 font-semibold uppercase">
              O entra rápidamente con
            </span>
          </div>
        </div>

        {/* Google Login Button */}
        <button
          onClick={handleGoogleLogin}
          type="button"
          disabled={signingIn}
          className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-white text-slate-900 rounded-xl font-bold text-sm hover:bg-slate-100 transition-all disabled:opacity-50 cursor-pointer shadow-md"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          <span>Google</span>
        </button>

        <p className="mt-8 text-slate-500 text-xs">
          ¿Aún no eres miembro?{" "}
          <Link href="/#oferta" className="text-blue-400 hover:text-blue-300 font-semibold underline underline-offset-2">
            Inscríbete aquí
          </Link>
        </p>
      </div>
    </div>
  );
}
