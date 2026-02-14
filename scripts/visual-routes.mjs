import fs from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'

const BASE_URL = process.env.PLAYWRIGHT_BASE_URL ?? 'http://127.0.0.1:4317'
const OUTPUT_DIR = path.resolve(process.cwd(), 'artifacts', 'route-screenshots')

const routes = [
  { path: '/', label: 'dashboard' },
  { path: '/loads', label: 'loads' },
  { path: '/fleet', label: 'fleet' },
  { path: '/ai-agent', label: 'ai-agent' },
  { path: '/more', label: 'more-controls' },
]

async function wait(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

async function run() {
  await fs.mkdir(OUTPUT_DIR, { recursive: true })

  let chromium
  try {
    const playwright = await import('@playwright/test')
    chromium = playwright.chromium
  } catch (error) {
    console.error('Playwright is required for screenshot capture.')
    console.error(
      'Run `bun add -d @playwright/test` and install browsers once, then rerun.',
    )
    if (process.env.NODE_ENV === 'development') {
      console.error(error)
    }
    process.exit(1)
  }

  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
  })

  for (const route of routes) {
    const page = await context.newPage()
    const url = `${BASE_URL}${route.path}`
    await page.goto(url, {
      waitUntil: 'networkidle',
    })
    await page.waitForLoadState('domcontentloaded')
    await page.setViewportSize({ width: 390, height: 844 })
    await wait(450)

    const filePath = path.join(OUTPUT_DIR, `${route.label}.png`)
    await page.screenshot({
      path: filePath,
      fullPage: false,
    })

    await page.close()
  }

  await context.close()
  await browser.close()
}

run().catch((error) => {
  console.error('Unable to run route screenshots.')
  console.error(error)
  process.exit(1)
})
