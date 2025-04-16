// app/paper/[paper_id]/PaperPage.tsx
"use client";

import { usePaper } from "@/hooks/usePaper";
import TiptapEditor from "./TiptapEditor";
const PaperPage = ({ paperId }: { paperId: string }) => {
  const { data: paper, isLoading } = usePaper(paperId);

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <h1>{paper?.title}</h1>
      <TiptapEditor />
    </div>
  );
};

export default PaperPage;
