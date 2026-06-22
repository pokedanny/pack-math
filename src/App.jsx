import { useState, useEffect } from "react";

const SNARKY_EMPTY = [
  "Your wishlist is emptier than a pack with no hits.",
  "Nothing here. Bold strategy for a collector.",
  "No cards saved. Are you just buying packs and hoping? Classic.",
  "This is awkward. Even a common deserves a spot here.",
];

const PACK_MATH_TAUNTS = {
  low: "Congrats. You almost bought a pack for that.",
  mid: "That's literally 2–3 packs of Destined Rivals. Think about it.",
  high: "You were about to gamble this on cardboard lottery tickets.",
  veryHigh: "This is serious sealed product money. Put it to work.",
};

const SAVINGS_QUIPS = [
  "Money you didn't waste on packs is money you actually have.",
  "Pack math is real math. The house always wins.",
  "Every pack you skip is a card you chose.",
  "Technically you're saving money right now by being here.",
];

const RARITY_COLORS = {
  "Special Illustration Rare": { bg: "rgba(201,168,76,0.15)", border: "#C9A84C", glow: "rgba(201,168,76,0.4)", label: "SIR" },
  "Illustration Rare": { bg: "rgba(78,205,196,0.15)", border: "#4ECDC4", glow: "rgba(78,205,196,0.4)", label: "IR" },
  "Hyper Rare": { bg: "rgba(255,120,80,0.15)", border: "#FF7850", glow: "rgba(255,120,80,0.4)", label: "HR" },
  "Alternate Art Secret": { bg: "rgba(180,100,255,0.15)", border: "#B464FF", glow: "rgba(180,100,255,0.4)", label: "ALT" },
  "Secret Rare": { bg: "rgba(180,100,255,0.15)", border: "#B464FF", glow: "rgba(180,100,255,0.4)", label: "SECRET" },
  "Ultra Rare": { bg: "rgba(201,168,76,0.15)", border: "#C9A84C", glow: "rgba(201,168,76,0.4)", label: "UR" },
  "Holo Rare": { bg: "rgba(78,205,196,0.12)", border: "#4ECDC4", glow: "rgba(78,205,196,0.3)", label: "HOLO" },
  "Shiny Holo Rare": { bg: "rgba(180,100,255,0.15)", border: "#B464FF", glow: "rgba(180,100,255,0.4)", label: "SHINY" },
  "Rare": { bg: "rgba(78,205,196,0.08)", border: "#4ECDC4", glow: "rgba(78,205,196,0.2)", label: "RARE" },
  "default": { bg: "rgba(255,255,255,0.04)", border: "rgba(255,255,255,0.15)", glow: "rgba(255,255,255,0.1)", label: "CARD" },
};

const getRarity = (card) => RARITY_COLORS[card.rarity] || RARITY_COLORS["default"];

const PokeBall = ({ size = 20, color = "#C9A84C" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="1.5" />
    <path d="M2 12h20" stroke={color} strokeWidth="1.5" />
    <circle cx="12" cy="12" r="3" fill={color} />
    <circle cx="12" cy="12" r="2" fill="#0A0A0F" />
    <circle cx="12" cy="12" r="1" fill={color} />
  </svg>
);

const CardTile = ({ card, onAdd, onRemove, inWishlist, onGoal }) => {
  const [hovered, setHovered] = useState(false);
  const rarity = getRarity(card);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? `linear-gradient(160deg, ${rarity.bg}, rgba(20,20,35,0.98))` : "rgba(20,20,35,0.9)",
        border: `1px solid ${hovered ? rarity.border : "rgba(255,255,255,0.07)"}`,
        borderRadius: 14,
        overflow: "hidden",
        transition: "all 0.3s ease",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        boxShadow: hovered ? `0 12px 40px ${rarity.glow}, 0 0 0 1px ${rarity.border}` : "0 2px 8px rgba(0,0,0,0.4)",
        cursor: "default",
        position: "relative",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Holo shimmer overlay */}
      {hovered && (
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none", zIndex: 2,
          background: "linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.04) 50%, transparent 70%)",
          animation: "shimmer 2s infinite",
        }} />
      )}

      {/* Card image area */}
      <div style={{
        width: "100%",
        paddingTop: "139%",
        position: "relative",
        background: `linear-gradient(160deg, rgba(30,30,50,0.8), rgba(10,10,20,0.9))`,
        overflow: "hidden",
      }}>
        {card.image_url ? (
          <img
            src={card.image_url}
            alt={card.name}
            style={{
              position: "absolute", inset: 0, width: "100%", height: "100%",
              objectFit: "cover",
              transition: "transform 0.4s ease",
              transform: hovered ? "scale(1.04)" : "scale(1)",
            }}
          />
        ) : (
          <div style={{
            position: "absolute", inset: 0, display: "flex",
            alignItems: "center", justifyContent: "center", fontSize: 48,
          }}>🃏</div>
        )}

        {/* Rarity badge */}
        <div style={{
          position: "absolute", top: 8, right: 8, zIndex: 3,
          fontSize: 9, fontWeight: 800, color: rarity.border,
          background: "rgba(10,10,15,0.85)",
          border: `1px solid ${rarity.border}`,
          padding: "3px 7px", borderRadius: 4,
          letterSpacing: "0.06em",
          backdropFilter: "blur(4px)",
          fontFamily: "Inter, sans-serif",
        }}>{rarity.label}</div>

        {/* Wishlist indicator */}
        {inWishlist && (
          <div style={{
            position: "absolute", top: 8, left: 8, zIndex: 3,
            fontSize: 14,
            filter: "drop-shadow(0 0 4px rgba(201,168,76,0.8))",
          }}>⭐</div>
        )}

        {/* Price tag */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 3,
          background: "linear-gradient(transparent, rgba(10,10,15,0.95))",
          padding: "24px 10px 8px",
        }}>
          <div style={{
            fontFamily: "Inter, sans-serif",
            fontSize: 16, fontWeight: 800,
            color: parseFloat(card.price) === 0 ? "rgba(240,237,232,0.3)" : "#4ECDC4",
            letterSpacing: "-0.02em",
            lineHeight: 1,
          }}>
            {parseFloat(card.price) > 0 ? `$${parseFloat(card.price).toFixed(2)}` : "—"}
          </div>
          <div style={{
            fontSize: 9, color: "rgba(78,205,196,0.45)",
            fontFamily: "Inter, sans-serif", fontWeight: 500, marginTop: 2,
          }}>NM MARKET</div>
        </div>
      </div>

      {/* Card info */}
      <div style={{ padding: "10px 12px 12px", flex: 1, display: "flex", flexDirection: "column", gap: 4 }}>
        <div style={{
          fontSize: 12, fontWeight: 700, color: "#F0EDE8",
          fontFamily: "Inter, sans-serif",
          lineHeight: 1.3,
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}>{card.name}</div>

        <div style={{
          fontSize: 10, color: "rgba(240,237,232,0.35)",
          fontFamily: "Inter, sans-serif",
          whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
        }}>{card.set_name}</div>

        {card.number && (
          <div style={{
            fontSize: 10, color: "rgba(240,237,232,0.2)",
            fontFamily: "Inter, sans-serif",
          }}>#{card.number}</div>
        )}

        {/* Action button */}
        <button
          onClick={() => inWishlist ? onRemove(card.id) : onAdd(card)}
          style={{
            marginTop: "auto",
            paddingTop: 8,
            background: inWishlist ? "rgba(255,80,80,0.1)" : `rgba(201,168,76,0.1)`,
            border: `1px solid ${inWishlist ? "rgba(255,80,80,0.3)" : "rgba(201,168,76,0.25)"}`,
            color: inWishlist ? "#FF5050" : "#C9A84C",
            borderRadius: 8, padding: "8px 0", cursor: "pointer",
            fontSize: 11, fontWeight: 700, fontFamily: "Inter, sans-serif",
            transition: "all 0.2s", width: "100%",
            letterSpacing: "0.04em",
          }}
        >
{inWishlist ? "✕ REMOVE" : "+ WISHLIST"}
        </button>
        {inWishlist && onGoal && (
          <button
            onClick={() => onGoal(card)}
            style={{
              background: "rgba(78,205,196,0.08)",
              border: "1px solid rgba(78,205,196,0.2)",
              color: "#4ECDC4",
              borderRadius: 8, padding: "8px 0", cursor: "pointer",
              fontSize: 11, fontWeight: 700, fontFamily: "Inter, sans-serif",
              transition: "all 0.2s", width: "100%", letterSpacing: "0.04em",
            }}
          >
            🎯 SAVE UP
          </button>
        )}
      </div>
    </div>
  );
};

