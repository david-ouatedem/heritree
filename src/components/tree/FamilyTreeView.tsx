"use client";

import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  useReactFlow,
  ReactFlowProvider,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useCallback, useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import { PersonNode } from "./PersonNode";
import { buildTreeLayout } from "@/lib/tree-layout";

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

const nodeTypes = { personNode: PersonNode };

function FamilyTreeInner({
  persons,
  onNodeClick,
}: {
  persons: PersonData[];
  onNodeClick?: (personId: string) => void;
}) {
  const { nodes: initialNodes, edges: initialEdges } = useMemo(
    () => buildTreeLayout(persons),
    [persons]
  );

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);
  const { setCenter } = useReactFlow();

  const [search, setSearch] = useState("");
  const [matchedIds, setMatchedIds] = useState<string[]>([]);
  const [matchIndex, setMatchIndex] = useState(0);

  const handleSearch = useCallback(
    (query: string) => {
      setSearch(query);
      if (!query.trim()) {
        setMatchedIds([]);
        setMatchIndex(0);
        setNodes((nds) => nds.map((n) => ({ ...n, style: undefined })));
        return;
      }

      const q = query.toLowerCase();
      const matches = persons.filter((p) => {
        const fullName = [p.firstName, p.lastName]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        return fullName.includes(q);
      });

      const ids = matches.map((m) => m.id);
      setMatchedIds(ids);
      setMatchIndex(0);

      // Highlight matched, dim others
      setNodes((nds) =>
        nds.map((n) => ({
          ...n,
          style:
            ids.length > 0
              ? ids.includes(n.id)
                ? { opacity: 1 }
                : { opacity: 0.3 }
              : undefined,
        }))
      );

      // Zoom to first match
      if (ids.length > 0) {
        const node = initialNodes.find((n) => n.id === ids[0]);
        if (node) {
          setCenter(node.position.x + 90, node.position.y + 40, {
            zoom: 1.2,
            duration: 500,
          });
        }
      }
    },
    [persons, initialNodes, setNodes, setCenter]
  );

  const goToMatch = useCallback(
    (index: number) => {
      if (matchedIds.length === 0) return;
      const i =
        ((index % matchedIds.length) + matchedIds.length) %
        matchedIds.length;
      setMatchIndex(i);

      const node = initialNodes.find((n) => n.id === matchedIds[i]);
      if (node) {
        setCenter(node.position.x + 90, node.position.y + 40, {
          zoom: 1.2,
          duration: 500,
        });
      }
    },
    [matchedIds, initialNodes, setCenter]
  );

  const clearSearch = useCallback(() => {
    setSearch("");
    setMatchedIds([]);
    setMatchIndex(0);
    setNodes((nds) => nds.map((n) => ({ ...n, style: undefined })));
  }, [setNodes]);

  return (
    <div className="relative h-[600px] w-full rounded-xl border border-gray-200 bg-white">
      {/* Search overlay */}
      <div className="absolute left-4 top-4 z-10 flex items-center gap-2">
        <div className="flex items-center rounded-lg border border-gray-200 bg-white shadow-sm">
          <Search className="ml-3 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && matchedIds.length > 0) {
                goToMatch(matchIndex + 1);
              }
            }}
            placeholder="Search by name..."
            className="w-48 border-0 bg-transparent px-2 py-2 text-sm focus:outline-none"
          />
          {search && (
            <button
              onClick={clearSearch}
              className="mr-2 text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        {matchedIds.length > 0 && (
          <div className="flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-2 py-1.5 text-xs text-gray-500 shadow-sm">
            <button
              onClick={() => goToMatch(matchIndex - 1)}
              className="px-1 hover:text-gray-700"
            >
              ↑
            </button>
            <span>
              {matchIndex + 1}/{matchedIds.length}
            </span>
            <button
              onClick={() => goToMatch(matchIndex + 1)}
              className="px-1 hover:text-gray-700"
            >
              ↓
            </button>
          </div>
        )}
        {search && matchedIds.length === 0 && (
          <span className="text-xs text-gray-400">No matches</span>
        )}
      </div>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={(_, node) => onNodeClick?.(node.id)}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.3 }}
        minZoom={0.2}
        maxZoom={2}
        attributionPosition="bottom-left"
      >
        <Background gap={20} size={1} color="#f1f5f9" />
        <Controls />
        <MiniMap
          nodeStrokeWidth={3}
          pannable
          zoomable
          className="!bg-gray-50"
        />
      </ReactFlow>
    </div>
  );
}

export function FamilyTreeView({
  persons,
  onNodeClick,
}: {
  persons: PersonData[];
  onNodeClick?: (personId: string) => void;
}) {
  if (persons.length === 0) return null;

  return (
    <ReactFlowProvider>
      <FamilyTreeInner persons={persons} onNodeClick={onNodeClick} />
    </ReactFlowProvider>
  );
}
