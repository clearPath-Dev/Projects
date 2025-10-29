import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config();

const { WEBFLOW_API_TOKEN, WEBFLOW_SITE_ID, WEBFLOW_STAGING_DOMAIN } = process.env;
if (!WEBFLOW_API_TOKEN || !WEBFLOW_SITE_ID || !WEBFLOW_STAGING_DOMAIN) {
  console.error("❌ Missing Webflow API credentials.");
  process.exit(1);
}

(async () => {
  console.log("🔁 Publishing Webflow staging site...");
  try {
    const res = await fetch(`https://api.webflow.com/v1/sites/${WEBFLOW_SITE_ID}/publish`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${WEBFLOW_API_TOKEN}`,
        "Content-Type": "application/json",
        "accept-version": "1.0.0"
      },
      body: JSON.stringify({ domains: [WEBFLOW_STAGING_DOMAIN] })
    });

    if (!res.ok) throw new Error(await res.text());
    console.log("✅ Webflow staging site published.\n");
  } catch (err) {
    console.error("❌ Webflow publish failed:", err.message);
  }
})();
