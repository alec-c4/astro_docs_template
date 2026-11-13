import { getDocs, href } from '../lib/docs';
export async function GET() {
	return Response.json(
		(await getDocs()).map((doc) => ({
			title: doc.data.title,
			href: href(doc.id),
			text: `${doc.data.description} ${doc.body ?? ''}`
				.replace(/<[^>]*>/g, ' ')
				.replace(/import .*?from .*?;/g, ' '),
		})),
	);
}
