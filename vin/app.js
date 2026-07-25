/* ═══════════════════════════════════════════════════════════════
   VINPAR — Rätt vin till maten
   Parningsmotor byggd på Systembolagets egna matsymboler,
   smakklockor (fyllighet, strävhet, fruktsyra, sötma) och stilar.
   Datat i wines.js är en ögonblicksbild av fasta sortimentet.
   ═══════════════════════════════════════════════════════════════ */

"use strict";

/* ──────────────────────────────────────────────
   Rätterna. Varje rätt beskriver vad den kräver av vinet:
   - sym:    Systembolagets matsymboler med vikt (högre = viktigare)
   - cat2:   bonus per vintyp (Rött vin, Vitt vin, …)
   - c3:     bonus per stilkategori (Systembolagets "Kryddigt & Mustigt" osv.)
   - clocks: önskade intervall på smakklockorna 0–12
             cb = fyllighet, cr = strävhet, cf = fruktsyra, cs = sötma
   - grapes: druvor som traditionellt sitter ihop med rätten
   - why:    motivering som visas för användaren
   ────────────────────────────────────────────── */
const DISHES = [
  /* ── Nöt & vilt ── */
  { id: "biff", grp: "Nöt & vilt", emoji: "🥩", name: "Grillad biff & entrecôte",
    sub: "Även ryggbiff, flankstek, T-ben",
    sym: { "Nöt": 30 }, cat2: { "Rött vin": 20 },
    c3: { "Kryddigt & Mustigt": 10, "Fruktigt & Smakrikt": 8, "Stramt & Nyanserat": 6 },
    clocks: { cb: [8, 12], cr: [6, 12] },
    grapes: ["cabernet sauvignon", "malbec", "syrah", "shiraz"],
    why: "Grillat nötkött har mycket protein och stekyta — det tämjer tanninerna och kräver ett rött vin med hög fyllighet och rejäl strävhet." },

  { id: "gryta", grp: "Nöt & vilt", emoji: "🍲", name: "Köttgryta & högrev",
    sub: "Boeuf bourguignon, kalops, oxsvans",
    sym: { "Nöt": 30 }, cat2: { "Rött vin": 20 },
    c3: { "Kryddigt & Mustigt": 12, "Fruktigt & Smakrikt": 8 },
    clocks: { cb: [8, 12], cr: [5, 10] },
    grapes: ["grenache", "syrah", "tempranillo", "mourvèdre"],
    why: "Långkok ger djup umami och mjuk konsistens — ett mustigt, kryddigt rött med mogen frukt möter grytan på samma våglängd." },

  { id: "vilt", grp: "Nöt & vilt", emoji: "🦌", name: "Vilt — älg, hjort & rådjur",
    sub: "Viltskav, viltstek, viltfärsbiffar",
    sym: { "Vilt": 30, "Nöt": 8 }, cat2: { "Rött vin": 20 },
    c3: { "Stramt & Nyanserat": 12, "Kryddigt & Mustigt": 8 },
    clocks: { cb: [7, 11], cr: [4, 9], cf: [7, 12] },
    grapes: ["pinot noir", "nebbiolo", "syrah"],
    why: "Viltkött är magert med skogig sälta — eleganta, stramare röda viner med fin syra lyfter smaken utan att dränka den." },

  { id: "burgare", grp: "Nöt & vilt", emoji: "🍔", name: "Hamburgare",
    sub: "Även smash burgers och köttfärsrätter",
    sym: { "Nöt": 25, "Buffémat": 6 }, cat2: { "Rött vin": 20 },
    c3: { "Fruktigt & Smakrikt": 12, "Mjukt & Bärigt": 8 },
    clocks: { cb: [6, 11], cr: [4, 9] },
    grapes: ["zinfandel", "malbec", "merlot"],
    why: "Burgaren är fet, salt och lite söt i brödet — generöst fruktiga röda viner med mjuka tanniner matchar utan att spjärna emot." },

  /* ── Lamm & fläsk ── */
  { id: "lamm", grp: "Lamm & fläsk", emoji: "🍖", name: "Lammstek & lammracks",
    sub: "Även lammfärs och grillat lamm",
    sym: { "Lamm": 30 }, cat2: { "Rött vin": 20 },
    c3: { "Kryddigt & Mustigt": 10, "Fruktigt & Smakrikt": 8 },
    clocks: { cb: [7, 12], cr: [5, 11] },
    grapes: ["cabernet sauvignon", "tempranillo", "syrah", "grenache"],
    why: "Lammets karaktäristiska sötma och fetma är en klassisk partner till strukturerade röda viner — Rioja och Bordeaux är skolboksexemplen." },

  { id: "flask", grp: "Lamm & fläsk", emoji: "🥓", name: "Fläskkarré & pulled pork",
    sub: "Även revben och kotletter",
    sym: { "Fläsk": 30 }, cat2: { "Rött vin": 14, "Vitt vin": 8, "Rosévin": 6 },
    c3: { "Fruktigt & Smakrikt": 10, "Mjukt & Bärigt": 8, "Fylligt & Smakrikt": 6 },
    clocks: { cb: [5, 10], cr: [2, 7] },
    grapes: ["zinfandel", "pinot noir", "chardonnay"],
    why: "Fläskkött är sött och fett men inte lika kraftigt som nöt — fruktiga röda med rundare tanniner, eller ett fylligt vitt, passar bäst." },

  { id: "chark", grp: "Lamm & fläsk", emoji: "🥖", name: "Charkbricka & korv",
    sub: "Salami, lufttorkad skinka, paté",
    sym: { "Fläsk": 20, "Buffémat": 12, "Sällskapsdryck": 6 },
    cat2: { "Rött vin": 12, "Rosévin": 10, "Mousserande vin": 8 },
    c3: { "Mjukt & Bärigt": 10, "Friskt & Bärigt": 8, "Rosé": 8 },
    clocks: { cb: [4, 9], cr: [2, 6], cf: [6, 12] },
    grapes: ["sangiovese", "gamay", "barbera"],
    why: "Salta charkuterier ropar efter friskhet och bär — lättare röda, torr rosé eller bubbel skär genom fettet och rensar gommen." },

  /* ── Fågel ── */
  { id: "kyckling", grp: "Fågel", emoji: "🍗", name: "Kyckling",
    sub: "Grillad, ugnsstekt eller i gryta",
    sym: { "Fågel": 30 }, cat2: { "Vitt vin": 14, "Rött vin": 10 },
    c3: { "Fylligt & Smakrikt": 10, "Friskt & Fruktigt": 8, "Mjukt & Bärigt": 8 },
    clocks: { cb: [5, 10], cr: [0, 6] },
    grapes: ["chardonnay", "pinot noir", "viognier"],
    why: "Kyckling är mild och tar färg av tillbehören — ett fylligt vitt eller ett lätt rött med diskreta tanniner följer med i det mesta." },

  { id: "anka", grp: "Fågel", emoji: "🦆", name: "Anka & kalkon",
    sub: "Ankbröst, confit, helstekt kalkon",
    sym: { "Fågel": 30 }, cat2: { "Rött vin": 16, "Vitt vin": 8 },
    c3: { "Stramt & Nyanserat": 10, "Fruktigt & Smakrikt": 8 },
    clocks: { cb: [6, 10], cr: [3, 7], cf: [7, 12] },
    grapes: ["pinot noir", "merlot", "nebbiolo"],
    why: "Ankans feta, mörka kött är Pinot Noirs paradgren — röd frukt och frisk syra skär genom fettet utan att slå ut smaken." },

  /* ── Fisk & skaldjur ── */
  { id: "vitfisk", grp: "Fisk & skaldjur", emoji: "🐟", name: "Vit fisk",
    sub: "Torsk, sej, gös — kokt eller stekt",
    sym: { "Fisk": 30 }, cat2: { "Vitt vin": 20 },
    c3: { "Torrt vitt": 10, "Friskt & Fruktigt": 10 },
    clocks: { cb: [3, 8], cf: [7, 12], cs: [0, 3] },
    grapes: ["sauvignon blanc", "chardonnay", "chenin blanc", "grüner veltliner"],
    why: "Delikat vit fisk kräver ett torrt, friskt vitt vin med hög syra — som en citronklyfta i glaset." },

  { id: "lax", grp: "Fisk & skaldjur", emoji: "🐠", name: "Lax & röding",
    sub: "Även gravad och varmrökt",
    sym: { "Fisk": 30 }, cat2: { "Vitt vin": 16, "Rosévin": 8 },
    c3: { "Fylligt & Smakrikt": 10, "Friskt & Fruktigt": 8, "Rosé": 6 },
    clocks: { cb: [5, 10], cf: [6, 11] },
    grapes: ["chardonnay", "pinot noir", "riesling"],
    why: "Fet fisk som lax bär mer smak — ett fylligare vitt med både kropp och syra, eller en rejäl rosé, balanserar fettet." },

  { id: "skaldjur", grp: "Fisk & skaldjur", emoji: "🦐", name: "Skaldjur & ostron",
    sub: "Räkor, kräftor, musslor, hummer",
    sym: { "Skaldjur": 30, "Fisk": 8 }, cat2: { "Vitt vin": 16, "Mousserande vin": 12 },
    c3: { "Torrt vitt": 10, "Friskt & Fruktigt": 10 },
    clocks: { cb: [2, 7], cf: [8, 12], cs: [0, 3] },
    grapes: ["chardonnay", "sauvignon blanc", "albariño", "picpoul"],
    why: "Skaldjurens sälta och sötma älskar knivskarp syra och mineralitet — Chablis-stil eller torrt bubbel är klassikerna." },

  { id: "sushi", grp: "Fisk & skaldjur", emoji: "🍣", name: "Sushi & poké",
    sub: "Även sashimi",
    sym: { "Asiatiskt": 20, "Fisk": 14, "Skaldjur": 10 },
    cat2: { "Vitt vin": 14, "Mousserande vin": 10, "Sake": 26 },
    c3: { "Friskt & Fruktigt": 8, "Druvigt & Blommigt": 8 },
    clocks: { cb: [2, 7], cf: [6, 11], cs: [0, 5] },
    grapes: ["riesling", "grüner veltliner"],
    why: "Ris, soja och rå fisk vill ha friska, lätt aromatiska viner med mjuk syra — och sake är det självklara originalet." },

  /* ── Vegetariskt ── */
  { id: "svamp", grp: "Vegetariskt", emoji: "🍄", name: "Svamprisotto & umami",
    sub: "Karljohan, tryffel, lagrad parmesan",
    sym: { "Grönsaker": 26 }, cat2: { "Rött vin": 12, "Vitt vin": 12 },
    c3: { "Stramt & Nyanserat": 10, "Fylligt & Smakrikt": 8, "Mjukt & Bärigt": 6 },
    clocks: { cb: [5, 10], cr: [2, 7] },
    grapes: ["pinot noir", "nebbiolo", "chardonnay"],
    why: "Svampens jordiga umami speglas bäst av viner med egen jordighet — mogen Pinot Noir eller ett fatpräglat vitt." },

  { id: "tomatpasta", grp: "Vegetariskt", emoji: "🍝", name: "Pasta med tomatsås",
    sub: "Arrabbiata, norma, pizza margherita",
    sym: { "Grönsaker": 22, "Buffémat": 4 }, cat2: { "Rött vin": 16 },
    c3: { "Fruktigt & Smakrikt": 10, "Friskt & Bärigt": 8 },
    clocks: { cb: [5, 9], cf: [8, 12], cr: [3, 8] },
    grapes: ["sangiovese", "barbera", "primitivo", "montepulciano"],
    why: "Tomatens höga syra kräver ett vin med minst lika hög syra — italienska röda på Sangiovese är byggda för exakt det här." },

  { id: "kramig", grp: "Vegetariskt", emoji: "🧀", name: "Krämig pasta & gratänger",
    sub: "Carbonara, alfredo, lasagne al forno",
    sym: { "Grönsaker": 12, "Fläsk": 10, "Fågel": 6 },
    cat2: { "Vitt vin": 16, "Rött vin": 8 },
    c3: { "Fylligt & Smakrikt": 12, "Torrt vitt": 6 },
    clocks: { cb: [6, 10], cf: [6, 11] },
    grapes: ["chardonnay", "viognier", "grillo"],
    why: "Grädde och ost behöver ett vin med både fyllighet att bära fettet och syra att skära igenom — fatlagrad Chardonnay gör båda." },

  { id: "sallad", grp: "Vegetariskt", emoji: "🥗", name: "Sallader & gröna rätter",
    sub: "Getostsallad, sparris, örtiga rätter",
    sym: { "Grönsaker": 26, "Aperitif": 4 }, cat2: { "Vitt vin": 18, "Rosévin": 8 },
    c3: { "Friskt & Fruktigt": 12, "Torrt vitt": 8 },
    clocks: { cb: [2, 7], cf: [8, 12], cs: [0, 3] },
    grapes: ["sauvignon blanc", "verdejo", "grüner veltliner"],
    why: "Gröna, örtiga smaker möter sin spegelbild i gräsiga, friska vita viner — Sauvignon Blanc och sparris är en klassisk duo." },

  { id: "grillgront", grp: "Vegetariskt", emoji: "🥦", name: "Grillade grönsaker & halloumi",
    sub: "Aubergine, paprika, bönbiffar",
    sym: { "Grönsaker": 26, "Buffémat": 6 },
    cat2: { "Rosévin": 12, "Rött vin": 10, "Vitt vin": 8 },
    c3: { "Rosé": 10, "Fruktigt & Smakrikt": 8, "Mjukt & Bärigt": 6 },
    clocks: { cb: [4, 9], cr: [0, 6] },
    grapes: ["grenache", "syrah", "vermentino"],
    why: "Grillyta ger sötma och rök — fruktiga viner med mjuka tanniner eller en smakrik rosé hänger med utan att ta över." },

  /* ── Asiatiskt & kryddstarkt ── */
  { id: "thai", grp: "Asiatiskt & kryddstarkt", emoji: "🌶️", name: "Thai & kryddstarkt",
    sub: "Curry, wok, vietnamesiskt",
    sym: { "Kryddstarkt": 30, "Asiatiskt": 20 },
    cat2: { "Vitt vin": 18, "Rosévin": 8 },
    c3: { "Druvigt & Blommigt": 14, "Friskt & Fruktigt": 8, "Halvtorrt vitt": 10 },
    clocks: { cb: [3, 8], cs: [2, 8], cr: [0, 3] },
    grapes: ["riesling", "gewürztraminer", "pinot gris"],
    why: "Chilihetta förstärks av tanniner och alkohol men dämpas av sötma — aromatiska vita med en gnutta restsötma är räddningen." },

  { id: "indiskt", grp: "Asiatiskt & kryddstarkt", emoji: "🍛", name: "Indiskt & currygrytor",
    sub: "Tikka masala, korma, dal",
    sym: { "Kryddstarkt": 24, "Asiatiskt": 16, "Fågel": 6 },
    cat2: { "Vitt vin": 14, "Rosévin": 10, "Rött vin": 4 },
    c3: { "Druvigt & Blommigt": 12, "Halvtorrt vitt": 8, "Rosé": 6 },
    clocks: { cb: [4, 9], cs: [2, 8], cr: [0, 4] },
    grapes: ["riesling", "gewürztraminer", "viognier"],
    why: "Krämiga, kryddiga såser vill ha aromatik och frukt — blommiga vita eller en fruktig rosé kyler ner och lyfter kryddorna." },

  { id: "taco", grp: "Asiatiskt & kryddstarkt", emoji: "🌮", name: "Taco & tex-mex",
    sub: "Fajitas, chili con carne, quesadillas",
    sym: { "Nöt": 12, "Kryddstarkt": 12, "Buffémat": 10 },
    cat2: { "Rött vin": 14, "Rosévin": 8 },
    c3: { "Fruktigt & Smakrikt": 10, "Mjukt & Bärigt": 10 },
    clocks: { cb: [5, 9], cr: [2, 6] },
    grapes: ["zinfandel", "malbec", "garnacha"],
    why: "Fredagsmyset behöver bärig frukt och mjuka tanniner — kryddan i maten gör att stram strävhet slår fel." },

  /* ── Ost & dessert ── */
  { id: "ostbricka", grp: "Ost & dessert", emoji: "🧀", name: "Ostbricka",
    sub: "Lagrade hårdostar, brie, marmelad",
    sym: { "Ost": 30, "Sällskapsdryck": 6 },
    cat2: { "Starkvin": 14, "Vitt vin": 10, "Rött vin": 8 },
    c3: { "Fylligt & Smakrikt": 8, "Sherry & Montilla": 8, "Portvin": 6 },
    clocks: { cb: [6, 12] },
    grapes: ["chardonnay", "tempranillo"],
    why: "Lagrad ost har sälta och umami som älskar både fylliga viner och nötiga starkviner — våga prova en torr sherry." },

  { id: "blamogel", grp: "Ost & dessert", emoji: "🫐", name: "Blåmögelost & dessertost",
    sub: "Roquefort, gorgonzola, stilton",
    sym: { "Ost": 24, "Dessert": 16 },
    cat2: { "Starkvin": 18, "Vitt vin": 6 },
    c3: { "Sött": 14, "Portvin": 12 },
    clocks: { cs: [6, 12], cb: [7, 12] },
    grapes: ["sémillon", "riesling", "muscat"],
    why: "Salt möter sött — den klassiska kontrasten. Portvin till stilton och sauternes till roquefort är tidlösa par." },

  { id: "choklad", grp: "Ost & dessert", emoji: "🍫", name: "Chokladdessert",
    sub: "Fondant, mousse, tryffel",
    sym: { "Dessert": 30 },
    cat2: { "Starkvin": 18, "Rött vin": 4 },
    c3: { "Sött": 14, "Portvin": 14 },
    clocks: { cs: [7, 12], cb: [8, 12] },
    grapes: ["touriga nacional", "muscat", "garnacha"],
    why: "Choklad är intensivt och sött — vinet måste vara minst lika sött och kraftigt, annars smakar det surt. Portvin är kungen här." },

  { id: "fruktdessert", grp: "Ost & dessert", emoji: "🥧", name: "Fruktiga desserter",
    sub: "Äppelpaj, citronmaräng, pannacotta med bär",
    sym: { "Dessert": 30 },
    cat2: { "Starkvin": 10, "Vitt vin": 10, "Mousserande vin": 10 },
    c3: { "Sött": 14 },
    clocks: { cs: [5, 12], cf: [5, 12] },
    grapes: ["riesling", "muscat", "chenin blanc"],
    why: "Frukt- och bärdesserter vill ha söta viner med hög syra som ekar desserten — sen skörd-riesling eller en söt mousserande." },

  /* ── Fest & fördrink ── */
  { id: "fordrink", grp: "Fest & fördrink", emoji: "🥂", name: "Fördrink & skål",
    sub: "Aperitif, mingel, nyår",
    sym: { "Aperitif": 26, "Sällskapsdryck": 14 },
    cat2: { "Mousserande vin": 22, "Vitt vin": 6, "Aperitifer": 8, "Vermouth": 6 },
    c3: {},
    clocks: { cs: [0, 4], cf: [7, 12] },
    grapes: ["chardonnay", "pinot noir", "glera"],
    why: "Fördrinken ska väcka aptiten, inte mätta — torrt bubbel med hög syra och fina bubblor är det givna valet." },

  { id: "buffe", grp: "Fest & fördrink", emoji: "🎉", name: "Buffé & plockmat",
    sub: "Många rätter, många smaker",
    sym: { "Buffémat": 26, "Sällskapsdryck": 14 },
    cat2: { "Rosévin": 10, "Vitt vin": 10, "Rött vin": 8, "Mousserande vin": 8 },
    c3: { "Friskt & Fruktigt": 8, "Mjukt & Bärigt": 8, "Rosé": 8 },
    clocks: { cb: [4, 9], cr: [0, 6] },
    grapes: [],
    why: "En buffé spretar åt alla håll — välj flexibla allroundviner: friska vita, torr rosé eller bäriga röda med mjuka tanniner." },
];

