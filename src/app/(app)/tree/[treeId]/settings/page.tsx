import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, TreePine } from "lucide-react";
import { TreeSettingsForm } from "@/components/tree/TreeSettingsForm";
import { DeleteTreeButton } from "@/components/tree/DeleteTreeButton";

export default async function TreeSettingsPage({
  params,
}: {
  params: Promise<{ treeId: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) notFound();

  const { treeId } = await params;

  const tree = await prisma.tree.findFirst({
    where: { id: treeId, ownerId: session.user.id },
    include: { _count: { select: { persons: true } } },
  });

  if (!tree) notFound();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white px-8 py-4">
        <div className="mx-auto flex max-w-2xl items-center gap-4">
          <Link
            href={`/tree/${tree.id}`}
            className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to tree
          </Link>
          <div className="flex items-center gap-2">
            <TreePine className="h-5 w-5 text-green-600" />
            <h1 className="text-lg font-semibold">Tree Settings</h1>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-2xl p-8 space-y-8">
        {/* General settings */}
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="mb-4 text-sm font-medium text-gray-400 uppercase">
            General
          </h2>
          <TreeSettingsForm tree={tree} />
        </div>

        {/* Privacy */}
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="mb-4 text-sm font-medium text-gray-400 uppercase">
            Privacy
          </h2>
          <div className="text-sm text-gray-600">
            <p className="mb-1">
              Current visibility:{" "}
              <span className="font-medium">
                {tree.privacy === "PRIVATE"
                  ? "Private (only you)"
                  : tree.privacy === "SHARED"
                    ? "Shared (invite-only)"
                    : "Public"}
              </span>
            </p>
            <p className="text-xs text-gray-400">
              Privacy settings will be configurable in a future update.
            </p>
          </div>
        </div>

        {/* Danger zone */}
        <div className="rounded-xl border border-red-200 bg-white p-6">
          <h2 className="mb-4 text-sm font-medium text-red-500 uppercase">
            Danger Zone
          </h2>
          <p className="mb-4 text-sm text-gray-600">
            Deleting this tree will permanently remove all{" "}
            <strong>{tree._count.persons} people</strong> and their
            relationships. This cannot be undone.
          </p>
          <DeleteTreeButton treeId={tree.id} treeName={tree.name} />
        </div>
      </main>
    </div>
  );
}
