"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import type { User } from "firebase/auth";

const ADMIN_EMAIL = (process.env.NEXT_PUBLIC_ADMIN_EMAIL || "gonsalcedod@gmail.com").toLowerCase().trim();

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  signInWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  signInWithEmail: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  resetPassword: (email: string) => Promise<{ success: boolean; message?: string; error?: string }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isAdmin: false,
  signInWithGoogle: async () => ({ success: false }),
  signInWithEmail: async () => ({ success: false }),
  resetPassword: async () => ({ success: false }),
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const isAdmin = user?.email?.toLowerCase().trim() === ADMIN_EMAIL;

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    import("@/lib/firebaseConfig").then(({ auth }) => {
      import("firebase/auth").then(({ onAuthStateChanged }) => {
        unsubscribe = onAuthStateChanged(auth, (u) => {
          setUser(u);
          setLoading(false);
        });
      });
    });

    const timeout = setTimeout(() => setLoading(false), 3000);

    return () => {
      clearTimeout(timeout);
      unsubscribe?.();
    };
  }, []);

  const signInWithGoogle = async () => {
    try {
      const { auth } = await import("@/lib/firebaseConfig");
      const { signInWithPopup, GoogleAuthProvider } = await import("firebase/auth");
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
      return { success: true };
    } catch (err: any) {
      console.error("Google sign in error:", err);
      return { success: false, error: err?.message || "Error al iniciar sesión con Google." };
    }
  };

  const signInWithEmail = async (email: string, pass: string) => {
    try {
      const { auth } = await import("@/lib/firebaseConfig");
      const { signInWithEmailAndPassword } = await import("firebase/auth");
      const result = await signInWithEmailAndPassword(auth, email.trim(), pass);
      setUser(result.user);
      return { success: true };
    } catch (err: any) {
      console.error("Email sign in error:", err);
      if (
        err.code === "auth/invalid-credential" ||
        err.code === "auth/user-not-found" ||
        err.code === "auth/wrong-password"
      ) {
        return { success: false, error: "Correo o contraseña incorrectos." };
      }
      return { success: false, error: "Error de autenticación. Verifica tus datos." };
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const cleanEmail = email.toLowerCase().trim();
      const { auth } = await import("@/lib/firebaseConfig");
      const { sendPasswordResetEmail, createUserWithEmailAndPassword, signOut: fbSignOut } = await import("firebase/auth");
      auth.languageCode = "es";

      // Si es alumno nuevo proveniente de compra por Stripe sin contraseña creada aún,
      // creamos la cuenta en silencio con clave aleatoria para que Firebase pueda despachar el reset email.
      try {
        const dummyPassword = Math.random().toString(36).slice(2) + "A1@xZ9";
        await createUserWithEmailAndPassword(auth, cleanEmail, dummyPassword);
        await fbSignOut(auth);
      } catch {}

      await sendPasswordResetEmail(auth, cleanEmail);
      return {
        success: true,
        message: "¡Te enviamos un correo! Úsalo para crear tu contraseña por primera vez o restablecerla. (Revisa tu carpeta de spam y promociones)",
      };
    } catch (err: any) {
      console.error("Reset password error:", err);
      return { success: false, error: "Ocurrió un error al intentar enviar el correo. Verifica que tu correo esté bien escrito." };
    }
  };

  const signOut = async () => {
    const { auth } = await import("@/lib/firebaseConfig");
    const { signOut: fbSignOut } = await import("firebase/auth");
    await fbSignOut(auth);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAdmin,
        signInWithGoogle,
        signInWithEmail,
        resetPassword,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