const DISH_GROUPS = [...new Set(DISHES.map(d => d.grp))];

/* ──────────────────────────────────────────────
   Parningsmotorn
   ────────────────────────────────────────────── */
function clockScore(val, range) {
  if (val == null) return 0;
  const [lo, hi] = range;
  if (val >= lo && val <= hi) return 4;
  const dist = val < lo ? lo - val : val - hi;
  return Math.max(-8, -2 * dist);
}

function scoreWine(wine, dish) {
  let score = 0;
  let symHit = false;

  for (const [sym, weight] of Object.entries(dish.sym)) {
    if (wine.sym.includes(sym)) { score += weight; symHit = true; }
  }

  const catBonus = dish.cat2[wine.c2];
  if (catBonus) score += catBonus;

  // Vintyper som inte alls nämns för rätten är nästan alltid fel val
  if (catBonus == null && !symHit) return -Infinity;

  if (dish.c3[wine.c3]) score += dish.c3[wine.c3];

  if (dish.clocks) {
    for (const [key, range] of Object.entries(dish.clocks)) {
      score += clockScore(wine[key], range);
    }
  }

  if (dish.grapes && dish.grapes.length && wine.g.length) {
    const lower = wine.g.map(g => g.toLowerCase());
    if (dish.grapes.some(dg => lower.some(wg => wg.includes(dg)))) score += 6;
  }

  // Halvflaskor och miniformat ska inte toppa listan före helflaskor
  if (wine.vol < 500) score -= 3;

  return score;
}

