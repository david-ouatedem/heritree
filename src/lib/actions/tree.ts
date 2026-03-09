"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createTreeSchema, updateTreeSchema } from "@/lib/validators/tree";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createTree(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const parsed = createTreeSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description") || undefined,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const tree = await prisma.tree.create({
    data: {
      name: parsed.data.name,
      description: parsed.data.description,
      ownerId: session.user.id,
    },
  });

  redirect(`/tree/${tree.id}`);
}

export async function updateTree(treeId: string, formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const tree = await prisma.tree.findFirst({
    where: { id: treeId, ownerId: session.user.id },
  });
  if (!tree) throw new Error("Tree not found");

  const parsed = updateTreeSchema.safeParse({
    name: formData.get("name") || undefined,
    description: formData.get("description") || undefined,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  await prisma.tree.update({
    where: { id: treeId },
    data: parsed.data,
  });

  revalidatePath(`/tree/${treeId}`);
}

export async function deleteTree(treeId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const tree = await prisma.tree.findFirst({
    where: { id: treeId, ownerId: session.user.id },
  });
  if (!tree) throw new Error("Tree not found");

  await prisma.tree.delete({ where: { id: treeId } });

  redirect("/dashboard");
}

export async function getUserTrees() {
  const session = await auth();
  if (!session?.user?.id) return [];

  return prisma.tree.findMany({
    where: { ownerId: session.user.id },
    include: {
      _count: { select: { persons: true } },
    },
    orderBy: { updatedAt: "desc" },
  });
}
