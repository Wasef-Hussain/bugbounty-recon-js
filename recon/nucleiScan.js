// recon/nucleiScan.js
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

async function nucleiScan(outputDir, templates = 'default') {
  const alivePath = path.join(outputDir, 'alive.txt');
  if (!fs.existsSync(alivePath)) {
    console.error('[!] alive.txt not found. Run probe step first.');
    return;
  }

  const inputFile = alivePath;
  const reportFile = path.join(outputDir, 'scan-report.json');

  const cmd = `nuclei -l ${inputFile} -o ${reportFile} -json -severity low,medium,high,critical ${templates !== 'default' ? `-t ${templates}` : ''}`;

  console.log('[*] Running Nuclei scan...');
  exec(cmd, (error, stdout, stderr) => {
    if (error) {
      console.error(`[!] Nuclei error: ${error.message}`);
      return;
    }
    console.log('[*] Nuclei scan complete. Report saved to scan-report.json');
  });
}

module.exports = { nucleiScan };