function pairWines(dish, filters) {
  const scored = [];
  for (const w of WINES) {
    if (!passesFilters(w, filters)) continue;
    const s = scoreWine(w, dish);
    if (s > 10) scored.push({ w, s });
  }
  scored.sort((a, b) => b.s - a.s || a.w.p - b.w.p);
  // Samma vin kan finnas i flera format (flaska, box, halvflaska) —
  // visa bara det bäst rankade formatet per artikelnummer
  const seen = new Set();
  return scored.filter(r => seen.has(r.w.nrs) ? false : (seen.add(r.w.nrs), true));
}

function passesFilters(w, f) {
  if (f.cat2 && f.cat2 !== "Alla" && w.c2 !== f.cat2) return false;
  if (f.maxPrice && w.p > f.maxPrice) return false;
  if (f.eko && !w.eko) return false;
  return true;
}

/* ──────────────────────────────────────────────
   Hjälpare & format
   ────────────────────────────────────────────── */
const $ = sel => document.querySelector(sel);
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

const CAT_COLORS = {
  "Rött vin": "röd", "Vitt vin": "vit", "Rosévin": "rosé", "Mousserande vin": "bubbel",
  "Starkvin": "stark", "Sake": "sake", "Aperitifer": "stark", "Vermouth": "stark",
  "Glögg och Glühwein": "stark", "Smaksatt vin & fruktvin": "rosé", "Drycker av flera typer": "vit",
};