const Nav = ({ page, setPage, wishlistCount }) => (
  <div style={{
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "18px 24px", borderBottom: "1px solid rgba(255,255,255,0.05)",
    background: "rgba(10,10,15,0.95)", position: "sticky", top: 0, zIndex: 100,
    backdropFilter: "blur(12px)",
  }}>
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <PokeBall size={22} />
      <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, letterSpacing: "0.08em", color: "#C9A84C" }}>PACK MATH</span>
    </div>
    <div style={{ display: "flex", gap: 4 }}>
      {[
        { id: "wishlist", label: `Wishlist${wishlistCount > 0 ? ` (${wishlistCount})` : ""}` },
        { id: "calculator", label: "Pack Math" },
        { id: "goals", label: "Goals" },
        { id: "savings", label: "Card Vault" },
      ].map(tab => (
        <button key={tab.id} onClick={() => setPage(tab.id)} style={{
          background: page === tab.id ? "rgba(201,168,76,0.15)" : "transparent",
          border: `1px solid ${page === tab.id ? "rgba(201,168,76,0.4)" : "transparent"}`,
          color: page === tab.id ? "#C9A84C" : "rgba(240,237,232,0.4)",
          borderRadius: 8, padding: "7px 14px", cursor: "pointer",
          fontSize: 12, fontWeight: 600, fontFamily: "Inter, sans-serif",
          transition: "all 0.2s", letterSpacing: "0.02em",
        }}>{tab.label}</button>
      ))}
    </div>
  </div>
);

