"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TreePine, ArrowRight } from "lucide-react";

type Step = "tree" | "person";

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("tree");
  const [treeName, setTreeName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [treeId, setTreeId] = useState("");

  async function handleCreateTree(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/trees", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: treeName }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error || "Failed to create tree");
      return;
    }

    setTreeId(data.tree.id);
    setStep("person");
  }

  async function handleAddSelf(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const res = await fetch("/api/persons", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        treeId,
        firstName: formData.get("firstName"),
        lastName: formData.get("lastName") || undefined,
        gender: formData.get("gender") || undefined,
        birthDate: formData.get("birthDate") || undefined,
      }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error || "Failed to add person");
      return;
    }

    router.push(`/tree/${treeId}`);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-lg">
        {/* Progress indicator */}
        <div className="mb-8 flex items-center justify-center gap-3">
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${
              step === "tree"
                ? "bg-green-600 text-white"
                : "bg-green-100 text-green-700"
            }`}
          >
            1
          </div>
          <div className="h-0.5 w-12 bg-gray-200" />
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${
              step === "person"
                ? "bg-green-600 text-white"
                : "bg-gray-200 text-gray-500"
            }`}
          >
            2
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
          {step === "tree" ? (
            <>
              <div className="mb-6 flex flex-col items-center gap-2">
                <TreePine className="h-10 w-10 text-green-600" />
                <h1 className="text-2xl font-bold">Welcome to Heritree!</h1>
                <p className="text-center text-sm text-gray-500">
                  Let&apos;s start by naming your family tree.
                </p>
              </div>

              <form onSubmit={handleCreateTree} className="flex flex-col gap-4">
                {error && (
                  <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
                    {error}
                  </p>
                )}

                <div>
                  <label
                    htmlFor="treeName"
                    className="mb-1 block text-sm font-medium"
                  >
                    Tree name
                  </label>
                  <input
                    id="treeName"
                    type="text"
                    required
                    value={treeName}
                    onChange={(e) => setTreeName(e.target.value)}
                    placeholder="e.g. The Smith Family"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center justify-center gap-2 rounded-lg bg-green-600 py-2.5 font-medium text-white transition hover:bg-green-700 disabled:opacity-50"
                >
                  {loading ? "Creating..." : "Continue"}
                  <ArrowRight className="h-4 w-4" />
                </button>
              </form>
            </>
          ) : (
            <>
              <div className="mb-6 flex flex-col items-center gap-2">
                <TreePine className="h-10 w-10 text-green-600" />
                <h1 className="text-2xl font-bold">Add yourself</h1>
                <p className="text-center text-sm text-gray-500">
                  You&apos;ll be the first person in your tree. You can add more
                  family members later.
                </p>
              </div>

              <form onSubmit={handleAddSelf} className="flex flex-col gap-4">
                {error && (
                  <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
                    {error}
                  </p>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="firstName"
                      className="mb-1 block text-sm font-medium"
                    >
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
                    <label
                      htmlFor="lastName"
                      className="mb-1 block text-sm font-medium"
                    >
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
                  <label
                    htmlFor="gender"
                    className="mb-1 block text-sm font-medium"
                  >
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

                <div>
                  <label
                    htmlFor="birthDate"
                    className="mb-1 block text-sm font-medium"
                  >
                    Birth date
                  </label>
                  <input
                    id="birthDate"
                    name="birthDate"
                    type="date"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center justify-center gap-2 rounded-lg bg-green-600 py-2.5 font-medium text-white transition hover:bg-green-700 disabled:opacity-50"
                >
                  {loading ? "Adding..." : "Start building your tree"}
                  <ArrowRight className="h-4 w-4" />
                </button>
              </form>

              <button
                onClick={() => router.push(`/tree/${treeId}`)}
                className="mt-4 w-full text-center text-sm text-gray-400 hover:text-gray-600"
              >
                Skip for now
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