function sbUrl(w) {
  return `https://www.systembolaget.se/produkt/vin/${w.slug}-${w.nr}/`;
}

function fmtPrice(p) {
  return p % 1 === 0 ? `${p}:-` : `${p.toFixed(2).replace(".", ":")}`;
}

function fmtVol(v) {
  return v >= 1000 ? `${(v / 1000).toLocaleString("sv-SE")} l` : `${v} ml`;
}

function clockBars(w) {
  const isRed = w.c2 === "Rött vin";
  const rows = isRed
    ? [["Fyllighet", w.cb], ["Strävhet", w.cr], ["Fruktsyra", w.cf]]
    : [["Fyllighet", w.cb], ["Fruktsyra", w.cf], ["Sötma", w.cs]];
  const usable = rows.filter(([, v]) => v != null);
  if (!usable.length) return "";
  return `<div class="clocks">` + usable.map(([label, v]) => `
    <div class="clock">
      <span class="clock-label">${label}</span>
      <span class="clock-track"><span class="clock-fill" style="width:${Math.round(v / 12 * 100)}%"></span></span>
      <span class="clock-val">${v}</span>
    </div>`).join("") + `</div>`;
}

function wineCard(w, dish) {
  const colorClass = CAT_COLORS[w.c2] || "vit";
  const origin = [w.co, w.o1, w.o2].filter(Boolean).join(" · ");
  const grapes = w.g.length ? w.g.join(", ") : "";
  const matched = dish ? w.sym.filter(s => dish.sym[s]) : [];
  const symChips = w.sym.map(s =>
    `<span class="chip${matched.includes(s) ? " chip-hit" : ""}">${esc(s)}</span>`).join("");
  return `
  <article class="card">
    <div class="card-head">
      <span class="dot dot-${colorClass}" title="${esc(w.c2)}"></span>
      <div class="card-title">
        <h3>${esc(w.n)}${w.v ? ` <span class="vintage">${w.v}</span>` : ""}</h3>
        <div class="card-meta">${esc(w.c3 || w.c2)}${origin ? ` · ${esc(origin)}` : ""}</div>
      </div>
      <div class="card-price">
        <div class="price">${fmtPrice(w.p)}</div>
        <div class="vol">${fmtVol(w.vol)} · ${w.alc}%</div>
      </div>
    </div>
    ${grapes ? `<div class="grapes">🍇 ${esc(grapes)}</div>` : ""}
    ${w.t ? `<p class="taste">${esc(w.t)}</p>` : ""}
    ${clockBars(w)}
    <div class="chips">${symChips}${w.eko ? `<span class="chip chip-eko">Eko</span>` : ""}</div>
    <div class="card-foot">
      <span class="artnr">Nr ${esc(w.nrs)}</span>
      <a class="sb-link" href="${sbUrl(w)}" target="_blank" rel="noopener">Visa på Systembolaget ↗</a>
    </div>
  </article>`;
}

