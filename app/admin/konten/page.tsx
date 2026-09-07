import { requireAdmin } from "@/lib/admin";
import { FALLBACK_SETTINGS, type SiteSettings } from "@/lib/products";
import { ContentForm } from "@/components/admin/content-form";

export default async function AdminContentPage() {
  const { supabase } = await requireAdmin();

  const { data } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", "general")
    .maybeSingle();

  const settings: SiteSettings = {
    ...FALLBACK_SETTINGS,
    ...((data?.value as SiteSettings) || {}),
  };

  return (
    <main>
      <ContentForm settings={settings} />
    </main>
  );
}