"use client";

import React from "react";
import LibraryItem from "./LibraryItem";

const LibraryPanel: React.FC = () => {
  return (
    <div className="w-56 p-4 border-r border-gray-300 bg-gray-50">
      <h2 className="font-bold mb-4">Library</h2>
      <LibraryItem label="Primary Button" elementType="button" />
      <LibraryItem label="Green Button" elementType="button2" />
      <LibraryItem label="Text Input" elementType="input" />
      <LibraryItem label="Card" elementType="card" />
    </div>
  );
};

export default LibraryPanel;
