import { SettingsPage } from "@/components/settings-page"

export default function Settings({ params }: { params: { role: string } }) {
  return <SettingsPage role={params.role} />
}
