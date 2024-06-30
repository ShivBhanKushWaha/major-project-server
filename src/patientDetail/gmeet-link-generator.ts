import puppeteer from 'puppeteer';

// Email credentials for login (use environment variables or a secure method to store these)
const EMAIL_USER = process.env.EMAIL_USER!;
const EMAIL_PASS = process.env.EMAIL_PASS!;

// Custom delay function
const delay = (time: number) => new Promise(resolve => setTimeout(resolve, time));

async function createGoogleMeetLink(): Promise<string> {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  try {
    await page.goto('https://meet.google.com/', { waitUntil: 'networkidle2' });
    await page.click('button[data-action="start"]');
    await page.waitForSelector('input[type="email"]');

    await page.type('input[type="email"]', EMAIL_USER);
    await page.click('#identifierNext');

    await page.waitForSelector('input[type="password"]', { visible: true });
    await page.type('input[type="password"]', EMAIL_PASS);
    await page.click('#passwordNext');

    await delay(3000); // Wait for login to complete

    // Retry navigating to the new meeting creation page up to 3 times
    let meetLink = '';
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        await page.goto('https://meet.google.com/new', { waitUntil: 'networkidle2' });

        meetLink = await page.evaluate(() => {
          const linkElement = document.querySelector('a');
          return linkElement ? linkElement.href : '';
        });

        if (meetLink) break; // Break out of loop if link is successfully retrieved
      } catch (error) {
        console.error(`Attempt ${attempt} failed:`, error);
      }
    }

    if (!meetLink) {
      throw new Error('Failed to retrieve Google Meet link after multiple attempts');
    }

    return meetLink;

  } catch (error) {
    console.error('Error creating Google Meet link:', error);
    throw error;

  } finally {
    await browser.close();
  }
}

export default createGoogleMeetLink;
