// app/paper/[paper_id]/page.tsx

import PaperPage from "@/components/editor/PaperPage";


const Page = async ({ params }: { params: { paper_id: string } }) => {
    const summaryId = (await params).paper_id
  return <PaperPage paperId={summaryId} />;
};

export default Page;
