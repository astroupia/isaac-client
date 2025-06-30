import { CaseDetail } from "@/components/case-detail"

export default function CaseDetailPage({ params }: { params: { id: string } }) {
  return <CaseDetail id={params.id} />
}
