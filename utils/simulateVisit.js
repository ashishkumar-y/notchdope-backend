const puppeteer = require('puppeteer');

module.exports = async function simulateVisit(videoUrl) {
  try {
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    await page.goto(videoUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });

    const cookies = await page.cookies();
    await browser.close();

    return cookies.map(c => `${c.name}=${c.value}`).join('; ');
  } catch (err) {
    console.error('❌ Puppeteer failed:', err.message);
    return null;
  }
};
