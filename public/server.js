const express = require("express");
const rateLimit = require("express-rate-limit");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
const API_BASE = (process.env.FREEFIRE_API_BASE ||
  "https://developers.freefirecommunity.com/api/v1").replace(/\/+$/, "");
const API_KEY = process.env.FREEFIRE_API_KEY || "";
const APP_UA = process.env.APP_USER_AGENT || "FFBDUIDLookup/1.0";

app.use(express.static(path.join(__dirname, "public")));
app.use("/api/", rateLimit({
  windowMs: 60 * 1000,
  limit: 20,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { error: "অনেকবার চেষ্টা করা হয়েছে। এক মিনিট পরে আবার চেষ্টা করো।" }
}));

app.get("/health", (_req, res) => {
  res.json({ ok: true, service: "FF BD UID Profile Lookup" });
});

app.get("/api/player", async (req, res) => {
  const uid = String(req.query.uid || "").trim();
  const region = String(req.query.region || "BD").trim().toLowerCase();

  if (!/^[0-9]{5,15}$/.test(uid)) {
    return res.status(400).json({ error: "সঠিক ৫–১৫ সংখ্যার Player UID দাও।" });
  }
  if (!/^[a-z]{2,10}$/.test(region)) {
    return res.status(400).json({ error: "Region code সঠিক নয়।" });
  }
  if (!API_KEY || API_KEY === "PUT_YOUR_API_KEY_HERE") {
    return res.status(503).json({
      error: "API key সেট করা হয়নি। Hosting-এর Environment Variables-এ FREEFIRE_API_KEY যোগ করো।",
      setupRequired: true
    });
  }

  try {
    const url = new URL(`${API_BASE}/info`);
    url.searchParams.set("uid", uid);
    url.searchParams.set("region", region);

    const upstream = await fetch(url, {
      method: "GET",
      headers: {
        "x-api-key": API_KEY,
        "User-Agent": APP_UA,
        "Accept": "application/json"
      },
      signal: AbortSignal.timeout(15000)
    });

    const raw = await upstream.text();
    let data;
    try { data = JSON.parse(raw); }
    catch { data = { message: "Profile provider returned an unreadable response." }; }

    if (!upstream.ok) {
      return res.status(upstream.status === 429 ? 429 : 502).json({
        error: "Profile provider থেকে তথ্য পাওয়া যায়নি। কিছুক্ষণ পরে আবার চেষ্টা করো।",
        providerStatus: upstream.status
      });
    }
    if (data.error || data.message === "Player not found") {
      return res.status(404).json({ error: "এই UID-এর প্রোফাইল পাওয়া যায়নি।", details: data.error || data.message });
    }
    res.set("Cache-Control", "no-store");
    return res.json({ source: "unofficial-community-api", uid, region: region.toUpperCase(), data });
  } catch (err) {
    console.error("Profile lookup error:", err.message);
    return res.status(502).json({ error: "সার্ভার প্রোফাইল সার্ভিসে সংযোগ করতে পারেনি। পরে চেষ্টা করো।" });
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`FF BD UID Profile Lookup running on port ${PORT}`);
});