/* ──────────────────────────────────────────────
   Vy: Para (rätt → vin)
   ────────────────────────────────────────────── */
const state = {
  view: "para",
  dish: null,
  shown: 9,
  filters: { cat2: "Alla", maxPrice: 0, eko: false },
  search: "",
  exploreCat: "Alla",
  exploreShown: 15,
};

const PRICE_STEPS = [0, 100, 150, 200, 300, 500];

function filterBar(prefix) {
  const f = state.filters;
  const cats = ["Alla", "Rött vin", "Vitt vin", "Rosévin", "Mousserande vin", "Starkvin"];
  return `
  <div class="filterbar">
    <div class="filter-row">
      ${cats.map(c => `<button class="fchip${f.cat2 === c ? " active" : ""}" data-fcat="${c}">${c === "Alla" ? "Alla typer" : c}</button>`).join("")}
    </div>
    <div class="filter-row">
      ${PRICE_STEPS.map(p => `<button class="fchip${f.maxPrice === p ? " active" : ""}" data-fprice="${p}">${p === 0 ? "Alla priser" : `Max ${p}:-`}</button>`).join("")}
      <button class="fchip${f.eko ? " active" : ""}" data-feko="1">🌱 Ekologiskt</button>
    </div>
  </div>`;
}

function renderPara() {
  const main = $("#main");
  if (!state.dish) {
    let groups = "";
    for (const grp of DISH_GROUPS) {
      const dishes = DISHES.filter(d => d.grp === grp);
      groups += `
      <section class="dish-group">
        <h2>${esc(grp)}</h2>
        <div class="dish-grid">
          ${dishes.map(d => `
          <button class="dish" data-dish="${d.id}">
            <span class="dish-emoji">${d.emoji}</span>
            <span class="dish-name">${esc(d.name)}</span>
            <span class="dish-sub">${esc(d.sub)}</span>
          </button>`).join("")}
        </div>
      </section>`;
    }
    main.innerHTML = `
    <div class="hero">
      <h1>Vad ska du äta?</h1>
      <p>Välj rätt så föreslår vi viner ur Systembolagets fasta sortiment — baserat på deras egna smakklockor och matsymboler.</p>
    </div>
    ${groups}`;
    main.querySelectorAll("[data-dish]").forEach(btn =>
      btn.addEventListener("click", () => {
        state.dish = DISHES.find(d => d.id === btn.dataset.dish);
        state.shown = 9;
        renderPara();
        window.scrollTo({ top: 0 });
      }));
    return;
  }

  const dish = state.dish;
  const results = pairWines(dish, state.filters);
  const visible = results.slice(0, state.shown);

  main.innerHTML = `
  <div class="result-head">
    <button class="back" id="backBtn">← Alla rätter</button>
    <div class="result-dish">
      <span class="result-emoji">${dish.emoji}</span>
      <div>
        <h1>${esc(dish.name)}</h1>
        <p class="why">${esc(dish.why)}</p>
      </div>
    </div>
  </div>
  ${filterBar("para")}
  <div class="result-count">${results.length} viner matchar${results.length ? ` — bäst match först` : ""}</div>
  <div class="cards">
    ${visible.map(r => wineCard(r.w, dish)).join("")}
  </div>
  ${results.length > state.shown ? `<button class="more" id="moreBtn">Visa fler (${results.length - state.shown} kvar)</button>` : ""}
  ${!results.length ? `<div class="empty">Inga viner matchar filtren. Prova att höja maxpriset eller släppa på typfiltret.</div>` : ""}`;

  $("#backBtn").addEventListener("click", () => { state.dish = null; renderPara(); window.scrollTo({ top: 0 }); });
  const moreBtn = $("#moreBtn");
  if (moreBtn) moreBtn.addEventListener("click", () => { state.shown += 9; renderPara(); });
  bindFilterBar(main, renderPara);
}

