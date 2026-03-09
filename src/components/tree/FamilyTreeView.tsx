"use client";

import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useMemo } from "react";
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

export function FamilyTreeView({ persons }: { persons: PersonData[] }) {
  const { nodes: initialNodes, edges: initialEdges } = useMemo(
    () => buildTreeLayout(persons),
    [persons]
  );

  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);

  if (persons.length === 0) return null;

  return (
    <div className="h-[600px] w-full rounded-xl border border-gray-200 bg-white">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
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
