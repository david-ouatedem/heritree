"use client";

import { useState } from "react";
import { createPerson } from "@/lib/actions/person";
import { UserPlus } from "lucide-react";

export function AddPersonDialog({ treeId }: { treeId: string }) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-green-700"
      >
        <UserPlus className="h-4 w-4" />
        Add person
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white p-6 shadow-xl">
            <h2 className="mb-4 text-lg font-semibold">Add a person</h2>

            {error && (
              <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
                {error}
              </p>
            )}

            <form
              action={async (formData) => {
                const result = await createPerson(formData);
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

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="mb-1 block text-sm font-medium">
                    First name *
                  </label>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    required
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="mb-1 block text-sm font-medium">
                    Last name
                  </label>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="gender" className="mb-1 block text-sm font-medium">
                  Gender
                </label>
                <select
                  id="gender"
                  name="gender"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                >
                  <option value="">Select...</option>
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="birthDate" className="mb-1 block text-sm font-medium">
                    Birth date
                  </label>
                  <input
                    id="birthDate"
                    name="birthDate"
                    type="date"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label htmlFor="deathDate" className="mb-1 block text-sm font-medium">
                    Death date
                  </label>
                  <input
                    id="deathDate"
                    name="deathDate"
                    type="date"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="birthPlace" className="mb-1 block text-sm font-medium">
                  Birth place
                </label>
                <input
                  id="birthPlace"
                  name="birthPlace"
                  type="text"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                />
              </div>

              <div>
                <label htmlFor="bio" className="mb-1 block text-sm font-medium">
                  Bio
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  rows={3}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                />
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
                  Add person
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
