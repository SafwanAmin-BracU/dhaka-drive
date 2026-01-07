import type { RequestHandler } from './$types';

export const POST:RequestHandler = async ({ locals: { drizzle, schema: { trafficNews } }, request }) => {
    try {

        const formData = await request.formData();
        const title = formData.get('title') as string;
        const content = formData.get('content') as string;
        const source = formData.get('source') as string;
        console.log("Received data:", formData);
        if (!title || !content) {
            return new Response(JSON.stringify({ message: "Title and content are required." }), { status: 400 });
        }
        await drizzle.insert(trafficNews).values({
            title,
            content,
            source: source || null,
        });
        return new Response(JSON.stringify({ message: "News article created successfully." }), { status: 201 });
    } catch (err) {
        console.error(err);
        return new Response(JSON.stringify({ message: "Internal server error." }), { status: 500 });
    }
};