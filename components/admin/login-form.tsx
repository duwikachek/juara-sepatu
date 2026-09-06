"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  Eye,
  EyeOff,
  LoaderCircle,
  LockKeyhole,
  LogIn,
  Mail,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface LoginFormProps {
  nextPath?: string;
  initialMessage?: string;
}

export function LoginForm({
  nextPath = "/admin",
  initialMessage,
}: LoginFormProps) {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(initialMessage ?? "");

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setLoading(true);
    setError("");

    const { data, error: loginError } =
      await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

    if (loginError || !data.user) {
      setError("Email atau password salah.");
      setLoading(false);
      return;
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role, active")
      .eq("id", data.user.id)
      .maybeSingle();

    const isAdmin =
      profile?.active === true &&
      (profile.role === "owner" || profile.role === "staff");

    if (profileError || !isAdmin) {
      await supabase.auth.signOut();
      setError("Akun ini tidak mempunyai akses ke halaman admin.");
      setLoading(false);
      return;
    }

    const destination = nextPath.startsWith("/admin")
      ? nextPath
      : "/admin";

    router.replace(destination);
    router.refresh();
  };

  return (
    <form
      onSubmit={handleLogin}
      className="w-full space-y-5 rounded-2xl border border-neutral-800 bg-neutral-900/70 p-6 shadow-2xl backdrop-blur md:p-8"
    >
      <div className="mb-7 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-yellow-400 text-black">
          <LockKeyhole className="h-6 w-6" />
        </div>

        <h1 className="text-2xl font-black uppercase tracking-tight">
          Login Admin
        </h1>

        <p className="mt-2 text-sm text-neutral-400">
          Masuk menggunakan akun Owner atau Staff.
        </p>
      </div>

      {error && (
        <div className="flex items-start gap-2 rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div>
        <label
          htmlFor="email"
          className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-neutral-400"
        >
          Email
        </label>

        <div className="relative">
          <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />

          <input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="admin@juarasepatu.com"
            className="w-full rounded-lg border border-neutral-800 bg-neutral-950 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-yellow-400"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="password"
          className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-neutral-400"
        >
          Password
        </label>

        <div className="relative">
          <LockKeyhole className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />

          <input
            id="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Masukkan password"
            className="w-full rounded-lg border border-neutral-800 bg-neutral-950 py-3 pl-10 pr-12 text-sm outline-none transition focus:border-yellow-400"
          />

          <button
            type="button"
            onClick={() => setShowPassword((current) => !current)}
            aria-label={
              showPassword ? "Sembunyikan password" : "Tampilkan password"
            }
            className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 transition hover:text-yellow-400"
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-yellow-400 py-3.5 text-sm font-black uppercase tracking-widest text-black transition hover:bg-yellow-300 disabled:cursor-wait disabled:opacity-60"
      >
        {loading ? (
          <>
            <LoaderCircle className="h-5 w-5 animate-spin" />
            Memeriksa...
          </>
        ) : (
          <>
            <LogIn className="h-5 w-5" />
            Masuk
          </>
        )}
      </button>

      <p className="text-center text-xs leading-relaxed text-neutral-500">
        Halaman ini hanya untuk pengelola Juara Sepatu.
      </p>
    </form>
  );
}