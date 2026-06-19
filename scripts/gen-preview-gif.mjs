// Build an animated GIF preview of all 5 cats walking on an island strip.
import { createCanvas, loadImage } from "@napi-rs/canvas";
import gifenc from "gifenc";
const { GIFEncoder, quantize, applyPalette } = gifenc;
import { writeFileSync } from "node:fs";

const KEYS = ["captain", "merchant", "scholar", "explorer", "streak_master"];
const FRAME = 128, FRAMES = 8, SCALE = 3;
const COLS = KEYS.length;
const Wl = COLS * 112 + 24; // logical width
const Hl = 150;
const W = Wl * SCALE, H = Hl * SCALE;

const sheets = {};
for (const k of KEYS) sheets[k] = await loadImage(`public/cats/${k}.png`);

function drawScene(ctx, frame) {
  // sky
  const sky = ctx.createLinearGradient(0, 0, 0, Hl);
  sky.addColorStop(0, "#bfe6ff");
  sky.addColorStop(1, "#e8f7ff");
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, Wl, Hl);
  // sun
  ctx.fillStyle = "#ffe08a";
  ctx.beginPath();
  ctx.arc(Wl - 22, 24, 14, 0, Math.PI * 2);
  ctx.fill();
  // ground
  ctx.fillStyle = "#bfe3c0";
  ctx.beginPath();
  ctx.moveTo(0, 118);
  ctx.quadraticCurveTo(Wl / 2, 104, Wl, 118);
  ctx.lineTo(Wl, Hl);
  ctx.lineTo(0, Hl);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "#a9d8aa";
  ctx.fillRect(0, 130, Wl, Hl - 130);
  // cats
  KEYS.forEach((k, i) => {
    const x = 12 + i * 112;
    const f = (frame + i * 2) % FRAMES; // stagger so they're not in lockstep
    ctx.drawImage(sheets[k], f * FRAME, 0, FRAME, FRAME, x, 14, FRAME * 0.85, FRAME * 0.85);
  });
}

const gif = GIFEncoder();
const c = createCanvas(W, H);
const ctx = c.getContext("2d");
ctx.imageSmoothingEnabled = false;

for (let loop = 0; loop < 2; loop++) {
  for (let f = 0; f < FRAMES; f++) {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, W, H);
    ctx.scale(SCALE, SCALE);
    drawScene(ctx, f);
    const { data } = ctx.getImageData(0, 0, W, H);
    const palette = quantize(data, 256);
    const index = applyPalette(data, palette);
    gif.writeFrame(index, W, H, { palette, delay: 110 });
  }
}
gif.finish();
writeFileSync("/tmp/cats_walk_preview.gif", gif.bytes());
console.log("wrote /tmp/cats_walk_preview.gif", W + "x" + H);
