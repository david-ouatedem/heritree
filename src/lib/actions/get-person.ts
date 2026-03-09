"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function getPersonWithDetails(personId: string) {
  const session = await auth();
  if (!session?.user?.id) return null;

  const person = await prisma.person.findUnique({
    where: { id: personId },
    include: {
      tree: {
        select: { id: true, name: true, ownerId: true },
      },
      relationshipsAsSource: {
        include: {
          person2: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              birthDate: true,
              gender: true,
              isLiving: true,
            },
          },
        },
      },
      relationshipsAsTarget: {
        include: {
          person1: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              birthDate: true,
              gender: true,
              isLiving: true,
            },
          },
        },
      },
    },
  });

  if (!person || person.tree.ownerId !== session.user.id) return null;

  return person;
}
