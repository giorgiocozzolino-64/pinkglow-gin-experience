import QRCode from "qrcode";
import fs from "fs";
import path from "path";
const SITE_URL = "https://pinkglow-gin-experience-8tjh.vercel.app";
const OUTPUT_DIR = path.join(process.cwd(), "public", "qrc");

async function generateQRCodes() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  for (let i = 1; i <= 250; i++) {
    const serial = `PG-FC26-${String(i).padStart(3, "0")}`;
    const url = `${SITE_URL}/p/${serial}`;
    const filePath = path.join(OUTPUT_DIR, `${serial}.png`);

    await QRCode.toFile(filePath, url, {
      type: "png",
      width: 1200,
      margin: 2,
      color: {
        dark: "#000000",
        light: "#ffffff",
      },
    });

    console.log(`Generated ${serial} -> ${url}`);
  }

  console.log("All 250 Pinkglow QR codes generated.");
}

generateQRCodes().catch((error) => {
  console.error(error);
  process.exit(1);
});