const http = require('http');

function get(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, data, headers: res.headers }));
    }).on('error', reject);
  });
}

async function verify() {
  console.log('--- Probing Next.js Pages & Assets ---');
  const pages = [
    '/',
    '/syllabus',
    '/experiments/exp-01-singly-linked-list',
    '/lab/exp-01-singly-linked-list',
    '/dashboard',
    '/leaderboard',
    '/faculty',
    '/about'
  ];

  const allAssets = new Set();

  for (const p of pages) {
    const res = await get('http://localhost:3000' + p);
    console.log(`Page: ${res.status} ${p} (${res.data.length} bytes)`);

    const linkRegex = /href="(\/_next\/[^"]+)"/g;
    const scriptRegex = /src="(\/_next\/[^"]+)"/g;

    let m;
    while ((m = linkRegex.exec(res.data)) !== null) {
      allAssets.add(m[1]);
    }
    while ((m = scriptRegex.exec(res.data)) !== null) {
      allAssets.add(m[1]);
    }
  }

  console.log(`\n--- Probing ${allAssets.size} Unique Next.js Static Assets (CSS & JS) ---`);
  let errors = 0;
  for (const asset of allAssets) {
    const res = await get('http://localhost:3000' + asset);
    const contentType = res.headers['content-type'] || 'unknown';
    if (res.status === 200) {
      console.log(`[PASS 200] ${asset} (${res.data.length} bytes, ${contentType})`);
    } else {
      console.log(`[FAIL ${res.status}] ${asset}`);
      errors++;
    }
  }

  console.log(`\nVerification Complete! Errors: ${errors}`);
}

verify().catch(console.error);
