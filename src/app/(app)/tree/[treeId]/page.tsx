import { getTreeWithPersons } from "@/lib/actions/person";
import { notFound } from "next/navigation";
import Link from "next/link";
import { TreePine, ArrowLeft, Users } from "lucide-react";
import { AddPersonDialog } from "@/components/tree/AddPersonDialog";
import { PersonCard } from "@/components/tree/PersonCard";
import { AddRelationshipDialog } from "@/components/tree/AddRelationshipDialog";

export default async function TreePage({
  params,
}: {
  params: Promise<{ treeId: string }>;
}) {
  const { treeId } = await params;
  const tree = await getTreeWithPersons(treeId);

  if (!tree) notFound();

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
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Users className="h-4 w-4" />
            {tree.persons.length}{" "}
            {tree.persons.length === 1 ? "person" : "people"}
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
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {tree.persons.map((person) => (
              <PersonCard
                key={person.id}
                person={person}
                treeId={tree.id}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
