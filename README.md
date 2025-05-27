
# BugBounty Recon JS

A lightweight local bug bounty reconnaissance toolchain built with Node.js.  
It automates subdomain enumeration, live host probing, Wayback Machine URL fetching, directory brute-forcing, and Nuclei vulnerability scanning.

---

## Features

- Subdomain enumeration via crt.sh
- Alive host checking (HTTP/HTTPS)
- Historical URL fetch from Wayback Machine
- Directory brute forcing with customizable wordlists
- Vulnerability scanning using Nuclei

---

## Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/Wasef-Hussain/bugbounty-recon-js.git
   cd bugbounty-recon-js

2. Install dependencies:
```npm install```

3. Usage
Run the full recon pipeline against a target domain:
node index.js example.

OR
npm start example.com


Directory Structure
bugbounty-recon-js/
├── index.js
├── fullRecon.js
├── package.json
├── README.md
├── recon/
│   ├── subdomainEnum.js
│   ├── probe.js
│   ├── wayback.js
│   ├── dirBrute.js
│   └── nucleiScan.js
├── utils/
│   └── logger.js
└── wordlists/
    └── common.txt





Requirements
Node.js (v16+ recommended)




Author
Wasef Hussain
GitHub: Wasef-Hussain
LinkedIn: linkedin.com/in/wasef-hussain-7a3070172

