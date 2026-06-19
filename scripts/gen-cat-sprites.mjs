// Cat sprite sheet generator — flat cute style, 8-frame walk cycle.
// Pure-code assets => clean licensing.
// Regenerate: npm i -D @napi-rs/canvas gifenc && node scripts/gen-cat-sprites.mjs
import { createCanvas } from "@napi-rs/canvas";
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";

const FRAME = 128;
const FRAMES = 8;
const OUT_DIR = "public/cats";
mkdirSync(OUT_DIR, { recursive: true });

// Each cat: body, belly (lighter), stripe/accent, plus an accessory drawer.
const CATS = {
  captain: { body: "#F2A04A", belly: "#FBE0C0", accent: "#D97B2B", acc: "hat" },
  merchant: { body: "#A8B0BD", belly: "#E7EAEF", accent: "#7C8696", acc: "coin" },
  scholar: { body: "#F3E7CD", belly: "#FFF8EC", accent: "#D9C49A", acc: "glasses" },
  explorer: { body: "#B5824E", belly: "#E8D2B4", accent: "#8A5E33", acc: "scarf" },
  streak_master: { body: "#5B5667", belly: "#8E8898", accent: "#3A3742", acc: "flame" },
};

function rr(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function drawCat(ctx, colors, phase) {
  const cx = FRAME / 2;
  const groundY = 104;
  const t = phase * Math.PI * 2;
  // vertical bob: cat dips slightly twice per stride
  const bob = -Math.abs(Math.sin(t)) * 3;
  const by = groundY + bob;

  ctx.save();
  ctx.translate(0, 0);

  // ---- soft shadow ----
  ctx.fillStyle = "rgba(0,0,0,0.12)";
  ctx.beginPath();
  ctx.ellipse(cx + 2, groundY + 6, 30, 7, 0, 0, Math.PI * 2);
  ctx.fill();

  // ---- tail (behind), sways with stride ----
  const tailSway = Math.sin(t + Math.PI / 4) * 0.35;
  ctx.strokeStyle = colors.body;
  ctx.lineWidth = 9;
  ctx.lineCap = "round";
  ctx.beginPath();
  const tx = cx - 26;
  const ty = by - 26;
  ctx.moveTo(tx, ty);
  ctx.quadraticCurveTo(tx - 20, ty - 6 + tailSway * 18, tx - 16, ty - 26 + tailSway * 22);
  ctx.stroke();
  // tail tip
  ctx.fillStyle = colors.accent;
  ctx.beginPath();
  ctx.arc(tx - 16, ty - 26 + tailSway * 22, 5, 0, Math.PI * 2);
  ctx.fill();

  // ---- legs (walk cycle): pairs in opposite phase ----
  const legY = by - 6;
  const swing = 9;
  const lift = 4;
  function leg(baseX, ph) {
    const dx = Math.sin(t + ph) * swing;
    const up = Math.max(0, Math.cos(t + ph)) * lift;
    ctx.fillStyle = colors.body;
    rr(ctx, baseX + dx - 4, legY - up, 8, 16, 4);
    ctx.fill();
    // paw
    ctx.fillStyle = colors.belly;
    ctx.beginPath();
    ctx.ellipse(baseX + dx, legY + 16 - up, 5, 3, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  // back legs (darker-ish, drawn first)
  leg(cx - 14, 0);
  leg(cx + 16, Math.PI);
  // ---- body ----
  ctx.fillStyle = colors.body;
  rr(ctx, cx - 28, by - 30, 56, 34, 17);
  ctx.fill();
  // belly patch
  ctx.fillStyle = colors.belly;
  rr(ctx, cx - 16, by - 18, 32, 18, 9);
  ctx.fill();
  // front legs (in front of body)
  leg(cx - 18, Math.PI);
  leg(cx + 12, 0);

  // ---- head ----
  const hx = cx + 22;
  const hy = by - 34;
  // ears
  ctx.fillStyle = colors.body;
  ctx.beginPath();
  ctx.moveTo(hx - 12, hy - 10);
  ctx.lineTo(hx - 18, hy - 24);
  ctx.lineTo(hx - 4, hy - 16);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(hx + 12, hy - 10);
  ctx.lineTo(hx + 18, hy - 24);
  ctx.lineTo(hx + 4, hy - 16);
  ctx.closePath();
  ctx.fill();
  // inner ears
  ctx.fillStyle = colors.accent;
  ctx.beginPath();
  ctx.moveTo(hx - 11, hy - 12);
  ctx.lineTo(hx - 14, hy - 20);
  ctx.lineTo(hx - 7, hy - 15);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(hx + 11, hy - 12);
  ctx.lineTo(hx + 14, hy - 20);
  ctx.lineTo(hx + 7, hy - 15);
  ctx.closePath();
  ctx.fill();
  // head circle
  ctx.fillStyle = colors.body;
  ctx.beginPath();
  ctx.arc(hx, hy, 16, 0, Math.PI * 2);
  ctx.fill();
  // cheeks/muzzle
  ctx.fillStyle = colors.belly;
  ctx.beginPath();
  ctx.ellipse(hx + 4, hy + 5, 9, 7, 0, 0, Math.PI * 2);
  ctx.fill();
  // eyes
  ctx.fillStyle = "#2B2B33";
  ctx.beginPath();
  ctx.arc(hx + 1, hy - 1, 2.4, 0, Math.PI * 2);
  ctx.arc(hx + 11, hy - 1, 2.4, 0, Math.PI * 2);
  ctx.fill();
  // eye shine
  ctx.fillStyle = "#fff";
  ctx.beginPath();
  ctx.arc(hx + 1.8, hy - 1.8, 0.8, 0, Math.PI * 2);
  ctx.arc(hx + 11.8, hy - 1.8, 0.8, 0, Math.PI * 2);
  ctx.fill();
  // nose
  ctx.fillStyle = "#E08B8B";
  ctx.beginPath();
  ctx.moveTo(hx + 6, hy + 3);
  ctx.lineTo(hx + 9, hy + 3);
  ctx.lineTo(hx + 7.5, hy + 5.5);
  ctx.closePath();
  ctx.fill();
  // whiskers
  ctx.strokeStyle = "rgba(0,0,0,0.25)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(hx + 9, hy + 4); ctx.lineTo(hx + 20, hy + 2);
  ctx.moveTo(hx + 9, hy + 6); ctx.lineTo(hx + 20, hy + 7);
  ctx.stroke();

  // ---- accessory ----
  drawAccessory(ctx, colors, hx, hy, by, cx);

  ctx.restore();
}

function drawAccessory(ctx, colors, hx, hy, by, cx) {
  switch (colors.acc) {
    case "hat": {
      // little captain cap
      ctx.fillStyle = "#2C3E70";
      rr(ctx, hx - 14, hy - 20, 28, 7, 3);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(hx, hy - 20, 13, 5, 0, Math.PI, 0);
      ctx.fill();
      ctx.fillStyle = "#F2C94C";
      rr(ctx, hx - 6, hy - 18, 12, 4, 2);
      ctx.fill();
      break;
    }
    case "glasses": {
      ctx.strokeStyle = "#5A4632";
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.arc(hx + 1, hy - 1, 4.5, 0, Math.PI * 2);
      ctx.arc(hx + 11, hy - 1, 4.5, 0, Math.PI * 2);
      ctx.moveTo(hx + 5.5, hy - 1); ctx.lineTo(hx + 6.5, hy - 1);
      ctx.stroke();
      break;
    }
    case "scarf": {
      ctx.fillStyle = "#E2603F";
      rr(ctx, hx - 13, hy + 11, 26, 7, 3);
      ctx.fill();
      rr(ctx, hx - 10, hy + 15, 7, 12, 3);
      ctx.fill();
      break;
    }
    case "coin": {
      ctx.fillStyle = "#F2C94C";
      ctx.beginPath();
      ctx.arc(cx - 34, by - 24, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#C9952B";
      ctx.lineWidth = 1.4;
      ctx.stroke();
      ctx.fillStyle = "#C9952B";
      ctx.font = "bold 8px sans-serif";
      ctx.fillText("$", cx - 36.5, by - 21);
      break;
    }
    case "flame": {
      ctx.fillStyle = "#FF7A3C";
      ctx.beginPath();
      ctx.moveTo(hx - 18, hy - 22);
      ctx.quadraticCurveTo(hx - 24, hy - 30, hx - 16, hy - 36);
      ctx.quadraticCurveTo(hx - 15, hy - 28, hx - 10, hy - 30);
      ctx.quadraticCurveTo(hx - 11, hy - 22, hx - 18, hy - 22);
      ctx.fill();
      ctx.fillStyle = "#FFD93B";
      ctx.beginPath();
      ctx.moveTo(hx - 16, hy - 23);
      ctx.quadraticCurveTo(hx - 19, hy - 28, hx - 15, hy - 32);
      ctx.quadraticCurveTo(hx - 14, hy - 27, hx - 12, hy - 28);
      ctx.quadraticCurveTo(hx - 13, hy - 23, hx - 16, hy - 23);
      ctx.fill();
      break;
    }
  }
}

// ---- render one sprite sheet per cat ----
for (const [key, colors] of Object.entries(CATS)) {
  const sheet = createCanvas(FRAME * FRAMES, FRAME);
  const sctx = sheet.getContext("2d");
  for (let f = 0; f < FRAMES; f++) {
    const fc = createCanvas(FRAME, FRAME);
    const fctx = fc.getContext("2d");
    drawCat(fctx, colors, f / FRAMES);
    sctx.drawImage(fc, f * FRAME, 0);
  }
  const path = `${OUT_DIR}/${key}.png`;
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, sheet.toBuffer("image/png"));
  console.log("wrote", path, FRAME * FRAMES + "x" + FRAME);
}
console.log("done");
