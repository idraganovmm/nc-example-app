import { z } from 'zod';
import { id, timestamps } from '../attribute-sets';

export const baseTodoAttributes = z.object({
  name: z.string().trim().min(1).max(255).openapi({ example: 'Laundry' }),
  note: z
    .string()
    .trim()
    .min(1)
    .max(255)
    .nullable()
    .openapi({ example: 'Buy detergent' }),
  completed: z.boolean().openapi({ example: false }),
});

export type BaseTodoAttributes = z.infer<typeof baseTodoAttributes>;

const userId = z.number().int().positive().openapi({ example: 1 });

const userAssociations = z.object({
  userId,
});

export const todoAttributes = baseTodoAttributes.merge(userAssociations);

export type TodoAttributes = z.infer<typeof todoAttributes>;

export const todo = todoAttributes.merge(id).merge(timestamps);

export type Todo = z.infer<typeof todo>;
