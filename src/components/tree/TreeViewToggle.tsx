"use client";

import { useState } from "react";
import { LayoutGrid, GitBranch } from "lucide-react";

export function TreeViewToggle({
  treeView,
  listView,
}: {
  treeView: React.ReactNode;
  listView: React.ReactNode;
}) {
  const [view, setView] = useState<"tree" | "list">("tree");

  return (
    <div>
      <div className="mb-4 flex items-center gap-1 rounded-lg border border-gray-200 bg-white p-1 w-fit">
        <button
          onClick={() => setView("tree")}
          className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition ${
            view === "tree"
              ? "bg-green-100 text-green-700"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <GitBranch className="h-4 w-4" />
          Tree
        </button>
        <button
          onClick={() => setView("list")}
          className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition ${
            view === "list"
              ? "bg-green-100 text-green-700"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <LayoutGrid className="h-4 w-4" />
          Cards
        </button>
      </div>

      {view === "tree" ? treeView : listView}
    </div>
  );
}
