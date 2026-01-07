export const POST = async ({ locals: { drizzle, schema: { trafficNews } }, request }) => {
    try {
        const data = await request.json();
        const title = data.title as string;
        const content = data.content as string;
        if (!title || !content) {
            return new Response(JSON.stringify({ message: "Title and content are required." }), { status: 400 });
        }
        await drizzle.insert(trafficNews).values({
            title,
            content,
            source: data.source || null,

        });
        return new Response(JSON.stringify({ message: "News article created successfully." }), { status: 201 });
    } catch (err) {
        console.error(err);
        return new Response(JSON.stringify({ message: "Internal server error." }), { status: 500 });
    }
};