const WishlistPage = ({ wishlist, setWishlist }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showSearch, setShowSearch] = useState(true);
  const [sortBy, setSortBy] = useState("default");
  const [filterRarity, setFilterRarity] = useState("all");
  const [emptyQuip] = useState(SNARKY_EMPTY[Math.floor(Math.random() * SNARKY_EMPTY.length)]);

  const search = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      setResults(Array.isArray(data) ? data : []);
      setSearched(true);
    } catch (e) {
      setError("Search failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const addToWishlist = async (card) => {
    if (wishlist.find(c => c.id === card.id)) return;
    try {
      await fetch("/api/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(card),
      });
      setWishlist(prev => [{ ...card }, ...prev]);
    } catch (e) {
      console.error("Failed to add card", e);
    }
  };

  const addToGoals = async (card) => {
  try {
    await fetch("/api/goals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(card),
    });
  } catch (e) {
    console.error("Failed to add goal", e);
  }
};
  const removeFromWishlist = async (id) => {
    try {
      await fetch(`/api/wishlist/${id}`, { method: "DELETE" });
      setWishlist(prev => prev.filter(c => c.id !== id));
    } catch (e) {
      console.error("Failed to remove card", e);
    }
  };

  const totalValue = wishlist.reduce((sum, c) => sum + parseFloat(c.price || 0), 0);

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 24px" }}>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 28 }}>
        <div>
          <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 48, color: "#F0EDE8", letterSpacing: "0.04em", margin: 0, lineHeight: 1 }}>YOUR WISHLIST</h1>
          <p style={{ fontFamily: "Inter, sans-serif", fontSize: 14, color: "rgba(240,237,232,0.4)", margin: "8px 0 0" }}>
            Build it here. Stop building it out of pack luck.
          </p>
        </div>
        {wishlist.length > 0 && (
          <div style={{ textAlign: "right" }}>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 28, color: "#4ECDC4", letterSpacing: "0.02em", lineHeight: 1 }}>
              ${totalValue.toFixed(2)}
            </div>
            <div style={{ fontSize: 11, color: "rgba(78,205,196,0.5)", fontFamily: "Inter, sans-serif", marginTop: 2 }}>
              {wishlist.length} card{wishlist.length !== 1 ? "s" : ""} · total value
            </div>
          </div>
        )}
      </div>

      {/* Search bar */}
      <div style={{ background: "rgba(20,20,35,0.8)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: 20, marginBottom: 32 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(201,168,76,0.6)", fontFamily: "Inter, sans-serif", letterSpacing: "0.08em", marginBottom: 12 }}>
          SEARCH CARDS
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === "Enter" && search()}
            placeholder='Try "Umbreon ex SIR", "Glaceon VMAX", "Prismatic Evolutions"...'
            style={{
              flex: 1, background: "rgba(10,10,15,0.8)", border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 10, padding: "12px 16px", color: "#F0EDE8", fontSize: 14,
              fontFamily: "Inter, sans-serif", outline: "none",
            }}
          />
          <button onClick={search} style={{
            background: loading ? "rgba(201,168,76,0.2)" : "linear-gradient(135deg, #C9A84C, #A8853A)",
            border: "none", borderRadius: 10, padding: "12px 24px", color: loading ? "#C9A84C" : "#0A0A0F",
            fontSize: 13, fontWeight: 700, fontFamily: "Inter, sans-serif",
            cursor: "pointer", letterSpacing: "0.04em", minWidth: 100,
            transition: "all 0.2s",
          }}>{loading ? "SEARCHING..." : "SEARCH"}</button>
        </div>

        {error && <div style={{ color: "#FF5050", fontSize: 12, fontFamily: "Inter, sans-serif", marginTop: 10 }}>{error}</div>}

        {/* Search results grid */}
        {searched && !loading && (
          <div style={{ marginTop: 20 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(240,237,232,0.3)", fontFamily: "Inter, sans-serif", letterSpacing: "0.08em", marginBottom: 14 }}>
              {results.length === 0 ? "NO RESULTS" : `${results.length} CARDS FOUND`}
            </div>
{results.length > 0 && (
  <div style={{ display: "flex", gap: 10, marginBottom: 14, flexWrap: "wrap", alignItems: "center" }}>
    <div style={{ display: "flex", gap: 8 }}>
      {[
        { id: "default", label: "Default" },
        { id: "price_high", label: "Price ↓" },
        { id: "price_low", label: "Price ↑" },
        { id: "name", label: "A–Z" },
      ].map(opt => (
        <button key={opt.id} onClick={() => setSortBy(opt.id)} style={{
          background: sortBy === opt.id ? "rgba(201,168,76,0.15)" : "rgba(10,10,15,0.5)",
          border: `1px solid ${sortBy === opt.id ? "rgba(201,168,76,0.5)" : "rgba(255,255,255,0.08)"}`,
          color: sortBy === opt.id ? "#C9A84C" : "rgba(240,237,232,0.4)",
          borderRadius: 6, padding: "5px 12px", cursor: "pointer",
          fontSize: 11, fontFamily: "Inter, sans-serif", fontWeight: 600,
          transition: "all 0.2s", letterSpacing: "0.04em",
        }}>{opt.label}</button>
      ))}
    </div>
    <select
      onChange={e => setFilterRarity(e.target.value)}
      style={{
        background: "rgba(10,10,15,0.8)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 6, padding: "5px 12px",
        color: "rgba(240,237,232,0.6)",
        fontSize: 11, fontFamily: "Inter, sans-serif", fontWeight: 600,
        cursor: "pointer", outline: "none",
      }}
    >
      <option value="all">All Rarities</option>
      <option value="Special Illustration Rare">SIR</option>
      <option value="Illustration Rare">IR</option>
      <option value="Hyper Rare">Hyper Rare</option>
      <option value="Alternate Art Secret">Alt Art</option>
      <option value="Secret Rare">Secret Rare</option>
      <option value="Ultra Rare">Ultra Rare</option>
      <option value="Shiny Holo Rare">Shiny Holo</option>
      <option value="Holo Rare">Holo Rare</option>
      <option value="Rare">Rare</option>
      <option value="Uncommon">Uncommon</option>
      <option value="Common">Common</option>
      <option value="Promo">Promo</option>
    </select>
  </div>
)}
            {results.length === 0 ? (
              <div style={{ color: "rgba(240,237,232,0.3)", fontFamily: "Inter, sans-serif", fontSize: 13 }}>
                No cards found. Try a different name or set.
              </div>
            ) : (
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
                gap: 16,
              }}>
{[...results].filter(card => filterRarity === "all" || card.rarity === filterRarity).sort((a, b) => {
  const RARITY_RANK = {
    "Special Illustration Rare": 1, "Hyper Rare": 2, "Alternate Art Secret": 3,
    "Secret Rare": 4, "Ultra Rare": 5, "Illustration Rare": 6,
    "Shiny Holo Rare": 7, "Holo Rare": 8, "Rare": 9, "default": 10,
  };
  if (sortBy === "price_high") return parseFloat(b.price) - parseFloat(a.price);
  if (sortBy === "price_low") return parseFloat(a.price) - parseFloat(b.price);
  if (sortBy === "rarity") return (RARITY_RANK[a.rarity] || 10) - (RARITY_RANK[b.rarity] || 10);
  if (sortBy === "name") return a.name.localeCompare(b.name);
  return 0;
}).map(card => (
                  <CardTile
                    key={card.id}
                    card={card}
                    onAdd={addToWishlist}
                    onRemove={removeFromWishlist}
                    inWishlist={!!wishlist.find(c => c.id === card.id)}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Wishlist grid */}
      {wishlist.length === 0 ? (
        <div style={{ textAlign: "center", padding: "80px 24px", border: "1px dashed rgba(255,255,255,0.06)", borderRadius: 20 }}>
          <div style={{ fontSize: 52, marginBottom: 20 }}>🃏</div>
          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 28, color: "rgba(240,237,232,0.2)", letterSpacing: "0.06em", marginBottom: 10 }}>NOTHING HERE YET</div>
          <div style={{ fontFamily: "Inter, sans-serif", fontSize: 14, color: "rgba(240,237,232,0.2)" }}>{emptyQuip}</div>
        </div>
      ) : (
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(240,237,232,0.3)", fontFamily: "Inter, sans-serif", letterSpacing: "0.08em", marginBottom: 16 }}>
            YOUR COLLECTION TARGET
          </div>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
            gap: 20,
          }}>
{wishlist.map(card => (
  <CardTile
    key={card.id}
    card={card}
    onAdd={() => {}}
    onRemove={removeFromWishlist}
    onGoal={addToGoals}
    inWishlist={true}
  />
))}
          </div>
        </div>
      )}
    </div>
  );
};

