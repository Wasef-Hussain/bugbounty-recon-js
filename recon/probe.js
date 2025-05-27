// recon/probe.js
const fs = require('fs');
const path = require('path');
const axios = require('axios');

async function probeAlive(outputDir) {
  const subPath = path.join(outputDir, 'subdomains.txt');
  if (!fs.existsSync(subPath)) {
    console.error('[!] subdomains.txt not found. Run subdomainEnum first.');
    return;
  }

  const subdomains = fs.readFileSync(subPath, 'utf-8').split('\n').filter(Boolean);
  const alive = [];

  for (const domain of subdomains) {
    try {
      await axios.get(`http://${domain}`, { timeout: 3000 });
      console.log(`[+] Alive (HTTP): ${domain}`);
      alive.push(domain);
    } catch (_) {
      try {
        await axios.get(`https://${domain}`, { timeout: 3000 });
        console.log(`[+] Alive (HTTPS): ${domain}`);
        alive.push(domain);
      } catch (_) {
        // Dead or unreachable
      }
    }
  }

  fs.writeFileSync(path.join(outputDir, 'alive.txt'), alive.join('\n'));
  console.log(`[*] Alive hosts saved to alive.txt`);
}

module.exports = { probeAlive };