import { redirect } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import { LogoutButton } from "@/components/admin/logout-button";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { createClient } from "@/lib/supabase/server";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, email, role, active")
    .eq("id", user.id)
    .maybeSingle();

  const allowed =
    profile?.active === true &&
    (profile.role === "owner" || profile.role === "staff");

  if (!allowed || !profile) {
    redirect("/login?error=not-admin");
  }

  return (
    <div className="min-h-screen bg-neutral-950 pt-20">
      <div className="border-b border-neutral-800 bg-neutral-900/70">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-1 flex items-center gap-2 text-yellow-400">
              <ShieldCheck className="h-4 w-4" />
              <span className="text-[10px] font-bold uppercase tracking-widest">
                Panel {profile.role}
              </span>
            </div>
            <p className="font-bold text-white">
              {profile.full_name || profile.email || user.email}
            </p>
            <p className="text-xs text-neutral-500">
              {profile.email || user.email}
            </p>
          </div>

          <LogoutButton />
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-6 py-10 lg:grid-cols-[230px_1fr]">
        <aside>
          <AdminSidebar />
        </aside>

        <section>{children}</section>
      </div>
    </div>
  );
}