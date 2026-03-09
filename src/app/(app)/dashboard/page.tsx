import { auth } from "@/lib/auth";
import { TreePine } from "lucide-react";

export default async function DashboardPage() {
  const session = await auth();

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <TreePine className="h-8 w-8 text-green-600" />
            <h1 className="text-2xl font-bold">Heritree</h1>
          </div>
          <p className="text-sm text-gray-500">
            Welcome, {session?.user?.name || session?.user?.email}
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-12 text-center">
          <TreePine className="mx-auto mb-4 h-16 w-16 text-gray-300" />
          <h2 className="mb-2 text-xl font-semibold">No family trees yet</h2>
          <p className="mb-6 text-gray-500">
            Create your first tree to start building your family history.
          </p>
          <button className="rounded-lg bg-green-600 px-6 py-3 font-medium text-white transition hover:bg-green-700">
            Create a tree
          </button>
        </div>
      </div>
    </div>
  );
}
