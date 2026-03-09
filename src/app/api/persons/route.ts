import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createPersonSchema } from "@/lib/validators/tree";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = createPersonSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0].message },
      { status: 400 }
    );
  }

  // Verify tree ownership
  const tree = await prisma.tree.findFirst({
    where: { id: parsed.data.treeId, ownerId: session.user.id },
  });
  if (!tree) {
    return NextResponse.json({ error: "Tree not found" }, { status: 404 });
  }

  const { treeId, birthDate, deathDate, ...rest } = parsed.data;

  const person = await prisma.person.create({
    data: {
      ...rest,
      birthDate: birthDate ? new Date(birthDate) : undefined,
      deathDate: deathDate ? new Date(deathDate) : undefined,
      treeId,
    },
  });

  return NextResponse.json({ person }, { status: 201 });
}
