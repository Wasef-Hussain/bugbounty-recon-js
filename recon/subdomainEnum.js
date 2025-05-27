// recon/subdomainEnum.js
const fs = require('fs');
const path = require('path');
const axios = require('axios');

async function fetchSubdomains(domain, outputDir) {
  try {
    const res = await axios.get(`https://crt.sh/?q=%25.${domain}&output=json`);
    const domains = [...new Set(res.data.map(entry => entry.name_value.split('\n')).flat())];
    fs.writeFileSync(path.join(outputDir, 'subdomains.txt'), domains.join('\n'));
    console.log(`[*] Found ${domains.length} subdomains`);
  } catch (err) {
    console.error('[!] Error fetching subdomains:', err.message);
  }
}

module.exports = { fetchSubdomains };