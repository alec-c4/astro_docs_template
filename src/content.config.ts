import { defineCollection } from 'astro:content';
import { z } from 'zod';
import { glob } from 'astro/loaders';
import { portal } from './portal.config';
export const collections = {
	docs: defineCollection({
		loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/docs' }),
		schema: z.object({
			title: z.string().min(1),
			description: z.string().min(1),
			section: z
				.string()
				.refine((id) => portal.sections.some((section) => section.id === id)),
			order: z.number().default(100),
			draft: z.boolean().default(false),
			updated: z.coerce.date().optional(),
		}),
	}),
};
