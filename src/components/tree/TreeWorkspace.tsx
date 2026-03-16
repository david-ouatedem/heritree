"use client";

import { useState } from "react";
import { LayoutGrid, GitBranch } from "lucide-react";
import { FamilyTreeView } from "./FamilyTreeView";
import { PersonCard } from "./PersonCard";
import { PersonSidePanel } from "./PersonSidePanel";

type PersonForTree = {
  id: string;
  firstName: string;
  lastName: string | null;
  birthDate: Date | null;
  deathDate: Date | null;
  gender: string | null;
  isLiving: boolean;
  relationshipsAsSource: {
    id: string;
    type: string;
    nature: string;
    person2Id: string;
  }[];
  relationshipsAsTarget: {
    id: string;
    type: string;
    nature: string;
    person1Id: string;
  }[];
};

type PersonForCard = {
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

export function TreeWorkspace({
  treeId,
  personsForTree,
  personsForCards,
}: {
  treeId: string;
  personsForTree: PersonForTree[];
  personsForCards: PersonForCard[];
}) {
  const [view, setView] = useState<"tree" | "list">("tree");
  const [selectedPersonId, setSelectedPersonId] = useState<string | null>(null);

  return (
    <div>
      <div className="mb-4 flex items-center gap-1 rounded-lg border border-gray-200 bg-white p-1 w-fit">
        <button
          onClick={() => setView("tree")}
          className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition ${
            view === "tree"
              ? "bg-green-100 text-green-700"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <GitBranch className="h-4 w-4" />
          Tree
        </button>
        <button
          onClick={() => setView("list")}
          className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition ${
            view === "list"
              ? "bg-green-100 text-green-700"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <LayoutGrid className="h-4 w-4" />
          Cards
        </button>
      </div>

      {view === "tree" ? (
        <FamilyTreeView
          persons={personsForTree}
          onNodeClick={(id) => setSelectedPersonId(id)}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {personsForCards.map((person) => (
            <PersonCard key={person.id} person={person} treeId={treeId} />
          ))}
        </div>
      )}

      <PersonSidePanel
        personId={selectedPersonId}
        treeId={treeId}
        onClose={() => setSelectedPersonId(null)}
        onSelectPerson={(id) => setSelectedPersonId(id)}
      />
    </div>
  );
}
