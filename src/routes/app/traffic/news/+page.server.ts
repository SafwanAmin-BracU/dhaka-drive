import { desc } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load = (async ({ locals: { drizzle, schema: { trafficNews } } }) => {
    try {
        const news = await drizzle
            .select()
            .from(trafficNews)
            .orderBy(desc(trafficNews.publishedAt));

        return { news };
    } catch (err) {
        console.error("Error loading traffic news:", err);
        return { news: [] };
    }
}) satisfies PageServerLoad;


