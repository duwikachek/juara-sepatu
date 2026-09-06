import type { Metadata } from "next";
import { LoginForm } from "@/components/admin/login-form";

export const metadata: Metadata = {
  title: "Login Admin",
  description: "Halaman login pengelola Juara Sepatu.",
};

type LoginPageProps = {
  searchParams: Promise<{
    next?: string;
    error?: string;
  }>;
};

export default async function LoginPage({
  searchParams,
}: LoginPageProps) {
  const params = await searchParams;

  const nextPath =
    params.next?.startsWith("/admin") ? params.next : "/admin";

  const initialMessage =
    params.error === "not-admin"
      ? "Akun kamu tidak mempunyai akses ke halaman admin."
      : "";

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 pb-20 pt-32">
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-yellow-500/10 blur-[120px]" />

      <div className="relative z-10 w-full max-w-md">
        <LoginForm
          nextPath={nextPath}
          initialMessage={initialMessage}
        />
      </div>
    </main>
  );
}