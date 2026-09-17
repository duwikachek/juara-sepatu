import Link from "next/link";
import { ShieldCheck, ExternalLink } from "lucide-react";
import { LogoutButton } from "@/components/admin/logout-button";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { requireAdmin } from "@/lib/admin";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, profile } = await requireAdmin();

  return (
    <div className="min-h-screen bg-neutral-950 pt-16 sm:pt-20">
      {/* Top bar */}
      <div className="border-b border-neutral-800 bg-neutral-900/80 backdrop-blur-sm sticky top-0 z-30">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 sm:py-4">
          <div className="flex items-center gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-brand">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Editor Web ({profile.role})
                </span>
              </div>
              <p className="text-sm font-bold text-white truncate max-w-[200px] sm:max-w-none">
                {profile.full_name || profile.email || user.email}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-700 bg-neutral-800/80 px-3 py-1.5 text-xs font-bold text-neutral-300 transition hover:border-brand hover:text-brand"
              title="Buka website di tab baru"
            >
              <span>Lihat Web</span>
              <ExternalLink className="h-3 w-3" />
            </Link>

            <LogoutButton />
          </div>
        </div>
      </div>

      {/* Main admin workspace */}
      <div className="mx-auto max-w-7xl px-3 py-4 sm:px-6 sm:py-6 lg:grid lg:grid-cols-[220px_1fr] lg:gap-8">
        <aside className="mb-4 lg:mb-0">
          <AdminSidebar />
        </aside>

        <section className="min-w-0">{children}</section>
      </div>
    </div>
  );
}