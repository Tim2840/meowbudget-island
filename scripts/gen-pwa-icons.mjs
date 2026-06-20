import { createCanvas } from "@napi-rs/canvas";
import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";

const OUT = join(process.cwd(), "public", "icons");
mkdirSync(OUT, { recursive: true });

function drawIcon(size) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext("2d");

  // Rounded rect background (amber)
  const r = size * 0.2;
  ctx.beginPath();
  ctx.moveTo(r, 0);
  ctx.lineTo(size - r, 0);
  ctx.arcTo(size, 0, size, r, r);
  ctx.lineTo(size, size - r);
  ctx.arcTo(size, size, size - r, size, r);
  ctx.lineTo(r, size);
  ctx.arcTo(0, size, 0, size - r, r);
  ctx.lineTo(0, r);
  ctx.arcTo(0, 0, r, 0, r);
  ctx.closePath();

  const grad = ctx.createLinearGradient(0, 0, 0, size);
  grad.addColorStop(0, "#FCD34D");
  grad.addColorStop(1, "#F59E0B");
  ctx.fillStyle = grad;
  ctx.fill();

  // Island (green oval)
  ctx.fillStyle = "#34D399";
  ctx.beginPath();
  ctx.ellipse(size * 0.5, size * 0.65, size * 0.28, size * 0.14, 0, 0, Math.PI * 2);
  ctx.fill();

  // Tree trunk
  ctx.fillStyle = "#78350F";
  ctx.fillRect(size * 0.46, size * 0.38, size * 0.08, size * 0.2);

  // Tree canopy
  ctx.fillStyle = "#059669";
  ctx.beginPath();
  ctx.arc(size * 0.5, size * 0.33, size * 0.18, 0, Math.PI * 2);
  ctx.fill();

  // Cat silhouette
  ctx.fillStyle = "#F97316";
  // body
  ctx.beginPath();
  ctx.ellipse(size * 0.5, size * 0.6, size * 0.08, size * 0.055, 0, 0, Math.PI * 2);
  ctx.fill();
  // head
  ctx.beginPath();
  ctx.arc(size * 0.5, size * 0.53, size * 0.055, 0, Math.PI * 2);
  ctx.fill();
  // ears
  ctx.beginPath();
  ctx.moveTo(size * 0.462, size * 0.495);
  ctx.lineTo(size * 0.452, size * 0.47);
  ctx.lineTo(size * 0.475, size * 0.49);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(size * 0.538, size * 0.495);
  ctx.lineTo(size * 0.548, size * 0.47);
  ctx.lineTo(size * 0.525, size * 0.49);
  ctx.fill();

  return canvas;
}

// Generate 192×192 and 512×512
for (const size of [192, 512]) {
  const canvas = drawIcon(size);
  const buf = canvas.toBuffer("image/png");
  writeFileSync(join(OUT, `icon-${size}x${size}.png`), buf);
  console.log(`Generated icon-${size}x${size}.png`);
}

// Also generate apple-touch-icon at 180×180
const appleCanvas = drawIcon(180);
const appleBuf = appleCanvas.toBuffer("image/png");
writeFileSync(join(process.cwd(), "public", "apple-touch-icon.png"), appleBuf);
console.log("Generated apple-touch-icon.png");
