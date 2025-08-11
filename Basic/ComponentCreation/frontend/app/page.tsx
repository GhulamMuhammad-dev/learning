"use client";

import React from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import LibraryPanel from "@/components/dargDrop/LibraryPanel";
import Canvas from "@/components/dargDrop/Canvas";

export default function Page() {
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex min-h-screen">
        <LibraryPanel />
        <Canvas />
      </div>
    </DndProvider>
  );
}
