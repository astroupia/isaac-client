import { SettingsPage } from "@/components/settings-page";

export default async function Settings({
  params,
}: {
  params: Promise<{ role: string }>;
}) {
  const { role } = await params;
  return <SettingsPage role={role} />;
}
