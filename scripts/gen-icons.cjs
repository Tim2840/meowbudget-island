const fs = require('fs');
const noto = require('@iconify-json/noto/icons.json');
const gi = require('@iconify-json/game-icons/icons.json');

// Icons actually used across the app (must match src/lib/iconMap.ts)
const USED = {
  'game-icons': ['lighthouse','fishing-pole','barrel','shop','pie-slice','sewing-needle','scales','flowers','telescope','pagoda'],
  'noto': ['anchor','convenience-store','sunrise-over-mountains','money-bag','wood','thread','fish'],
};

const SETS = { 'game-icons': gi, 'noto': noto };
const out = [];

for (const [prefix, names] of Object.entries(USED)) {
  const set = SETS[prefix];
  for (const name of names) {
    // resolve alias chain
    let key = name;
    if (!set.icons[key] && set.aliases && set.aliases[key]) key = set.aliases[key].parent;
    const icon = set.icons[key];
    if (!icon) { console.error('MISSING', prefix, name); process.exit(1); }
    out.push({
      name: `${prefix}:${name}`,
      data: {
        body: icon.body,
        width: icon.width ?? set.width,
        height: icon.height ?? set.height,
      },
    });
  }
}

const header = `// AUTO-GENERATED — offline Iconify bundle. Do not edit by hand.
// Regenerate via scripts/gen-icons.cjs after changing src/lib/iconMap.ts.
// Registers only the icons the app uses so they render without CDN access.
import { addIcon } from "@iconify/react";

`;
const body = out.map(o =>
  `addIcon(${JSON.stringify(o.name)}, ${JSON.stringify(o.data)});`
).join('\n');

fs.writeFileSync('src/lib/iconBundle.ts', header + body + '\n');
console.log('Wrote src/lib/iconBundle.ts with', out.length, 'icons');
