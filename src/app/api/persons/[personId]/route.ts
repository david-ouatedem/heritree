import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ personId: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { personId } = await params;

  const person = await prisma.person.findUnique({
    where: { id: personId },
    include: {
      tree: { select: { ownerId: true } },
      relationshipsAsSource: {
        include: {
          person2: {
            select: { id: true, firstName: true, lastName: true },
          },
        },
      },
      relationshipsAsTarget: {
        include: {
          person1: {
            select: { id: true, firstName: true, lastName: true },
          },
        },
      },
    },
  });

  if (!person || person.tree.ownerId !== session.user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Group relationships for easy consumption
  const parents = person.relationshipsAsTarget
    .filter((r) => r.type === "PARENT_CHILD")
    .map((r) => r.person1);

  const children = person.relationshipsAsSource
    .filter((r) => r.type === "PARENT_CHILD")
    .map((r) => r.person2);

  const spouses = [
    ...person.relationshipsAsSource
      .filter((r) => r.type === "SPOUSE")
      .map((r) => r.person2),
    ...person.relationshipsAsTarget
      .filter((r) => r.type === "SPOUSE")
      .map((r) => r.person1),
  ];

  const siblings = [
    ...person.relationshipsAsSource
      .filter((r) => r.type === "SIBLING")
      .map((r) => r.person2),
    ...person.relationshipsAsTarget
      .filter((r) => r.type === "SIBLING")
      .map((r) => r.person1),
  ];

  return NextResponse.json({
    person: {
      id: person.id,
      firstName: person.firstName,
      lastName: person.lastName,
      birthDate: person.birthDate,
      deathDate: person.deathDate,
      birthPlace: person.birthPlace,
      gender: person.gender,
      bio: person.bio,
      isLiving: person.isLiving,
      parents,
      children,
      spouses,
      siblings,
    },
  });
}
