"use client";

import { Handle, Position } from "@xyflow/react";
import type { NodeProps } from "@xyflow/react";

function formatYear(date: Date | string | null) {
  if (!date) return null;
  return new Date(date).getFullYear();
}

function getGenderBorder(gender: string | null) {
  switch (gender) {
    case "MALE":
      return "border-blue-300";
    case "FEMALE":
      return "border-pink-300";
    default:
      return "border-gray-300";
  }
}

function getGenderBg(gender: string | null) {
  switch (gender) {
    case "MALE":
      return "bg-blue-50";
    case "FEMALE":
      return "bg-pink-50";
    default:
      return "bg-gray-50";
  }
}

type PersonNodeData = {
  firstName: string;
  lastName: string | null;
  birthDate: Date | string | null;
  deathDate: Date | string | null;
  gender: string | null;
  isLiving: boolean;
};

export function PersonNode({ data }: NodeProps) {
  const d = data as PersonNodeData;
  const fullName = [d.firstName, d.lastName].filter(Boolean).join(" ");
  const birthYear = formatYear(d.birthDate);
  const deathYear = formatYear(d.deathDate);

  const dateStr = birthYear
    ? deathYear
      ? `${birthYear} — ${deathYear}`
      : d.isLiving
        ? `b. ${birthYear}`
        : `${birthYear} — ?`
    : null;

  return (
    <div
      className={`rounded-lg border-2 ${getGenderBorder(d.gender)} ${getGenderBg(d.gender)} px-4 py-3 shadow-sm min-w-[160px] text-center`}
    >
      <Handle type="target" position={Position.Top} className="!bg-gray-400" />
      <p className="text-sm font-semibold truncate">{fullName}</p>
      {dateStr && <p className="text-xs text-gray-500 mt-0.5">{dateStr}</p>}
      {!d.isLiving && (
        <p className="text-[10px] text-gray-400 mt-0.5">Deceased</p>
      )}
      <Handle type="source" position={Position.Bottom} className="!bg-gray-400" />
    </div>
  );
}
