"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  X,
  Calendar,
  MapPin,
  ExternalLink,
  Heart,
  Users,
  User,
} from "lucide-react";

type PersonDetail = {
  id: string;
  firstName: string;
  lastName: string | null;
  birthDate: string | null;
  deathDate: string | null;
  birthPlace: string | null;
  gender: string | null;
  bio: string | null;
  isLiving: boolean;
  parents: { id: string; firstName: string; lastName: string | null }[];
  children: { id: string; firstName: string; lastName: string | null }[];
  spouses: { id: string; firstName: string; lastName: string | null }[];
  siblings: { id: string; firstName: string; lastName: string | null }[];
};

function formatDate(date: string | null) {
  if (!date) return null;
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function PersonSidePanel({
  personId,
  treeId,
  onClose,
  onSelectPerson,
}: {
  personId: string | null;
  treeId: string;
  onClose: () => void;
  onSelectPerson: (id: string) => void;
}) {
  const [person, setPerson] = useState<PersonDetail | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!personId) {
      setPerson(null);
      return;
    }

    setLoading(true);
    fetch(`/api/persons/${personId}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        setPerson(data?.person ?? null);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [personId]);

  if (!personId) return null;

  const fullName = person
    ? [person.firstName, person.lastName].filter(Boolean).join(" ")
    : "";

  return (
    <div className="fixed inset-y-0 right-0 z-40 w-96 border-l border-gray-200 bg-white shadow-xl overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-100 bg-white px-6 py-4">
        <h2 className="font-semibold truncate">
          {loading ? "Loading..." : fullName}
        </h2>
        <button
          onClick={onClose}
          className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {loading && (
        <div className="flex items-center justify-center p-12">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-green-600" />
        </div>
      )}

      {!loading && person && (
        <div className="p-6">
          {/* Basic info */}
          <div className="mb-4 flex items-center gap-2">
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
                {person.gender.charAt(0) + person.gender.slice(1).toLowerCase()}
              </span>
            )}
            {!person.isLiving && (
              <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-500">
                Deceased
              </span>
            )}
          </div>

          <div className="mb-6 space-y-2 text-sm text-gray-600">
            {person.birthDate && (
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span>Born {formatDate(person.birthDate)}</span>
              </div>
            )}
            {person.deathDate && (
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span>Died {formatDate(person.deathDate)}</span>
              </div>
            )}
            {person.birthPlace && (
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-400" />
                <span>{person.birthPlace}</span>
              </div>
            )}
          </div>

          {person.bio && (
            <div className="mb-6">
              <p className="text-sm text-gray-500 leading-relaxed line-clamp-6">
                {person.bio}
              </p>
            </div>
          )}

          {/* Relationships */}
          <div className="space-y-4">
            <RelGroup
              icon={<Users className="h-3.5 w-3.5 text-blue-500" />}
              title="Parents"
              persons={person.parents}
              onSelect={onSelectPerson}
            />
            <RelGroup
              icon={<Heart className="h-3.5 w-3.5 text-pink-500" />}
              title="Spouses"
              persons={person.spouses}
              onSelect={onSelectPerson}
            />
            <RelGroup
              icon={<User className="h-3.5 w-3.5 text-gray-500" />}
              title="Siblings"
              persons={person.siblings}
              onSelect={onSelectPerson}
            />
            <RelGroup
              icon={<Users className="h-3.5 w-3.5 text-green-500" />}
              title="Children"
              persons={person.children}
              onSelect={onSelectPerson}
            />
          </div>

          {/* View full profile link */}
          <Link
            href={`/person/${person.id}`}
            className="mt-6 flex items-center justify-center gap-2 rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            View full profile
            <ExternalLink className="h-3.5 w-3.5" />
          </Link>
        </div>
      )}

      {!loading && !person && personId && (
        <div className="p-12 text-center text-sm text-gray-400">
          Person not found
        </div>
      )}
    </div>
  );
}

function RelGroup({
  icon,
  title,
  persons,
  onSelect,
}: {
  icon: React.ReactNode;
  title: string;
  persons: { id: string; firstName: string; lastName: string | null }[];
  onSelect: (id: string) => void;
}) {
  if (persons.length === 0) return null;

  return (
    <div>
      <p className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-gray-400 uppercase">
        {icon}
        {title}
      </p>
      <div className="space-y-1">
        {persons.map((p) => (
          <button
            key={p.id}
            onClick={() => onSelect(p.id)}
            className="block w-full rounded-lg px-2 py-1.5 text-left text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            {[p.firstName, p.lastName].filter(Boolean).join(" ")}
          </button>
        ))}
      </div>
    </div>
  );
}
