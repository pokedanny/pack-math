export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const fullPath = url.pathname;
  const path = fullPath.replace(/^\/api/, "");

  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  if (request.method === "OPTIONS") {
    return new Response(null, { headers });
  }

  // Search cards
  if (path === "/search" && request.method === "GET") {
    const query = url.searchParams.get("q");
    if (!query) return new Response(JSON.stringify([]), { headers });

    const res = await fetch(
      `https://api.tcgapi.dev/v1/pokemon/cards?search=${encodeURIComponent(query)}&limit=12`,
      { headers: { Authorization: `Bearer ${env.TCGAPI_KEY}` } }
    );
    const data = await res.json();
    return new Response(JSON.stringify(data), { headers });
  }

  // Get wishlist
  if (path === "/wishlist" && request.method === "GET") {
    const { results } = await env.DB.prepare("SELECT * FROM wishlist ORDER BY created_at DESC").all();
    return new Response(JSON.stringify(results), { headers });
  }

  // Add to wishlist
  if (path === "/wishlist" && request.method === "POST") {
    const card = await request.json();
    await env.DB.prepare(
      "INSERT INTO wishlist (card_id, name, set_name, number, price, rarity, image) VALUES (?, ?, ?, ?, ?, ?, ?)"
    ).bind(card.id, card.name, card.set_name, card.number, card.price, card.rarity, card.image).run();
    return new Response(JSON.stringify({ success: true }), { headers });
  }

  // Delete from wishlist
  if (path.startsWith("/wishlist/") && request.method === "DELETE") {
    const id = path.split("/").pop();
    await env.DB.prepare("DELETE FROM wishlist WHERE id = ?").bind(id).run();
    return new Response(JSON.stringify({ success: true }), { headers });
  }

  // Get savings
  if (path === "/savings" && request.method === "GET") {
    const { results } = await env.DB.prepare("SELECT * FROM savings ORDER BY created_at DESC").all();
    return new Response(JSON.stringify(results), { headers });
  }

  // Add savings
  if (path === "/savings" && request.method === "POST") {
    const entry = await request.json();
    await env.DB.prepare(
      "INSERT INTO savings (amount, note) VALUES (?, ?)"
    ).bind(entry.amount, entry.note).run();
    return new Response(JSON.stringify({ success: true }), { headers });
  }

  // Delete savings entry
  if (path.startsWith("/savings/") && request.method === "DELETE") {
    const id = path.split("/").pop();
    await env.DB.prepare("DELETE FROM savings WHERE id = ?").bind(id).run();
    return new Response(JSON.stringify({ success: true }), { headers });
  }

  return new Response(JSON.stringify({ error: "Not found", path }), { status: 404, headers });
}