const CalculatorPage = ({ wishlist }) => {
  const [amount, setAmount] = useState("");
  const [result, setResult] = useState(null);
  const [packType, setPackType] = useState("booster");

  const PACK_PRICES = {
    booster: { label: "Booster Pack", price: 4.99 },
    etb: { label: "Elite Trainer Box", price: 49.99 },
    boosterBundle: { label: "Booster Bundle", price: 29.99 },
    bav: { label: "Booster at Value", price: 3.99 },
  };

  const calculate = () => {
    const budget = parseFloat(amount);
    if (!budget || budget <= 0) return;
    const packEquiv = Math.floor(budget / PACK_PRICES[packType].price);
    let remaining = budget;
    let selected = [];
    let sorted = [...wishlist].filter(c => parseFloat(c.price) > 0).sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
    for (let card of sorted) {
      if (parseFloat(card.price) <= remaining) {
        selected.push(card);
        remaining -= parseFloat(card.price);
      }
    }
    const taunt =
      budget >= 150 ? PACK_MATH_TAUNTS.veryHigh
      : budget >= 50 ? PACK_MATH_TAUNTS.high
      : budget >= 20 ? PACK_MATH_TAUNTS.mid
      : PACK_MATH_TAUNTS.low;
    setResult({ budget, packEquiv, packType, selected, remaining: remaining.toFixed(2), taunt });
  };

  return (
    <div style={{ maxWidth: 680, margin: "0 auto", padding: "32px 24px" }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 48, color: "#F0EDE8", letterSpacing: "0.04em", margin: 0, lineHeight: 1 }}>PACK MATH</h1>
        <p style={{ fontFamily: "Inter, sans-serif", fontSize: 14, color: "rgba(240,237,232,0.4)", margin: "8px 0 0" }}>
          Enter what you were about to blow. We'll tell you what you could actually own.
        </p>
      </div>

      <div style={{ background: "rgba(20,20,35,0.8)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: 24, marginBottom: 24 }}>
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(201,168,76,0.7)", fontFamily: "Inter, sans-serif", letterSpacing: "0.08em", marginBottom: 10 }}>WHAT WERE YOU ABOUT TO BUY?</div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {Object.entries(PACK_PRICES).map(([key, val]) => (
              <button key={key} onClick={() => setPackType(key)} style={{
                background: packType === key ? "rgba(201,168,76,0.15)" : "rgba(10,10,15,0.5)",
                border: `1px solid ${packType === key ? "rgba(201,168,76,0.5)" : "rgba(255,255,255,0.08)"}`,
                color: packType === key ? "#C9A84C" : "rgba(240,237,232,0.4)",
                borderRadius: 8, padding: "8px 14px", cursor: "pointer",
                fontSize: 12, fontFamily: "Inter, sans-serif", fontWeight: 600, transition: "all 0.2s",
              }}>
                {val.label} <span style={{ opacity: 0.6 }}>${val.price}</span>
              </button>
            ))}
          </div>
        </div>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(201,168,76,0.7)", fontFamily: "Inter, sans-serif", letterSpacing: "0.08em", marginBottom: 10 }}>HOW MUCH WERE YOU GOING TO SPEND?</div>
          <div style={{ display: "flex", gap: 10 }}>
            <div style={{ position: "relative", flex: 1 }}>
              <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "rgba(240,237,232,0.3)", fontFamily: "Inter, sans-serif", fontSize: 16 }}>$</span>
              <input
                value={amount}
                onChange={e => setAmount(e.target.value.replace(/[^0-9.]/g, ""))}
                onKeyDown={e => e.key === "Enter" && calculate()}
                placeholder="0.00"
                style={{
                  width: "100%", background: "rgba(10,10,15,0.8)", border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 8, padding: "13px 14px 13px 28px", color: "#F0EDE8", fontSize: 20,
                  fontFamily: "Inter, sans-serif", fontWeight: 600, outline: "none", boxSizing: "border-box",
                }}
              />
            </div>
            <button onClick={calculate} style={{
              background: "linear-gradient(135deg, #C9A84C, #A8853A)", border: "none",
              borderRadius: 8, padding: "13px 24px", color: "#0A0A0F",
              fontSize: 13, fontWeight: 800, fontFamily: "'Bebas Neue', sans-serif",
              cursor: "pointer", letterSpacing: "0.08em",
            }}>DO THE MATH</button>
          </div>
        </div>
      </div>

      {result && (
        <div>
          <div style={{ background: "rgba(201,168,76,0.06)", border: "1px solid rgba(201,168,76,0.2)", borderRadius: 12, padding: "16px 20px", marginBottom: 20, display: "flex", gap: 12, alignItems: "center" }}>
            <span style={{ fontSize: 20 }}>🎰</span>
            <div>
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 18, color: "#C9A84C", letterSpacing: "0.04em", lineHeight: 1.2 }}>{result.taunt}</div>
              <div style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: "rgba(240,237,232,0.4)", marginTop: 4 }}>
                ${result.budget.toFixed(2)} = {result.packEquiv} {PACK_PRICES[result.packType].label}{result.packEquiv !== 1 ? "s" : ""} · Expected value: probably less than you paid
              </div>
            </div>
          </div>

          {wishlist.length === 0 ? (
            <div style={{ background: "rgba(20,20,35,0.8)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, padding: "32px", textAlign: "center" }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>🙃</div>
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 20, color: "rgba(240,237,232,0.4)", letterSpacing: "0.04em" }}>ADD CARDS TO YOUR WISHLIST FIRST</div>
            </div>
          ) : result.selected.length === 0 ? (
            <div style={{ background: "rgba(20,20,35,0.8)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, padding: "32px", textAlign: "center" }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>💸</div>
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 20, color: "rgba(240,237,232,0.4)", letterSpacing: "0.04em" }}>NOT QUITE ENOUGH</div>
              <div style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: "rgba(240,237,232,0.25)", marginTop: 8 }}>Save it to the Card Vault instead.</div>
            </div>
          ) : (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 16 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(78,205,196,0.7)", fontFamily: "Inter, sans-serif", letterSpacing: "0.08em" }}>INSTEAD, YOU COULD OWN:</div>
                {parseFloat(result.remaining) > 0 && (
                  <div style={{ fontSize: 12, color: "rgba(240,237,232,0.35)", fontFamily: "Inter, sans-serif" }}>${result.remaining} left over</div>
                )}
              </div>
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
                gap: 16,
                marginBottom: 20,
              }}>
                {result.selected.map(card => (
                  <a
                    key={card.id}
                    href={`https://www.tcgplayer.com/search/pokemon/product?q=${encodeURIComponent(card.name)}&utm_source=packmathapp`}
                    target="_blank" rel="noopener noreferrer"
                    style={{ textDecoration: "none" }}
                  >
                    <CardTile card={card} onAdd={() => {}} onRemove={() => {}} inWishlist={false} />
                  </a>
                ))}
              </div>
              <div style={{ background: "rgba(78,205,196,0.06)", border: "1px solid rgba(78,205,196,0.15)", borderRadius: 10, padding: "14px 18px", fontFamily: "Inter, sans-serif", fontSize: 13, color: "rgba(78,205,196,0.8)", display: "flex", gap: 10, alignItems: "center" }}>
                <span>✓</span>
                <span>You'd actually own <strong style={{ color: "#4ECDC4" }}>{result.selected.length} card{result.selected.length !== 1 ? "s" : ""}</strong> instead of statistically owning nothing.</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
