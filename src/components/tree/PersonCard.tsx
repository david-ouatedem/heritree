"use client";

import { deletePerson } from "@/lib/actions/person";
import { Trash2, Calendar, MapPin } from "lucide-react";
import { useState } from "react";

type PersonWithRelationships = {
  id: string;
  firstName: string;
  lastName: string | null;
  birthDate: Date | null;
  deathDate: Date | null;
  birthPlace: string | null;
  gender: string | null;
  bio: string | null;
  isLiving: boolean;
  relationshipsAsSource: {
    id: string;
    type: string;
    nature: string;
    person2: { id: string; firstName: string; lastName: string | null };
  }[];
  relationshipsAsTarget: {
    id: string;
    type: string;
    nature: string;
    person1: { id: string; firstName: string; lastName: string | null };
  }[];
};

function formatDate(date: Date | null) {
  if (!date) return null;
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function getRelationshipLabel(type: string, isSource: boolean) {
  switch (type) {
    case "PARENT_CHILD":
      return isSource ? "Parent of" : "Child of";
    case "SPOUSE":
      return "Spouse of";
    case "SIBLING":
      return "Sibling of";
    default:
      return type;
  }
}

function getGenderColor(gender: string | null) {
  switch (gender) {
    case "MALE":
      return "bg-blue-100 text-blue-700";
    case "FEMALE":
      return "bg-pink-100 text-pink-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
}

export function PersonCard({
  person,
  treeId,
}: {
  person: PersonWithRelationships;
  treeId: string;
}) {
  const [confirming, setConfirming] = useState(false);
  const fullName = [person.firstName, person.lastName].filter(Boolean).join(" ");

  const allRelationships = [
    ...person.relationshipsAsSource.map((r) => ({
      id: r.id,
      label: getRelationshipLabel(r.type, true),
      name: [r.person2.firstName, r.person2.lastName].filter(Boolean).join(" "),
      nature: r.nature,
    })),
    ...person.relationshipsAsTarget.map((r) => ({
      id: r.id,
      label: getRelationshipLabel(r.type, false),
      name: [r.person1.firstName, r.person1.lastName].filter(Boolean).join(" "),
      nature: r.nature,
    })),
  ];

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      <div className="mb-3 flex items-start justify-between">
        <div>
          <h3 className="font-semibold">{fullName}</h3>
          <div className="mt-1 flex items-center gap-2">
            {person.gender && (
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-medium ${getGenderColor(person.gender)}`}
              >
                {person.gender.charAt(0) + person.gender.slice(1).toLowerCase()}
              </span>
            )}
            {!person.isLiving && (
              <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-500">
                Deceased
              </span>
            )}
          </div>
        </div>
        {confirming ? (
          <div className="flex items-center gap-1">
            <button
              onClick={async () => {
                await deletePerson(person.id);
                setConfirming(false);
              }}
              className="rounded px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50"
            >
              Confirm
            </button>
            <button
              onClick={() => setConfirming(false)}
              className="rounded px-2 py-1 text-xs text-gray-500 hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setConfirming(true)}
            className="text-gray-300 hover:text-red-500"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="space-y-1.5 text-sm text-gray-500">
        {(person.birthDate || person.deathDate) && (
          <div className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5" />
            <span>
              {formatDate(person.birthDate)}
              {person.deathDate && ` — ${formatDate(person.deathDate)}`}
            </span>
          </div>
        )}
        {person.birthPlace && (
          <div className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5" />
            <span>{person.birthPlace}</span>
          </div>
        )}
      </div>

      {person.bio && (
        <p className="mt-3 text-sm text-gray-500 line-clamp-2">{person.bio}</p>
      )}

      {allRelationships.length > 0 && (
        <div className="mt-3 border-t border-gray-100 pt-3">
          <p className="mb-1.5 text-xs font-medium text-gray-400 uppercase">
            Relationships
          </p>
          <div className="space-y-1">
            {allRelationships.map((rel) => (
              <div key={rel.id} className="flex items-center gap-1 text-xs text-gray-500">
                <span className="font-medium">{rel.label}</span>
                <span>{rel.name}</span>
                {rel.nature !== "BIOLOGICAL" && (
                  <span className="rounded bg-gray-100 px-1 text-[10px]">
                    {rel.nature.toLowerCase()}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
