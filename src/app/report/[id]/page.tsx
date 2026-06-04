import Navbar from "../../components/Navbar";
import ReportDetail from "./ReportDetail";

export default async function ReportPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <div className="min-h-[100dvh]">
      <Navbar />
      <ReportDetail id={id} />
    </div>
  );
}
