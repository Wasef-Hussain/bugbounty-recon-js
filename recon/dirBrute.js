const fs = require('fs');
const path = require('path');
const axios = require('axios');
const pLimit = (...args) => import('p-limit').then(mod => mod.default(...args));
const { logInfo, logError } = require('../utils/logger');

async function checkURL(url) {
  try {
    const res = await axios.get(url, { timeout: 3000 });
    if (res.status < 400) return true;
  } catch (err) {
    logError(`[!] Request failed: ${url} (${err.code || err.message})`);
  }
  return false;
}

async function dirBrute(domain, outputDir, wordlistPath = 'wordlists/common.txt') {
  logInfo('[*] Starting directory brute-force...');
  const limit = await pLimit(10);

  const wordlistPathResolved = path.isAbsolute(wordlistPath)
    ? wordlistPath
    : path.join(__dirname, '..', wordlistPath);

  if (!fs.existsSync(wordlistPathResolved)) {
    logError(`Wordlist not found at ${wordlistPathResolved}`);
    return;
  }

  const wordlist = fs.readFileSync(wordlistPathResolved, 'utf-8').split('\n').filter(Boolean);
  const alivePath = path.join(outputDir, 'alive.txt');
  if (!fs.existsSync(alivePath)) {
    logError(`Alive hosts file not found at ${alivePath}`);
    return;
  }

  const aliveHosts = fs.readFileSync(alivePath, 'utf-8').split('\n').filter(Boolean);
  logInfo(`[*] Loaded ${aliveHosts.length} alive hosts and ${wordlist.length} words`);

  for (const host of aliveHosts) {
    const foundDirs = [];
    logInfo(`\n[*] Scanning host: ${host}`);

    const promises = wordlist.map(word => limit(async () => {
      let url = `https://${host}/${word}`;
      let alive = await checkURL(url);
      if (!alive) {
        url = `http://${host}/${word}`;
        alive = await checkURL(url);
      }
      if (alive) {
        console.log(`[+] Found: ${url}`);
        foundDirs.push(url);
      }
    }));

    await Promise.all(promises);

    const outputFile = path.join(outputDir, `${host.replace(/[:/]/g, '_')}_dirs.txt`);
    fs.writeFileSync(outputFile, foundDirs.join('\n'));

    logInfo(`[*] Finished scanning ${host}. Found ${foundDirs.length} directories.`);
  }

  logInfo('[*] Directory brute-force complete.\n');
}

module.exports = { dirBrute };
