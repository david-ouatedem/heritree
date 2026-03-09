"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  createPersonSchema,
  updatePersonSchema,
  createRelationshipSchema,
} from "@/lib/validators/tree";
import { revalidatePath } from "next/cache";

async function verifyTreeOwnership(treeId: string, userId: string) {
  const tree = await prisma.tree.findFirst({
    where: { id: treeId, ownerId: userId },
  });
  if (!tree) throw new Error("Tree not found");
  return tree;
}

export async function createPerson(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const treeId = formData.get("treeId") as string;
  await verifyTreeOwnership(treeId, session.user.id);

  const parsed = createPersonSchema.safeParse({
    treeId,
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName") || undefined,
    birthDate: formData.get("birthDate") || undefined,
    deathDate: formData.get("deathDate") || undefined,
    birthPlace: formData.get("birthPlace") || undefined,
    gender: formData.get("gender") || undefined,
    bio: formData.get("bio") || undefined,
    isLiving: formData.get("isLiving") !== "false",
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const { treeId: _, birthDate, deathDate, ...rest } = parsed.data;

  const person = await prisma.person.create({
    data: {
      ...rest,
      birthDate: birthDate ? new Date(birthDate) : undefined,
      deathDate: deathDate ? new Date(deathDate) : undefined,
      treeId,
    },
  });

  revalidatePath(`/tree/${treeId}`);
  return { person };
}

export async function updatePerson(personId: string, formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const person = await prisma.person.findUnique({
    where: { id: personId },
    include: { tree: { select: { ownerId: true, id: true } } },
  });
  if (!person || person.tree.ownerId !== session.user.id) {
    throw new Error("Person not found");
  }

  const parsed = updatePersonSchema.safeParse({
    firstName: formData.get("firstName") || undefined,
    lastName: formData.get("lastName") || undefined,
    birthDate: formData.get("birthDate") || undefined,
    deathDate: formData.get("deathDate") || undefined,
    birthPlace: formData.get("birthPlace") || undefined,
    gender: formData.get("gender") || undefined,
    bio: formData.get("bio") || undefined,
    isLiving: formData.has("isLiving")
      ? formData.get("isLiving") !== "false"
      : undefined,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const { birthDate, deathDate, ...rest } = parsed.data;

  await prisma.person.update({
    where: { id: personId },
    data: {
      ...rest,
      ...(birthDate !== undefined && {
        birthDate: birthDate ? new Date(birthDate) : null,
      }),
      ...(deathDate !== undefined && {
        deathDate: deathDate ? new Date(deathDate) : null,
      }),
    },
  });

  revalidatePath(`/tree/${person.tree.id}`);
}

export async function deletePerson(personId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const person = await prisma.person.findUnique({
    where: { id: personId },
    include: { tree: { select: { ownerId: true, id: true } } },
  });
  if (!person || person.tree.ownerId !== session.user.id) {
    throw new Error("Person not found");
  }

  await prisma.person.delete({ where: { id: personId } });

  revalidatePath(`/tree/${person.tree.id}`);
}

export async function addRelationship(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const treeId = formData.get("treeId") as string;
  await verifyTreeOwnership(treeId, session.user.id);

  const parsed = createRelationshipSchema.safeParse({
    treeId,
    person1Id: formData.get("person1Id"),
    person2Id: formData.get("person2Id"),
    type: formData.get("type"),
    nature: formData.get("nature") || "BIOLOGICAL",
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const { person1Id, person2Id, type, nature } = parsed.data;

  if (person1Id === person2Id) {
    return { error: "Cannot create a relationship with the same person" };
  }

  // Check both persons belong to this tree
  const persons = await prisma.person.findMany({
    where: { id: { in: [person1Id, person2Id] }, treeId },
  });
  if (persons.length !== 2) {
    return { error: "Both persons must belong to this tree" };
  }

  // Check for duplicate
  const existing = await prisma.relationship.findUnique({
    where: {
      person1Id_person2Id_type: { person1Id, person2Id, type },
    },
  });
  if (existing) {
    return { error: "This relationship already exists" };
  }

  await prisma.relationship.create({
    data: { person1Id, person2Id, type, nature },
  });

  revalidatePath(`/tree/${treeId}`);
}

export async function removeRelationship(relationshipId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const relationship = await prisma.relationship.findUnique({
    where: { id: relationshipId },
    include: {
      person1: { select: { tree: { select: { ownerId: true, id: true } } } },
    },
  });

  if (!relationship || relationship.person1.tree.ownerId !== session.user.id) {
    throw new Error("Relationship not found");
  }

  await prisma.relationship.delete({ where: { id: relationshipId } });

  revalidatePath(`/tree/${relationship.person1.tree.id}`);
}

export async function getTreeWithPersons(treeId: string) {
  const session = await auth();
  if (!session?.user?.id) return null;

  return prisma.tree.findFirst({
    where: { id: treeId, ownerId: session.user.id },
    include: {
      persons: {
        include: {
          relationshipsAsSource: {
            include: { person2: true },
          },
          relationshipsAsTarget: {
            include: { person1: true },
          },
        },
        orderBy: { createdAt: "asc" },
      },
    },
  });
}
