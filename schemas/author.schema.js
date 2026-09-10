import { z } from "zod";

export const createAuthorSchema = z.object({
  name: z.string().min(2),
  age: z.coerce.number().positive()
});

export const updateAuthorSchema = z.object({
  name: z.string().min(2),
  age: z.coerce.number().positive()
});

export const authorIdSchema = z.object({
  id: z.coerce.number({ message:" ID must be a vali number "}).positive()
});

export const searchAuthorSchema = z.object({
  name: z.string().optional()
});