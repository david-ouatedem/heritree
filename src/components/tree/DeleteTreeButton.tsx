"use client";

import { deleteTree } from "@/lib/actions/tree";
import { useState } from "react";
import { Trash2 } from "lucide-react";

export function DeleteTreeButton({
  treeId,
  treeName,
}: {
  treeId: string;
  treeName: string;
}) {
  const [confirming, setConfirming] = useState(false);
  const [confirmText, setConfirmText] = useState("");

  if (!confirming) {
    return (
      <button
        onClick={() => setConfirming(true)}
        className="flex items-center gap-2 rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
      >
        <Trash2 className="h-4 w-4" />
        Delete this tree
      </button>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-gray-600">
        Type <strong>{treeName}</strong> to confirm:
      </p>
      <input
        type="text"
        value={confirmText}
        onChange={(e) => setConfirmText(e.target.value)}
        placeholder={treeName}
        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
      />
      <div className="flex items-center gap-3">
        <button
          onClick={async () => {
            if (confirmText === treeName) {
              await deleteTree(treeId);
            }
          }}
          disabled={confirmText !== treeName}
          className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700 disabled:opacity-50"
        >
          Permanently delete
        </button>
        <button
          onClick={() => {
            setConfirming(false);
            setConfirmText("");
          }}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium transition hover:bg-gray-50"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