const GoalsPage = ({ goals, setGoals, savings, setSavings }) => {
  const [depositAmounts, setDepositAmounts] = useState({});

  useEffect(() => {
    fetch("/api/goals").then(r => r.json()).then(setGoals).catch(console.error);
  }, []);

  const removeGoal = async (id) => {
    try {
      await fetch(`/api/goals/${id}`, { method: "DELETE" });
      setGoals(prev => prev.filter(g => g.id !== id));
    } catch (e) {
      console.error("Failed to remove goal", e);
    }
  };

  const depositToGoal = async (goal) => {
    const amount = parseFloat(depositAmounts[goal.id]);
    if (!amount || amount <= 0) return;
    try {
      await fetch(`/api/goals/${goal.id}/deposit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount }),
      });
      setGoals(prev => prev.map(g =>
        g.id === goal.id ? { ...g, saved_amount: parseFloat(g.saved_amount) + amount } : g
      ));
      setDepositAmounts(prev => ({ ...prev, [goal.id]: "" }));
    } catch (e) {
      console.error("Failed to deposit", e);
    }
  };

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 24px" }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 48, color: "#F0EDE8", letterSpacing: "0.04em", margin: 0, lineHeight: 1 }}>GOALS</h1>
        <p style={{ fontFamily: "Inter, sans-serif", fontSize: 14, color: "rgba(240,237,232,0.4)", margin: "8px 0 0" }}>
          Pick your targets. Save with intention. Skip the packs.
        </p>
      </div>

      {goals.length === 0 ? (
        <div style={{ textAlign: "center", padding: "80px 24px", border: "1px dashed rgba(255,255,255,0.06)", borderRadius: 20 }}>
          <div style={{ fontSize: 52, marginBottom: 20 }}>🎯</div>
          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 28, color: "rgba(240,237,232,0.2)", letterSpacing: "0.06em", marginBottom: 10 }}>NO GOALS YET</div>
          <div style={{ fontFamily: "Inter, sans-serif", fontSize: 14, color: "rgba(240,237,232,0.2)" }}>Go to your wishlist and hit SAVE UP on a card.</div>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 24 }}>
          {goals.map(goal => {
            const saved = parseFloat(goal.saved_amount) || 0;
            const target = parseFloat(goal.price) || 0;
            const progress = target > 0 ? Math.min((saved / target) * 100, 100) : 0;
            const complete = progress >= 100;
            const rarity = RARITY_COLORS[goal.rarity] || RARITY_COLORS["default"];

            return (
              <div key={goal.id} style={{
                background: complete ? "rgba(201,168,76,0.08)" : "rgba(20,20,35,0.9)",
                border: `1px solid ${complete ? "rgba(201,168,76,0.4)" : "rgba(255,255,255,0.07)"}`,
                borderRadius: 16,
                overflow: "hidden",
                boxShadow: complete ? "0 0 30px rgba(201,168,76,0.15)" : "none",
                transition: "all 0.3s",
              }}>
                <div style={{ position: "relative", width: "100%", paddingTop: "120%", overflow: "hidden" }}>
                  {goal.image_url ? (
                    <img src={goal.image_url} alt={goal.name} style={{
                      position: "absolute", inset: 0, width: "100%", height: "100%",
                      objectFit: "contain", objectPosition: "center",
                    }} />
                  ) : (
                    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 48 }}>🃏</div>
                  )}
                  <div style={{
                    position: "absolute", inset: 0,
                    background: "linear-gradient(transparent 40%, rgba(10,10,15,0.95))",
                  }} />
                  {complete && (
                    <div style={{
                      position: "absolute", top: 12, right: 12,
                      background: "rgba(201,168,76,0.9)", borderRadius: 8,
                      padding: "4px 10px", fontSize: 11, fontWeight: 800,
                      fontFamily: "Inter, sans-serif", color: "#0A0A0F",
                      letterSpacing: "0.06em",
                    }}>READY TO BUY</div>
                  )}
                  <div style={{ position: "absolute", bottom: 12, left: 14, right: 14 }}>
                    <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 20, color: "#F0EDE8", letterSpacing: "0.04em", lineHeight: 1.2 }}>{goal.name}</div>
                    <div style={{ fontSize: 11, color: "rgba(240,237,232,0.5)", fontFamily: "Inter, sans-serif", marginTop: 2 }}>{goal.set_name}</div>
                  </div>
                </div>

                <div style={{ padding: "16px 16px 20px" }}>
                  <div style={{ marginBottom: 12 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                      <span style={{ fontSize: 12, fontFamily: "Inter, sans-serif", color: "#4ECDC4", fontWeight: 700 }}>
                        ${saved.toFixed(2)} saved
                      </span>
                      <span style={{ fontSize: 12, fontFamily: "Inter, sans-serif", color: "rgba(240,237,232,0.4)" }}>
                        ${target.toFixed(2)} goal
                      </span>
                    </div>
                    <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: 999, height: 8, overflow: "hidden" }}>
                      <div style={{
                        height: "100%", borderRadius: 999,
                        width: `${progress}%`,
                        background: complete
                          ? "linear-gradient(90deg, #C9A84C, #F0D080)"
                          : "linear-gradient(90deg, #4ECDC4, #3AB5AD)",
                        transition: "width 0.5s ease",
                        boxShadow: complete ? "0 0 8px rgba(201,168,76,0.6)" : "0 0 8px rgba(78,205,196,0.4)",
                      }} />
                    </div>
                    <div style={{ fontSize: 11, color: "rgba(240,237,232,0.3)", fontFamily: "Inter, sans-serif", marginTop: 4 }}>
                      {complete ? "You earned this. Now go buy it." : `$${(target - saved).toFixed(2)} to go · ${progress.toFixed(0)}% there`}
                    </div>
                  </div>

                  {!complete && (
                    <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
                      <div style={{ position: "relative", flex: 1 }}>
                        <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "rgba(240,237,232,0.3)", fontFamily: "Inter, sans-serif", fontSize: 13 }}>$</span>
                        <input
                          value={depositAmounts[goal.id] || ""}
                          onChange={e => setDepositAmounts(prev => ({ ...prev, [goal.id]: e.target.value.replace(/[^0-9.]/g, "") }))}
                          placeholder="0.00"
                          style={{
                            width: "100%", background: "rgba(10,10,15,0.8)",
                            border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8,
                            padding: "9px 10px 9px 22px", color: "#F0EDE8",
                            fontSize: 13, fontFamily: "Inter, sans-serif",
                            outline: "none", boxSizing: "border-box",
                          }}
                        />
                      </div>
                      <button onClick={() => depositToGoal(goal)} style={{
                        background: "linear-gradient(135deg, #4ECDC4, #3AB5AD)",
                        border: "none", borderRadius: 8, padding: "9px 14px",
                        color: "#0A0A0F", fontSize: 11, fontWeight: 800,
                        fontFamily: "'Bebas Neue', sans-serif", cursor: "pointer",
                        letterSpacing: "0.06em", whiteSpace: "nowrap",
                      }}>ADD FUNDS</button>
                    </div>
                  )}

                  {complete && (
                    <a
                      href={`https://www.tcgplayer.com/search/pokemon/product?q=${encodeURIComponent(goal.name)}&utm_source=packmathapp`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: "block", textAlign: "center", textDecoration: "none",
                        background: "linear-gradient(135deg, #C9A84C, #A8853A)",
                        borderRadius: 8, padding: "10px 0",
                        color: "#0A0A0F", fontSize: 12, fontWeight: 800,
                        fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.08em",
                        marginBottom: 10,
                      }}
                    >BUY ON TCGPLAYER</a>
                  )}

                  <button onClick={() => removeGoal(goal.id)} style={{
                    background: "transparent", border: "none",
                    color: "rgba(240,237,232,0.2)", cursor: "pointer",
                    fontSize: 11, fontFamily: "Inter, sans-serif",
                    width: "100%", padding: "4px 0",
                  }}>remove goal</button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
