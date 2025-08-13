const axios = require("axios");

function normalizeTag(tag) {
  const t = String(tag || "").trim().toUpperCase();
  return t.startsWith("#") ? t : "#" + t;
}

function encodeTag(tag) {
  // API expects %23 instead of #
  return normalizeTag(tag).replace("#", "%23");
}

const api = axios.create({
  baseURL: "https://api.brawlstars.com/v1",
  headers: {
    Authorization: `Bearer ${process.env.BRAWL_STARS_TOKEN}`
  },
  timeout: 10000
});

module.exports = {
  normalizeTag,

  async getPlayer(tag) {
    const res = await api.get(`/players/${encodeTag(tag)}`);
    return res.data;
  },

  async getBattleLog(tag) {
    const res = await api.get(`/players/${encodeTag(tag)}/battlelog`);
    return res.data;
  },

  async getBrawlers() {
    const res = await api.get(`/brawlers`);
    return res.data;
  },

  async getClub(clubTag) {
    const res = await api.get(`/clubs/${encodeTag(clubTag)}`);
    return res.data;
  },

 
};
