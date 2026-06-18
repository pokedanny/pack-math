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
  "Special Illustration Rare": { bg: "rgba(201,168,76,0.15)", border: "#C9A84C", label: "SIR" },
  "Illustration Rare": { bg: "rgba(78,205,196,0.15)", border: "#4ECDC4", label: "IR" },
  "Hyper Rare": { bg: "rgba(255,120,80,0.15)", border: "#FF7850", label: "HR" },
  "Alternate Art Secret": { bg: "rgba(180,100,255,0.15)", border: "#B464FF", label: "ALT" },
  "default": { bg: "rgba(78,205,196,0.15)", border: "#4ECDC4", label: "CARD" },
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

const HoloCard = ({ card, onAdd, onRemove, inWishlist, compact = false }) => {
  const [hovered, setHovered] = useState(false);
  const rarity = getRarity(card);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered
          ? `linear-gradient(135deg, ${rarity.bg}, rgba(30,30,46,0.95))`
          : "rgba(30,30,46,0.8)",
        border: `1px solid ${hovered ? rarity.border : "rgba(255,255,255,0.06)"}`,
        borderRadius: 12,
        padding: compact ? "12px 14px" : "16px",
        display: "flex",
        alignItems: "center",
        gap: 14,
        transition: "all 0.25s ease",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {hovered && (
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          background: "linear-gradient(105deg, transparent 40%, rgba(201,168,76,0.04) 50%, transparent 60%)",
          animation: "shimmer 1.5s infinite",
        }} />
      )}
      <div style={{
        width: compact ? 40 : 52,
        height: compact ? 56 : 72,
        borderRadius: 6,
        background: `linear-gradient(135deg, ${rarity.bg}, rgba(15,15,25,0.9))`,
        border: `1px solid ${rarity.border}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: compact ? 18 : 24,
        flexShrink: 0,
      }}>
{card.image_url ? (
  <img
    src={card.image_url}
    alt={card.name}
    style={{ width: "100%", height: "100%", objectFit: "contain", borderRadius: 4 }}
  />
) : (
  <span style={{ filter: "drop-shadow(0 0 6px rgba(201,168,76,0.6))" }}>🃏</span>
)}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
          <span style={{
            fontSize: compact ? 13 : 14, fontWeight: 700, color: "#F0EDE8",
            fontFamily: "Inter, sans-serif", whiteSpace: "nowrap",
            overflow: "hidden", textOverflow: "ellipsis",
          }}>{card.name}</span>
          <span style={{
            fontSize: 9, fontWeight: 700, color: rarity.border,
            background: rarity.bg, border: `1px solid ${rarity.border}`,
            padding: "1px 5px", borderRadius: 3, letterSpacing: "0.05em", flexShrink: 0,
          }}>{rarity.label}</span>
        </div>
        <div style={{ fontSize: 11, color: "rgba(240,237,232,0.4)", fontFamily: "Inter, sans-serif", marginBottom: 4 }}>
          {card.set_name} · {card.number}
        </div>
        <div style={{ fontSize: compact ? 13 : 15, fontWeight: 700, color: "#4ECDC4", fontFamily: "Inter, sans-serif", letterSpacing: "-0.02em" }}>
          ${parseFloat(card.price).toFixed(2)}
          <span style={{ fontSize: 10, color: "rgba(78,205,196,0.5)", fontWeight: 400, marginLeft: 4 }}>NM · Verified</span>
        </div>
      </div>
      <button
        onClick={() => inWishlist ? onRemove(card.id) : onAdd(card)}
        style={{
          background: inWishlist ? "rgba(255,80,80,0.1)" : "rgba(201,168,76,0.1)",
          border: `1px solid ${inWishlist ? "rgba(255,80,80,0.3)" : "rgba(201,168,76,0.3)"}`,
          color: inWishlist ? "#FF5050" : "#C9A84C",
          borderRadius: 8, padding: "8px 12px", cursor: "pointer",
          fontSize: 12, fontWeight: 700, fontFamily: "Inter, sans-serif",
          transition: "all 0.2s", flexShrink: 0, whiteSpace: "nowrap",
        }}
      >
        {inWishlist ? "Remove" : "+ Wishlist"}
      </button>
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
  const [emptyQuip] = useState(SNARKY_EMPTY[Math.floor(Math.random() * SNARKY_EMPTY.length)]);

  const search = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      setResults(Array.isArray(data) ? data : data.cards || data.data || []);
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

  const removeFromWishlist = async (id) => {
    try {
      await fetch(`/api/wishlist/${id}`, { method: "DELETE" });
      setWishlist(prev => prev.filter(c => c.id !== id));
    } catch (e) {
      console.error("Failed to remove card", e);
    }
  };

  const totalValue = wishlist.reduce((sum, c) => sum + parseFloat(c.price), 0);

  return (
    <div style={{ maxWidth: 680, margin: "0 auto", padding: "32px 24px" }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 48, color: "#F0EDE8", letterSpacing: "0.04em", margin: 0, lineHeight: 1 }}>YOUR WISHLIST</h1>
        <p style={{ fontFamily: "Inter, sans-serif", fontSize: 14, color: "rgba(240,237,232,0.4)", margin: "8px 0 0" }}>
          Build it here. Stop building it out of pack luck.
        </p>
      </div>

      <div style={{ background: "rgba(30,30,46,0.6)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: 20, marginBottom: 28 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(201,168,76,0.7)", fontFamily: "Inter, sans-serif", letterSpacing: "0.08em", marginBottom: 12 }}>SEARCH CARDS</div>
        <div style={{ display: "flex", gap: 10 }}>
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === "Enter" && search()}
            placeholder="Umbreon ex, Evolving Skies, SIR..."
            style={{
              flex: 1, background: "rgba(10,10,15,0.8)", border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 8, padding: "11px 14px", color: "#F0EDE8", fontSize: 14,
              fontFamily: "Inter, sans-serif", outline: "none",
            }}
          />
          <button onClick={search} style={{
            background: "linear-gradient(135deg, #C9A84C, #A8853A)", border: "none",
            borderRadius: 8, padding: "11px 20px", color: "#0A0A0F",
            fontSize: 13, fontWeight: 700, fontFamily: "Inter, sans-serif",
            cursor: "pointer", letterSpacing: "0.04em",
          }}>{loading ? "..." : "SEARCH"}</button>
        </div>

        {error && <div style={{ color: "#FF5050", fontSize: 12, fontFamily: "Inter, sans-serif", marginTop: 10 }}>{error}</div>}

        {searched && !loading && (
          <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 8 }}>
            {results.length === 0 ? (
              <div style={{ color: "rgba(240,237,232,0.35)", fontFamily: "Inter, sans-serif", fontSize: 13, padding: "8px 0" }}>
                No cards found. Try another name or set.
              </div>
            ) : results.map(card => (
              <HoloCard
                key={card.id}
                card={card}
                onAdd={addToWishlist}
                onRemove={removeFromWishlist}
                inWishlist={!!wishlist.find(c => c.id === card.id)}
                compact
              />
            ))}
          </div>
        )}
      </div>

      {wishlist.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 24px", border: "1px dashed rgba(255,255,255,0.08)", borderRadius: 16 }}>
          <div style={{ fontSize: 40, marginBottom: 16 }}>🃏</div>
          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, color: "rgba(240,237,232,0.3)", letterSpacing: "0.06em", marginBottom: 8 }}>NOTHING HERE YET</div>
          <div style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: "rgba(240,237,232,0.25)" }}>{emptyQuip}</div>
        </div>
      ) : (
        <>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 16 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(240,237,232,0.4)", fontFamily: "Inter, sans-serif", letterSpacing: "0.08em" }}>
              {wishlist.length} CARD{wishlist.length !== 1 ? "S" : ""} SAVED
            </div>
            <div style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: "#4ECDC4", fontWeight: 600 }}>
              Total value: ${totalValue.toFixed(2)}
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {wishlist.map(card => (
              <HoloCard key={card.id} card={card} onAdd={() => {}} onRemove={removeFromWishlist} inWishlist={true} />
            ))}
          </div>
        </>
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
    let sorted = [...wishlist].sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
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

      <div style={{ background: "rgba(30,30,46,0.6)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: 24, marginBottom: 24 }}>
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
            <div style={{ background: "rgba(30,30,46,0.6)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, padding: "32px", textAlign: "center" }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>🙃</div>
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 20, color: "rgba(240,237,232,0.4)", letterSpacing: "0.04em" }}>ADD CARDS TO YOUR WISHLIST FIRST</div>
            </div>
          ) : result.selected.length === 0 ? (
            <div style={{ background: "rgba(30,30,46,0.6)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, padding: "32px", textAlign: "center" }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>💸</div>
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 20, color: "rgba(240,237,232,0.4)", letterSpacing: "0.04em" }}>NOT QUITE ENOUGH</div>
              <div style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: "rgba(240,237,232,0.25)", marginTop: 8 }}>Save it to the Card Vault instead.</div>
            </div>
          ) : (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 14 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(78,205,196,0.7)", fontFamily: "Inter, sans-serif", letterSpacing: "0.08em" }}>INSTEAD, YOU COULD OWN:</div>
                {parseFloat(result.remaining) > 0 && (
                  <div style={{ fontSize: 12, color: "rgba(240,237,232,0.35)", fontFamily: "Inter, sans-serif" }}>${result.remaining} left over</div>
                )}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
                {result.selected.map(card => (
                  <div key={card.id} style={{ position: "relative" }}>
                    <HoloCard card={card} onAdd={() => {}} onRemove={() => {}} inWishlist={false} compact />
                    <a
                      href={`https://www.tcgplayer.com/search/pokemon/product?q=${encodeURIComponent(card.name)}&utm_source=packmathapp`}
                      target="_blank" rel="noopener noreferrer"
                      style={{ position: "absolute", right: 14, bottom: 12, fontSize: 11, color: "#4ECDC4", fontFamily: "Inter, sans-serif", fontWeight: 600, textDecoration: "none", opacity: 0.7 }}
                    >Buy on TCGPlayer →</a>
                  </div>
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

const SavingsPage = ({ savings, setSavings }) => {
  const [depositAmount, setDepositAmount] = useState("");
  const [depositNote, setDepositNote] = useState("");
  const [quipIndex] = useState(Math.floor(Math.random() * SAVINGS_QUIPS.length));

  const deposit = async () => {
    const amt = parseFloat(depositAmount);
    if (!amt || amt <= 0) return;
    const note = depositNote || `Didn't buy ${Math.floor(amt / 4.99)} packs`;
    try {
      await fetch("/api/savings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: amt, note }),
      });
      const entry = { id: Date.now(), amount: amt, note, created_at: new Date().toISOString() };
      setSavings(prev => [entry, ...prev]);
      setDepositAmount("");
      setDepositNote("");
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

      <div style={{ background: "linear-gradient(135deg, rgba(78,205,196,0.08), rgba(30,30,46,0.8))", border: "1px solid rgba(78,205,196,0.2)", borderRadius: 16, padding: "28px 24px", marginBottom: 24, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(78,205,196,0.5)", fontFamily: "Inter, sans-serif", letterSpacing: "0.08em", marginBottom: 6 }}>VAULT BALANCE</div>
          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 52, color: "#4ECDC4", letterSpacing: "-0.02em", lineHeight: 1 }}>${total.toFixed(2)}</div>
          <div style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: "rgba(78,205,196,0.5)", marginTop: 6 }}>
            {packsSaved > 0 ? `That's ${packsSaved} pack${packsSaved !== 1 ? "s" : ""} you didn't impulse buy. Proud of you.` : "Start saving. Skip one pack. That's how it starts."}
          </div>
        </div>
        <div style={{ fontSize: 48, opacity: 0.4 }}>🏦</div>
      </div>

      <div style={{ background: "rgba(30,30,46,0.6)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: 24, marginBottom: 24 }}>
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
            {savings.map(entry => (
              <div key={entry.id} style={{ background: "rgba(30,30,46,0.5)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 10, padding: "13px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#4ECDC4", flexShrink: 0, boxShadow: "0 0 6px rgba(78,205,196,0.5)" }} />
                  <div>
                    <div style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: "rgba(240,237,232,0.7)", marginBottom: 2 }}>{entry.note}</div>
                    <div style={{ fontFamily: "Inter, sans-serif", fontSize: 11, color: "rgba(240,237,232,0.25)" }}>
                      {new Date(entry.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </div>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ fontFamily: "Inter, sans-serif", fontSize: 16, fontWeight: 700, color: "#4ECDC4", letterSpacing: "-0.02em" }}>+${parseFloat(entry.amount).toFixed(2)}</div>
                  <button onClick={() => withdraw(entry.id)} style={{ background: "transparent", border: "none", color: "rgba(240,237,232,0.2)", cursor: "pointer", fontSize: 16, padding: 4, lineHeight: 1 }}>×</button>
                </div>
              </div>
            ))}
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

  useEffect(() => {
    fetch("/api/wishlist").then(r => r.json()).then(setWishlist).catch(console.error);
    fetch("/api/savings").then(r => r.json()).then(setSavings).catch(console.error);
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
      {page === "savings" && <SavingsPage savings={savings} setSavings={setSavings} />}
    </div>
  );
}
