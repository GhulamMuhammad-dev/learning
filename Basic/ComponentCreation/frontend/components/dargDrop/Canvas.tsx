"use client";

import React, { useState, useRef, useEffect } from "react";
import { useDrop } from "react-dnd";
import { ItemTypes } from "./ItemTypes";

interface DroppedItem {
  elementType: "button" | "input" | "card" | "button2";
  label: string;
  id: string;
}

const Canvas: React.FC = () => {
  const [elements, setElements] = useState<DroppedItem[]>([]);
  const dropRef = useRef<HTMLDivElement>(null);

  const [, drop] = useDrop(() => ({
    accept: ItemTypes.UI_ELEMENT,
    drop: (item: { elementType: DroppedItem["elementType"]; label: string }) => {
      setElements((prev) => [
        ...prev,
        { ...item, id: Date.now().toString() },
      ]);
    },
  }));

  useEffect(() => {
    if (dropRef.current) {
      drop(dropRef);
    }
  }, [drop]);

  return (
    <div
      ref={dropRef}
      className="flex-1 p-4 border border-gray-300 bg-white min-h-screen "
    >
      <h2 className="font-bold mb-4">Canvas</h2>
      {elements.length === 0 && (
        <p className="text-gray-400">Drag items here</p>
      )}
      {elements.map((el) => {
        if (el.elementType === "button") {
          return (
            <button
              key={el.id}
              className="bg-blue-500 text-white px-4 py-2 rounded block mb-2"
            >
              {el.label}
            </button>
          );
        }

         else if(el.elementType==="button2"){
            return(
              <button
              key={el.id}
              className="bg-green-500 text-white px-4 py-2 rounded-xl block mb-2"
            >
              {el.label}
            </button>
            )
         }

        else if (el.elementType === "input") {
          return (
            <input
              key={el.id}
              type="text"
              placeholder={el.label}
              className="border p-2 rounded block mb-2"
            />
          );
        }
        else if (el.elementType === "card") {
          return (
            <div
              key={el.id}
              className="border p-4 rounded shadow-sm bg-gray-100 mb-2"
            >
              <h3 className="font-bold">{el.label}</h3>
              <p className="text-sm text-gray-500">Card content...</p>
            </div>
          );
        }
        return null;
      })}
    </div>
  );
};

export default Canvas;
