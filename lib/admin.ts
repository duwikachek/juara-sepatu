import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type AdminProfile = {
  id: string;
  email: string | null;
  full_name: string;
  role: "owner" | "staff";
  active: boolean;
};

export async function requireAdmin() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, email, full_name, role, active")
    .eq("id", user.id)
    .maybeSingle();

  const allowed =
    !!profile &&
    profile.active === true &&
    (profile.role === "owner" || profile.role === "staff");

  if (!allowed || !profile) {
    redirect("/login?error=not-admin");
  }

  return {
    supabase,
    user,
    profile: profile as AdminProfile,
    isOwner: profile.role === "owner",
  };
}

export function createProductSlug(name: string) {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);
}