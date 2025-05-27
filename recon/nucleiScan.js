// recon/nucleiScan.js
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const util = require('util');
const execAsync = util.promisify(exec);
const { logInfo, logError } = require('../utils/logger');

async function nucleiScan(outputDir, templates = 'default') {
  logInfo(`[*] Starting Nuclei scan for directory: ${outputDir}`);

  const alivePath = path.join(outputDir, 'alive.txt');
  logInfo(`[*] Checking for alive.txt at: ${alivePath}`);

  if (!fs.existsSync(alivePath)) {
    logError('[!] alive.txt not found. Run probe step first.');
    return;
  }

  const inputFile = alivePath;
  const reportFile = path.join(outputDir, 'scan-report.txt'); // changed extension for clarity

  logInfo(`[*] Input file for Nuclei: ${inputFile}`);
  logInfo(`[*] Output report file will be: ${reportFile}`);

  // Check if nuclei is installed
  try {
    const { stdout } = await execAsync('which nuclei');
    logInfo(`[*] Found Nuclei binary at: ${stdout.trim()}`);
  } catch {
    logError(`[!] 'nuclei' command not found. Please install it using:\n  go install -v github.com/projectdiscovery/nuclei/v3/cmd/nuclei@latest`);
    return;
  }

  const templateArg = templates !== 'default' ? `-t ${templates}` : '';
  const cmd = `nuclei -l "${inputFile}" -o "${reportFile}" -severity low,medium,high,critical ${templateArg}`;

  logInfo(`[*] Executing Nuclei command:\n${cmd}`);

  try {
    const { stdout, stderr } = await execAsync(cmd);

    logInfo('[*] Nuclei command executed.');

    if (stdout) logInfo(`[*] STDOUT:\n${stdout.trim()}`);
    if (stderr) logInfo(`[*] STDERR:\n${stderr.trim()}`);

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
