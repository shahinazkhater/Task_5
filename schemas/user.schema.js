import z from "zod";

export const userSchema = z.object({
  name: z
    .string("name must be a string")
    .trim()
    .min(2, "name should be at least 2 charcters"),
  age: z.number("age must be a number").min(18, "min age is 18"),
  email: z.email("very bad email"),
  hobbies: z.array(z.string()).min(1)
});