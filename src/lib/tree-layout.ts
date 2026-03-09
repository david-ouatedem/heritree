import type { Node, Edge } from "@xyflow/react";

type PersonData = {
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

const NODE_WIDTH = 180;
const NODE_HEIGHT = 80;
const HORIZONTAL_GAP = 60;
const VERTICAL_GAP = 120;

export function buildTreeLayout(persons: PersonData[]) {
  if (persons.length === 0) return { nodes: [], edges: [] };

  const edges: Edge[] = [];
  const personMap = new Map(persons.map((p) => [p.id, p]));

  // Build parent-child adjacency
  const childrenOf = new Map<string, string[]>(); // parentId -> childIds
  const parentsOf = new Map<string, string[]>(); // childId -> parentIds
  const spouseOf = new Map<string, Set<string>>();

  for (const person of persons) {
    for (const rel of person.relationshipsAsSource) {
      if (rel.type === "PARENT_CHILD") {
        if (!childrenOf.has(person.id)) childrenOf.set(person.id, []);
        childrenOf.get(person.id)!.push(rel.person2Id);
        if (!parentsOf.has(rel.person2Id)) parentsOf.set(rel.person2Id, []);
        parentsOf.get(rel.person2Id)!.push(person.id);

        edges.push({
          id: rel.id,
          source: person.id,
          target: rel.person2Id,
          type: "smoothstep",
          style: { stroke: "#94a3b8", strokeWidth: 2 },
          animated: rel.nature !== "BIOLOGICAL",
        });
      } else if (rel.type === "SPOUSE") {
        if (!spouseOf.has(person.id)) spouseOf.set(person.id, new Set());
        if (!spouseOf.has(rel.person2Id))
          spouseOf.set(rel.person2Id, new Set());
        spouseOf.get(person.id)!.add(rel.person2Id);
        spouseOf.get(rel.person2Id)!.add(person.id);

        edges.push({
          id: rel.id,
          source: person.id,
          target: rel.person2Id,
          type: "straight",
          style: { stroke: "#f472b6", strokeWidth: 2 },
          label: "♥",
        });
      } else if (rel.type === "SIBLING") {
        edges.push({
          id: rel.id,
          source: person.id,
          target: rel.person2Id,
          type: "smoothstep",
          style: { stroke: "#60a5fa", strokeWidth: 1, strokeDasharray: "5,5" },
        });
      }
    }
  }

  // Assign generations using BFS from roots (people with no parents)
  const generation = new Map<string, number>();
  const roots = persons.filter((p) => !parentsOf.has(p.id) || parentsOf.get(p.id)!.length === 0);

  // If no clear roots, pick first person
  if (roots.length === 0 && persons.length > 0) {
    roots.push(persons[0]);
  }

  const queue: { id: string; gen: number }[] = roots.map((r) => ({
    id: r.id,
    gen: 0,
  }));
  const visited = new Set<string>();

  while (queue.length > 0) {
    const { id, gen } = queue.shift()!;
    if (visited.has(id)) continue;
    visited.add(id);
    generation.set(id, gen);

    // Spouses go at the same generation
    const spouses = spouseOf.get(id) || new Set();
    for (const spouseId of spouses) {
      if (!visited.has(spouseId)) {
        queue.push({ id: spouseId, gen });
      }
    }

    // Children go one generation below
    const children = childrenOf.get(id) || [];
    for (const childId of children) {
      if (!visited.has(childId)) {
        queue.push({ id: childId, gen: gen + 1 });
      }
    }
  }

  // Handle unvisited persons (disconnected)
  for (const person of persons) {
    if (!visited.has(person.id)) {
      generation.set(person.id, 0);
    }
  }

  // Group by generation
  const generationGroups = new Map<number, string[]>();
  for (const [personId, gen] of generation) {
    if (!generationGroups.has(gen)) generationGroups.set(gen, []);
    generationGroups.get(gen)!.push(personId);
  }

  // Position nodes
  const nodes: Node[] = [];
  const sortedGens = [...generationGroups.keys()].sort((a, b) => a - b);

  for (const gen of sortedGens) {
    const personIds = generationGroups.get(gen)!;
    const totalWidth = personIds.length * (NODE_WIDTH + HORIZONTAL_GAP) - HORIZONTAL_GAP;
    const startX = -totalWidth / 2;

    personIds.forEach((personId, index) => {
      const person = personMap.get(personId)!;
      nodes.push({
        id: personId,
        type: "personNode",
        position: {
          x: startX + index * (NODE_WIDTH + HORIZONTAL_GAP),
          y: gen * (NODE_HEIGHT + VERTICAL_GAP),
        },
        data: {
          firstName: person.firstName,
          lastName: person.lastName,
          birthDate: person.birthDate,
          deathDate: person.deathDate,
          gender: person.gender,
          isLiving: person.isLiving,
        },
      });
    });
  }

  return { nodes, edges };
}