function bindFilterBar(root, rerender) {
  root.querySelectorAll("[data-fcat]").forEach(b => b.addEventListener("click", () => {
    state.filters.cat2 = b.dataset.fcat; rerender();
  }));
  root.querySelectorAll("[data-fprice]").forEach(b => b.addEventListener("click", () => {
    state.filters.maxPrice = Number(b.dataset.fprice); rerender();
  }));
  root.querySelectorAll("[data-feko]").forEach(b => b.addEventListener("click", () => {
    state.filters.eko = !state.filters.eko; rerender();
  }));
}

/* ──────────────────────────────────────────────
   Vy: Utforska (sök & bläddra)
   ────────────────────────────────────────────── */
function renderUtforska() {
  const main = $("#main");
  const q = state.search.trim().toLowerCase();
  let list = WINES.filter(w => passesFilters(w, state.filters));
  if (q) {
    list = list.filter(w =>
      w.n.toLowerCase().includes(q) ||
      (w.co || "").toLowerCase().includes(q) ||
      (w.o1 || "").toLowerCase().includes(q) ||
      (w.o2 || "").toLowerCase().includes(q) ||
      (w.c3 || "").toLowerCase().includes(q) ||
      w.g.some(g => g.toLowerCase().includes(q)) ||
      String(w.nrs).includes(q));
  }
  list.sort((a, b) => a.p - b.p);
  const visible = list.slice(0, state.exploreShown);

  main.innerHTML = `
  <div class="hero">
    <h1>Utforska sortimentet</h1>
    <p>${WINES.length} viner ur fasta sortimentet. Sök på namn, druva, land eller artikelnummer.</p>
  </div>
  <input type="search" class="search" id="searchInput" placeholder="Sök… t.ex. riesling, rioja, 7671" value="${esc(state.search)}">
  ${filterBar("utforska")}
  <div class="result-count">${list.length} viner — billigast först</div>
  <div class="cards">${visible.map(w => wineCard(w, null)).join("")}</div>
  ${list.length > state.exploreShown ? `<button class="more" id="moreBtn">Visa fler (${list.length - state.exploreShown} kvar)</button>` : ""}
  ${!list.length ? `<div class="empty">Inget matchade sökningen.</div>` : ""}`;

  const input = $("#searchInput");
  input.addEventListener("input", () => {
    state.search = input.value;
    state.exploreShown = 15;
    clearTimeout(input._t);
    input._t = setTimeout(() => {
      const pos = input.selectionStart;
      renderUtforska();
      const ni = $("#searchInput");
      ni.focus();
      ni.setSelectionRange(pos, pos);
    }, 250);
  });
  const moreBtn = $("#moreBtn");
  if (moreBtn) moreBtn.addEventListener("click", () => { state.exploreShown += 15; renderUtforska(); });
  bindFilterBar(main, renderUtforska);
}

