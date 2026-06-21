// Iconify icon names for game elements.
// game-icons: monochrome silhouettes (colour via `color` prop)
// noto: Google Noto emoji as SVGs — cross-platform consistent

export const BUILDING_ICON_MAP: Record<string, string> = {
  lighthouse:    "game-icons:lighthouse",
  fishing_dock:  "game-icons:fishing-pole",
  warehouse:     "game-icons:barrel",
  market_stall:  "game-icons:shop",
  bakery:        "game-icons:pie-slice",
  textile_shop:  "game-icons:sewing-needle",
  trading_post:  "game-icons:scales",
  garden:        "game-icons:flowers",
  observatory:   "game-icons:telescope",
  rest_pavilion: "game-icons:pagoda",
};

export const ZONE_ICON_MAP: Record<string, string> = {
  harbor: "noto:anchor",
  market: "noto:convenience-store",
  hill:   "noto:sunrise-over-mountains",
};

export const RESOURCE_ICON_MAP: Record<string, string> = {
  coins:  "noto:money-bag",
  wood:   "noto:wood",
  fabric: "noto:thread",
  fish:   "noto:fish",
};
