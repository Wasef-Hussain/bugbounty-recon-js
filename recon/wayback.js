// recon/wayback.js
const fs = require('fs');
const path = require('path');
const axios = require('axios');

async function fetchWaybackURLs(domain, outputDir) {
  try {
    const res = await axios.get(`http://web.archive.org/cdx/search/cdx?url=*.${domain}/*&output=json&fl=original&collapse=urlkey`);
    const urls = res.data.slice(1).map(row => row[0]);
    fs.writeFileSync(path.join(outputDir, 'wayback_urls.txt'), urls.join('\n'));
    console.log(`[*] Fetched ${urls.length} historical URLs from Wayback Machine`);
  } catch (err) {
    console.error('[!] Error fetching Wayback URLs:', err.message);
  }
}

module.exports = { fetchWaybackURLs };