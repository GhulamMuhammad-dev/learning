import ScrollablePanel from "@/components/ScrollablePanel";

export default function Page() {
  const data = Array.from({ length: 50 }, (_, i) => `Hello G ${i + 1}`);

  return (
    <div className="flex  justify-start min-h-screen bg-gray-600">
      <ScrollablePanel items={data} height="h-screen" side="left" />
      
    </div>
  );
}
