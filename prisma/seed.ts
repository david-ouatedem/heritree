import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding database...");

  // Create a test user
  const hashedPassword = await bcrypt.hash("Password1", 12);
  const user = await prisma.user.upsert({
    where: { email: "test@heritree.dev" },
    update: {},
    create: {
      name: "Test User",
      email: "test@heritree.dev",
      password: hashedPassword,
    },
  });
  console.log(`Created user: ${user.email}`);

  // Create a sample tree
  const tree = await prisma.tree.upsert({
    where: { id: "seed-tree-1" },
    update: {},
    create: {
      id: "seed-tree-1",
      name: "My Family Tree",
      description: "A sample family tree to get started",
      ownerId: user.id,
    },
  });
  console.log(`Created tree: ${tree.name}`);

  // Create sample persons
  const grandpa = await prisma.person.create({
    data: {
      firstName: "James",
      lastName: "Smith",
      birthDate: new Date("1940-03-15"),
      deathDate: new Date("2015-08-22"),
      gender: "MALE",
      isLiving: false,
      treeId: tree.id,
    },
  });

  const grandma = await prisma.person.create({
    data: {
      firstName: "Mary",
      lastName: "Smith",
      birthDate: new Date("1943-07-10"),
      gender: "FEMALE",
      isLiving: true,
      treeId: tree.id,
    },
  });

  const dad = await prisma.person.create({
    data: {
      firstName: "Robert",
      lastName: "Smith",
      birthDate: new Date("1968-11-05"),
      gender: "MALE",
      isLiving: true,
      treeId: tree.id,
    },
  });

  const mom = await prisma.person.create({
    data: {
      firstName: "Linda",
      lastName: "Smith",
      birthDate: new Date("1970-02-20"),
      gender: "FEMALE",
      isLiving: true,
      treeId: tree.id,
    },
  });

  const child = await prisma.person.create({
    data: {
      firstName: "Alex",
      lastName: "Smith",
      birthDate: new Date("1995-06-12"),
      gender: "MALE",
      isLiving: true,
      treeId: tree.id,
    },
  });

  console.log(`Created ${5} persons`);

  // Create relationships
  await prisma.relationship.createMany({
    data: [
      // Grandparents are spouses
      { person1Id: grandpa.id, person2Id: grandma.id, type: "SPOUSE", nature: "BIOLOGICAL" },
      // Grandpa & Grandma → Dad
      { person1Id: grandpa.id, person2Id: dad.id, type: "PARENT_CHILD", nature: "BIOLOGICAL" },
      { person1Id: grandma.id, person2Id: dad.id, type: "PARENT_CHILD", nature: "BIOLOGICAL" },
      // Dad & Mom are spouses
      { person1Id: dad.id, person2Id: mom.id, type: "SPOUSE", nature: "BIOLOGICAL" },
      // Dad & Mom → Child
      { person1Id: dad.id, person2Id: child.id, type: "PARENT_CHILD", nature: "BIOLOGICAL" },
      { person1Id: mom.id, person2Id: child.id, type: "PARENT_CHILD", nature: "BIOLOGICAL" },
    ],
  });

  console.log("Created relationships");
  console.log("Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
