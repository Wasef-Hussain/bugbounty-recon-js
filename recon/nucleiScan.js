// recon/nucleiScan.js
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const util = require('util');
const execAsync = util.promisify(exec);
const { logInfo, logError } = require('../utils/logger');

async function nucleiScan(outputDir, templates = 'default') {
  const alivePath = path.join(outputDir, 'alive.txt');

  if (!fs.existsSync(alivePath)) {
    logError('[!] alive.txt not found. Run probe step first.');
    return;
  }

  const inputFile = alivePath;
  const reportFile = path.join(outputDir, 'scan-report.txt'); // note: changed extension for clarity

  // Check if nuclei is installed
  try {
    await execAsync('which nuclei');
  } catch {
    logError(`[!] 'nuclei' command not found. Please install it using:\n  go install -v github.com/projectdiscovery/nuclei/v3/cmd/nuclei@latest`);
    return;
  }

  const templateArg = templates !== 'default' ? `-t ${templates}` : '';
  const cmd = `nuclei -l "${inputFile}" -o "${reportFile}" -severity low,medium,high,critical ${templateArg}`;

  logInfo('[*] Running Nuclei scan...');

  try {
    const { stdout, stderr } = await execAsync(cmd);

    if (stdout) console.log(stdout.trim());
    if (stderr) console.error(stderr.trim());

    if (fs.existsSync(reportFile)) {
      logInfo(`[*] Nuclei scan complete. Report saved to: ${reportFile}`);
    } else {
      logError('[!] Scan finished but report file not found.');
    }
  } catch (err) {
    logError(`[!] Nuclei scan failed: ${err.message}`);
  }
}

module.exports = { nucleiScan };
