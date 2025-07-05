const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const tmp = require('tmp');

puppeteer.use(StealthPlugin());

module.exports = async function simulateVisit(videoUrl) {
  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.goto(videoUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(5000);

    const cookies = await page.cookies();
    await browser.close();

    const cookieStr = cookies.map(c => `${c.name}=${c.value}`).join('; ');
    return cookieStr;
  } catch (err) {
    console.error('❌ simulateVisit error:', err.message);
    return null;
  }
};
