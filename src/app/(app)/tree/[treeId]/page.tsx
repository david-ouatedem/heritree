import { getTreeWithPersons } from "@/lib/actions/person";
import { notFound } from "next/navigation";
import Link from "next/link";
import { TreePine, ArrowLeft, Users, Settings } from "lucide-react";
import { AddPersonDialog } from "@/components/tree/AddPersonDialog";
import { AddRelationshipDialog } from "@/components/tree/AddRelationshipDialog";
import { TreeWorkspace } from "@/components/tree/TreeWorkspace";

export default async function TreePage({
  params,
}: {
  params: Promise<{ treeId: string }>;
}) {
  const { treeId } = await params;
  const tree = await getTreeWithPersons(treeId);

  if (!tree) notFound();

  // Prepare persons data for the tree view
  const personsForTree = tree.persons.map((p) => ({
    id: p.id,
    firstName: p.firstName,
    lastName: p.lastName,
    birthDate: p.birthDate,
    deathDate: p.deathDate,
    gender: p.gender,
    isLiving: p.isLiving,
    relationshipsAsSource: p.relationshipsAsSource.map((r) => ({
      id: r.id,
      type: r.type,
      nature: r.nature,
      person2Id: r.person2Id,
    })),
    relationshipsAsTarget: p.relationshipsAsTarget.map((r) => ({
      id: r.id,
      type: r.type,
      nature: r.nature,
      person1Id: r.person1Id,
    })),
  }));

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white px-8 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
            >
              <ArrowLeft className="h-4 w-4" />
              Dashboard
            </Link>
            <div className="flex items-center gap-2">
              <TreePine className="h-5 w-5 text-green-600" />
              <h1 className="text-lg font-semibold">{tree.name}</h1>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Users className="h-4 w-4" />
              {tree.persons.length}{" "}
              {tree.persons.length === 1 ? "person" : "people"}
            </div>
            <Link
              href={`/tree/${tree.id}/settings`}
              className="flex items-center gap-1 text-sm text-gray-400 hover:text-gray-600"
            >
              <Settings className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl p-8">
        {tree.description && (
          <p className="mb-6 text-sm text-gray-500">{tree.description}</p>
        )}

        <div className="mb-6 flex items-center gap-3">
          <AddPersonDialog treeId={tree.id} />
          {tree.persons.length >= 2 && (
            <AddRelationshipDialog
              treeId={tree.id}
              persons={tree.persons.map((p) => ({
                id: p.id,
                firstName: p.firstName,
                lastName: p.lastName,
              }))}
            />
          )}
        </div>

        {tree.persons.length === 0 ? (
          <div className="rounded-xl border border-gray-200 bg-white p-12 text-center">
            <Users className="mx-auto mb-4 h-16 w-16 text-gray-300" />
            <h2 className="mb-2 text-xl font-semibold">No people yet</h2>
            <p className="mb-6 text-gray-500">
              Add yourself or a family member to get started.
            </p>
            <AddPersonDialog treeId={tree.id} />
          </div>
        ) : (
          <TreeWorkspace
            treeId={tree.id}
            personsForTree={personsForTree}
            personsForCards={tree.persons}
          />
        )}
      </main>
    </div>
  );
}