const SavingsEntry = ({ entry, assignedGoal, goals, onWithdraw, onAssign }) => {
  const [assigning, setAssigning] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState("");

  return (
    <div style={{ background: "rgba(20,20,35,0.8)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 10, padding: "13px 16px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 8, height: 8, borderRadius: "50%", flexShrink: 0,
            background: assignedGoal ? "#C9A84C" : "#4ECDC4",
            boxShadow: assignedGoal ? "0 0 6px rgba(201,168,76,0.5)" : "0 0 6px rgba(78,205,196,0.5)",
          }} />
          <div>
            <div style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: "rgba(240,237,232,0.7)", marginBottom: 2 }}>{entry.note}</div>
            <div style={{ fontFamily: "Inter, sans-serif", fontSize: 11, color: "rgba(240,237,232,0.25)" }}>
              {new Date(entry.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
              {assignedGoal && (
                <span style={{ color: "#C9A84C", marginLeft: 6 }}>→ {assignedGoal.name}</span>
              )}
            </div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ fontFamily: "Inter, sans-serif", fontSize: 16, fontWeight: 700, color: "#4ECDC4", letterSpacing: "-0.02em" }}>
            +${parseFloat(entry.amount).toFixed(2)}
          </div>
          {!assignedGoal && goals && goals.length > 0 && (
            <button
              onClick={() => setAssigning(!assigning)}
              style={{
                background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.2)",
                color: "#C9A84C", borderRadius: 6, padding: "4px 8px",
                cursor: "pointer", fontSize: 10, fontFamily: "Inter, sans-serif",
                fontWeight: 700, letterSpacing: "0.04em",
              }}
            >ASSIGN</button>
          )}
          <button onClick={() => onWithdraw(entry.id)} style={{ background: "transparent", border: "none", color: "rgba(240,237,232,0.2)", cursor: "pointer", fontSize: 16, padding: 4, lineHeight: 1 }}>×</button>
        </div>
      </div>
      {assigning && (
        <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
          <select
            value={selectedGoal}
            onChange={e => setSelectedGoal(e.target.value)}
            style={{
              flex: 1, background: "rgba(10,10,15,0.8)",
              border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8,
              padding: "8px 12px", color: selectedGoal ? "#F0EDE8" : "rgba(240,237,232,0.3)",
              fontSize: 12, fontFamily: "Inter, sans-serif", outline: "none",
            }}
          >
            <option value="">Pick a goal...</option>
            {goals.map(g => (
              <option key={g.id} value={g.id}>{g.name} — ${parseFloat(g.price).toFixed(2)}</option>
            ))}
          </select>
          <button
            onClick={() => {
              if (!selectedGoal) return;
              onAssign(entry.id, parseInt(selectedGoal), parseFloat(entry.amount));
              setAssigning(false);
            }}
            style={{
              background: "linear-gradient(135deg, #C9A84C, #A8853A)",
              border: "none", borderRadius: 8, padding: "8px 14px",
              color: "#0A0A0F", fontSize: 11, fontWeight: 800,
              fontFamily: "'Bebas Neue', sans-serif", cursor: "pointer",
              letterSpacing: "0.06em",
            }}
          >CONFIRM</button>
        </div>
      )}
    </div>
  );
};
const SavingsPage = ({ savings, setSavings, goals, setGoals }) => {
  const [depositAmount, setDepositAmount] = useState("");
  const [depositNote, setDepositNote] = useState("");
  const [selectedGoal, setSelectedGoal] = useState("");
  const [quipIndex] = useState(Math.floor(Math.random() * SAVINGS_QUIPS.length));

const deposit = async () => {
    const amt = parseFloat(depositAmount);
    if (!amt || amt <= 0) return;
    const note = depositNote || `Didn't buy ${Math.floor(amt / 4.99)} packs`;
    const goal_id = selectedGoal ? parseInt(selectedGoal) : null;
    try {
      await fetch("/api/savings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: amt, note, goal_id }),
      });
      const entry = { id: Date.now(), amount: amt, note, goal_id, created_at: new Date().toISOString() };
      setSavings(prev => [entry, ...prev]);
      if (goal_id) {
        setGoals(prev => prev.map(g =>
          g.id === goal_id ? { ...g, saved_amount: parseFloat(g.saved_amount) + amt } : g
        ));
      }
      setDepositAmount("");
      setDepositNote("");
      setSelectedGoal("");
    } catch (e) {
      console.error("Failed to save entry", e);
    }
  };

  const withdraw = async (id) => {
    try {
      await fetch(`/api/savings/${id}`, { method: "DELETE" });
      setSavings(prev => prev.filter(e => e.id !== id));
    } catch (e) {
      console.error("Failed to delete entry", e);
    }
  };

  const total = savings.reduce((sum, e) => sum + parseFloat(e.amount), 0);
  const packsSaved = Math.floor(total / 4.99);

  return (
    <div style={{ maxWidth: 680, margin: "0 auto", padding: "32px 24px" }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 48, color: "#F0EDE8", letterSpacing: "0.04em", margin: 0, lineHeight: 1 }}>CARD VAULT</h1>
        <p style={{ fontFamily: "Inter, sans-serif", fontSize: 14, color: "rgba(240,237,232,0.4)", margin: "8px 0 0" }}>{SAVINGS_QUIPS[quipIndex]}</p>
      </div>

      <div style={{ background: "linear-gradient(135deg, rgba(78,205,196,0.08), rgba(20,20,35,0.9))", border: "1px solid rgba(78,205,196,0.2)", borderRadius: 16, padding: "28px 24px", marginBottom: 24, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(78,205,196,0.5)", fontFamily: "Inter, sans-serif", letterSpacing: "0.08em", marginBottom: 6 }}>VAULT BALANCE</div>
          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 52, color: "#4ECDC4", letterSpacing: "-0.02em", lineHeight: 1 }}>${total.toFixed(2)}</div>
          <div style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: "rgba(78,205,196,0.5)", marginTop: 6 }}>
            {packsSaved > 0 ? `That's ${packsSaved} pack${packsSaved !== 1 ? "s" : ""} you didn't impulse buy. Proud of you.` : "Start saving. Skip one pack. That's how it starts."}
          </div>
        </div>
        <div style={{ fontSize: 48, opacity: 0.4 }}>🏦</div>
      </div>

      <div style={{ background: "rgba(20,20,35,0.8)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: 24, marginBottom: 24 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(201,168,76,0.7)", fontFamily: "Inter, sans-serif", letterSpacing: "0.08em", marginBottom: 16 }}>LOG MONEY SAVED</div>
        <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
          <div style={{ position: "relative", flex: 1 }}>
            <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "rgba(240,237,232,0.3)", fontFamily: "Inter, sans-serif" }}>$</span>
            <input
              value={depositAmount}
              onChange={e => setDepositAmount(e.target.value.replace(/[^0-9.]/g, ""))}
              placeholder="0.00"
              style={{ width: "100%", background: "rgba(10,10,15,0.8)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "11px 12px 11px 24px", color: "#F0EDE8", fontSize: 16, fontFamily: "Inter, sans-serif", fontWeight: 600, outline: "none", boxSizing: "border-box" }}
            />
          </div>
          <button onClick={deposit} style={{ background: "linear-gradient(135deg, #4ECDC4, #3AB5AD)", border: "none", borderRadius: 8, padding: "11px 20px", color: "#0A0A0F", fontSize: 12, fontWeight: 800, fontFamily: "'Bebas Neue', sans-serif", cursor: "pointer", letterSpacing: "0.06em" }}>ADD TO VAULT</button>
        </div>
        <input
          value={depositNote}
          onChange={e => setDepositNote(e.target.value)}
          placeholder="What did you skip? (optional)"
          style={{ width: "100%", background: "rgba(10,10,15,0.5)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 8, padding: "9px 12px", color: "rgba(240,237,232,0.5)", fontSize: 13, fontFamily: "Inter, sans-serif", outline: "none", boxSizing: "border-box" }}
        />
        <select
          value={selectedGoal}
          onChange={e => setSelectedGoal(e.target.value)}
          style={{
            width: "100%", background: "rgba(10,10,15,0.8)",
            border: "1px solid rgba(255,255,255,0.06)", borderRadius: 8,
            padding: "9px 12px", color: selectedGoal ? "#F0EDE8" : "rgba(240,237,232,0.3)",
            fontSize: 13, fontFamily: "Inter, sans-serif", outline: "none",
            boxSizing: "border-box", marginTop: 8,
          }}
        >
          <option value="">Assign to a goal (optional)</option>
          {goals && goals.length > 0
            ? goals.map(g => (
                <option key={g.id} value={g.id}>{g.name} — ${parseFloat(g.price).toFixed(2)}</option>
              ))
            : null}
        </select>
        <div style={{ fontSize: 11, color: "rgba(240,237,232,0.2)", fontFamily: "Inter, sans-serif", marginTop: 8 }}>
          Girl math applies — money not spent on packs is money you actually have.
        </div>
      </div>

      {savings.length === 0 ? (
        <div style={{ textAlign: "center", padding: "48px 24px", border: "1px dashed rgba(255,255,255,0.06)", borderRadius: 12 }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>🔐</div>
          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 20, color: "rgba(240,237,232,0.25)", letterSpacing: "0.06em" }}>VAULT EMPTY</div>
          <div style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: "rgba(240,237,232,0.2)", marginTop: 6 }}>Skip a pack. Log it. Watch it add up.</div>
        </div>
      ) : (
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(240,237,232,0.3)", fontFamily: "Inter, sans-serif", letterSpacing: "0.08em", marginBottom: 12 }}>SAVED HISTORY</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {savings.map(entry => {
  const assignedGoal = goals && goals.find(g => g.id === entry.goal_id);
  return (
    <SavingsEntry
      key={entry.id}
      entry={entry}
      assignedGoal={assignedGoal}
      goals={goals}
      onWithdraw={withdraw}
      onAssign={async (entryId, goalId, amount) => {
        try {
          await fetch(`/api/savings/${entryId}/assign`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ goal_id: goalId, amount }),
          });
          setSavings(prev => prev.map(e => e.id === entryId ? { ...e, goal_id: goalId } : e));
          setGoals(prev => prev.map(g =>
            g.id === goalId ? { ...g, saved_amount: parseFloat(g.saved_amount) + amount } : g
          ));
        } catch (e) {
          console.error("Failed to assign", e);
        }
      }}
    />
  );
})}
          </div>
        </div>
      )}
    </div>
  );
};

