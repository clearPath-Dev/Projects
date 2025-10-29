import { execSync } from "node:child_process";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

dotenv.config();

const ENV = process.argv[2] || "staging";
const SITE_ID =
  ENV === "prod" ? process.env.NETLIFY_SITE_ID_PROD : process.env.NETLIFY_SITE_ID_STAGING;

if (!SITE_ID || !process.env.NETLIFY_AUTH_TOKEN) {
  console.error("❌ Missing .env configuration.");
  process.exit(1);
}

// Version = ISO timestamp + short git hash (fallback to timestamp)
let version = "";
try {
  const hash = execSync("git rev-parse --short HEAD").toString().trim();
  const ts = new Date().toISOString().replace(/[-:.TZ]/g, "");
  version = `${ts}-${hash}`;
} catch {
  version = Date.now().toString();
}

console.log(`\n🧠 Building version: ${version} (${ENV})\n`);
process.env.BUILD_VERSION = version;

// Build
execSync("npm run build", { stdio: "inherit" });

// Save manifest (optional)
fs.writeFileSync(path.join("dist", "build.json"), JSON.stringify({ version, environment: ENV }, null, 2));

// Deploy via Netlify CLI
const alias = ENV === "prod" ? "--prod" : `--alias=${ENV}`;
const site = `--site ${SITE_ID}`;
const token = `--auth ${process.env.NETLIFY_AUTH_TOKEN}`;
const message = `--message="Local deploy ${version}"`;

console.log(`\n🚀 Deploying ${ENV} build to Netlify...\n`);
const output = execSync(`netlify deploy ${alias} ${site} ${token} --dir=dist ${message}`, { encoding: "utf8" });
console.log(output);

// Parse URL & open
const urlMatch = output.match(/Website (?:Draft )?URL:\s+(https?:\/\/[^\s]+)/);
const deployedUrl = urlMatch ? urlMatch[1] : null;

if (deployedUrl) {
  const openCmd = process.platform === "darwin" ? "open" : process.platform === "win32" ? "start" : "xdg-open";
  execSync(`${openCmd} ${deployedUrl}`);
  console.log(`\n🌐 Opened deployed site: ${deployedUrl}\n`);
}

// Auto-publish Webflow staging
if (ENV === "staging") {
  console.log("🔁 Triggering Webflow staging publish...\n");
  execSync("node scripts/webflowPublish.js", { stdio: "inherit" });
}

console.log(`\n✅ ${ENV.toUpperCase()} build ${version} deployed.\n`);
