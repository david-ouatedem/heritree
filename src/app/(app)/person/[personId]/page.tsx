import { getPersonWithDetails } from "@/lib/actions/get-person";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  User,
  Users,
  Heart,
} from "lucide-react";
import { EditPersonForm } from "@/components/tree/EditPersonForm";

function formatDate(date: Date | null) {
  if (!date) return null;
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function getRelationshipLabel(type: string, isSource: boolean) {
  switch (type) {
    case "PARENT_CHILD":
      return isSource ? "Child" : "Parent";
    case "SPOUSE":
      return "Spouse";
    case "SIBLING":
      return "Sibling";
    default:
      return type;
  }
}

function getRelationshipIcon(type: string) {
  switch (type) {
    case "SPOUSE":
      return <Heart className="h-3.5 w-3.5 text-pink-500" />;
    case "PARENT_CHILD":
      return <Users className="h-3.5 w-3.5 text-blue-500" />;
    default:
      return <User className="h-3.5 w-3.5 text-gray-500" />;
  }
}

export default async function PersonPage({
  params,
}: {
  params: Promise<{ personId: string }>;
}) {
  const { personId } = await params;
  const person = await getPersonWithDetails(personId);

  if (!person) notFound();

  const fullName = [person.firstName, person.lastName]
    .filter(Boolean)
    .join(" ");

  // Group relationships
  const parents = person.relationshipsAsTarget
    .filter((r) => r.type === "PARENT_CHILD")
    .map((r) => ({ ...r.person1, relId: r.id, nature: r.nature }));

  const children = person.relationshipsAsSource
    .filter((r) => r.type === "PARENT_CHILD")
    .map((r) => ({ ...r.person2, relId: r.id, nature: r.nature }));

  const spouses = [
    ...person.relationshipsAsSource
      .filter((r) => r.type === "SPOUSE")
      .map((r) => ({ ...r.person2, relId: r.id, nature: r.nature })),
    ...person.relationshipsAsTarget
      .filter((r) => r.type === "SPOUSE")
      .map((r) => ({ ...r.person1, relId: r.id, nature: r.nature })),
  ];

  const siblings = [
    ...person.relationshipsAsSource
      .filter((r) => r.type === "SIBLING")
      .map((r) => ({ ...r.person2, relId: r.id, nature: r.nature })),
    ...person.relationshipsAsTarget
      .filter((r) => r.type === "SIBLING")
      .map((r) => ({ ...r.person1, relId: r.id, nature: r.nature })),
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white px-8 py-4">
        <div className="mx-auto flex max-w-4xl items-center gap-4">
          <Link
            href={`/tree/${person.tree.id}`}
            className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
          >
            <ArrowLeft className="h-4 w-4" />
            {person.tree.name}
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-4xl p-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Profile Info */}
          <div className="lg:col-span-2">
            <div className="rounded-xl border border-gray-200 bg-white p-6">
              <div className="mb-6 flex items-start justify-between">
                <div>
                  <h1 className="text-2xl font-bold">{fullName}</h1>
                  <div className="mt-2 flex items-center gap-3">
                    {person.gender && (
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                          person.gender === "MALE"
                            ? "bg-blue-100 text-blue-700"
                            : person.gender === "FEMALE"
                              ? "bg-pink-100 text-pink-700"
                              : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {person.gender.charAt(0) +
                          person.gender.slice(1).toLowerCase()}
                      </span>
                    )}
                    {!person.isLiving && (
                      <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-500">
                        Deceased
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-3 text-sm">
                {person.birthDate && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span>Born {formatDate(person.birthDate)}</span>
                  </div>
                )}
                {person.deathDate && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span>Died {formatDate(person.deathDate)}</span>
                  </div>
                )}
                {person.birthPlace && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span>{person.birthPlace}</span>
                  </div>
                )}
              </div>

              {person.bio && (
                <div className="mt-6">
                  <h3 className="mb-2 text-sm font-medium text-gray-400 uppercase">
                    Biography
                  </h3>
                  <p className="whitespace-pre-wrap text-sm text-gray-600 leading-relaxed">
                    {person.bio}
                  </p>
                </div>
              )}
            </div>

            {/* Edit form */}
            <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6">
              <h3 className="mb-4 text-sm font-medium text-gray-400 uppercase">
                Edit Details
              </h3>
              <EditPersonForm person={person} />
            </div>
          </div>

          {/* Relationships Sidebar */}
          <div className="space-y-6">
            {parents.length > 0 && (
              <RelationshipGroup title="Parents" persons={parents} treeId={person.tree.id} type="PARENT_CHILD" />
            )}
            {spouses.length > 0 && (
              <RelationshipGroup title="Spouses" persons={spouses} treeId={person.tree.id} type="SPOUSE" />
            )}
            {siblings.length > 0 && (
              <RelationshipGroup title="Siblings" persons={siblings} treeId={person.tree.id} type="SIBLING" />
            )}
            {children.length > 0 && (
              <RelationshipGroup title="Children" persons={children} treeId={person.tree.id} type="PARENT_CHILD" />
            )}

            {parents.length === 0 &&
              spouses.length === 0 &&
              siblings.length === 0 &&
              children.length === 0 && (
                <div className="rounded-xl border border-gray-200 bg-white p-6 text-center">
                  <Users className="mx-auto mb-2 h-8 w-8 text-gray-300" />
                  <p className="text-sm text-gray-500">
                    No relationships yet
                  </p>
                  <Link
                    href={`/tree/${person.tree.id}`}
                    className="mt-2 inline-block text-sm text-green-600 hover:underline"
                  >
                    Add relationships in tree view
                  </Link>
                </div>
              )}
          </div>
        </div>
      </main>
    </div>
  );
}

function RelationshipGroup({
  title,
  persons,
  treeId,
  type,
}: {
  title: string;
  persons: {
    id: string;
    firstName: string;
    lastName: string | null;
    birthDate: Date | null;
    gender: string | null;
    isLiving: boolean;
    nature: string;
  }[];
  treeId: string;
  type: string;
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4">
      <h3 className="mb-3 flex items-center gap-1.5 text-sm font-medium text-gray-400 uppercase">
        {getRelationshipIcon(type)}
        {title}
      </h3>
      <div className="space-y-2">
        {persons.map((p) => (
          <Link
            key={p.id}
            href={`/person/${p.id}`}
            className="flex items-center justify-between rounded-lg p-2 transition hover:bg-gray-50"
          >
            <div>
              <p className="text-sm font-medium">
                {[p.firstName, p.lastName].filter(Boolean).join(" ")}
              </p>
              {p.birthDate && (
                <p className="text-xs text-gray-400">
                  b. {new Date(p.birthDate).getFullYear()}
                </p>
              )}
            </div>
            {p.nature !== "BIOLOGICAL" && (
              <span className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-medium text-gray-500">
                {p.nature.toLowerCase()}
              </span>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
