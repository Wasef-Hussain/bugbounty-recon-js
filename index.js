// fullRecon.js
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { fetchSubdomains } = require('./recon/subdomainEnum');
const { probeAlive } = require('./recon/probe');
const { fetchWaybackURLs } = require('./recon/wayback');
const { dirBrute } = require('./recon/dirBrute');
const { nucleiScan } = require('./recon/nucleiScan');
const { logInfo } = require('./utils/logger');

const target = process.argv[2];
if (!target) {
  console.error('Usage: node fullRecon.js <target.com>');
  process.exit(1);
}
console.log(process.env.API_KEY); // access your API key
const outputDir = path.join(__dirname, 'output', target);
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

(async () => {
  logInfo(`Starting full recon on ${target}`);
  await fetchSubdomains(target, outputDir);
  await probeAlive(outputDir);
  await fetchWaybackURLs(target, outputDir);
  await dirBrute(target, outputDir);
  await nucleiScan(outputDir);
})();