/* ──────────────────────────────────────────────
   Vy: Om
   ────────────────────────────────────────────── */
function renderOm() {
  $("#main").innerHTML = `
  <div class="hero"><h1>Om VINPAR</h1></div>
  <div class="prose">
    <p><strong>VINPAR</strong> hjälper dig hitta rätt vin till maten — och föreslår bara viner
    som faktiskt går att köpa: allt kommer ur <strong>Systembolagets fasta sortiment</strong>,
    alltså de varor som normalt finns i butik.</p>
    <h2>Så funkar parningen</h2>
    <p>Motorn bygger på Systembolagets egen produktdata:</p>
    <ul>
      <li><strong>Matsymboler</strong> — Systembolagets egna rekommendationer (nöt, lamm, fisk, skaldjur, kryddstarkt …)</li>
      <li><strong>Smakklockor</strong> — fyllighet, strävhet, fruktsyra och sötma på skalan 0–12</li>
      <li><strong>Stilkategorier</strong> — t.ex. "Kryddigt & Mustigt" eller "Friskt & Fruktigt"</li>
      <li><strong>Druvor</strong> — klassiska kombinationer som Pinot Noir till anka ger extra poäng</li>
    </ul>
    <p>Varje rätt beskriver vad den kräver av vinet, och alla viner poängsätts mot kraven.
    Högst poäng hamnar överst.</p>
    <h2>Om datat</h2>
    <p>Sortimentsdatat är en ögonblicksbild (juli 2026) av Systembolagets fasta sortiment
    — priser, årgångar och tillgänglighet kan ha ändrats. Kontrollera alltid aktuell information
    på <a href="https://www.systembolaget.se" target="_blank" rel="noopener">systembolaget.se</a>,
    där du också ser lagerstatus i din butik. Appen är fristående och har ingen koppling till Systembolaget.</p>
    <h2>Ansvarsfullt</h2>
    <p>Alkohol är beroendeframkallande och säljs endast till dig som fyllt 20 år.
    Läs mer på <a href="https://www.iq.se" target="_blank" rel="noopener">IQ.se</a>.</p>
  </div>`;
}

/* ──────────────────────────────────────────────
   Navigering & start
   ────────────────────────────────────────────── */
const VIEWS = { para: renderPara, utforska: renderUtforska, om: renderOm };

document.querySelectorAll(".nav-btn").forEach(btn =>
  btn.addEventListener("click", () => {
    document.querySelectorAll(".nav-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    state.view = btn.dataset.view;
    VIEWS[state.view]();
    window.scrollTo({ top: 0 });
  }));

renderPara();