export default function App() {
  const [page, setPage] = useState("wishlist");
  const [wishlist, setWishlist] = useState([]);
  const [savings, setSavings] = useState([]);
  const [goals, setGoals] = useState([]);

  useEffect(() => {
    fetch("/api/wishlist").then(r => r.json()).then(setWishlist).catch(console.error);
    fetch("/api/savings").then(r => r.json()).then(setSavings).catch(console.error);
    fetch("/api/goals").then(r => r.json()).then(setGoals).catch(console.error);
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "#0A0A0F", color: "#F0EDE8" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        ::placeholder { color: rgba(240,237,232,0.25) !important; }
        @keyframes shimmer {
          0% { transform: translateX(-100%) skewX(-15deg); }
          100% { transform: translateX(200%) skewX(-15deg); }
        }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(201,168,76,0.2); border-radius: 2px; }
      `}</style>
      <Nav page={page} setPage={setPage} wishlistCount={wishlist.length} />
      {page === "wishlist" && <WishlistPage wishlist={wishlist} setWishlist={setWishlist} />}
      {page === "calculator" && <CalculatorPage wishlist={wishlist} />}
      {page === "savings" && <SavingsPage savings={savings} setSavings={setSavings} goals={goals} setGoals={setGoals} />}
      {page === "goals" && <GoalsPage goals={goals} setGoals={setGoals} savings={savings} setSavings={setSavings} />}
    </div>
  );
}
