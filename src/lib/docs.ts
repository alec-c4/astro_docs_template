import { getCollection } from 'astro:content';
import { portal } from '../portal.config';
export const href = (id = '') =>
	`${import.meta.env.BASE_URL.replace(/\/$/, '')}/${id ? `${id.replace(/\/$/, '')}/` : ''}`;
export async function getDocs() {
	const docs = await getCollection(
		'docs',
		({ data }) => import.meta.env.DEV || !data.draft,
	);
	return docs.sort(
		(a, b) =>
			portal.sections.findIndex((s) => s.id === a.data.section) -
				portal.sections.findIndex((s) => s.id === b.data.section) ||
			a.data.order - b.data.order ||
			a.data.title.localeCompare(b.data.title, portal.locale),
	);
}
