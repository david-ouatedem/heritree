"use client";

import { useState } from "react";
import { addRelationship } from "@/lib/actions/person";
import { Link2 } from "lucide-react";

type PersonOption = {
  id: string;
  firstName: string;
  lastName: string | null;
};

export function AddRelationshipDialog({
  treeId,
  persons,
}: {
  treeId: string;
  persons: PersonOption[];
}) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium transition hover:bg-gray-50"
      >
        <Link2 className="h-4 w-4" />
        Add relationship
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <h2 className="mb-4 text-lg font-semibold">Add a relationship</h2>

            {error && (
              <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
                {error}
              </p>
            )}

            <form
              action={async (formData) => {
                const result = await addRelationship(formData);
                if (result?.error) {
                  setError(result.error);
                } else {
                  setOpen(false);
                  setError("");
                }
              }}
              className="flex flex-col gap-4"
            >
              <input type="hidden" name="treeId" value={treeId} />

              <div>
                <label htmlFor="person1Id" className="mb-1 block text-sm font-medium">
                  Person 1
                </label>
                <select
                  id="person1Id"
                  name="person1Id"
                  required
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                >
                  <option value="">Select a person...</option>
                  {persons.map((p) => (
                    <option key={p.id} value={p.id}>
                      {[p.firstName, p.lastName].filter(Boolean).join(" ")}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="type" className="mb-1 block text-sm font-medium">
                  Relationship type
                </label>
                <select
                  id="type"
                  name="type"
                  required
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                >
                  <option value="">Select type...</option>
                  <option value="PARENT_CHILD">Parent → Child</option>
                  <option value="SPOUSE">Spouse</option>
                  <option value="SIBLING">Sibling</option>
                </select>
              </div>

              <div>
                <label htmlFor="person2Id" className="mb-1 block text-sm font-medium">
                  Person 2
                </label>
                <select
                  id="person2Id"
                  name="person2Id"
                  required
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                >
                  <option value="">Select a person...</option>
                  {persons.map((p) => (
                    <option key={p.id} value={p.id}>
                      {[p.firstName, p.lastName].filter(Boolean).join(" ")}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="nature" className="mb-1 block text-sm font-medium">
                  Nature
                </label>
                <select
                  id="nature"
                  name="nature"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                >
                  <option value="BIOLOGICAL">Biological</option>
                  <option value="ADOPTED">Adopted</option>
                  <option value="STEP">Step</option>
                  <option value="FOSTER">Foster</option>
                </select>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    setError("");
                  }}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium transition hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-green-700"
                >
                  Add relationship
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
