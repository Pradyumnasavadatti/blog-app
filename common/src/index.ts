import { boolean, z } from "zod";

export const SignupVal = z.object({
  email: z.string().email({ message: "Invalid email" }),
  password: z
    .string()
    .min(6, { message: "Minimum 8 characters expected for password" })
    .max(25, { message: "Maximum 25 characters expected for password" })
    .regex(/[A-Za-z0-9][@#]/, {
      message: "Password must contain only letters, numbers, @, or #.",
    }),

  name: z.string().max(25, { message: "Maximum 25 characters" }),
});

export type SignupInf = z.infer<typeof SignupVal>;

export const SigninVal = z.object({
  email: z.string().email({ message: "Invalid email" }),
  password: z
    .string()
    .min(6, { message: "Minimum 8 characters expected for password" })
    .max(25, { message: "Maximum 25 characters expected for password" })
    .regex(/[A-Za-z0-9][@#]/, {
      message: "Password must contain only letters, numbers, @, or #.",
    }),
});

export type SigninInf = z.infer<typeof SigninVal>;

export const CreateBlogVal = z.object({
  title: z
    .string()
    .min(1, { message: "Minimum 1 character expected for title" })
    .max(50, { message: "Maximum 50 characters only for title" }),
  content: z
    .string()
    .min(20, { message: "Minimum 20 character expected for content" })
    .max(2000, { message: "Maximum 2000 characters only for content" }),
});

export type CreateBlogInf = z.infer<typeof CreateBlogVal>;

export const UpdateBlogVal = z
  .object({
    title: z
      .string()
      .min(1, { message: "Minimum 1 character expected for title" })
      .max(50, { message: "Maximum 50 characters only for title" })
      .optional(),
    content: z
      .string()
      .min(20, { message: "Minimum 20 character expected for content" })
      .max(2000, { message: "Maximum 2000 characters only for content" })
      .optional(),
    published: boolean().optional(),
  })
  .refine(
    (data) => {
      return Object.values(data).some((d: string | boolean) => d !== undefined);
    },
    { message: "Atleast one field required to update" }
  );

export type UpdateBlogInf = z.infer<typeof UpdateBlogVal>;
