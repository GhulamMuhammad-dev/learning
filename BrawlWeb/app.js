require("dotenv").config();
const express = require("express");
const path = require("path");
const methodOverride = require("method-override");
const helmet = require("helmet");
const db = require("./db");
const brawl = require("./services/brawlStars");

const app = express();
const PORT = process.env.PORT || 3000;

/* ---------- App basic setup ---------- */
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(
  helmet({
    contentSecurityPolicy: false // simple for demo; keep assets local
  })
);

/* ---------- Ensure DB migration on boot ---------- */
db.migrate()
  .then(() => console.log("✅ DB migration complete"))
  .catch((e) => {
    console.error("❌ DB migration failed:", e);
    process.exit(1);
  });

/* ---------- Routes ---------- */

// Home
app.get("/", (req, res) => {
  res.render("index");
});

// Search player -> details
app.post("/search-player", async (req, res) => {
  const tag = req.body.tag || "";
  try {
    const player = await brawl.getPlayer(tag);
    const IconId=player.icon.id;
    let battles = [];
    try {
      const log = await brawl.getBattleLog(tag);
      battles = log?.items || [];
    } catch (e) {
      // ignore battlelog errors; not always available
    }
    res.render("player", { player, battles,IconId });
  } catch (err) {
    res
      .status(500)
      .render("error", {
        message:
          "Could not fetch player. Check the tag, your API token, and allowlisted IP on developer.brawlstars.com.",
        error: err.response?.data || err.message
      });
  }
});

// Brawlers page
app.get("/brawlers", async (req, res) => {
  try {
    const data = await brawl.getBrawlers();
    res.render("brawlers", { brawlers: data.items || [] });
  } catch (err) {
    res
      .status(500)
      .render("error", { message: "Could not fetch brawlers.", error: err.response?.data || err.message });
  }
});

/* ---------- CRUD: Saved Players (PostgreSQL) ---------- */

// Read/list
app.get("/saved", async (req, res) => {
  try {
    const { rows } = await db.query(
      "SELECT * FROM saved_players ORDER BY created_at DESC"
    );
    res.render("saved", { players: rows });
  } catch (err) {
    res.status(500).render("error", { message: "DB error", error: err.message });
  }
});

// Create
app.post("/saved", async (req, res) => {
  const { tag, name, trophies, note } = req.body;
  const normTag = brawl.normalizeTag(tag);
  try {
    await db.query(
      `INSERT INTO saved_players (tag, name, trophies, note)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (tag) DO NOTHING`,
      [normTag, name || "", Number(trophies) || 0, note || ""]
    );
    res.redirect("/saved");
  } catch (err) {
    res.status(500).render("error", { message: "DB insert error", error: err.message });
  }
});

// Edit (form)
app.get("/saved/:id/edit", async (req, res) => {
  try {
    const { rows } = await db.query("SELECT * FROM saved_players WHERE id = $1", [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).render("error", { message: "Not found", error: "No record" });
    }
    res.render("edit", { player: rows[0] });
  } catch (err) {
    res.status(500).render("error", { message: "DB error", error: err.message });
  }
});

// Update
app.put("/saved/:id", async (req, res) => {
  try {
    await db.query("UPDATE saved_players SET note = $1 WHERE id = $2", [req.body.note || "", req.params.id]);
    res.redirect("/saved");
  } catch (err) {
    res.status(500).render("error", { message: "DB update error", error: err.message });
  }
});

// Delete
app.delete("/saved/:id", async (req, res) => {
  try {
    await db.query("DELETE FROM saved_players WHERE id = $1", [req.params.id]);
    res.redirect("/saved");
  } catch (err) {
    res.status(500).render("error", { message: "DB delete error", error: err.message });
  }
});

// Refresh from live API
app.post("/saved/:id/refresh", async (req, res) => {
  try {
    const { rows } = await db.query("SELECT tag FROM saved_players WHERE id = $1", [req.params.id]);
    if (rows.length === 0) return res.redirect("/saved");

    const p = await brawl.getPlayer(rows[0].tag);
    await db.query(
      "UPDATE saved_players SET name = $1, trophies = $2 WHERE id = $3",
      [p.name, p.trophies, req.params.id]
    );
    res.redirect("/saved");
  } catch (e) {
    res.redirect("/saved"); // keep UX simple
  }
});

/* ---------- Fallbacks ---------- */

// 404
app.use((req, res) => {
  res.status(404).render("error", { message: "Page not found", error: "" });
});

// Error handler (last)
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).render("error", { message: "Server error", error: err.message });
});

app.listen(PORT, () =>
  console.log(`🚀 Server running at http://localhost:${PORT}`)
);
