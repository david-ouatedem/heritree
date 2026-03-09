import { auth, signOut } from "@/lib/auth";
import { getUserTrees } from "@/lib/actions/tree";
import { CreateTreeDialog } from "@/components/tree/CreateTreeDialog";
import { TreePine, Users, LogOut } from "lucide-react";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await auth();
  const trees = await getUserTrees();

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <TreePine className="h-8 w-8 text-green-600" />
            <h1 className="text-2xl font-bold">Heritree</h1>
          </div>
          <div className="flex items-center gap-4">
            <p className="text-sm text-gray-500">
              {session?.user?.name || session?.user?.email}
            </p>
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/" });
              }}
            >
              <button
                type="submit"
                className="flex items-center gap-1 text-sm text-gray-400 hover:text-gray-600"
              >
                <LogOut className="h-4 w-4" />
                Log out
              </button>
            </form>
          </div>
        </div>

        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-semibold">My Trees</h2>
          <CreateTreeDialog />
        </div>

        {trees.length === 0 ? (
          <div className="rounded-xl border border-gray-200 bg-white p-12 text-center">
            <TreePine className="mx-auto mb-4 h-16 w-16 text-gray-300" />
            <h2 className="mb-2 text-xl font-semibold">No family trees yet</h2>
            <p className="mb-6 text-gray-500">
              Create your first tree to start building your family history.
            </p>
            <CreateTreeDialog />
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {trees.map((tree) => (
              <Link
                key={tree.id}
                href={`/tree/${tree.id}`}
                className="group rounded-xl border border-gray-200 bg-white p-6 transition hover:border-green-300 hover:shadow-md"
              >
                <div className="mb-3 flex items-center gap-2">
                  <TreePine className="h-5 w-5 text-green-600" />
                  <h3 className="font-semibold group-hover:text-green-700">
                    {tree.name}
                  </h3>
                </div>
                {tree.description && (
                  <p className="mb-3 text-sm text-gray-500 line-clamp-2">
                    {tree.description}
                  </p>
                )}
                <div className="flex items-center gap-1 text-xs text-gray-400">
                  <Users className="h-3.5 w-3.5" />
                  <span>
                    {tree._count.persons}{" "}
                    {tree._count.persons === 1 ? "person" : "people"}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
