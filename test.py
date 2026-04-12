import asyncio
from playwright.async_api import async_playwright

FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLSft3BZ8fwYAYlSKcBRXAdyC7eqpwDUvMXgcg46QoSSrp7YbyA/viewform"

DATA = {
    "name": "Venkata Aditya Gopalapuram",
    "phone": "9876543210",
    "college": "Your College Name",
    "github": "https://github.com/VenkataAditya897",
    "ai": "I built an AI-powered job automation system...",
}

RESUME_PATH = r"C:\Users\venka\Desktop\autoapply-ai\backend\uploads\1_VenkataAditya_Resume_m11.pdf"


async def fill_form():
    async with async_playwright() as p:
        browser = await p.chromium.connect_over_cdp("http://localhost:9222")
        context = browser.contexts[0]
        page = await context.new_page()

        await page.goto(FORM_URL)
        await page.wait_for_timeout(4000)

        questions = page.locator("div[role='listitem']")
        count = await questions.count()

        print(f"\n🚀 Filling {count} questions...\n")

        resume_done = False  # ✅ prevent double upload

        for i in range(count):
            q = questions.nth(i)
            text = (await q.inner_text()).lower()

            print(f"\n👉 Processing: {text[:60]}")

            try:
                inputs = q.locator("input:visible")
                textarea = q.locator("textarea")
                label = text.strip()

                # ✅ FULL NAME
                if "full name" in label:
                    await inputs.first.fill(DATA["name"])

                # ✅ PHONE
                elif "phone number" in label:
                    await inputs.first.fill(DATA["phone"])

                # ✅ COLLEGE (safe)
                elif "college" in label and "github" not in label:
                    await inputs.first.fill(DATA["college"])

                # ✅ GITHUB (strict)
                elif "github" in label:
                    await inputs.first.wait_for(timeout=5000)
                    await inputs.first.fill(DATA["github"])

                # ✅ AI DESCRIPTION
                elif "describe" in label:
                    await textarea.first.fill(DATA["ai"])

                # ✅ DATE (3 fields)
                elif "date" in label:
                    date_inputs = q.locator("input")

                    if await date_inputs.count() >= 3:
                        await date_inputs.nth(0).fill("01")
                        await date_inputs.nth(1).fill("05")
                        await date_inputs.nth(2).fill("2026")

                # ✅ RESUME (FIXED)
                elif "resume" in text and "upload" in text and not resume_done:
                    print("📎 Uploading resume...")

                    await q.locator("text=Add file").click()
                    await page.wait_for_timeout(2000)

                    frame = page.frame_locator("iframe").last

                    # Upload tab
                    try:
                        await frame.locator("text=Upload").click(timeout=2000)
                    except:
                        pass

                    # Browse → file chooser
                    async with page.expect_file_chooser() as fc_info:
                        await frame.locator("text=Browse").click()

                    file_chooser = await fc_info.value

                    await file_chooser.set_files(RESUME_PATH)
                    print("✅ File selected")

                    await page.wait_for_timeout(3000)

                    # Click Upload / Insert
                    try:
                        await frame.locator("text=Upload").click(timeout=3000)
                    except:
                        try:
                            await frame.locator("text=Insert").click(timeout=3000)
                        except:
                            print("⚠️ Could not click Upload/Insert")

                    print("✅ Resume uploaded")
                    resume_done = True  # ✅ prevent second run

                print("✅ Done")

            except Exception as e:
                print("❌ Skipped:", e)

        # ✅ SUBMIT
        await page.click("div[role='button']:has-text('Submit')")
        print("🚀 Submitted!")

        await page.wait_for_timeout(3000)


asyncio.run(fill_form())