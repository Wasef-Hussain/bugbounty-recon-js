// recon/dirBrute.js
const fs = require('fs');
const path = require('path');
const axios = require('axios');

async function dirBrute(domain, outputDir, wordlistPath = 'wordlists/common.txt') {
  const wordlist = fs.readFileSync(wordlistPath, 'utf-8').split('\n').filter(Boolean);
  const alivePath = path.join(outputDir, 'alive.txt');
  const aliveHosts = fs.readFileSync(alivePath, 'utf-8').split('\n').filter(Boolean);

  for (const host of aliveHosts) {
    const foundDirs = [];
    console.log(`\n[*] Scanning ${host}`);

    for (const word of wordlist) {
      const url = `http://${host}/${word}`;
      try {
        const res = await axios.get(url, { timeout: 3000 });
        if (res.status < 400) {
          console.log(`[+] Found: ${url}`);
          foundDirs.push(url);
        }
      } catch (_) {}
    }

    const outputFile = path.join(outputDir, `${host.replace(/[:/]/g, '_')}_dirs.txt`);
    fs.writeFileSync(outputFile, foundDirs.join('\n'));
  }
}

module.exports = { dirBrute };
