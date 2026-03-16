"use client";

import { updateTree } from "@/lib/actions/tree";
import { useState } from "react";

type TreeData = {
  id: string;
  name: string;
  description: string | null;
};

export function TreeSettingsForm({ tree }: { tree: TreeData }) {
  const [success, setSuccess] = useState(false);

  return (
    <form
      action={async (formData) => {
        setSuccess(false);
        await updateTree(tree.id, formData);
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }}
      className="flex flex-col gap-4"
    >
      {success && (
        <p className="rounded-lg bg-green-50 p-3 text-sm text-green-600">
          Settings saved
        </p>
      )}

      <div>
        <label htmlFor="name" className="mb-1 block text-sm font-medium">
          Tree name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          defaultValue={tree.name}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
        />
      </div>

      <div>
        <label
          htmlFor="description"
          className="mb-1 block text-sm font-medium"
        >
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={3}
          defaultValue={tree.description ?? ""}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
        />
      </div>

      <button
        type="submit"
        className="w-fit rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-green-700"
      >
        Save changes
      </button>
    </form>
  );
}
