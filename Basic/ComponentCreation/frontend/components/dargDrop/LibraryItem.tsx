"use client";

import React, { useRef, useEffect } from "react";
import { useDrag } from "react-dnd";
import { ItemTypes } from "./ItemTypes";

interface LibraryItemProps {
  label: string;
  elementType: "button" | "input" | "card" | "button2";
}

const LibraryItem: React.FC<LibraryItemProps> = ({ label, elementType }) => {
  const dragRef = useRef<HTMLDivElement>(null);

  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.UI_ELEMENT,
    item: { elementType, label },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  useEffect(() => {
    if (dragRef.current) {
      drag(dragRef);
    }
  }, [drag]);

  return (
    <div
      ref={dragRef}
      className={`p-2 mb-2 border rounded cursor-grab bg-white shadow-sm ${
        isDragging ? "opacity-50" : "opacity-100"
      }`}
    >
      {label}
    </div>
  );
};

export default LibraryItem;
