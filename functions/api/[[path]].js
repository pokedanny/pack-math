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

const [nameRes, exRes, gxRes] = await Promise.all([
  fetch(`https://api.tcgapi.dev/v1/search?q=${encodeURIComponent(query)}&game=pokemon&limit=25`, { headers: { "X-API-Key": env.TCGAPI_KEY } }),
  fetch(`https://api.tcgapi.dev/v1/search?q=${encodeURIComponent(query + " ex")}&game=pokemon&limit=25`, { headers: { "X-API-Key": env.TCGAPI_KEY } }),
  fetch(`https://api.tcgapi.dev/v1/search?q=${encodeURIComponent(query + " gx")}&game=pokemon&limit=25`, { headers: { "X-API-Key": env.TCGAPI_KEY } }),
]);

const [nameData, exData, gxData] = await Promise.all([nameRes.json(), exRes.json(), gxRes.json()]);

    const seen = new Set();
const combined = [...(nameData.data || []), ...(exData.data || []), ...(gxData.data || [])]
      .filter(card => {
        if (card.product_type !== "Cards") return false;
        if (card.name.startsWith("Code Card")) return false;
        if (seen.has(card.id)) return false;
        seen.add(card.id);
        return true;
      })
      .map(card => ({
        id: String(card.id),
        name: card.name,
        set_name: card.set_name,
        number: card.number,
        price: card.market_price || card.low_price || 0,
        rarity: card.rarity || "Unknown",
        image: "🃏",
        image_url: card.image_url,
      }));

    return new Response(JSON.stringify(combined), { headers });
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
      "INSERT INTO wishlist (card_id, name, set_name, number, price, rarity, image, image_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
    ).bind(card.id, card.name, card.set_name, card.number, card.price, card.rarity, card.image, card.image_url).run();
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