import { z } from "zod/v4";

export const createTreeSchema = z.object({
  name: z.string().min(1, "Tree name is required").max(100),
  description: z.string().max(500).optional(),
});

export const updateTreeSchema = createTreeSchema.partial();

export const createPersonSchema = z.object({
  treeId: z.string().min(1),
  firstName: z.string().min(1, "First name is required").max(100),
  lastName: z.string().max(100).optional(),
  birthDate: z.string().optional(), // ISO date string from form
  deathDate: z.string().optional(),
  birthPlace: z.string().max(200).optional(),
  gender: z.enum(["MALE", "FEMALE", "OTHER"]).optional(),
  bio: z.string().max(2000).optional(),
  isLiving: z.boolean().default(true),
});

export const updatePersonSchema = createPersonSchema.omit({ treeId: true }).partial();

export const createRelationshipSchema = z.object({
  treeId: z.string().min(1),
  person1Id: z.string().min(1),
  person2Id: z.string().min(1),
  type: z.enum(["PARENT_CHILD", "SPOUSE", "SIBLING"]),
  nature: z.enum(["BIOLOGICAL", "ADOPTED", "STEP", "FOSTER"]).default("BIOLOGICAL"),
});

export type CreateTreeInput = z.infer<typeof createTreeSchema>;
export type UpdateTreeInput = z.infer<typeof updateTreeSchema>;
export type CreatePersonInput = z.infer<typeof createPersonSchema>;
export type UpdatePersonInput = z.infer<typeof updatePersonSchema>;
export type CreateRelationshipInput = z.infer<typeof createRelationshipSchema>;
