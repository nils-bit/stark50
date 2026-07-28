/* ═══════════════════════════════════════════════════════
   STARK50 — Hälsa & styrka efter 50
   All data sparas lokalt i webbläsaren (localStorage).
   ═══════════════════════════════════════════════════════ */

"use strict";

/* ─────────────── DATA: LIVSMEDEL (per portion) ─────────────── */
const FOODS = [
  { n: "Havregrynsgröt med mjölk", kcal: 280, p: 11, c: "frukost" },
  { n: "2 ägg + 2 knäckebröd", kcal: 330, p: 18, c: "frukost" },
  { n: "Fil med müsli & bär", kcal: 310, p: 12, c: "frukost" },
  { n: "Proteinpannkakor", kcal: 350, p: 28, c: "frukost" },
  { n: "Smörgås ost & skinka", kcal: 250, p: 12, c: "frukost" },
  { n: "Kvarg med bär (250 g)", kcal: 200, p: 26, c: "frukost" },
  { n: "Ägg (1 st)", kcal: 75, p: 7, c: "frukost" },
  { n: "Grillad kyckling med ris & grönsaker", kcal: 550, p: 45, c: "lunch" },
  { n: "Laxfilé med potatis", kcal: 560, p: 38, c: "lunch" },
  { n: "Köttbullar med potatismos", kcal: 650, p: 30, c: "lunch" },
  { n: "Kycklingsallad", kcal: 420, p: 38, c: "lunch" },
  { n: "Pasta med köttfärssås", kcal: 680, p: 32, c: "lunch" },
  { n: "Fiskgratäng", kcal: 520, p: 34, c: "lunch" },
  { n: "Ärtsoppa med fläsk", kcal: 450, p: 26, c: "lunch" },
  { n: "Sushi (10 bitar)", kcal: 480, p: 22, c: "lunch" },
  { n: "Räksmörgås", kcal: 380, p: 24, c: "lunch" },
  { n: "Biff med rotfrukter", kcal: 580, p: 42, c: "middag" },
  { n: "Ugnsbakad torsk med potatis", kcal: 430, p: 40, c: "middag" },
  { n: "Kycklinggryta med ris", kcal: 560, p: 40, c: "middag" },
  { n: "Fläskfilé med klyftpotatis", kcal: 540, p: 44, c: "middag" },
  { n: "Vegetarisk chili med bönor", kcal: 480, p: 22, c: "middag" },
  { n: "Omelett med grönsaker (3 ägg)", kcal: 320, p: 21, c: "middag" },
  { n: "Grillspett med sallad", kcal: 460, p: 38, c: "middag" },
  { n: "Pytt i panna med ägg", kcal: 600, p: 28, c: "middag" },
  { n: "Banan", kcal: 100, p: 1, c: "mellanmål" },
  { n: "Äpple", kcal: 60, p: 0, c: "mellanmål" },
  { n: "Proteinshake", kcal: 160, p: 25, c: "mellanmål" },
  { n: "Proteinbar", kcal: 200, p: 20, c: "mellanmål" },
  { n: "Nötter (30 g)", kcal: 185, p: 6, c: "mellanmål" },
  { n: "Kvarg (150 g)", kcal: 100, p: 17, c: "mellanmål" },
  { n: "Keso (150 g)", kcal: 140, p: 18, c: "mellanmål" },
  { n: "Kokt ägg", kcal: 75, p: 7, c: "mellanmål" },
  { n: "Smörgås med makrill", kcal: 260, p: 14, c: "mellanmål" },
  { n: "Ostbit & några oliver", kcal: 180, p: 9, c: "mellanmål" },
  { n: "Glas mjölk", kcal: 100, p: 8, c: "mellanmål" },
  { n: "Kaffe med mjölk", kcal: 30, p: 2, c: "mellanmål" },
  { n: "Öl (33 cl)", kcal: 140, p: 1, c: "mellanmål" },
  { n: "Glas vin", kcal: 125, p: 0, c: "mellanmål" },
  { n: "Kanelbulle", kcal: 280, p: 5, c: "mellanmål" },
  { n: "Bit mörk choklad (20 g)", kcal: 110, p: 2, c: "mellanmål" },
];

/* ─────────────── DATA: RECEPT ─────────────── */
const RECIPES = [
  { id: "lax-ugn", name: "Ugnsbakad lax med citron & dill", desc: "Omega-3 för hjärta och leder. Klar på 25 minuter.", kcal: 520, p: 40, min: 25, tags: ["högprotein", "hjärtsmart", "snabb"], prot: ["fisk"], color: "#e08a3c",
    ing: ["Laxfilé 150 g/person", "Citron", "Färsk dill", "Kokt potatis", "Crème fraiche light", "Salt & peppar"],
    steps: ["Sätt ugnen på 200°.", "Lägg laxen i en form, pressa över citron, salta och peppra.", "Baka 15–18 min.", "Servera med potatis, dill och en klick crème fraiche."] },
  { id: "kyckling-wok", name: "Snabb kycklingwok med cashew", desc: "Mycket protein, mycket grönsaker, lite disk.", kcal: 540, p: 42, min: 20, tags: ["högprotein", "snabb", "fettförbränning"], prot: ["fågel"], color: "#93ac8f",
    ing: ["Kycklingfilé i strimlor", "Wokgrönsaker", "Cashewnötter", "Soja & ingefära", "Fullkornsris"],
    steps: ["Koka riset.", "Stek kycklingen hårt i het panna.", "Tillsätt grönsaker och woka 3–4 min.", "Rör i soja, ingefära och nötter. Servera."] },
  { id: "biff-rot", name: "Ryggbiff med rostade rotfrukter", desc: "Klassiker med järn och zink — bra för muskler och energi.", kcal: 580, p: 45, min: 40, tags: ["högprotein", "muskelbygge"], prot: ["nötkött"], color: "#c96b52",
    ing: ["Ryggbiff 180 g/person", "Morot, palsternacka, rödbeta", "Olivolja & rosmarin", "Grönsallad"],
    steps: ["Rosta rotfrukterna i ugn 225° i 30 min med olja och rosmarin.", "Stek biffen 2–3 min per sida, låt vila 5 min.", "Servera med sallad."] },
  { id: "torsk-agg", name: "Torsk med äggsås och potatis", desc: "Mager fisk, gammaldags gott. Lätt för magen på kvällen.", kcal: 430, p: 40, min: 30, tags: ["hjärtsmart", "fettförbränning"], prot: ["fisk", "ägg"], color: "#7fa8b8",
    ing: ["Torskrygg", "2 hårdkokta ägg", "Mjölk, smör, mjöl till sås", "Potatis", "Persilja"],
    steps: ["Koka potatis och ägg.", "Pochera torsken i lättsaltat vatten ~8 min.", "Gör en enkel vit sås, hacka i äggen.", "Servera med persilja."] },
  { id: "chili-bonor", name: "Chili med högrev & svarta bönor", desc: "Långkok som ger matlådor hela veckan. Fiber + protein.", kcal: 560, p: 38, min: 90, tags: ["högprotein", "matlåda"], prot: ["nötkött"], color: "#c96b52",
    ing: ["Högrev i bitar", "Svarta bönor", "Krossade tomater", "Lök, vitlök, chili, spiskummin", "Fullkornsris"],
    steps: ["Bryn köttet, tillsätt lök och kryddor.", "Häll på tomater, sjud 60–75 min.", "Rör i bönorna sista 10 min.", "Servera med ris. Frys in resten."] },
  { id: "kvargpannkaka", name: "Proteinpannkakor med bär", desc: "Frukost eller mellanmål — 30 g protein utan pulver.", kcal: 380, p: 30, min: 15, tags: ["högprotein", "frukost", "snabb"], prot: ["ägg", "mejeri"], color: "#e08a3c",
    ing: ["3 ägg", "150 g kvarg", "0,5 dl havregryn", "Blåbär & hallon", "Kanel"],
    steps: ["Mixa ägg, kvarg och havregryn till smet.", "Stek små pannkakor på medelvärme.", "Toppa med bär och kanel."] },
  { id: "kyckling-trad", name: "Hel ugnskyckling med tillbehör", desc: "Söndagsmiddag som ger rester till veckans luncher.", kcal: 600, p: 48, min: 75, tags: ["högprotein", "helg"], prot: ["fågel"], color: "#93ac8f",
    ing: ["Hel kyckling", "Citron & timjan", "Klyftpotatis", "Haricots verts", "Sky eller gräddsås"],
    steps: ["Gnid in kycklingen med olja, salt, timjan. Citron i kaviteten.", "Ugn 180° ca 70 min (innertemp 72°).", "Rosta potatisen sista 40 min.", "Vila fågeln 10 min, servera."] },
  { id: "sill-agg", name: "Sill, ägg & knäckebröd", desc: "Snabbaste omega-3-lunchen som finns. Nordiskt hjärtsmart.", kcal: 420, p: 24, min: 10, tags: ["hjärtsmart", "snabb"], prot: ["fisk", "ägg"], color: "#7fa8b8",
    ing: ["Inlagd sill", "2 kokta ägg", "Knäckebröd", "Gräslök", "Lättcrème fraiche"],
    steps: ["Koka äggen.", "Lägg upp sill, ägg och knäcke.", "Toppa med gräslök."] },
  { id: "linssoppa", name: "Värmande linssoppa med bacon", desc: "Fiber som håller blodsockret jämnt — och mätt länge.", kcal: 440, p: 24, min: 35, tags: ["fettförbränning", "matlåda"], prot: ["fläsk"], color: "#93ac8f",
    ing: ["Röda linser", "Bacon i tärningar", "Morot & lök", "Buljong & tomatpuré", "Spiskummin"],
    steps: ["Fräs bacon, lök och morot.", "Tillsätt linser, buljong och kryddor.", "Sjud 20 min. Mixa grovt om du vill."] },
  { id: "flaskfile", name: "Fläskfilé med svampsås", desc: "Mager gris + krämig sås utan att kalorierna sticker iväg.", kcal: 520, p: 44, min: 35, tags: ["högprotein", "muskelbygge"], prot: ["fläsk"], color: "#c96b52",
    ing: ["Fläskfilé", "Champinjoner", "Matlagningsgrädde light", "Soja & timjan", "Ris eller potatis"],
    steps: ["Stek filén hel, ca 4 min per sida, eftersteka i ugn 150° till 65°.", "Stek svampen, häll på grädde och soja, sjud ihop.", "Skiva köttet och servera."] },
  { id: "tonfisksallad", name: "Tonfisksallad med vita bönor", desc: "Ingen spis. Fem minuter. 35 gram protein.", kcal: 390, p: 35, min: 5, tags: ["snabb", "fettförbränning", "högprotein"], prot: ["fisk"], color: "#7fa8b8",
    ing: ["Tonfisk i vatten", "Vita bönor", "Rödlök & tomat", "Olivolja & citron", "Rucola"],
    steps: ["Skölj bönorna.", "Blanda allt i en skål.", "Ringla över olja och citron."] },
  { id: "kottfarssas", name: "Köttfärssås på fullkornspasta", desc: "Vardagsklassikern — med smygrivna morötter för fibrerna.", kcal: 620, p: 34, min: 30, tags: ["vardag", "matlåda"], prot: ["nötkött"], color: "#c96b52",
    ing: ["Nötfärs 10 %", "Krossade tomater", "Riven morot & lök", "Fullkornspasta", "Parmesan"],
    steps: ["Bryn färsen med lök.", "Tillsätt morot, tomater, kryddor. Sjud 15 min.", "Koka pastan. Riv över ost."] },
  { id: "gronsaksomelett", name: "Omelett med spenat & fetaost", desc: "Kvällsmat som inte stör sömnen. Lätt och snabb.", kcal: 340, p: 22, min: 12, tags: ["snabb", "kvällsmat", "fettförbränning"], prot: ["ägg", "mejeri", "vego"], color: "#93ac8f",
    ing: ["3 ägg", "Spenat", "Fetaost", "Tomat", "Smör"],
    steps: ["Vispa äggen.", "Fräs spenaten, häll på äggen.", "Smula över feta, låt stelna på svag värme."] },
  { id: "raggmunk", name: "Raggmunk med fläsk & lingon", desc: "Helgbelöning. Allt behöver inte vara nyttigt — bara medvetet.", kcal: 680, p: 26, min: 30, tags: ["helg", "vardag"], prot: ["fläsk"], color: "#e08a3c",
    ing: ["Potatis", "Mjöl, mjölk, ägg", "Rimmat fläsk", "Rårörda lingon"],
    steps: ["Gör smet, riv i potatisen.", "Stek fläsket knaprigt.", "Grädda tunna raggmunkar i fläskfettet.", "Servera med lingon."] },
  { id: "halloumigryta", name: "Halloumigryta med linser", desc: "Vegetariskt som mättar en karl. Klar i en kastrull.", kcal: 510, p: 26, min: 25, tags: ["snabb", "matlåda"], prot: ["vego", "mejeri"], color: "#93ac8f",
    ing: ["Halloumi i tärningar", "Röda linser", "Krossade tomater", "Spenat", "Vitlök & paprikapulver", "Ris eller bulgur"],
    steps: ["Fräs vitlöken, tillsätt linser, tomater och kryddor.", "Sjud 15 min.", "Stek halloumin gyllene, vänd ner med spenaten.", "Servera med ris."] },
  { id: "kalkonbiffar", name: "Kalkonbiffar med tzatziki", desc: "Magrare än nötfärs, lika mycket protein. Grillvänligt.", kcal: 470, p: 42, min: 25, tags: ["högprotein", "fettförbränning"], prot: ["fågel"], color: "#e08a3c",
    ing: ["Kalkonfärs", "Ägg & ströbröd", "Gurka, yoghurt, vitlök till tzatziki", "Klyftpotatis", "Citron"],
    steps: ["Blanda färsen med ägg, ströbröd och kryddor. Forma biffar.", "Stek eller grilla 4–5 min per sida.", "Rör ihop tzatzikin.", "Servera med potatis och citron."] },
  { id: "kycklingpasta", name: "Krämig kycklingpasta med soltorkad tomat", desc: "Vardagsräddaren när alla är hungriga nu.", kcal: 640, p: 44, min: 20, tags: ["högprotein", "snabb", "vardag"], prot: ["fågel", "mejeri"], color: "#c96b52",
    ing: ["Kycklingfilé", "Fullkornspasta", "Matlagningsgrädde light", "Soltorkade tomater", "Babyspenat", "Parmesan"],
    steps: ["Koka pastan.", "Stek kycklingen i bitar.", "Tillsätt grädde och tomater, sjud 5 min.", "Vänd ner spenat och pasta. Riv över ost."] },
  { id: "bonbiffar", name: "Bönbiffar med rostad potatis", desc: "Växtbaserat med rejäl konsistens — bra för hjärtat och plånboken.", kcal: 450, p: 20, min: 35, tags: ["hjärtsmart", "matlåda"], prot: ["vego"], color: "#7fa8b8",
    ing: ["Kidneybönor", "Havregryn & ägg (eller aquafaba)", "Lök & spiskummin", "Potatis", "Yoghurtsås"],
    steps: ["Rosta potatisen i ugn 225°.", "Mixa bönorna grovt med lök, gryn och kryddor. Forma biffar.", "Stek 3–4 min per sida.", "Servera med sås."] },
  { id: "fiskgratang", name: "Fiskgratäng med räkor & dill", desc: "Fredagsklass på vardagsfisk. Går utmärkt att frysa.", kcal: 540, p: 42, min: 45, tags: ["högprotein", "helg"], prot: ["fisk", "mejeri"], color: "#7fa8b8",
    ing: ["Torsk eller sej", "Räkor", "Crème fraiche & dill", "Riven ost", "Potatismos"],
    steps: ["Lägg fisken i smord form, salta.", "Blanda crème fraiche, dill och räkor — bred över.", "Toppa med ost, grädda 200° i 25 min.", "Servera med mos."] },
];

/* ─────────────── DATA: ENHETER ─────────────── */
const DEVICES = [
  { id: "apple-health", name: "Apple Health", ico: "❤️" },
  { id: "apple-watch", name: "Apple Watch", ico: "⌚" },
  { id: "oura", name: "Oura Ring", ico: "💍" },
  { id: "garmin", name: "Garmin", ico: "🧭" },
  { id: "polar", name: "Polar", ico: "🐻‍❄️" },
  { id: "fitbit", name: "Fitbit", ico: "📟" },
];
const PREF_OPTS = [
  { id: "fisk", label: "Fisk & skaldjur" },
  { id: "fågel", label: "Kyckling & kalkon" },
  { id: "nötkött", label: "Rött kött" },
  { id: "fläsk", label: "Fläsk" },
  { id: "ägg", label: "Ägg" },
  { id: "mejeri", label: "Mejeri" },
];

/* ─────────────── DATA: PASSMALLAR PER MÅL ─────────────── */
const TEMPLATES = {
  muskler: [
    { name: "Pass A — Överkropp press", focus: "Bröst · Axlar · Triceps", exercises: [
      { name: "Hantelpress på bänk", sets: 4, reps: "8–10" },
      { name: "Axelpress sittande", sets: 3, reps: "8–10" },
      { name: "Hantellyft åt sidan", sets: 3, reps: "12" },
      { name: "Triceps pushdown", sets: 3, reps: "10–12" },
      { name: "Plankan", sets: 3, reps: "40 sek" } ] },
    { name: "Pass B — Ben & bål", focus: "Ben · Säte · Core", exercises: [
      { name: "Goblet squat", sets: 4, reps: "8–10" },
      { name: "Rumänska marklyft", sets: 3, reps: "8–10" },
      { name: "Utfallssteg", sets: 3, reps: "10/ben" },
      { name: "Vadpress", sets: 3, reps: "15" },
      { name: "Sidoplanka", sets: 3, reps: "30 sek/sida" } ] },
    { name: "Pass C — Överkropp drag", focus: "Rygg · Biceps", exercises: [
      { name: "Latsdrag", sets: 4, reps: "8–10" },
      { name: "Sittande rodd", sets: 3, reps: "10" },
      { name: "Hantelrodd", sets: 3, reps: "10/arm" },
      { name: "Bicepscurl", sets: 3, reps: "10–12" },
      { name: "Face pulls", sets: 3, reps: "15" } ] },
  ],
  fett: [
    { name: "Cirkelpass helkropp", focus: "Puls + styrka, korta vilor", exercises: [
      { name: "Goblet squat", sets: 3, reps: "12" },
      { name: "Armhävningar (ev. på knä)", sets: 3, reps: "10–15" },
      { name: "Rodd med gummiband/kabel", sets: 3, reps: "12" },
      { name: "Step-ups på bänk", sets: 3, reps: "10/ben" },
      { name: "Mountain climbers", sets: 3, reps: "30 sek" } ] },
    { name: "Intervaller — gå/jogga", focus: "Kondition, skonsam", exercises: [
      { name: "Uppvärmning rask gång", sets: 1, reps: "5 min" },
      { name: "Rask gång/jogg i backe", sets: 6, reps: "1 min" },
      { name: "Lugn gång mellan", sets: 6, reps: "90 sek" },
      { name: "Nedvarvning", sets: 1, reps: "5 min" } ] },
    { name: "Styrka bas", focus: "Behåll muskler under viktnedgång", exercises: [
      { name: "Marklyft med hantlar", sets: 3, reps: "8" },
      { name: "Hantelpress på bänk", sets: 3, reps: "8–10" },
      { name: "Latsdrag", sets: 3, reps: "10" },
      { name: "Plankan", sets: 3, reps: "40 sek" } ] },
  ],
  halsa: [
    { name: "Helkropp styrka", focus: "Styrka för vardagen", exercises: [
      { name: "Goblet squat", sets: 3, reps: "10" },
      { name: "Hantelpress", sets: 3, reps: "10" },
      { name: "Sittande rodd", sets: 3, reps: "10" },
      { name: "Rumänska marklyft", sets: 2, reps: "10" },
      { name: "Plankan", sets: 2, reps: "30 sek" } ] },
    { name: "Rörlighet & core", focus: "Leder · Balans · Rygg", exercises: [
      { name: "Katt–ko", sets: 2, reps: "10" },
      { name: "Höftöppnare (utfall + rotation)", sets: 2, reps: "8/sida" },
      { name: "Fågelhunden", sets: 3, reps: "8/sida" },
      { name: "Balans på ett ben", sets: 3, reps: "30 sek/ben" },
      { name: "Bröstryggsrotation", sets: 2, reps: "10/sida" } ] },
    { name: "Kondition — valfritt", focus: "Puls i samtalstempo", exercises: [
      { name: "Rask promenad / cykel / simning", sets: 1, reps: "30–40 min" } ] },
  ],
};

const GOAL_META = {
  muskler: { label: "Bygga muskler", tag: "Hypertrofi", ico: "▲", kcalAdj: 250, protein: 1.8,
    desc: "Styrketräning med fokus på muskeltillväxt. Efter 50 tappar vi 1–2 % muskelmassa per år om vi inte tränar — det här vänder kurvan." },
  fett: { label: "Fettförbränning", tag: "Deffa smart", ico: "◆", kcalAdj: -400, protein: 2.0,
    desc: "Måttligt kaloriunderskott, högt protein och rörelse varje dag. Hållbart tempo — inga chockdieter." },
  halsa: { label: "Hälsa & ork", tag: "Balans", ico: "❖", kcalAdj: 0, protein: 1.5,
    desc: "Starkare, rörligare och piggare i vardagen. Styrka, kondition och återhämtning i lagom dos." },
};

/* ─────────────── TRÄNINGSINRIKTNING ───────────────
   `goal` ovan styr KOSTEN (kalorier och protein). `discipline` här styr
   TRÄNINGEN. Det är två olika frågor som tidigare delade nyckel — man kan
   mycket väl köra Hyrox i kaloriunderskott. "allman" betyder uttryckligen
   "slå upp passmallar på goal som förut", så befintliga användare får
   oförändrat beteende. */
const DISC_META = {
  allman: {
    label: "Allmän hälsa & styrka", tag: "Balanserat", ico: "❖",
    desc: "Styrka, kondition och rörlighet i lagom dos — byggt för att du ska må bra i vardagen och hålla i trettio år till. Inga tävlingsmoment.",
    reality: "3 pass i veckan räcker gott.",
  },
  styrka: {
    label: "Styrka & powerlifting", tag: "Tunga lyft", ico: "▲",
    desc: "Knäböj, bänkpress och marklyft som grund, med accessoarer runt omkring. Låga reps, tunga vikter och gott om vila mellan seten.",
    reality: "Bäst dokumenterade träningen för muskelmassa och bentäthet efter 50 — men den kräver att du tar tekniken på allvar.",
  },
  hyrox: {
    label: "Hyrox & hybridträning", tag: "Löpning + stationer", ico: "◆",
    desc: "8 × 1 km löpning varvat med släde, rodd, ski erg, farmers carry, wall balls och lunges. Vi tränar både momenten och konsten att springa på trötta ben.",
    reality: "Har egna åldersklasser och låg teknisk tröskel. Löpvolymen är den nya belastningen — appen ökar den varannan vecka, inte varje.",
  },
};

/* Startpass per inriktning. `allman` saknas medvetet — den faller tillbaka på
   TEMPLATES[goal] via templatesFor(), vilket bevarar dagens beteende exakt. */
const DISC_TEMPLATES = {
  styrka: [
    { name: "Pass A — Knäböj", focus: "Ben · Bål", exercises: [
      { name: "Knäböj med skivstång", sets: 4, reps: "5" },
      { name: "Rumänska marklyft", sets: 3, reps: "8" },
      { name: "Bulgarian split squat", sets: 3, reps: "8/ben" },
      { name: "Hängande benlyft", sets: 3, reps: "10" },
      { name: "Pallof press", sets: 3, reps: "10/sida" } ] },
    { name: "Pass B — Bänkpress", focus: "Bröst · Axlar · Triceps", exercises: [
      { name: "Bänkpress", sets: 4, reps: "5" },
      { name: "Militärpress", sets: 3, reps: "6–8" },
      { name: "Hantelrodd", sets: 3, reps: "8/arm" },
      { name: "Triceps pushdown", sets: 3, reps: "10–12" },
      { name: "Face pulls", sets: 3, reps: "15" } ] },
    { name: "Pass C — Marklyft", focus: "Rygg · Baksida · Grepp", exercises: [
      { name: "Marklyft", sets: 4, reps: "4–5" },
      { name: "Frontböj", sets: 3, reps: "6" },
      { name: "Latsdrag", sets: 3, reps: "8–10" },
      { name: "Farmers walk", sets: 3, reps: "40 m" },
      { name: "Plankan", sets: 3, reps: "45 sek" } ] },
  ],
  hyrox: [
    { name: "Pass A — Stationer & styrka", focus: "Släde · Bär · Ben", exercises: [
      { name: "Slädpush", sets: 4, reps: "25 m" },
      { name: "Slädpull", sets: 4, reps: "25 m" },
      { name: "Wall balls", sets: 4, reps: "20" },
      { name: "Farmers walk", sets: 3, reps: "50 m" },
      { name: "Sandbag lunges", sets: 3, reps: "20 m" } ] },
    { name: "Pass B — Kompromissad löpning", focus: "Löpning direkt efter station", exercises: [
      { name: "Uppvärmning lugn löpning", sets: 1, reps: "10 min" },
      { name: "Löpning 1 km", sets: 4, reps: "tävlingsfart" },
      { name: "Roddmaskin 500 m", sets: 4, reps: "mellan varje km" },
      { name: "Nedvarvning", sets: 1, reps: "5 min" } ] },
    { name: "Pass C — Erg & bål", focus: "Rodd · Ski erg · Core", exercises: [
      { name: "Roddmaskin — intervaller", sets: 5, reps: "500 m" },
      { name: "Ski erg — intervaller", sets: 5, reps: "500 m" },
      { name: "Burpee broad jumps", sets: 3, reps: "10" },
      { name: "Hängande benlyft", sets: 3, reps: "12" },
      { name: "Sidoplanka", sets: 3, reps: "40 sek/sida" } ] },
  ],
};

/* ─────────────── BLOCKMODELL ───────────────
   Rullande 4-veckorsblock: tre uppbyggande veckor plus en deload. Deloaden är
   inte en viloperiod utan en del av programmet — det är där superkompensationen
   sker, och den blir viktigare ju äldre man är. */
const BLOCK_WEEKS = [
  { n: 1, name: "Uppbyggnad", vol: 1.0, setAdj: 0, rpe: "RPE 7", runVol: 1.0,
    note: "Lägg grunden. Håll ett par repetitioner i tanken på varje set — det ska kännas kontrollerat." },
  { n: 2, name: "Belastning", vol: 1.1, setAdj: 1, rpe: "RPE 8", runVol: 1.1,
    note: "Ett set till per övning. Nu ska det börja kosta, men du ska fortfarande klara alla repetitioner." },
  { n: 3, name: "Topp", vol: 1.0, setAdj: 0, rpe: "RPE 8–9", runVol: 1.1,
    note: "Blockets tyngsta vecka. Gå nära gränsen på sista setet — men aldrig till total utmattning." },
  { n: 4, name: "Deload", vol: 0.55, setAdj: -1, rpe: "RPE 6", runVol: 0.6,
    note: "Halva volymen och lätta vikter. Hoppa inte över den här veckan — det är nu kroppen bygger tillbaka det du slitit ner." },
];
const BLOCK_LEN = BLOCK_WEEKS.length;
const ABSENCE_DAYS = 10; // längre uppehåll än så → blocket ankras om till vecka 1

const RELAX_TIPS = [
  { t: "10 minuter innan skärmen släcks", d: "Lägg mobilen i ett annat rum 30 min före läggdags. Blått ljus trycker ner melatoninet — särskilt känsligt efter 50." },
  { t: "Kaffestopp klockan 14", d: "Koffein har en halveringstid på 5–6 timmar. En kopp kl 16 = en halv kopp i blodet vid midnatt." },
  { t: "Promenad = stresshantering", d: "20 minuter i lugnt tempo sänker kortisolet mätbart. Räknas dubbelt om det är dagsljus." },
  { t: "Skriv av dig", d: "Två minuter innan sömn: skriv ner tre saker som ska göras imorgon. Hjärnan släpper taget när listan finns på papper." },
  { t: "Svalt sovrum", d: "16–18 grader är optimalt. Kroppstemperaturen behöver sjunka för att djupsömnen ska komma igång." },
  { t: "Andas 4-7-8 vid stress", d: "In genom näsan 4 sek, håll 7 sek, ut genom munnen 8 sek. Tre varv aktiverar det parasympatiska nervsystemet." },
  { t: "Alkohol stjäl djupsömn", d: "Ett glas vin somnar man lätt på — men REM-sömnen halveras. Spara det till helgen och märk skillnaden." },
];

/* ─────────────── STATE ─────────────── */
const STORE_KEY = "stark50_v1";

/* Deklareras här men laddas först i init() — normalizeState() slår upp värden i
   tabeller (GOAL_META, PACES …) som deklareras längre ner i filen. */
let state;

function defaultState() {
  return {
    onboarded: false,
    profile: { name: "", age: 52, height: 180, weight: 88, activity: 1.375, trainingDays: 3, goal: "halsa", discipline: "allman", walksPerDay: 1, pace: "medel", targetWeight: null },
    targets: {},
    prefs: { avoid: [], vego: false },
    favs: [],            // favoritmarkerade recept-id:n
    customRecipes: [],   // genererade/egna recept
    body: [],            // kroppsmått: { date, waist, neck, bf }
    workouts: [],
    reminders: { walks: ["10:00", "15:00"], water: true, windDown: "21:30", weighDay: 5, weighTime: "07:30", mealPing: false },
    logs: { meals: {}, walks: [], sessions: [], sleep: [], stress: [], weight: [], water: {}, supps: {}, bp: [] },
    progress: {},        // progressive overload: { "Övning": { weight, full } }
    mealPlan: null,      // { monday, roll, ids[7] middagar, breakfasts[7], lunches[7] }
    dayPlan: null,       // dagens slumpade matsedel { date, seed, items }
    dagsformLog: {},     // { "YYYY-MM-DD": score } — historik för trendgrafen
    genPrefs: null,      // passgeneratorns senaste val { time, eq, focus }
    schedule: { days: {}, time: "17:00", remind: true }, // veckoschema: { 1: "wid" | "auto", ... } (0=sön)
    program: { start: null, block: 1 }, // rullande 4-veckorsblock; start = måndagen blocket började
    aiKey: "",           // egen Anthropic-nyckel för matfoto (ligger bara i din webbläsare)
    aiModel: "claude-opus-5",
    shopping: [],        // [{ t, done }]
    devices: [],         // anslutna enhets-id:n
    deviceData: {},      // { "YYYY-MM-DD": { steps, rhr, sleep } }
    fired: { date: "", keys: [] },
  };
}
/* Yttergränser för profilvärden. Onboardingen och inställningarna är strängare
   (se PROFILE_LIMITS) — det här är bara sanity: utanför dessa blir kaloriberäkningen
   meningslös eller negativ. */
const PROFILE_SANE = { age: [18, 110], height: [100, 250], weight: [30, 300] };
/* Vad man får skriva in i formulären — onboardingen och inställningarna delar dessa */
const PROFILE_LIMITS = { age: [35, 90], height: [140, 220], weight: [45, 220] };
const clampTo = (v, [lo, hi], fallback) => {
  const n = Number(v);
  return Number.isFinite(n) ? Math.min(hi, Math.max(lo, n)) : fallback;
};
/* Set måste vara ett heltal 1–10: Array(3.5) och Array(-2) kastar RangeError */
const clampSets = v => Math.min(10, Math.max(1, Math.round(Number(v)) || 3));

/* Gör ett rått objekt användbart som state: fyller i nycklar som saknas i äldre
   sparningar och ersätter värden som skulle krascha renderingen.
   Anropas från BÅDA vägarna in i state — load() och importen. Att de tidigare
   hade varsin kopia av logiken var orsaken till att en gammal backup kunde låsa
   appen i vit skärm. */
function normalizeState(raw) {
  const d = defaultState();
  const s = Object.assign(d, raw && typeof raw === "object" ? raw : {});

  // Object.assign är ytlig — nya nycklar inuti gamla objekt måste fyllas i här
  s.profile = Object.assign(defaultState().profile, s.profile && typeof s.profile === "object" ? s.profile : {});
  s.schedule = Object.assign({ days: {}, time: "17:00", remind: true }, s.schedule && typeof s.schedule === "object" ? s.schedule : {});
  if (!s.schedule.days || typeof s.schedule.days !== "object") s.schedule.days = {};
  // En sparad logs ersätter hela standardobjektet, så nya loggtyper måste läggas tillbaka
  s.logs = Object.assign(defaultState().logs, s.logs && typeof s.logs === "object" ? s.logs : {});
  for (const k of ["meals", "water", "supps"]) if (!s.logs[k] || typeof s.logs[k] !== "object") s.logs[k] = {};
  for (const k of ["walks", "sessions", "sleep", "stress", "weight", "bp"]) if (!Array.isArray(s.logs[k])) s.logs[k] = [];
  for (const k of ["favs", "customRecipes", "body", "workouts", "shopping", "devices"]) if (!Array.isArray(s[k])) s[k] = defaultState()[k];
  s.prefs = Object.assign({ avoid: [], vego: false }, s.prefs && typeof s.prefs === "object" ? s.prefs : {});
  if (!Array.isArray(s.prefs.avoid)) s.prefs.avoid = [];
  for (const k of ["progress", "dagsformLog", "deviceData"]) if (!s[k] || typeof s[k] !== "object") s[k] = {};
  s.reminders = Object.assign(defaultState().reminders, s.reminders && typeof s.reminders === "object" ? s.reminders : {});

  // Värden som slås upp i tabeller måste finnas där — annars TypeError i calcTargets/switchView
  const p = s.profile;
  if (!GOAL_META[p.goal]) p.goal = "halsa";
  // Användare som onboardade före inriktningarna kör vidare på målbaserade mallar
  if (!DISC_META[p.discipline]) p.discipline = "allman";
  if (!PACES[p.pace]) p.pace = "medel";
  p.age = clampTo(p.age, PROFILE_SANE.age, 52);
  p.height = clampTo(p.height, PROFILE_SANE.height, 180);
  p.weight = clampTo(p.weight, PROFILE_SANE.weight, 88);
  if (!Number.isFinite(+p.activity) || +p.activity <= 0) p.activity = 1.375;
  p.trainingDays = clampTo(p.trainingDays, [1, 7], 3);
  if (typeof p.name !== "string") p.name = "";

  // Blockprogrammet ankras här istället för lat i currentBlock() — då kan
  // en generering utanför Träning-vyn inte längre tappa bort starten.
  s.program = Object.assign({ start: null, block: 1 }, s.program && typeof s.program === "object" ? s.program : {});
  if (!s.program.start || !/^\d{4}-\d{2}-\d{2}$/.test(s.program.start)) s.program.start = dkey(mondayOf());
  if (!Number.isFinite(+s.program.block) || +s.program.block < 1) s.program.block = 1;

  // Passens set-antal måste vara heltal — Array(3.5) kastar RangeError i startSession
  s.workouts.forEach(w => {
    if (w && Array.isArray(w.exercises)) w.exercises.forEach(e => { if (e) e.sets = clampSets(e.sets); });
  });

  if (typeof s.aiKey !== "string") s.aiKey = "";
  return s;
}

function load() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (raw) return normalizeState(JSON.parse(raw));
  } catch (e) { /* korrupt data → börja om */ }
  return normalizeState(null);
}
function save() { localStorage.setItem(STORE_KEY, JSON.stringify(state)); }

/* ─────────────── HJÄLPARE ─────────────── */
const $ = (sel, el = document) => el.querySelector(sel);
const $$ = (sel, el = document) => [...el.querySelectorAll(sel)];
const esc = s => String(s).replace(/[&<>"']/g, m => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m]));

const DAYS = ["Söndag", "Måndag", "Tisdag", "Onsdag", "Torsdag", "Fredag", "Lördag"];
const MONTHS = ["januari", "februari", "mars", "april", "maj", "juni", "juli", "augusti", "september", "oktober", "november", "december"];

function dkey(d = new Date()) {
  return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
}
function fromKey(k) { const [y, m, d] = k.split("-").map(Number); return new Date(y, m - 1, d); }
function prettyDate(k) {
  const d = fromKey(k);
  const today = dkey();
  if (k === today) return "Idag";
  const yd = new Date(); yd.setDate(yd.getDate() - 1);
  if (k === dkey(yd)) return "Igår";
  return DAYS[d.getDay()] + " " + d.getDate() + " " + MONTHS[d.getMonth()];
}
function weekKeys() { // måndag–söndag denna vecka
  const now = new Date();
  const mon = new Date(now);
  mon.setDate(now.getDate() - ((now.getDay() + 6) % 7));
  return Array.from({ length: 7 }, (_, i) => { const d = new Date(mon); d.setDate(mon.getDate() + i); return dkey(d); });
}
function hashStr(s) { let h = 0; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0; return h; }

/* ─────────────── VECKOSCHEMA FÖR PASS ───────────────
   state.schedule.days = { "1": passId | "auto", ... } där nyckeln är veckodag (0=sön).
   "auto" betyder att passgeneratorn får bestämma utifrån dagsformen. */
const DAY_SHORT = ["Sön", "Mån", "Tis", "Ons", "Tor", "Fre", "Lör"];
const DAY_ICS = ["SU", "MO", "TU", "WE", "TH", "FR", "SA"];

function scheduleDays() {
  const d = (state.schedule && state.schedule.days) || {};
  return Object.keys(d).map(Number).filter(n => n >= 0 && n <= 6).sort((a, b) => a - b);
}
function scheduleTime() { return (state.schedule && state.schedule.time) || "17:00"; }

/* Passobjektet för en given veckodag — null om dagen är en vilodag.
   Ett borttaget pass faller tillbaka på "auto" istället för att tyst försvinna. */
function workoutForDay(dow) {
  const val = state.schedule && state.schedule.days ? state.schedule.days[dow] : undefined;
  if (val == null) return null;
  if (val !== "auto") {
    const w = state.workouts.find(x => x.id === val);
    if (w) return w;
  }
  return { id: "auto", name: "Auto — genereras", focus: "Anpassas efter dagsformen", exercises: [], auto: true };
}

function scheduledFor(dateKey) { return workoutForDay(fromKey(dateKey).getDay()); }

/* Närmaste kommande schemalagda pass, inklusive idag. Null om inget är schemalagt. */
function nextScheduled(fromDate = new Date()) {
  if (!scheduleDays().length) return null;
  for (let i = 0; i < 7; i++) {
    const d = new Date(fromDate); d.setDate(fromDate.getDate() + i);
    const w = workoutForDay(d.getDay());
    if (w) return { dateKey: dkey(d), workout: w, inDays: i, dow: d.getDay() };
  }
  return null;
}

/* Veckans sju dagar korsade med loggade pass — driver veckoremsan i Träning. */
function weekSchedule() {
  const todayKey = dkey();
  return weekKeys().map(k => {
    const w = scheduledFor(k);
    const done = state.logs.sessions.some(s => s.date === k);
    return { dateKey: k, dow: fromKey(k).getDay(), planned: w, done, past: k < todayKey, today: k === todayKey };
  });
}

/* ─────────────── ÅTERHÄMTNING MELLAN PASS ───────────────
   Muskelproteinsyntesen efter ett tungt pass pågår ungefär 24–48 timmar, och
   återhämtningsförmågan sjunker med åldern. Två pass som belastar samma
   muskler dagar i rad ger därför sämre resultat än om de sprids ut. Vi jämför
   övningsnamn — delar två pass minst en tredjedel av övningarna räknas de som
   överlappande. "Auto" jämförs inte; det passet är inte bestämt än. */
function similarWorkouts(a, b) {
  if (!a || !b || a.auto || b.auto) return false;
  if (a.id === b.id) return true;
  const namesA = new Set(a.exercises.map(e => e.name.toLowerCase()));
  if (!namesA.size || !b.exercises.length) return false;
  const shared = b.exercises.filter(e => namesA.has(e.name.toLowerCase())).length;
  return shared / Math.min(namesA.size, b.exercises.length) >= 0.34;
}

/* Par av intilliggande schemalagda dagar som tränar samma sak */
function recoveryConflicts() {
  const out = [];
  for (let dow = 0; dow <= 6; dow++) {
    const next = (dow + 1) % 7;
    const a = workoutForDay(dow), b = workoutForDay(next);
    if (a && b && similarWorkouts(a, b)) out.push({ a: dow, b: next, name: a.id === b.id ? a.name : null });
  }
  return out;
}

/* Förslag på jämnt utspridda dagar för N pass/vecka — används vid onboarding. */
function suggestScheduleDays(n) {
  const presets = { 1: [3], 2: [2, 5], 3: [1, 3, 5], 4: [1, 2, 4, 5], 5: [1, 2, 3, 4, 5], 6: [1, 2, 3, 4, 5, 6] };
  return presets[Math.max(1, Math.min(6, n || 3))] || [1, 3, 5];
}

/* Viktminskningstakt som % av kroppsvikt/vecka (forskning: 0,5–1,0 %/v bevarar muskler) */
const PACES = {
  lugn: { pct: 0.3, label: "Lugn", desc: "0,3 % av kroppsvikten/vecka — nästan omärkbart, lätt att hålla" },
  medel: { pct: 0.5, label: "Medel", desc: "0,5 %/vecka — forskningens standardrekommendation" },
  tuff: { pct: 0.8, label: "Tuff", desc: "0,8 %/vecka — nära taket (1 %) innan muskler offras" },
};

function calcTargets(p) {
  // Mifflin-St Jeor (män) × aktivitetsfaktor + målsjustering
  const bmr = Math.round(10 * p.weight + 6.25 * p.height - 5 * p.age + 5);
  const mifflin = Math.round(bmr * p.activity);
  // Adaptiv TDEE: uppmätt förbrukning (från vikttrend + loggat intag) trumfar formeln om användaren valt det
  const tdee = p.tdeeOverride || mifflin;
  const g = GOAL_META[p.goal];
  const pace = PACES[p.pace || "medel"] || PACES.medel;
  // Deficit från %-takt: kg/vecka × 7700 kcal ÷ 7 dagar, aldrig större än ~1 %/v
  const adj = p.goal === "fett" ? -Math.round((Math.min(pace.pct, 1) / 100) * p.weight * 7700 / 7) : g.kcalAdj;
  const kcal = Math.round((tdee + adj) / 10) * 10;
  // Protein: 2,2 g/kg vid tuff deff (anabol resistens 40+), annars per mål
  const pPerKg = p.goal === "fett" && (p.pace === "tuff") ? 2.2 : g.protein;
  const protein = Math.round(p.weight * pPerKg);
  // Makrosplit: fett ~0,9 g/kg men aldrig under golvet 0,6 g/kg; resten kolhydrater
  let fat = Math.round(p.weight * 0.9);
  let carbs = Math.round((kcal - protein * 4 - fat * 9) / 4);
  if (carbs < 80) { // frigör kolhydrater runt passen genom att gå mot fettgolvet
    fat = Math.max(Math.round(p.weight * 0.6), Math.round(fat - (80 - carbs) * 4 / 9));
    carbs = Math.max(0, Math.round((kcal - protein * 4 - fat * 9) / 4));
  }
  const wpd = p.walksPerDay || 1;
  return {
    bmr, tdee, mifflin, kcalAdj: adj, adaptive: !!p.tdeeOverride,
    kcal, protein, fat, carbs,
    workoutsPerWeek: p.trainingDays,
    walksPerDay: wpd,
    walksPerWeek: wpd * 7,
    walkMin: 30,
    steps: 8000, // 7–8 000 steg/dag fångar merparten av hälsovinsten (Lancet 2025)
    sleepHours: 7.5,
    waterGlasses: 8,
  };
}

/* ─────────────── PROTEIN PER MÅLTID ───────────────
   Efter 50 räcker det inte att nå dagsmålet — fördelningen avgör.
   Anabol resistens gör att muskeln behöver en större dos per måltid för att
   sätta igång proteinsyntesen; forskningen landar runt 0,4 g/kg kroppsvikt och
   måltid (Moore m.fl. 2015), och 3–4 sådana doser per dag. Ett dygn med 150 g
   protein där 120 g kommer på middagen bygger mindre muskel än samma mängd
   jämnt fördelad. Golvet nedan garanterar tröskeln; överskottet läggs på
   huvudmålen och resten faller på mellanmål. */
const MAIN_MEALS = ["frukost", "lunch", "middag"];

function proteinPerMeal() {
  const kg = state.profile.weight || 80;
  const daily = state.targets.protein || Math.round(kg * 1.6);
  const threshold = Math.round(0.4 * kg);            // anabol tröskel per måltid
  const main = Math.max(threshold, Math.round(daily * 0.28)); // ~28 % × 3 huvudmål
  return {
    frukost: main, lunch: main, middag: main,
    "mellanmål": Math.max(0, daily - main * 3),
    threshold,
  };
}

/* Protein per måltidstyp för ett visst datum */
function proteinByMeal(dateKey) {
  const out = { frukost: 0, lunch: 0, middag: 0, "mellanmål": 0 };
  (state.logs.meals[dateKey] || []).forEach(m => {
    if (out[m.meal] != null) out[m.meal] += m.p || 0;
  });
  return out;
}

/* Hur många huvudmål som nådde tröskeln — det är det måttet som betyder något */
function mainMealsHittingThreshold(dateKey) {
  const got = proteinByMeal(dateKey), tgt = proteinPerMeal();
  return MAIN_MEALS.filter(m => got[m] >= tgt.threshold).length;
}

/* ─────────────── BLODTRYCK ───────────────
   Efter 50 säger blodtrycket mer om risken än vad vågen gör, och det är ett av
   få mått du kan följa själv. Kategorierna följer europeisk praxis (ESC/ESH).
   Appen ställer ingen diagnos — den visar var värdet ligger och när det är
   dags att prata med vården. */
function bpCategory(sys, dia) {
  if (sys >= 180 || dia >= 110) return { label: "Mycket högt", cls: "clay", advice: "Kontakta vården. Vid samtidig bröstsmärta, andnöd eller synrubbning — sök akut." };
  if (sys >= 160 || dia >= 100) return { label: "Högt (grad 2)", cls: "clay", advice: "Boka tid hos vårdcentralen för utredning." };
  if (sys >= 140 || dia >= 90) return { label: "Högt (grad 1)", cls: "clay", advice: "Mät om vid några tillfällen. Ligger det kvar här bör du ta det med vårdcentralen." };
  if (sys >= 130 || dia >= 85) return { label: "Högt normalt", cls: "amber", advice: "Här gör vikt, promenader, salt, sömn och alkohol tydlig skillnad." };
  if (sys >= 120 || dia >= 80) return { label: "Normalt", cls: "amber", advice: "Bra läge — håll i träningen och promenaderna." };
  return { label: "Optimalt", cls: "sage", advice: "Optimalt värde. Fortsätt precis så här." };
}

/* Snitt av de senaste mätningarna — ett enskilt värde säger nästan ingenting */
function bpAverage(n = 5) {
  const last = state.logs.bp.slice(-n);
  if (!last.length) return null;
  return {
    sys: Math.round(last.reduce((a, b) => a + b.sys, 0) / last.length),
    dia: Math.round(last.reduce((a, b) => a + b.dia, 0) / last.length),
    n: last.length,
  };
}

/* Adaptiv TDEE: bakåträkna verklig förbrukning från loggat intag + vikttrend (à la MacroFactor) */
function adaptiveTDEE() {
  const days = [];
  for (let i = 1; i <= 21; i++) {
    const d = new Date(); d.setDate(d.getDate() - i);
    const k = dkey(d);
    const tot = dayTotals(k);
    if (tot.kcal > 800) days.push(tot.kcal); // dagar med rimligt komplett loggning
  }
  const tr = weightTrend();
  if (days.length < 10 || !tr) return null;
  const avgIntake = days.reduce((a, b) => a + b, 0) / days.length;
  const est = Math.round((avgIntake - (tr.perWeek * 7700) / 7) / 10) * 10;
  return { est, daysLogged: days.length, avgIntake: Math.round(avgIntake) };
}

/* Kroppssammansättning — US Navy-formeln (män), mått i cm */
function navyBodyFat(waist, neck, height) {
  if (!(waist > neck) || !height) return null;
  const bf = 495 / (1.0324 - 0.19077 * Math.log10(waist - neck) + 0.15456 * Math.log10(height)) - 450;
  return Math.round(bf * 10) / 10;
}
function bfCategory(bf) {
  if (bf == null) return "";
  if (bf < 14) return "Atletisk";
  if (bf < 21) return "Bra form";
  if (bf < 26) return "Medel";
  return "Förhöjd — bra utgångsläge, stor potential";
}

/* Vikttrend: 7 dagars glidande medelvärde + takt per vecka */
function weightTrend() {
  const w = state.logs.weight;
  if (w.length < 2) return null;
  const last = w.slice(-14);
  const avg7 = w.slice(-7).reduce((a, x) => a + x.kg, 0) / Math.min(7, w.length);
  const first = last[0], lastE = last[last.length - 1];
  const days = Math.max(1, (fromKey(lastE.date) - fromKey(first.date)) / 86400000);
  const perWeek = ((lastE.kg - first.kg) / days) * 7;
  let etaWeeks = null;
  const tw = state.profile.targetWeight;
  if (tw && Math.abs(perWeek) > 0.05 && (perWeek < 0) === (tw < lastE.kg)) {
    etaWeeks = Math.abs((lastE.kg - tw) / perWeek);
  }
  return { avg7: Math.round(avg7 * 10) / 10, perWeek: Math.round(perWeek * 100) / 100, etaWeeks };
}

/* ─────────────── DAGSFORM ───────────────
   Sammanvägd readiness 0–100 av sömn, vilopuls, stress,
   träningsbelastning och rörelse. Har du synkat Ouras egen
   readiness-score vägs den in med halva vikten. */
function rhrBaseline() {
  const vals = [];
  for (let i = 2; i <= 21; i++) {
    const d = new Date(); d.setDate(d.getDate() - i);
    const dd = state.deviceData[dkey(d)];
    if (dd && dd.rhr) vals.push(dd.rhr);
  }
  if (vals.length < 4) return null;
  vals.sort((a, b) => a - b);
  return vals[Math.floor(vals.length / 2)]; // median
}

function computeDagsform() {
  const today = dkey();
  const yd = new Date(); yd.setDate(yd.getDate() - 1);
  const ydKey = dkey(yd);
  const dd = state.deviceData[today] || {};
  const ddY = state.deviceData[ydKey] || {};
  const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
  const factors = [];

  // 1. Sömn (35 %) — enhet eller manuell logg
  const sleepLog = state.logs.sleep.find(s => s.date === today);
  const sleepH = dd.sleep != null ? dd.sleep : (sleepLog ? sleepLog.hours : null);
  factors.push({
    name: "Sömn i natt", w: 35,
    score: sleepH != null ? Math.round(clamp((sleepH - 4.5) / 3 * 100, 15, 100)) : 70,
    detail: sleepH != null ? String(sleepH).replace(".", ",") + " tim" : "ingen data",
    hasData: sleepH != null,
  });

  // 2. Vilopuls mot din baslinje (25 %)
  const base = rhrBaseline();
  const rhr = dd.rhr != null ? dd.rhr : ddY.rhr;
  let rhrScore = 72, rhrDetail = "ingen data";
  if (rhr != null && base) {
    const diff = rhr - base;
    rhrScore = Math.round(clamp(100 - diff * 9, 25, 100));
    rhrDetail = rhr + " (baslinje " + base + ")";
  } else if (rhr != null) { rhrScore = 78; rhrDetail = rhr + " — samlar baslinje"; }
  factors.push({ name: "Vilopuls", w: 25, score: rhrScore, detail: rhrDetail, hasData: rhr != null });

  // 3. Stress (15 %) — senaste loggade nivån (idag eller igår)
  const stress = state.logs.stress.find(s => s.date === today) || state.logs.stress.find(s => s.date === ydKey);
  factors.push({
    name: "Stress", w: 15,
    score: stress ? 100 - (stress.level - 1) * 19 : 70,
    detail: stress ? ["Lugn", "Bra", "Spänd", "Stressad", "Pressad"][stress.level - 1] : "ingen data",
    hasData: !!stress,
  });

  // 4. Träningsbelastning (15 %) — vila mellan passen är en del av träningen
  const recent = state.logs.sessions.filter(s => {
    const days = (fromKey(today) - fromKey(s.date)) / 86400000;
    return days >= 0 && days <= 2;
  }).length;
  factors.push({
    name: "Återhämtning", w: 15,
    score: recent === 0 ? 95 : recent === 1 ? 78 : 58,
    detail: recent === 0 ? "utvilad" : recent + " pass senaste 2 dagarna",
    hasData: true,
  });

  // 5. Rörelse igår (10 %)
  const stepsY = ddY.steps;
  const walkedY = state.logs.walks.some(w => w.date === ydKey);
  factors.push({
    name: "Rörelse igår", w: 10,
    score: stepsY != null ? Math.round(clamp(stepsY / (state.targets.steps || 8000) * 100, 30, 100)) : (walkedY ? 85 : 65),
    detail: stepsY != null ? stepsY.toLocaleString("sv-SE") + " steg" : (walkedY ? "promenad loggad" : "ingen data"),
    hasData: stepsY != null || walkedY,
  });

  let score = Math.round(factors.reduce((a, f) => a + f.score * f.w, 0) / 100);
  let ouraBlend = false;
  if (dd.readiness != null) { score = Math.round(score * 0.5 + dd.readiness * 0.5); ouraBlend = true; }

  const level = score >= 80 ? { label: "Toppform", ico: "▲", color: "var(--sage)", css: "sage",
      rec: "Grönt ljus — kör dagens pass med full kraft och sikta på att öka vikterna." }
    : score >= 60 ? { label: "Bra läge", ico: "◆", color: "var(--amber-soft)", css: "amber",
      rec: "Kör som planerat. Lyssna på kroppen i uppvärmningen och skala därefter." }
    : score >= 40 ? { label: "Ta det lugnare", ico: "◐", color: "var(--amber)", css: "amber",
      rec: "Sänk intensiteten idag — ett lättare pass eller en rask promenad räcker gott." }
    : { label: "Vila & ladda om", ico: "●", color: "var(--clay)", css: "clay",
      rec: "Kroppen ber om vila. Ta en lugn promenad, ät ordentligt med protein och prioritera sömnen ikväll." };

  const hasAnyData = factors.some(f => f.hasData);
  return { score, factors, ouraBlend, hasAnyData, ...level };
}

/* Streak: dagar i rad med någon loggning (mat, pass, promenad, sömn eller vikt) */
function loggedDates() {
  const s = new Set(Object.keys(state.logs.meals).filter(k => state.logs.meals[k].length));
  state.logs.walks.forEach(w => s.add(w.date));
  state.logs.sessions.forEach(x => s.add(x.date));
  state.logs.sleep.forEach(x => s.add(x.date));
  state.logs.weight.forEach(x => s.add(x.date));
  return s;
}
function currentStreak() {
  const s = loggedDates();
  let n = 0;
  const d = new Date();
  if (!s.has(dkey(d))) d.setDate(d.getDate() - 1); // dagen är ung — räkna från igår
  while (s.has(dkey(d))) { n++; d.setDate(d.getDate() - 1); }
  return n;
}

/* ─────────────── TRÄNINGSFASER & PROGRESSIVE OVERLOAD ─────────────── */
const PHASES = [
  { min: 0, name: "Fas 1 — Grund", sub: "Teknik & vana", reps: "10–12", sets: 3,
    note: "Lär in rörelserna med lättare vikter. Öka först när tekniken sitter i alla set." },
  { min: 12, name: "Fas 2 — Bygg", sub: "Volym & styrka", reps: "8–10", sets: 3,
    note: "Nu ökar vi belastningen stegvis, pass för pass — det är detta som är progressive overload." },
  { min: 30, name: "Fas 3 — Prestera", sub: "Tyngre & tätare", reps: "6–8", sets: 4,
    note: "Tyngre vikter och fler set. Vila 2–3 minuter mellan seten och sov ordentligt." },
];
function currentPhase() { const n = state.logs.sessions.length; return PHASES.filter(p => n >= p.min).pop(); }
function nextPhaseIn() {
  const n = state.logs.sessions.length;
  const nxt = PHASES.find(p => p.min > n);
  return nxt ? nxt.min - n : null;
}
function overloadNext(name) {
  const pr = state.progress[name];
  if (!pr || !pr.weight) return null;
  return pr.full ? Math.round((pr.weight + (pr.weight >= 40 ? 2.5 : 1)) * 2) / 2 : pr.weight;
}

/* ─────────────── BLOCKBERÄKNING ───────────────
   Blocket härleds on demand ur `program.start` istället för att materialiseras
   som sparade veckor — veckoschemat kan ändras när som helst och en sparad plan
   skulle genast hamna ur synk.

   Frånvaro: ren kalenderförankring har ett tydligt fel — är du borta tre veckor
   kommer du tillbaka till "vecka 4, deload" utan att ha något att ladda av från.
   Har inget pass loggats på ABSENCE_DAYS dagar ankras blocket därför om till
   vecka 1. Det är vad en tränare gör; man kliver inte in i toppveckan efter ett
   längre uppehåll. */
function disciplineOf() { return (state.profile && state.profile.discipline) || "allman"; }

function mondayOf(d = new Date()) {
  const m = new Date(d);
  m.setDate(d.getDate() - ((d.getDay() + 6) % 7));
  m.setHours(0, 0, 0, 0);
  return m;
}

function lastSessionDate() {
  const s = state.logs.sessions;
  return s.length ? s[s.length - 1].date : null;
}

/* → { block, week, meta, restarted, dirty }
   restarted är sant den gång vi ankrar om, dirty när state.program ändrades.
   Anroparen äger sparandet: spara när dirty, annars inte. Ett ovillkorligt save()
   här hade serialiserat hela state vid varje vyväxling. */
function currentBlock() {
  const prog = state.program || (state.program = { start: null, block: 1 });
  const todayMon = mondayOf();
  let restarted = false, dirty = false;

  // Normalt satt redan i normalizeState — kvar som skydd om program nollställts
  if (!prog.start) { prog.start = dkey(todayMon); prog.block = 1; dirty = true; }

  const last = lastSessionDate();
  if (last) {
    const gap = Math.floor((fromKey(dkey()) - fromKey(last)) / 86400000);
    if (gap > ABSENCE_DAYS && dkey(todayMon) !== prog.start) {
      prog.start = dkey(todayMon); prog.block = 1; restarted = true; dirty = true;
    }
  }

  const weeksIn = Math.max(0, Math.floor((todayMon - mondayOf(fromKey(prog.start))) / (7 * 86400000)));
  const block = prog.block + Math.floor(weeksIn / BLOCK_LEN);
  const week = (weeksIn % BLOCK_LEN) + 1;
  return { block, week, meta: BLOCK_WEEKS[week - 1], restarted, dirty };
}

/* Blockveckan för ett godtyckligt datum — används av kalenderexport och vyer */
function blockWeekOf(dateKey) {
  const prog = state.program;
  if (!prog || !prog.start) return BLOCK_WEEKS[0];
  const weeksIn = Math.floor((mondayOf(fromKey(dateKey)) - mondayOf(fromKey(prog.start))) / (7 * 86400000));
  return BLOCK_WEEKS[((weeksIn % BLOCK_LEN) + BLOCK_LEN) % BLOCK_LEN];
}

/* Startpassen: allman behåller målbaserade mallar, övriga får sina egna */
function templatesFor(profile) {
  const d = (profile && profile.discipline) || "allman";
  return DISC_TEMPLATES[d] || TEMPLATES[(profile && profile.goal) || "halsa"];
}

/* Slumpgenerator med frö — samma frö ger samma pass */
function makeRng(seed) { let s = seed >>> 0; return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }
function pickN(arr, n, rnd) { const a = [...arr], out = []; while (a.length && out.length < n) out.push(a.splice(Math.floor(rnd() * a.length), 1)[0]); return out; }

/* Övningspool med utrustningstaggar: gym ⊃ hantlar ⊃ kroppsvikt.

   Det valfria `disc`-fältet är en ANNAN axel än `eq`: en släde är inte "mer gym
   än gym", den är utrustning bara vissa inriktningar tränar med. En övning UTAN
   `disc` erbjuds alla (dagens beteende, oförändrat); en övning MED `disc`
   erbjuds bara de inriktningarna. Därmed får en vanlig gymanvändare aldrig
   slädövningar hen inte kan göra. */
const EXPOOL = {
  press: [
    { n: "Hantelpress på bänk", eq: "hantlar" }, { n: "Axelpress sittande", eq: "hantlar" },
    { n: "Lutande hantelpress", eq: "hantlar" }, { n: "Bröstpress i maskin", eq: "gym" },
    { n: "Armhävningar (ev. på knä)", eq: "kropp" }, { n: "Pikade armhävningar", eq: "kropp" },
    { n: "Dips mot bänk eller stol", eq: "kropp" },
    { n: "Bänkpress", eq: "gym", disc: ["styrka", "hyrox"] },
    { n: "Militärpress", eq: "gym", disc: ["styrka", "hyrox"] },
    { n: "Lutande bänkpress med skivstång", eq: "gym", disc: ["styrka"] },
  ],
  drag: [
    { n: "Latsdrag", eq: "gym" }, { n: "Sittande rodd", eq: "gym" }, { n: "Face pulls", eq: "gym" },
    { n: "Hantelrodd", eq: "hantlar" }, { n: "Bicepscurl", eq: "hantlar" },
    { n: "Omvänd rodd under bord", eq: "kropp" }, { n: "Supermanlyft", eq: "kropp" },
    { n: "Skivstångsrodd", eq: "gym", disc: ["styrka", "hyrox"] },
    { n: "Chins med gummiband", eq: "gym", disc: ["styrka", "hyrox"] },
  ],
  ben: [
    { n: "Benpress", eq: "gym" }, { n: "Vadpress", eq: "gym" },
    { n: "Goblet squat", eq: "hantlar" }, { n: "Rumänska marklyft", eq: "hantlar" },
    { n: "Knäböj med kroppsvikt", eq: "kropp" }, { n: "Utfallssteg", eq: "kropp" },
    { n: "Step-ups på bänk", eq: "kropp" }, { n: "Enbens höftlyft", eq: "kropp" },
    { n: "Vadhävningar på trappsteg", eq: "kropp" },
    { n: "Knäböj med skivstång", eq: "gym", disc: ["styrka", "hyrox"] },
    { n: "Marklyft", eq: "gym", disc: ["styrka", "hyrox"] },
    { n: "Frontböj", eq: "gym", disc: ["styrka"] },
    { n: "Bulgarian split squat", eq: "hantlar", disc: ["styrka", "hyrox"] },
  ],
  core: [
    { n: "Plankan", eq: "kropp" }, { n: "Sidoplanka", eq: "kropp" },
    { n: "Fågelhunden", eq: "kropp" }, { n: "Dead bug", eq: "kropp" },
    { n: "Pallof press", eq: "gym" },
    { n: "Hängande benlyft", eq: "gym", disc: ["styrka", "hyrox"] },
  ],
  puls: [
    { n: "Roddmaskin — hårt tempo", eq: "gym" }, { n: "Kettlebell swings", eq: "hantlar" },
    { n: "Mountain climbers", eq: "kropp" }, { n: "Burpees utan hopp", eq: "kropp" },
    { n: "Hopprep eller trampa på stället", eq: "kropp" },
  ],
  rorlighet: [
    { n: "Katt–ko", eq: "kropp" }, { n: "Höftöppnare med rotation", eq: "kropp" },
    { n: "Bröstryggsrotation", eq: "kropp" }, { n: "Baksida lår — stretch", eq: "kropp" },
    { n: "Balans på ett ben", eq: "kropp" },
  ],
  /* Hyrox-stationerna. Alla disc-taggade så de aldrig läcker till andra. */
  slap: [
    { n: "Slädpush", eq: "gym", disc: ["hyrox"] },
    { n: "Slädpull", eq: "gym", disc: ["hyrox"] },
    { n: "Farmers walk", eq: "hantlar", disc: ["hyrox", "styrka"] },
    { n: "Sandbag lunges", eq: "gym", disc: ["hyrox"] },
    { n: "Wall balls", eq: "gym", disc: ["hyrox"] },
    { n: "Burpee broad jumps", eq: "kropp", disc: ["hyrox"] },
  ],
  erg: [
    { n: "Roddmaskin — intervaller", eq: "gym", disc: ["hyrox"] },
    { n: "Ski erg — intervaller", eq: "gym", disc: ["hyrox"] },
    { n: "Roddmaskin — jämnt tempo", eq: "gym", disc: ["hyrox"] },
    { n: "Ski erg — jämnt tempo", eq: "gym", disc: ["hyrox"] },
  ],
  lopning: [
    { n: "Löpning 1 km i tävlingsfart", eq: "kropp", disc: ["hyrox"] },
    { n: "Löpning — lugn distans", eq: "kropp", disc: ["hyrox"] },
    { n: "Löpintervaller 400 m", eq: "kropp", disc: ["hyrox"] },
    { n: "Kompromissad löpning efter station", eq: "kropp", disc: ["hyrox"] },
  ],
};

const FOCUS_SEQ = {
  helkropp: ["ben", "press", "drag", "ben", "core", "press", "drag", "puls", "ben"],
  overkropp: ["press", "drag", "press", "drag", "press", "drag", "core", "press", "drag"],
  underkropp: ["ben", "ben", "core", "ben", "ben", "core", "ben", "ben", "ben"],
  puls: ["puls", "ben", "puls", "core", "puls", "ben", "puls", "core", "puls"],
  // Styrka: en tung basövning först, sedan accessoarer runt den
  knaboj: ["ben", "ben", "ben", "core", "drag", "ben", "core", "drag", "core"],
  bank: ["press", "press", "drag", "press", "drag", "core", "press", "drag", "core"],
  marklyft: ["ben", "drag", "ben", "drag", "core", "drag", "ben", "core", "drag"],
  // Hyrox
  stationer: ["slap", "slap", "ben", "slap", "erg", "slap", "core", "slap", "erg"],
  erglopning: ["erg", "lopning", "erg", "lopning", "erg", "core", "lopning", "erg", "core"],
  kompromiss: ["lopning", "slap", "lopning", "slap", "lopning", "erg", "lopning", "slap", "core"],
};

/* Vilka fokusval som erbjuds per inriktning i passgeneratorn */
const DISC_FOCUS = {
  allman: [["auto", "✦ Auto"], ["helkropp", "Helkropp"], ["overkropp", "Överkropp"], ["underkropp", "Underkropp"], ["puls", "Puls & flås"]],
  styrka: [["auto", "✦ Auto"], ["knaboj", "Knäböj"], ["bank", "Bänk"], ["marklyft", "Marklyft"], ["helkropp", "Helkropp"]],
  hyrox: [["auto", "✦ Auto"], ["stationer", "Stationer"], ["erglopning", "Erg & löpning"], ["kompromiss", "Kompromissad löpning"], ["helkropp", "Helkropp"]],
};

/* Repetitioner och belastning per övning.

   PHASES och blockveckan mäter olika saker och samverkar: PHASES är
   TRÄNINGSÅLDER och fungerar som säkerhetsspärr — en nybörjare i Fas 1 ska
   aldrig köra tunga treor oavsett var i blocket hen befinner sig. Blockveckan
   är VAR I MESOCYKELN man är och skalar runt det.

   Belastningen anges i RPE, inte procent av 1RM. Det kräver inget maxtest, och
   ett maxtest är det farligaste en app utan coach kan be en 52-åring om. */
const HEAVY_LIFTS = ["Knäböj med skivstång", "Marklyft", "Bänkpress", "Militärpress", "Frontböj", "Skivstångsrodd", "Lutande bänkpress med skivstång"];

function repsFor(cat, ex, ph, blk, disc) {
  if (cat === "puls") return "40 sek";
  if (cat === "core") return "30–45 sek";
  if (cat === "rorlighet") return "45 sek lugnt";
  if (cat === "erg") return blk.meta.n === 4 ? "3 × 500 m lugnt" : "5 × 500 m";
  if (cat === "lopning") return blk.meta.n === 4 ? "15 min lugnt" : "4 × 1 km";
  if (cat === "slap") return blk.meta.n === 4 ? "2 × 25 m lätt" : "4 × 25 m";

  // Tunga basövningar: repschemat följer blockveckan, men bara för den som
  // hunnit förbi grundfasen. Fas 1 stannar på teknikreps oavsett vecka.
  if (disc === "styrka" && HEAVY_LIFTS.includes(ex.n) && ph.min >= 12) {
    return ["5 · RPE 7", "5 · RPE 8", "3 · RPE 8–9", "5 · RPE 6 (lätt)"][blk.meta.n - 1];
  }
  return ph.reps;
}

/* Dynamisk passgenerator: tid × utrustning × fokus × dagsform × vad du körde sist */
function generateWorkout(opts) {
  const { seed, time = 45, eq = "gym", focus = "auto" } = opts;
  const rnd = makeRng(seed);
  const ph = currentPhase();
  const goal = state.profile.goal;
  const disc = disciplineOf();
  const blk = currentBlock();
  if (blk.dirty) save(); // ankringen får inte tappas bort bara för att man genererar från Idag
  const df = computeDagsform();
  const allowedEq = eq === "gym" ? ["gym", "hantlar", "kropp"] : eq === "hantlar" ? ["hantlar", "kropp"] : ["kropp"];
  // En övning utan disc-tagg är öppen för alla; med tagg bara för sin inriktning
  const okDisc = x => !x.disc || x.disc.includes(disc);
  const notes = [];

  // Dagsform styr intensiteten
  let setAdj = 0;
  if (df.hasAnyData && df.score < 40 && focus === "auto") {
    // Återhämtningspass: rörlighet + core i lugnt tempo
    const pool = EXPOOL.rorlighet.concat(EXPOOL.core.filter(x => allowedEq.includes(x.eq)));
    const exercises = pickN(pool, 5, rnd).map(x => ({ name: x.n, sets: 2, reps: "45 sek lugnt" }));
    return { id: "gen" + seed, custom: true, name: "Återhämtningspass", focus: "Dagsform " + df.score + " — vila är träning idag",
      exercises, note: "Låg dagsform (" + df.score + "). Lugn rörlighet + en promenad slår ett hårt pass idag — kom tillbaka starkare imorgon." };
  }
  if (df.hasAnyData && df.score < 60) { setAdj = -1; notes.push("Dagsform " + df.score + " — ett set mindre per övning och lite lättare vikter idag."); }
  if (df.hasAnyData && df.score >= 80) notes.push("Toppform (" + df.score + ") — lägg gärna på ett extra set eller kliv upp i vikt på första övningen.");

  /* Blockveckan modulerar volymen ovanpå dagsformen. Dagsformen är alltid
     starkast: en tung vecka-3-dag med dagsform 35 blev redan ett
     återhämtningspass ovan, och en dålig dag drar fortfarande ner ett set. */
  setAdj += blk.meta.setAdj;
  notes.push("Block " + blk.block + " · vecka " + blk.week + " av " + BLOCK_LEN + " — " + blk.meta.name + ". " + blk.meta.note);
  if (blk.restarted) notes.push("Du har varit borta ett tag, så blocket börjar om på uppbyggnad. Kliv in mjukt.");

  // Fokus: auto väljer sekvens efter inriktning (och för allman efter mål, som förut)
  let seqKey = focus;
  if (focus === "auto") {
    seqKey = disc === "styrka" ? ["knaboj", "bank", "marklyft"][state.logs.sessions.length % 3]
      : disc === "hyrox" ? ["stationer", "erglopning", "kompromiss"][state.logs.sessions.length % 3]
      : "helkropp";
  }
  let seq = [...(FOCUS_SEQ[seqKey] || FOCUS_SEQ.helkropp)];
  if (focus === "auto" && disc === "allman" && goal === "fett") { seq[4] = "puls"; seq[7] = "puls"; }

  // Antal övningar efter tid
  const count = time <= 20 ? 4 : time <= 30 ? 6 : time <= 45 ? 8 : 9;
  seq = seq.slice(0, count);

  // Undvik exakt samma övningar som förra passet (variation)
  const lastNames = new Set();
  const lastSess = state.logs.sessions[state.logs.sessions.length - 1];
  if (lastSess) { const w = state.workouts.find(x => x.id === lastSess.workoutId); if (w) w.exercises.forEach(e => lastNames.add(e.name)); }

  const used = new Set();
  const exercises = seq.map(cat => {
    const base = EXPOOL[cat].filter(x => allowedEq.includes(x.eq) && okDisc(x));
    let pool = base.filter(x => !used.has(x.n) && !lastNames.has(x.n));
    if (!pool.length) pool = base.filter(x => !used.has(x.n));
    /* Är allt i kategorin redan använt hoppar vi över platsen istället för att
       upprepa samma övning. Ett kortare pass är bättre än fem set burpees i rad
       — det inträffar bara i smala kombinationer (t.ex. Hyrox utan utrustning). */
    if (!pool.length) return null;
    const x = pool[Math.floor(rnd() * pool.length)];
    used.add(x.n);
    const isTimed = cat === "core" || cat === "puls" || cat === "rorlighet";
    return {
      name: x.n,
      sets: Math.max(2, (isTimed ? 3 : ph.sets) + (isTimed ? 0 : setAdj)),
      reps: repsFor(cat, x, ph, blk, disc),
    };
  }).filter(Boolean);

  const focusLabels = {
    auto: "Auto — " + DISC_META[disc].label, helkropp: "Helkropp", overkropp: "Överkropp",
    underkropp: "Underkropp", puls: "Puls & flås", knaboj: "Knäböj", bank: "Bänk",
    marklyft: "Marklyft", stationer: "Stationer", erglopning: "Erg & löpning", kompromiss: "Kompromissad löpning",
  };
  const eqLabels = { gym: "gym", hantlar: "hantlar", kropp: "kroppsvikt" };
  return {
    id: "gen" + seed, custom: true,
    name: (focus === "auto" ? "Dagens pass" : focusLabels[focus] || "Pass") + " · " + time + " min",
    focus: (focusLabels[focus] || "Pass") + " · " + eqLabels[eq] + " · v" + blk.week + " " + blk.meta.name,
    exercises, note: notes.join(" "),
  };
}

/* ─────────────── MATPREFERENSER & VECKOPLAN ─────────────── */
function allRecipes() { return RECIPES.concat(state.customRecipes || []); }
function findRecipe(id) { return allRecipes().find(r => r.id === id); }
function isFav(id) { return state.favs.includes(id); }
function toggleFav(id) {
  isFav(id) ? state.favs.splice(state.favs.indexOf(id), 1) : state.favs.push(id);
  save();
}

function allowedRecipes() {
  let list = allRecipes().filter(r => !(r.prot || []).some(t => state.prefs.avoid.includes(t)));
  if (state.prefs.vego) {
    const v = list.filter(r => (r.prot || []).includes("vego"));
    if (v.length >= 3) list = v;
  }
  return list.length ? list : RECIPES;
}

/* ─────────────── RECEPTGENERATOR ───────────────
   Bygger nya recept av komponenter, anpassade efter preferenser. */
const GEN = {
  prot: [
    { n: "kycklingfilé", kcal: 165, p: 34, tag: "fågel" },
    { n: "kalkonfärs", kcal: 180, p: 32, tag: "fågel" },
    { n: "laxfilé", kcal: 300, p: 30, tag: "fisk" },
    { n: "torskrygg", kcal: 120, p: 27, tag: "fisk" },
    { n: "räkor", kcal: 120, p: 27, tag: "fisk" },
    { n: "nötfärs (10 %)", kcal: 255, p: 30, tag: "nötkött" },
    { n: "ryggbiff", kcal: 270, p: 40, tag: "nötkött" },
    { n: "fläskfilé", kcal: 160, p: 33, tag: "fläsk" },
    { n: "halloumi", kcal: 320, p: 22, tag: "mejeri", vego: true },
    { n: "tofu", kcal: 180, p: 20, tag: "vego", vego: true },
    { n: "kikärtor", kcal: 240, p: 12, tag: "vego", vego: true },
  ],
  carb: [
    { n: "fullkornsris", kcal: 180, p: 4 }, { n: "klyftpotatis", kcal: 160, p: 3 },
    { n: "fullkornspasta", kcal: 220, p: 8 }, { n: "bulgur", kcal: 170, p: 6 },
    { n: "sötpotatis", kcal: 160, p: 2 }, { n: "quinoa", kcal: 190, p: 7 },
  ],
  veg: [
    { n: "broccoli", kcal: 35 }, { n: "haricots verts", kcal: 40 }, { n: "rostade rotfrukter", kcal: 90 },
    { n: "paprika & rödlök", kcal: 45 }, { n: "spenat", kcal: 25 }, { n: "grillad zucchini", kcal: 35 },
  ],
  sauce: [
    { n: "citron- & örtyoghurt", kcal: 60, p: 3 }, { n: "tomat- & vitlökssås", kcal: 70, p: 2 },
    { n: "lätt currysås", kcal: 110, p: 2 }, { n: "soja- & ingefärsglaze", kcal: 50, p: 1 },
    { n: "fetayoghurt med dill", kcal: 80, p: 4 }, { n: "chimichurri", kcal: 90, p: 1 },
  ],
  method: [
    { n: "Ugnsbakad", steps: ["Sätt ugnen på 200°.", "Krydda {prot} och lägg i form med {veg}.", "Baka 18–25 min tills {prot} är genomstekt.", "Koka {carb} under tiden och rör ihop {sauce}.", "Lägg upp och servera."] },
    { n: "Stekt", steps: ["Koka {carb}.", "Stek {prot} i het panna med olivolja, salta och peppra.", "Stek eller ånga {veg} hastigt.", "Rör ihop {sauce}.", "Lägg upp allt och toppa med såsen."] },
    { n: "Gryta med", steps: ["Bryn {prot} i en gryta.", "Tillsätt {veg} och {sauce}, sjud 10–15 min.", "Koka {carb} under tiden.", "Smaka av med salt och peppar. Servera."] },
    { n: "Snabbwokad", steps: ["Koka {carb}.", "Woka {prot} hårt i het panna 3–4 min.", "Tillsätt {veg}, woka 3 min till.", "Vänd ner {sauce} och låt puttra ihop 1 min.", "Servera direkt."] },
  ],
};
const GEN_COLORS = ["#e08a3c", "#93ac8f", "#c96b52", "#7fa8b8"];

function generateRecipe(seed) {
  const rnd = makeRng(seed);
  const avoid = state.prefs.avoid;
  let prots = GEN.prot.filter(x => !avoid.includes(x.tag));
  if (state.prefs.vego) { const v = prots.filter(x => x.vego); if (v.length) prots = v; }
  if (!prots.length) prots = GEN.prot;
  const P = prots[Math.floor(rnd() * prots.length)];
  const C = GEN.carb[Math.floor(rnd() * GEN.carb.length)];
  const V = GEN.veg[Math.floor(rnd() * GEN.veg.length)];
  const S = GEN.sauce[Math.floor(rnd() * GEN.sauce.length)];
  const M = GEN.method[Math.floor(rnd() * GEN.method.length)];
  const kcal = Math.round((P.kcal + C.kcal + V.kcal + S.kcal) / 10) * 10;
  const p = P.p + (C.p || 0) + (S.p || 0);
  const fill = s => s.replace(/\{prot\}/g, P.n).replace(/\{carb\}/g, C.n).replace(/\{veg\}/g, V.n).replace(/\{sauce\}/g, S.n);
  return {
    id: "gen" + seed,
    name: `${M.n} ${P.n} med ${C.n} & ${V.n}`,
    desc: `Genererat efter dina preferenser och ditt kalorimål — ${S.n} sätter smaken.`,
    kcal, p, min: 25,
    tags: ["genererad", p >= 30 ? "högprotein" : "vardag"],
    prot: [P.tag].concat(P.vego ? ["vego"] : []),
    color: GEN_COLORS[Math.floor(rnd() * GEN_COLORS.length)],
    ing: [P.n[0].toUpperCase() + P.n.slice(1) + " (ca 150 g/person)", C.n[0].toUpperCase() + C.n.slice(1), V.n[0].toUpperCase() + V.n.slice(1), S.n[0].toUpperCase() + S.n.slice(1), "Olivolja, salt & peppar"],
    steps: M.steps.map(fill),
  };
}

function openRecipeGen(seed) {
  const r = generateRecipe(seed != null ? seed : Math.floor(Math.random() * 1e9));
  openModal(`
    <div class="card-kicker">🧪 Genererat recept · anpassat efter dig</div>
    <h2>${esc(r.name)}</h2>
    <div class="recipe-meta" style="margin:.6rem 0 1rem"><span><b>${r.kcal}</b> kcal</span><span><b>${r.p} g</b> protein</span><span><b>~${r.min}</b> min</span></div>
    <div class="section-title" style="font-size:1.05rem;margin-top:0">Ingredienser<span class="st-line"></span></div>
    <ul class="tips-list" style="margin-bottom:1rem">${r.ing.map(i => `<li style="padding:.35rem 0">${esc(i)}</li>`).join("")}</ul>
    <div class="section-title" style="font-size:1.05rem">Gör så här<span class="st-line"></span></div>
    <ol style="padding-left:1.2rem;color:var(--cream-dim);line-height:1.65;margin-bottom:1.3rem">
      ${r.steps.map(s => `<li style="margin-bottom:.35rem">${esc(s)}</li>`).join("")}
    </ol>
    <div class="ob-nav" style="margin-top:0;flex-wrap:wrap">
      <button class="btn" id="genSaveFav">★ Spara som favorit</button>
      <button class="btn ghost" id="genSave">Spara</button>
      <button class="btn ghost" id="genAgain">🧪 Generera nytt</button>
    </div>`);
  const doSave = fav => {
    state.customRecipes.push(r);
    if (fav) state.favs.push(r.id);
    save(); closeModal();
    toast("🧪", "Recept sparat", "\"" + r.name + "\" finns nu bland dina recept" + (fav ? " och favoriter." : "."));
    switchView(currentView);
  };
  $("#genSaveFav").onclick = () => doSave(true);
  $("#genSave").onclick = () => doSave(false);
  $("#genAgain").onclick = () => openRecipeGen();
}
const FOOD_AVOID = [
  [/lax|torsk|sill|tonfisk|räk|makrill|sushi|fisk/i, "fisk"],
  [/kyckling|kalkon/i, "fågel"],
  [/biff|köttbull|köttfärs|högrev|pytt/i, "nötkött"],
  [/fläsk|bacon|skinka/i, "fläsk"],
  [/ägg|omelett/i, "ägg"],
  [/mjölk|\bfil\b|kvarg|keso|ost/i, "mejeri"],
];
function foodOk(f) { return !FOOD_AVOID.some(([re, tag]) => state.prefs.avoid.includes(tag) && re.test(f.n)); }

/* Gemensamma måltidspooler för veckoplan & dagsplan — {name, kcal, p, rid?} */
function mealPools() {
  const okFoods = FOODS.filter(foodOk);
  const rp = allowedRecipes();
  return {
    breakfast: [
      // Bara riktiga frukostar — småplock som ett ensamt ägg hör hemma bland mellanmålen
      ...okFoods.filter(f => f.c === "frukost" && f.kcal >= 200).map(f => ({ name: f.n, kcal: f.kcal, p: f.p })),
      ...rp.filter(r => r.tags.includes("frukost")).map(r => ({ name: r.name, kcal: r.kcal, p: r.p, rid: r.id })),
    ],
    lunch: [
      ...rp.filter(r => !r.tags.includes("frukost") && (r.tags.includes("snabb") || r.tags.includes("matlåda") || r.tags.includes("vardag"))).map(r => ({ name: r.name, kcal: r.kcal, p: r.p, rid: r.id })),
      ...okFoods.filter(f => f.c === "lunch").map(f => ({ name: f.n, kcal: f.kcal, p: f.p })),
    ],
    dinner: rp.filter(r => !r.tags.includes("frukost")),
    snacks: okFoods.filter(f => f.c === "mellanmål" && f.kcal < 250),
  };
}

function genMealPlan(roll) {
  const monday = weekKeys()[0];
  const pools = mealPools();
  const pool = pools.dinner;
  const rnd = makeRng(hashStr(monday) + roll * 7919);
  // Favoriter först: upp till 3 av veckans middagar hämtas från dina favoriter
  const favPool = pool.filter(r => isFav(r.id));
  const favPicks = pickN(favPool, Math.min(3, favPool.length), rnd);
  const rest = pool.filter(r => !favPicks.includes(r));
  const ids = favPicks.concat(pickN(rest, Math.min(7 - favPicks.length, rest.length), rnd)).map(r => r.id);
  while (ids.length < 7) ids.push(pool[Math.floor(rnd() * pool.length)].id);
  // Blanda så favoriterna inte alltid ligger mån–ons
  for (let i = ids.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [ids[i], ids[j]] = [ids[j], ids[i]]; }
  // Frukost & lunch: variera över veckan utan att upprepa två dagar i rad
  const pickWeek = pl => {
    const out = [];
    for (let i = 0; i < 7; i++) {
      let cand = pl[Math.floor(rnd() * pl.length)], tries = 0;
      while (out[i - 1] && cand.name === out[i - 1].name && tries++ < 5) cand = pl[Math.floor(rnd() * pl.length)];
      out.push(cand);
    }
    return out;
  };
  const breakfasts = pickWeek(pools.breakfast);
  const lunches = pickWeek(pools.lunch);
  state.mealPlan = { monday, roll, ids, breakfasts, lunches };
  save();
}
function ensureMealPlan() {
  if (!state.mealPlan || state.mealPlan.monday !== weekKeys()[0] || !state.mealPlan.lunches) genMealPlan(0);
}
function todaysPlannedDinner() {
  ensureMealPlan();
  const idx = (new Date().getDay() + 6) % 7; // mån=0
  return RECIPES.find(r => r.id === state.mealPlan.ids[idx]);
}
function buildShopping() {
  ensureMealPlan();
  const seen = new Set(), items = [];
  const add = i => { const k = i.toLowerCase(); if (!seen.has(k)) { seen.add(k); items.push({ t: i, done: false }); } };
  // Middagar: fulla ingredienslistor
  state.mealPlan.ids.forEach(id => { const r = findRecipe(id); if (r) r.ing.forEach(add); });
  // Frukost & lunch: receptbaserade får ingredienser, enkla rätter läggs som en rad
  [...(state.mealPlan.breakfasts || []), ...(state.mealPlan.lunches || [])].forEach(m => {
    if (!m) return;
    const r = m.rid ? findRecipe(m.rid) : null;
    if (r) r.ing.forEach(add); else add("Till: " + m.name);
  });
  state.shopping = items;
  save();
}

/* "Vad ska jag äta idag?" — förslag utifrån mål, preferenser och vad som redan loggats */
function openEatSuggestion() {
  const today = dkey();
  const tot = dayTotals(today);
  const t = state.targets;
  const left = Math.round(t.kcal - tot.kcal);
  const pLeft = Math.round(t.protein - tot.p);
  const logged = new Set(mealsFor(today).map(m => m.meal));
  const okFoods = FOODS.filter(foodOk);
  const dinner = todaysPlannedDinner();
  const sugg = [];

  if (!logged.has("frukost")) {
    const f = okFoods.filter(x => x.c === "frukost").sort((a, b) => b.p - a.p)[0];
    if (f) sugg.push({ meal: "frukost", name: f.n, kcal: f.kcal, p: f.p });
  }
  if (!logged.has("lunch")) {
    const lunchR = allowedRecipes().filter(r => r.tags.includes("snabb") || r.tags.includes("matlåda"))[hashStr(today) % 3];
    if (lunchR) sugg.push({ meal: "lunch", name: lunchR.name, kcal: lunchR.kcal, p: lunchR.p, rid: lunchR.id });
  }
  if (!logged.has("middag") && dinner) {
    sugg.push({ meal: "middag", name: dinner.name, kcal: dinner.kcal, p: dinner.p, rid: dinner.id });
  }
  const plannedP = tot.p + sugg.reduce((a, s) => a + s.p, 0);
  if (plannedP < t.protein) {
    const snack = okFoods.filter(x => x.c === "mellanmål" && x.p >= 15).sort((a, b) => b.p - a.p)[0];
    if (snack) sugg.push({ meal: "mellanmål", name: snack.n, kcal: snack.kcal, p: snack.p });
  }

  openModal(`
    <h2>Vad ska du äta idag?</h2>
    <p class="sub" style="margin:.4rem 0 1.2rem">
      Kvar av dagens budget: <b style="color:var(--amber-soft)">${left} kcal</b> och <b style="color:var(--amber-soft)">${Math.max(0, pLeft)} g protein</b>.
      Förslagen tar hänsyn till dina preferenser och veckans matsedel.</p>
    ${sugg.length ? sugg.map((s, i) => `
      <div class="meal-item" style="margin-bottom:.5rem">
        <span><b style="text-transform:capitalize;font-family:var(--font-display)">${s.meal}</b><br>${esc(s.name)}${s.rid ? ` <button class="link-btn" data-r="${esc(s.rid)}">recept</button>` : ""}</span>
        <span style="display:flex;gap:.9rem;align-items:center">
          <span class="mi-macro">${s.kcal} kcal · ${s.p} g</span>
          <button class="btn small" data-log="${i}">+ Logga</button>
        </span>
      </div>`).join("") : `<p class="sub">Alla måltider är redan loggade idag — snyggt jobbat!</p>`}
    <p class="sub" style="margin-top:1rem;font-size:.85rem">Middagen kommer från veckans matsedel under Recept — där finns även inköpslistan.</p>`);

  $$("[data-log]").forEach(b => b.onclick = () => {
    const s = sugg[+b.dataset.log];
    if (!state.logs.meals[today]) state.logs.meals[today] = [];
    state.logs.meals[today].push({ name: s.name, kcal: s.kcal, p: s.p, meal: s.meal });
    save(); closeModal();
    toast("✦", "Loggad", s.name + " tillagd som " + s.meal + ".");
    switchView(currentView);
  });
  $$("[data-r]").forEach(b => b.onclick = () => openRecipe(findRecipe(b.dataset.r)));
}

/* ─────────────── DAGSPLAN: slumpa frukost + lunch + middag + mellanmål ───────────────
   Träffar dags-kcal inom ±8 % och prioriterar protein. */
function buildDayPlan(seed) {
  const rnd = makeRng(seed);
  const t = state.targets;
  const pools = mealPools();
  const pickR = arr => arr[Math.floor(rnd() * arr.length)];

  const breakfastPool = pools.breakfast;
  const lunchPool = pools.lunch;
  const dinnerPool = pools.dinner.map(r => ({ name: r.name, kcal: r.kcal, p: r.p, rid: r.id }));
  const snackPool = pools.snacks;

  const planned = todaysPlannedDinner();
  const items = [
    { meal: "frukost", ...pickR(breakfastPool) },
    { meal: "lunch", ...pickR(lunchPool) },
    { meal: "middag", ...(rnd() < 0.6 && planned ? { name: planned.name, kcal: planned.kcal, p: planned.p, rid: planned.id } : pickR(dinnerPool)) },
  ];

  // Fyll upp mot kalorimålet med mellanmål — proteinrika först om proteingap finns
  let sum = () => items.reduce((a, x) => a + x.kcal, 0);
  let psum = () => items.reduce((a, x) => a + x.p, 0);
  let guard = 0;
  while (sum() < t.kcal * 0.92 && guard++ < 3) {
    const gap = t.kcal - sum();
    const needP = psum() < t.protein * 0.9;
    const pool = snackPool
      .filter(f => f.kcal <= gap + 80 && !items.some(x => x.name === f.n))
      .sort((a, b) => needP ? (b.p / b.kcal) - (a.p / a.kcal) : Math.abs(gap - a.kcal) - Math.abs(gap - b.kcal));
    const pick = pool[Math.floor(rnd() * Math.min(3, pool.length))];
    if (!pick) break;
    items.push({ meal: "mellanmål", name: pick.n, kcal: pick.kcal, p: pick.p });
  }
  return { date: dkey(), seed, items };
}

function openDayPlan(seed) {
  // Återanvänd dagens sparade plan om ingen ny slump begärts
  if (seed == null && state.dayPlan && state.dayPlan.date === dkey() && state.dayPlan.items) {
    return renderDayPlanModal(state.dayPlan);
  }
  const plan = buildDayPlan(seed != null ? seed : Math.floor(Math.random() * 1e9));
  renderDayPlanModal(plan);
}

function renderDayPlanModal(plan) {
  const t = state.targets;
  state.dayPlan = plan; save();
  const kcal = plan.items.reduce((a, x) => a + x.kcal, 0);
  const prot = plan.items.reduce((a, x) => a + x.p, 0);
  const ICONS = { frukost: "☀", lunch: "✦", middag: "◉", mellanmål: "·" };

  openModal(`
    <div class="card-kicker">🎲 Dagens matsedel · slumpad mot dina mål</div>
    <h2>Så här äter du idag</h2>
    <p class="sub" style="margin:.4rem 0 1.1rem">
      Totalt <b style="color:var(--amber-soft)">${kcal} kcal</b> (mål ${t.kcal}) och
      <b style="color:var(--amber-soft)">${prot} g protein</b> (mål ${t.protein}) — anpassat efter dina preferenser.</p>
    ${plan.items.map((s, i) => `
      <div class="meal-item" style="margin-bottom:.5rem">
        <span><b style="text-transform:capitalize;font-family:var(--font-display)">${ICONS[s.meal] || ""} ${s.meal}</b><br>
          ${esc(s.name)}${s.rid ? ` <button class="link-btn" data-r="${esc(s.rid)}">recept</button>` : ""}</span>
        <span style="display:flex;gap:.7rem;align-items:center">
          <span class="mi-macro">${s.kcal} kcal · ${s.p} g</span>
          <button class="btn small ghost" data-re="${i}" title="Slumpa om denna">🎲</button>
          <button class="btn small" data-log="${i}">+ Logga</button>
        </span>
      </div>`).join("")}
    <div class="ob-nav" style="margin-top:1.2rem;flex-wrap:wrap">
      <button class="btn" id="dpLogAll">Logga hela dagen ✓</button>
      <button class="btn ghost" id="dpReroll">🎲 Slumpa om allt</button>
    </div>`);

  const logItem = s => {
    const today = dkey();
    if (!state.logs.meals[today]) state.logs.meals[today] = [];
    state.logs.meals[today].push({ name: s.name, kcal: s.kcal, p: s.p, meal: s.meal });
  };
  $$("[data-log]").forEach(b => b.onclick = () => {
    logItem(plan.items[+b.dataset.log]); save(); closeModal();
    toast("✦", "Loggad", plan.items[+b.dataset.log].name + " tillagd.");
    switchView(currentView);
  });
  $$("[data-re]").forEach(b => b.onclick = () => {
    // Slumpa om bara denna rad — övriga behålls
    const i = +b.dataset.re;
    const fresh = buildDayPlan(Math.floor(Math.random() * 1e9));
    const repl = fresh.items.find(x => x.meal === plan.items[i].meal && x.name !== plan.items[i].name) || fresh.items[Math.min(i, fresh.items.length - 1)];
    plan.items[i] = repl;
    renderDayPlanModal(plan);
  });
  $$("[data-r]").forEach(b => b.onclick = () => openRecipe(findRecipe(b.dataset.r)));
  $("#dpLogAll").onclick = () => {
    plan.items.forEach(logItem); save(); closeModal();
    toast("✦", "Hela dagen loggad", plan.items.length + " måltider · " + kcal + " kcal · " + prot + " g protein.");
    switchView(currentView);
  };
  $("#dpReroll").onclick = () => openDayPlan(Math.floor(Math.random() * 1e9));
}

/* ─────────────── TOASTS & NOTISER ─────────────── */
function toast(ico, title, body, ms = 9000) {
  const el = document.createElement("div");
  el.className = "toast";
  el.innerHTML = `<div class="t-ico">${ico}</div><div><h4>${esc(title)}</h4><p>${esc(body)}</p></div><button class="t-close">✕</button>`;
  $(".t-close", el).onclick = () => el.remove();
  $("#toasts").appendChild(el);
  if (ms) setTimeout(() => el.remove(), ms);
  return el;
}

/* Service workern har installerat en ny version bredvid den som kör. Ladda inte
   om automatiskt — står man mitt i ett pass och loggar set är det tvärtemot vad
   man vill. Erbjud omladdningen istället; nästa start tar den nya versionen ändå. */
window.onAppUpdate = () => {
  if (window.__updateShown) return;
  window.__updateShown = true;
  const el = toast("⬆️", "Ny version av STARK50", "Tryck här för att ladda om och köra den senaste.", 0);
  el.style.cursor = "pointer";
  el.onclick = e => { if (!e.target.classList.contains("t-close")) location.reload(); };
};

/* Vilken version som faktiskt kör — sw.js äger strängen och svarar på förfrågan.
   Det är det enda sättet att se med egna ögon att en uppdatering nått telefonen. */
function swVersion() {
  return new Promise(resolve => {
    const sw = navigator.serviceWorker && navigator.serviceWorker.controller;
    if (!sw) return resolve(null);
    const ch = new MessageChannel();
    const timer = setTimeout(() => resolve(null), 1500);
    ch.port1.onmessage = e => { clearTimeout(timer); resolve(e.data); };
    try { sw.postMessage({ type: "version" }, [ch.port2]); }
    catch (e) { clearTimeout(timer); resolve(null); }
  });
}
/* Systemnotis via service workern. iOS (och Chrome på Android) stöder INTE
   `new Notification(...)` — bara registration.showNotification(). Konstruktorn
   ligger kvar som sista utväg för äldre desktop-webbläsare. */
function notify(title, body) {
  if (!("Notification" in window) || Notification.permission !== "granted") return;
  const opts = { body, icon: "icon-192.png", badge: "icon-192.png", tag: "stark50", renotify: false };
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.ready
      .then(reg => reg.showNotification(title, opts))
      .catch(() => { try { new Notification(title, opts); } catch (e) { /* stöds inte */ } });
  } else {
    try { new Notification(title, opts); } catch (e) { /* stöds inte */ }
  }
}
function remind(ico, title, body) { toast(ico, title, body, 15000); notify(title, body); }

/* ─────────────── PÅMINNELSEMOTOR ───────────────
   Körs var 30:e sekund medan fliken är öppen — och fångar upp påminnelser vars
   tidpunkt passerat medan appen var stängd, istället för att tappa dem helt.
   CATCHUP_MIN sätter hur gammal en missad påminnelse får vara för att fortfarande
   visas; annars skulle man mötas av ett regn av notiser när man öppnar appen. */
const WATER_TIMES = ["09:30", "11:30", "13:30", "15:30", "17:30"];
const CATCHUP_MIN = 180;

function checkReminders() {
  if (!state.onboarded) return;
  const now = new Date();
  const nowMin = now.getHours() * 60 + now.getMinutes();
  const today = dkey();
  if (state.fired.date !== today) state.fired = { date: today, keys: [] };

  // Sant när klockslaget har passerat idag och inte ligger längre bak än fönstret
  const due = hhmm => {
    if (!/^\d{1,2}:\d{2}$/.test(hhmm || "")) return false;
    const [h, m] = hhmm.split(":").map(Number);
    const diff = nowMin - (h * 60 + m);
    return diff >= 0 && diff <= CATCHUP_MIN;
  };
  const fire = (key, fn) => {
    if (state.fired.keys.includes(key)) return;
    state.fired.keys.push(key); save(); fn();
  };

  (state.reminders.walks || []).forEach(t => {
    if (due(t)) fire("walk-" + t, () =>
      remind("🚶", "Dags för en promenad", "Res dig och gå i 20–30 minuter. Benen, hjärtat och huvudet tackar dig."));
  });
  if (state.reminders.water) WATER_TIMES.forEach(t => {
    if (due(t)) fire("water-" + t, () =>
      remind("💧", "Ett glas vatten", "Törstkänslan avtar med åren — drick innan du känner dig törstig."));
  });
  if (state.reminders.windDown && due(state.reminders.windDown)) {
    fire("wind", () => remind("🌙", "Dags att varva ner", "Släck skärmarna snart. Logga gärna dagens sömn och stress under Sinne."));
  }
  // Veckovägning: valfri veckodag + tid (0=sön ... 6=lör)
  const r = state.reminders;
  if (r.weighDay != null && now.getDay() === r.weighDay && due(r.weighTime || "07:30")) {
    fire("weigh", () => remind("⚖️", "Dags att väga dig", "Före frukost, efter toaletten — samma förutsättningar varje gång. Logga under Mål."));
  }
  // Träningspåminnelse på schemalagda dagar — hoppas över om passet redan är loggat
  const trainToday = scheduledFor(today);
  if (trainToday && state.schedule.remind !== false && due(scheduleTime())
      && !state.logs.sessions.some(s => s.date === today)) {
    fire("train-" + today, () => remind("▲", "Dags för dagens pass",
      trainToday.auto ? "Generera passet under Träning — dagsformen styr intensiteten." : trainToday.name + " står på schemat idag."));
  }
  // Måltidspåminnelser (lunch & kväll) om påslaget
  if (r.mealPing) {
    if (due("12:45")) fire("meal-lunch", () => remind("✦", "Har du loggat lunchen?", "30 sekunder nu sparar gissningar ikväll."));
    if (due("20:00")) fire("meal-dinner", () => remind("✦", "Logga dagens måltider", "Kolla att middagen är loggad — då stämmer veckorapporten."));
  }
}
setInterval(checkReminders, 30000);
// Fånga upp missade påminnelser när appen tas fram igen
document.addEventListener("visibilitychange", () => { if (!document.hidden) checkReminders(); });

/* ═══════════════ ONBOARDING ═══════════════ */

let ob = { step: 0, draft: null, tmpWorkouts: [] };
const OB_STEPS = 10;

function startOnboarding(existing) {
  ob.step = 0;
  ob.draft = existing ? JSON.parse(JSON.stringify(state.profile)) : defaultState().profile;
  if (!ob.draft.walksPerDay) ob.draft.walksPerDay = 1;
  ob.tmpWorkouts = existing && state.workouts.length ? JSON.parse(JSON.stringify(state.workouts)) : null;
  // Startpassen byts bara ut om mål eller inriktning faktiskt ändras. Kör man om
  // onboardingen för att rätta sitt namn ska egna pass och schemat överleva.
  ob.origGoal = ob.draft.goal;
  ob.origDisc = ob.draft.discipline;
  ob.existing = !!existing;
  ob.tmpReminders = JSON.parse(JSON.stringify(state.reminders));
  ob.tmpPrefs = JSON.parse(JSON.stringify(state.prefs || { avoid: [], vego: false }));
  ob.tmpDevices = [...(state.devices || [])];
  $("#app").classList.add("hidden");
  $("#onboarding").classList.remove("hidden");
  renderOb();
}

function obProgress() {
  return `<div class="ob-progress">${Array.from({ length: OB_STEPS - 1 }, (_, i) =>
    `<span class="${i < ob.step ? "done" : ""}"></span>`).join("")}</div>`;
}

function renderOb() {
  const el = $("#obInner");
  const d = ob.draft;
  const steps = [obHero, obYou, obGoal, obDiscipline, obHabits, obPrefs, obWorkouts, obReminders, obDevices, obSummary];
  el.innerHTML = "";
  el.appendChild(steps[ob.step]());
  el.scrollTop = 0; window.scrollTo(0, 0);
}
function obStepEl(html) { const div = document.createElement("div"); div.className = "ob-step"; div.innerHTML = html; return div; }
function obNext(valid = true) { if (!valid) return; ob.step++; renderOb(); }
function obBack() { ob.step--; renderOb(); }

/* Steg 0 — Hero */
function obHero() {
  const el = obStepEl(`
    <div style="padding-top:8vh">
      <div class="ob-kicker">För män som passerat femtio</div>
      <div class="ob-hero-title">STARK<span class="fifty">50</span></div>
      <div class="ob-hero-rule"></div>
      <p class="ob-lead">Det här är inte en app för 25-åringar med sixpack-drömmar. Det är din
      personliga plan för styrka, mat, sömn och lugn — byggd för kroppen du har nu, och den du vill ha om tio år.</p>
      <ul class="ob-hero-list">
        <li>Träningspass anpassade efter ditt mål — eller bygg dina egna</li>
        <li>Mattracking med kalori- och proteinmål uträknade för dig</li>
        <li>Recept som slumpas fram när fantasin tryter</li>
        <li>Promenad- och vattenpåminnelser under dagen</li>
        <li>Sömn, stress och avslappning — halva jobbet sker utanför gymmet</li>
      </ul>
      <button class="btn" id="obStart">Sätt igång →</button>
    </div>`);
  $("#obStart", el).onclick = () => obNext();
  return el;
}

/* Steg 1 — Om dig */
function obYou() {
  const d = ob.draft;
  const el = obStepEl(`
    ${obProgress()}
    <div class="ob-kicker">Steg 1 av 9</div>
    <h2 class="ob-title">Vem är <em>du</em>?</h2>
    <p class="ob-lead">Uppgifterna används bara för att räkna ut dina kalori- och proteinmål. Allt stannar i din webbläsare.</p>
    <div class="ob-grid">
      <div class="full"><label>Vad ska vi kalla dig?</label><input id="obName" value="${esc(d.name)}" placeholder="Förnamn"></div>
      <div><label>Ålder</label><input id="obAge" type="number" min="35" max="90" value="${d.age}"></div>
      <div><label>Längd (cm)</label><input id="obHeight" type="number" min="140" max="220" value="${d.height}"></div>
      <div><label>Vikt (kg)</label><input id="obWeight" type="number" min="45" max="220" value="${d.weight}"></div>
    </div>
    <div class="ob-nav">
      <button class="btn ghost" id="obB">← Tillbaka</button>
      <button class="btn" id="obN">Fortsätt →</button>
    </div>`);
  $("#obB", el).onclick = obBack;
  $("#obN", el).onclick = () => {
    d.name = $("#obName", el).value.trim() || "Kompis";
    d.age = +$("#obAge", el).value || 52;
    d.height = +$("#obHeight", el).value || 180;
    d.weight = +$("#obWeight", el).value || 88;
    obNext();
  };
  return el;
}

/* Steg 2 — Mål */
function obGoal() {
  const d = ob.draft;
  const el = obStepEl(`
    ${obProgress()}
    <div class="ob-kicker">Steg 2 av 9</div>
    <h2 class="ob-title">Vad vill du <em>uppnå</em>?</h2>
    <p class="ob-lead">Ditt val styr träningspassen, kalorimålet och proteinnivån. Du kan byta när som helst.</p>
    <div class="goal-cards">
      ${Object.entries(GOAL_META).map(([k, g]) => `
        <button class="goal-card ${d.goal === k ? "selected" : ""}" data-goal="${k}">
          <div class="gc-ico">${g.ico}</div>
          <div><h3>${g.label}</h3><p>${g.desc}</p><span class="gc-tag">${g.tag}</span></div>
        </button>`).join("")}
    </div>
    <div id="obPaceWrap" style="${d.goal === "fett" ? "" : "display:none"};margin-top:.4rem">
      <label>Takt på viktnedgången</label>
      <p class="sub" style="margin-bottom:.6rem">Forskningen: håll dig under 1 % av kroppsvikten per vecka så behåller du musklerna.</p>
      <div class="chip-row" id="obPace" style="margin-bottom:1.2rem">
        ${Object.entries(PACES).map(([k, pc]) => `<button class="chip ${(d.pace || "medel") === k ? "selected" : ""}" data-p="${k}">${pc.label} · ${String(pc.pct).replace(".", ",")} %/v</button>`).join("")}
      </div>
      <label>Målvikt (valfritt)</label>
      <input id="obTargetW" type="number" step="0.5" min="50" max="200" value="${d.targetWeight || ""}" placeholder="t.ex. 88" style="max-width:200px">
    </div>
    <div class="ob-nav">
      <button class="btn ghost" id="obB">← Tillbaka</button>
      <button class="btn" id="obN">Fortsätt →</button>
    </div>`);
  const paceWrap = $("#obPaceWrap", el);
  $$(".goal-card", el).forEach(b => b.onclick = () => {
    d.goal = b.dataset.goal;
    $$(".goal-card", el).forEach(x => x.classList.toggle("selected", x === b));
    paceWrap.style.display = d.goal === "fett" ? "" : "none";
  });
  $$("#obPace .chip", el).forEach(c => c.onclick = () => {
    d.pace = c.dataset.p;
    $$("#obPace .chip", el).forEach(x => x.classList.toggle("selected", x === c));
  });
  $("#obB", el).onclick = obBack;
  $("#obN", el).onclick = () => {
    if (d.goal === "fett") d.targetWeight = +$("#obTargetW", el).value || null;
    if (d.goal !== ob.origGoal) ob.tmpWorkouts = null; // nytt mål → nya startpass
    obNext();
  };
  return el;
}

/* Steg 3 — Träningsinriktning.
   Måste ligga FÖRE obHabits, som är där startpassen faktiskt skapas. */
function obDiscipline() {
  const d = ob.draft;
  if (!d.discipline) d.discipline = "allman"; // användare från före inriktningarna
  const el = obStepEl(`
    ${obProgress()}
    <div class="ob-kicker">Steg 3 av 9</div>
    <h1 class="ob-title">Vad tränar du <em>mot</em>?</h1>
    <p class="ob-lead">Det här styr vilka pass du får och hur programmet byggs upp över tid — inte hur du äter.
    Kosten följer målet du just valde, så du kan mycket väl köra Hyrox i underskott.</p>
    <div class="goal-cards">
      ${Object.entries(DISC_META).map(([k, m]) => `
        <button class="goal-card ${d.discipline === k ? "selected" : ""}" data-disc="${k}">
          <div class="gc-ico">${m.ico}</div>
          <div><h3>${m.label}</h3><p>${m.desc}</p>
            <p style="margin-top:.5rem;color:var(--cream-faint);font-size:.9rem">${m.reality}</p>
            <span class="gc-tag">${m.tag}</span></div>
        </button>`).join("")}
    </div>
    <p class="sub" style="margin-top:1.2rem">Oavsett vad du väljer bygger appen ett rullande fyraveckorsblock: tre veckor som trappar upp och en lättare vecka som låter kroppen bygga tillbaka. Du kan byta inriktning när du vill under Inställningar.</p>
    <div class="ob-nav">
      <button class="btn ghost" id="obB">← Tillbaka</button>
      <button class="btn" id="obN">Fortsätt →</button>
    </div>`);
  $$(".goal-card", el).forEach(b => b.onclick = () => {
    d.discipline = b.dataset.disc;
    $$(".goal-card", el).forEach(x => x.classList.toggle("selected", x === b));
  });
  $("#obB", el).onclick = obBack;
  $("#obN", el).onclick = () => {
    if (d.discipline !== ob.origDisc) ob.tmpWorkouts = null; // ny inriktning → nya startpass i nästa steg
    obNext();
  };
  return el;
}

/* Steg 4 — Vanor */
function obHabits() {
  const d = ob.draft;
  const acts = [
    { v: 1.2, l: "Stillasittande", s: "Kontorsjobb, lite rörelse" },
    { v: 1.375, l: "Lätt aktiv", s: "Promenader, rör mig ibland" },
    { v: 1.55, l: "Aktiv", s: "Rör mig varje dag" },
    { v: 1.725, l: "Mycket aktiv", s: "Fysiskt jobb eller daglig träning" },
  ];
  const el = obStepEl(`
    ${obProgress()}
    <div class="ob-kicker">Steg 4 av 9</div>
    <h2 class="ob-title">Din <em>vardag</em></h2>
    <p class="ob-lead">Hur många pass i veckan är realistiskt — inte i bästa fall, utan en vanlig vecka?</p>
    <label>Träningspass per vecka</label>
    <div class="chip-row" id="obDays" style="margin-bottom:1.6rem">
      ${[2, 3, 4, 5].map(n => `<button class="chip ${d.trainingDays === n ? "selected" : ""}" data-n="${n}">${n} pass</button>`).join("")}
    </div>
    <label>Powerwalks per dag</label>
    <p class="sub" style="margin-bottom:.6rem">Raska promenader på 20–30 min. Välj hur många du vill klämma in per dag — appen påminner dig.</p>
    <div class="chip-row" id="obWpd" style="margin-bottom:1.6rem">
      ${[[1, "1 om dagen"], [2, "2 om dagen"], [3, "3 eller fler"]].map(([n, l]) => `<button class="chip ${(d.walksPerDay || 1) === n ? "selected" : ""}" data-n="${n}">${l}</button>`).join("")}
    </div>
    <label>Aktivitetsnivå utanför träningen</label>
    <div class="goal-cards">
      ${acts.map(a => `
        <button class="goal-card ${d.activity === a.v ? "selected" : ""}" data-v="${a.v}" style="padding:.9rem 1.2rem">
          <div><h3 style="font-size:1.05rem">${a.l}</h3><p>${a.s}</p></div>
        </button>`).join("")}
    </div>
    <div class="ob-nav">
      <button class="btn ghost" id="obB">← Tillbaka</button>
      <button class="btn" id="obN">Fortsätt →</button>
    </div>`);
  $$("#obDays .chip", el).forEach(c => c.onclick = () => {
    d.trainingDays = +c.dataset.n;
    $$("#obDays .chip", el).forEach(x => x.classList.toggle("selected", x === c));
  });
  $$("#obWpd .chip", el).forEach(c => c.onclick = () => {
    d.walksPerDay = +c.dataset.n;
    $$("#obWpd .chip", el).forEach(x => x.classList.toggle("selected", x === c));
  });
  $$(".goal-card[data-v]", el).forEach(b => b.onclick = () => {
    d.activity = +b.dataset.v;
    $$(".goal-card[data-v]", el).forEach(x => x.classList.toggle("selected", x === b));
  });
  $("#obB", el).onclick = obBack;
  $("#obN", el).onclick = () => {
    if (!ob.tmpWorkouts) ob.tmpWorkouts = templatesFor(d).map((w, i) => ({ id: "w" + Date.now() + i, custom: false, ...JSON.parse(JSON.stringify(w)) }));
    ob.tmpReminders.walks = WALK_DEFAULTS[Math.min(d.walksPerDay || 1, 3)];
    obNext();
  };
  return el;
}

const WALK_DEFAULTS = { 1: ["10:00"], 2: ["10:00", "15:00"], 3: ["08:30", "12:30", "16:30"] };

/* Steg 4 — Matpreferenser */
function obPrefs() {
  const p = ob.tmpPrefs;
  const el = obStepEl(`
    ${obProgress()}
    <div class="ob-kicker">Steg 5 av 9</div>
    <h2 class="ob-title">Vad vill du <em>inte</em> äta?</h2>
    <p class="ob-lead">Markera det du undviker — receptförslag, matsedel och inköpslista anpassas efter dina val.</p>
    <label>Jag undviker</label>
    <div class="chip-row" id="obAvoid" style="margin-bottom:1.6rem">
      ${PREF_OPTS.map(o => `<button class="chip ${p.avoid.includes(o.id) ? "selected" : ""}" data-t="${o.id}">${o.label}</button>`).join("")}
    </div>
    <label>Växtbaserat</label>
    <div class="chip-row">
      <button class="chip ${p.vego ? "selected" : ""}" id="obVego">🌱 Vegetariskt så ofta det går</button>
    </div>
    <div class="ob-nav">
      <button class="btn ghost" id="obB">← Tillbaka</button>
      <button class="btn" id="obN">Fortsätt →</button>
    </div>`);
  $$("#obAvoid .chip", el).forEach(c => c.onclick = () => {
    const t = c.dataset.t;
    p.avoid.includes(t) ? p.avoid.splice(p.avoid.indexOf(t), 1) : p.avoid.push(t);
    c.classList.toggle("selected");
  });
  $("#obVego", el).onclick = e => { p.vego = !p.vego; e.target.classList.toggle("selected", p.vego); };
  $("#obB", el).onclick = obBack;
  $("#obN", el).onclick = () => obNext();
  return el;
}

/* Steg 7 — Enheter */
function obDevices() {
  const el = obStepEl(`
    ${obProgress()}
    <div class="ob-kicker">Steg 8 av 9</div>
    <h2 class="ob-title">Dina <em>enheter</em></h2>
    <p class="ob-lead">Har du en klocka, ring eller hälsoapp? Markera dem så får du en plats på översikten för steg, vilopuls och sömn.</p>
    <div class="chip-row" id="obDev" style="margin-bottom:1.4rem">
      ${DEVICES.map(dv => `<button class="chip ${ob.tmpDevices.includes(dv.id) ? "selected" : ""}" data-d="${dv.id}">${dv.ico} ${dv.name}</button>`).join("")}
    </div>
    <p class="sub" style="max-width:56ch">Ärligt talat: en webbapp kan inte läsa Apple Health eller Garmin automatiskt — det kräver en riktig telefonapp.
    Här fungerar det så att du <strong>synkar dagens siffror med ett klick</strong> från översikten (steg, vilopuls, sömn), så räknas de in i dina mål.</p>
    <div class="ob-nav">
      <button class="btn ghost" id="obB">← Tillbaka</button>
      <button class="btn" id="obN">Fortsätt →</button>
    </div>`);
  $$("#obDev .chip", el).forEach(c => c.onclick = () => {
    const t = c.dataset.d;
    ob.tmpDevices.includes(t) ? ob.tmpDevices.splice(ob.tmpDevices.indexOf(t), 1) : ob.tmpDevices.push(t);
    c.classList.toggle("selected");
  });
  $("#obB", el).onclick = obBack;
  $("#obN", el).onclick = () => obNext();
  return el;
}

/* Steg 4 — Träningspass (mallar + egen byggare) */
function obWorkouts() {
  const el = obStepEl(`
    ${obProgress()}
    <div class="ob-kicker">Steg 6 av 9</div>
    <h2 class="ob-title">Dina <em>träningspass</em></h2>
    <p class="ob-lead">Vi har satt ihop pass utifrån ditt mål — skonsamma för leder men tuffa nog att ge resultat.
    Redigera dem, släng dem eller bygg helt egna.</p>
    <div id="obWkList"></div>
    <button class="btn ghost small" id="obAddWk">+ Bygg eget pass</button>
    <div class="ob-nav">
      <button class="btn ghost" id="obB">← Tillbaka</button>
      <button class="btn" id="obN">Fortsätt →</button>
    </div>`);
  renderWkList($("#obWkList", el));
  $("#obAddWk", el).onclick = () => openWorkoutBuilder(null, () => renderWkList($("#obWkList", el)));
  $("#obB", el).onclick = obBack;
  $("#obN", el).onclick = () => obNext(ob.tmpWorkouts.length > 0 || (toast("⚠️", "Minst ett pass", "Lägg till minst ett träningspass för att fortsätta."), false));
  return el;
}

function renderWkList(container) {
  // Listan kan nås innan passen hunnit skapas (t.ex. om man backar i flödet)
  if (!ob.tmpWorkouts) ob.tmpWorkouts = templatesFor(ob.draft).map((w, i) =>
    ({ id: "w" + Date.now() + i, custom: false, ...JSON.parse(JSON.stringify(w)) }));
  container.innerHTML = ob.tmpWorkouts.map((w, i) => `
    <div class="wk-card">
      <div class="wk-card-head"><h3>${esc(w.name)}</h3><span class="wk-focus">${esc(w.focus || (w.custom ? "Eget pass" : ""))}</span></div>
      <ul class="wk-ex-list">
        ${w.exercises.map(e => `<li><span>${esc(e.name)}</span><span class="sets">${e.sets} × ${esc(e.reps)}</span></li>`).join("")}
      </ul>
      <div class="wk-actions">
        <button class="link-btn" data-edit="${i}">Redigera</button>
        <button class="link-btn danger" data-del="${i}">Ta bort</button>
      </div>
    </div>`).join("");
  $$("[data-edit]", container).forEach(b => b.onclick = () => openWorkoutBuilder(+b.dataset.edit, () => renderWkList(container)));
  $$("[data-del]", container).forEach(b => b.onclick = () => { ob.tmpWorkouts.splice(+b.dataset.del, 1); renderWkList(container); });
}

/* Passbyggare (modal) — används i onboarding OCH i appen */
function openWorkoutBuilder(index, onDone, list) {
  const arr = list || ob.tmpWorkouts;
  const w = index != null ? arr[index] : { id: "w" + Date.now(), custom: true, name: "", focus: "", exercises: [{ name: "", sets: 3, reps: "10" }] };
  const draft = JSON.parse(JSON.stringify(w));

  function render() {
    openModal(`
      <h2>${index != null ? "Redigera pass" : "Bygg eget pass"}</h2>
      <p class="sub" style="margin-bottom:1.2rem">Namnge passet och lägg till övningar med set och repetitioner.</p>
      <div style="display:grid;gap:.9rem;margin-bottom:1.2rem">
        <div><label>Passets namn</label><input id="wbName" value="${esc(draft.name)}" placeholder="T.ex. Måndagspasset"></div>
        <div><label>Fokus (valfritt)</label><input id="wbFocus" value="${esc(draft.focus || "")}" placeholder="T.ex. Rygg & biceps"></div>
      </div>
      <label>Övningar</label>
      <div class="ex-builder-row" style="margin-bottom:.2rem">
        <span style="font-size:.72rem;color:var(--cream-faint);font-weight:700;text-transform:uppercase;letter-spacing:.08em">Övning</span>
        <span style="font-size:.72rem;color:var(--cream-faint);font-weight:700;text-align:center">SET</span>
        <span style="font-size:.72rem;color:var(--cream-faint);font-weight:700;text-align:center">REPS</span><span></span>
      </div>
      <div id="wbExs">
        ${draft.exercises.map((e, i) => `
          <div class="ex-builder-row">
            <input data-f="name" data-i="${i}" value="${esc(e.name)}" placeholder="Övning">
            <input data-f="sets" data-i="${i}" type="number" min="1" max="10" value="${e.sets}">
            <input data-f="reps" data-i="${i}" value="${esc(e.reps)}">
            <button class="ex-del" data-i="${i}">✕</button>
          </div>`).join("")}
      </div>
      <button class="link-btn" id="wbAddEx">+ Lägg till övning</button>
      <div class="ob-nav">
        <button class="btn ghost" id="wbCancel">Avbryt</button>
        <button class="btn" id="wbSave">Spara pass</button>
      </div>`);

    const syncInputs = () => $$("#wbExs input").forEach(inp => {
      const e = draft.exercises[+inp.dataset.i];
      // min/max på inputen är bara dekoration — det finns inget <form> som validerar,
      // och Array(3.5) i startSession() kastar RangeError.
      if (inp.dataset.f === "sets") e.sets = clampSets(inp.value); else e[inp.dataset.f] = inp.value;
    });
    $$("#wbExs input").forEach(inp => inp.onchange = syncInputs);
    $$("#wbExs .ex-del").forEach(b => b.onclick = () => { syncInputs(); draft.exercises.splice(+b.dataset.i, 1); if (!draft.exercises.length) draft.exercises.push({ name: "", sets: 3, reps: "10" }); render(); });
    $("#wbAddEx").onclick = () => { syncInputs(); draft.exercises.push({ name: "", sets: 3, reps: "10" }); render(); };
    $("#wbCancel").onclick = closeModal;
    $("#wbSave").onclick = () => {
      syncInputs();
      draft.name = $("#wbName").value.trim() || "Eget pass";
      draft.focus = $("#wbFocus").value.trim();
      draft.exercises = draft.exercises.filter(e => e.name.trim());
      if (!draft.exercises.length) { toast("⚠️", "Tomt pass", "Lägg till minst en övning."); return; }
      if (index != null) arr[index] = draft; else arr.push(draft);
      closeModal(); onDone && onDone();
    };
  }
  render();
}

/* Steg 5 — Påminnelser */
function obReminders() {
  const r = ob.tmpReminders;
  const walkOpts = ["08:00", "10:00", "12:30", "15:00", "18:00"];
  const el = obStepEl(`
    ${obProgress()}
    <div class="ob-kicker">Steg 7 av 9</div>
    <h2 class="ob-title">Puffar under <em>dagen</em></h2>
    <p class="ob-lead">Appen påminner dig medan den är öppen i en flik — promenader, vatten och nedvarvning inför natten.</p>
    <label>När vill du bli påmind om promenad?</label>
    <div class="chip-row" id="obWalks" style="margin-bottom:1.6rem">
      ${walkOpts.map(t => `<button class="chip ${r.walks.includes(t) ? "selected" : ""}" data-t="${t}">${t}</button>`).join("")}
    </div>
    <label>Vattenpåminnelser (5 st mellan 09:30–17:30)</label>
    <div class="chip-row" style="margin-bottom:1.6rem">
      <button class="chip ${r.water ? "selected" : ""}" id="obWater">${r.water ? "På" : "Av"} — 💧</button>
    </div>
    <label>Nedvarvning inför sömn</label>
    <div class="chip-row" id="obWind" style="margin-bottom:1.6rem">
      ${["21:00", "21:30", "22:00", "22:30"].map(t => `<button class="chip ${r.windDown === t ? "selected" : ""}" data-t="${t}">${t}</button>`).join("")}
      <button class="chip ${!r.windDown ? "selected" : ""}" data-t="">Ingen</button>
    </div>
    <label>Systemnotiser</label>
    <p class="sub" style="margin-bottom:.6rem">Tillåt notiser så syns påminnelserna även när fliken ligger i bakgrunden.</p>
    <button class="btn ghost small" id="obNotif">🔔 Tillåt notiser</button>
    <div class="ob-nav">
      <button class="btn ghost" id="obB">← Tillbaka</button>
      <button class="btn" id="obN">Fortsätt →</button>
    </div>`);
  $$("#obWalks .chip", el).forEach(c => c.onclick = () => {
    const t = c.dataset.t;
    r.walks.includes(t) ? r.walks.splice(r.walks.indexOf(t), 1) : r.walks.push(t);
    c.classList.toggle("selected");
  });
  $("#obWater", el).onclick = e => { r.water = !r.water; e.target.classList.toggle("selected", r.water); e.target.textContent = (r.water ? "På" : "Av") + " — 💧"; };
  $$("#obWind .chip", el).forEach(c => c.onclick = () => {
    r.windDown = c.dataset.t;
    $$("#obWind .chip", el).forEach(x => x.classList.toggle("selected", x === c));
  });
  $("#obNotif", el).onclick = async e => {
    if (!("Notification" in window)) { toast("ℹ️", "Stöds inte", "Din webbläsare stöder inte systemnotiser — påminnelser visas i appen istället."); return; }
    const perm = await Notification.requestPermission();
    e.target.textContent = perm === "granted" ? "✓ Notiser på" : "🔕 Nekad — påminnelser visas i appen";
  };
  $("#obB", el).onclick = obBack;
  $("#obN", el).onclick = () => obNext();
  return el;
}

/* Steg 6 — Sammanfattning */
function obSummary() {
  const d = ob.draft;
  const t = calcTargets(d);
  const g = GOAL_META[d.goal];
  const el = obStepEl(`
    ${obProgress()}
    <div class="ob-kicker">Din plan är klar</div>
    <h2 class="ob-title">Så här kör vi, <em>${esc(d.name)}</em>.</h2>
    <p class="ob-lead">Mål: <strong style="color:var(--amber-soft)">${g.label}</strong>. Uträknat med Mifflin-St Jeor och evidensbaserade makromål — allt kan justeras senare.</p>
    <div class="card" style="margin-bottom:1rem">
      <div class="card-kicker">Din energibudget</div>
      <div class="hist-item"><span>BMR — vad kroppen bränner i vila</span><span class="h-date"><b style="color:var(--cream)">${t.bmr}</b> kcal</span></div>
      <div class="hist-item"><span>TDEE — med din aktivitetsnivå</span><span class="h-date"><b style="color:var(--cream)">${t.mifflin}</b> kcal</span></div>
      <div class="hist-item"><span>${t.kcalAdj < 0 ? "Underskott för viktnedgång" : t.kcalAdj > 0 ? "Överskott för muskelbygge" : "Balans"}</span><span class="h-date"><b style="color:var(--cream)">${t.kcalAdj > 0 ? "+" : ""}${t.kcalAdj}</b> kcal</span></div>
      <div class="hist-item" style="border-bottom:none"><span><b>Ditt dagliga mål</b></span><span class="h-date"><b style="color:var(--amber);font-size:1.1rem">${t.kcal}</b> kcal</span></div>
    </div>
    <div class="card" style="margin-bottom:1rem">
      <div class="card-kicker">Makrokomposition</div>
      <div style="display:flex;gap:2.2rem;flex-wrap:wrap;margin-top:.5rem">
        <div><div class="big-num" style="font-size:1.8rem">${t.protein}<small> g</small></div><p class="sub">protein (${Math.round(t.protein * 4 / t.kcal * 100)} %)</p></div>
        <div><div class="big-num" style="font-size:1.8rem">${t.fat}<small> g</small></div><p class="sub">fett (${Math.round(t.fat * 9 / t.kcal * 100)} %)</p></div>
        <div><div class="big-num" style="font-size:1.8rem">${t.carbs}<small> g</small></div><p class="sub">kolhydrat (${Math.round(t.carbs * 4 / t.kcal * 100)} %)</p></div>
      </div>
    </div>
    <div class="grid-3" style="margin-bottom:1rem">
      <div class="card"><div class="card-kicker">Pass / v</div><div class="big-num" style="font-size:1.9rem">${t.workoutsPerWeek}</div></div>
      <div class="card"><div class="card-kicker">Powerwalks / dag</div><div class="big-num" style="font-size:1.9rem">${t.walksPerDay}</div></div>
      <div class="card"><div class="card-kicker">Steg / dag</div><div class="big-num" style="font-size:1.9rem">${(t.steps/1000)}<small>k</small></div></div>
    </div>
    <p class="sub" style="margin-bottom:1.5rem">Du kan justera allt senare under Inställningar och Mål.</p>
    <div class="ob-nav">
      <button class="btn ghost" id="obB">← Tillbaka</button>
      <button class="btn" id="obDone">Starta STARK50 →</button>
    </div>`);
  $("#obB", el).onclick = obBack;
  $("#obDone", el).onclick = () => {
    state.profile = d;
    state.targets = t;
    // tmpWorkouts är en djupkopia, så identitet säger inget — jämför innehållet
    const wkChanged = JSON.stringify(state.workouts) !== JSON.stringify(ob.tmpWorkouts || []);
    state.workouts = ob.tmpWorkouts || [];
    state.reminders = ob.tmpReminders;
    state.prefs = ob.tmpPrefs;
    state.devices = ob.tmpDevices;
    state.mealPlan = null; // ny plan utifrån nya preferenser
    // Förifyll veckoschemat med jämnt utspridda dagar — går att ändra under Träning.
    // Ett handtrimmat schema skrivs bara över när passen faktiskt byttes ut.
    if (!ob.existing || wkChanged || !scheduleDays().length) {
      state.schedule.days = {};
      suggestScheduleDays(d.trainingDays).forEach((dow, i) => {
        state.schedule.days[dow] = state.workouts.length ? state.workouts[i % state.workouts.length].id : "auto";
      });
    }
    // Blocket startar den här veckan — men en omkörd onboarding nollställer inte
    // en pågående progression.
    if (!ob.existing || !state.program || !state.program.start) state.program = { start: dkey(mondayOf()), block: 1 };
    state.onboarded = true;
    save();
    $("#onboarding").classList.add("hidden");
    $("#app").classList.remove("hidden");
    switchView("idag");
    toast("🎉", "Välkommen, " + d.name + "!", "Din plan är igång. Börja med att logga dagens första måltid.");
  };
  return el;
}

/* ═══════════════ MODAL ═══════════════ */
function openModal(html) {
  $("#modal").innerHTML = `<button class="modal-close" id="modalX">✕</button>` + html;
  $("#modalBackdrop").classList.remove("hidden");
  $("#modalX").onclick = closeModal;
}
function closeModal() { $("#modalBackdrop").classList.add("hidden"); stopBreath(); }
$("#modalBackdrop").addEventListener("click", e => { if (e.target.id === "modalBackdrop") closeModal(); });

/* ═══════════════ NAVIGATION ═══════════════ */
const VIEW_TITLES = { idag: "Idag", mat: "Mat", traning: "Träning", recept: "Recept", sinne: "Sinne", mal: "Mål", installningar: "Inställningar" };
let currentView = "idag";

function switchView(v) {
  currentView = v;
  $$(".nav-btn").forEach(b => b.classList.toggle("active", b.dataset.view === v));
  $("#topbarTitle").textContent = VIEW_TITLES[v];
  const d = new Date();
  $("#topbarDate").textContent = DAYS[d.getDay()] + " " + d.getDate() + " " + MONTHS[d.getMonth()] + " " + d.getFullYear();
  $("#topbarUser").textContent = state.profile.name ? state.profile.name + " · " + GOAL_META[state.profile.goal].label : "";
  const views = { idag: renderIdag, mat: renderMat, traning: renderTraning, recept: renderRecept, sinne: renderSinne, mal: renderMal, installningar: renderInstallningar };
  const wrap = $("#viewWrap");
  wrap.style.animation = "none"; void wrap.offsetHeight; wrap.style.animation = "";
  wrap.innerHTML = "";
  views[v](wrap);
  window.scrollTo(0, 0);
}
$$(".nav-btn").forEach(b => b.onclick = () => switchView(b.dataset.view));

/* ─────────────── LOGG-HJÄLPARE ─────────────── */
function mealsFor(key) { return state.logs.meals[key] || []; }
function dayTotals(key) {
  return mealsFor(key).reduce((a, m) => ({ kcal: a.kcal + m.kcal, p: a.p + m.p }), { kcal: 0, p: 0 });
}
function walksThisWeek() { const wk = weekKeys(); return state.logs.walks.filter(w => wk.includes(w.date)); }
function sessionsThisWeek() { const wk = weekKeys(); return state.logs.sessions.filter(s => wk.includes(s.date)); }
function pbar(val, max, cls = "") {
  const pct = Math.min(100, Math.round((val / max) * 100));
  const over = val > max * 1.1;
  return `<div class="pbar"><div class="${over ? "over" : cls}" style="width:${pct}%"></div></div>
    <div class="pbar-meta"><span>${Math.round(val)}</span><span>mål ${Math.round(max)}</span></div>`;
}

/* ═══════════════ VY: IDAG ═══════════════ */
function renderIdag(wrap) {
  const today = dkey();
  const tot = dayTotals(today);
  const t = state.targets;
  const hour = new Date().getHours();
  const greet = hour < 10 ? "God morgon" : hour < 12 ? "God förmiddag" : hour < 18 ? "God eftermiddag" : "God kväll";
  const walksToday = state.logs.walks.filter(w => w.date === today);
  const water = state.logs.water[today] || 0;
  const wkSessions = sessionsThisWeek();
  // Nästa pass styrs av veckoschemat när ett sådant finns; annars roterar vi som förr.
  const doneToday = state.logs.sessions.some(s => s.date === today);
  const hasSchedule = scheduleDays().length > 0;
  // Är dagens pass redan avklarat söker vi vidare från imorgon.
  const searchFrom = new Date();
  if (doneToday && scheduledFor(today)) searchFrom.setDate(searchFrom.getDate() + 1);
  const sched = hasSchedule ? nextScheduled(searchFrom) : null;
  const nextWk = sched ? sched.workout
    : (state.workouts.length ? state.workouts[state.logs.sessions.length % state.workouts.length] : null);
  const nextWkWhen = sched
    ? (dkey(searchFrom) === sched.dateKey && sched.dateKey === today ? "Idag"
      : sched.dateKey === dkey(new Date(Date.now() + 864e5)) ? "Imorgon" : DAYS[sched.dow].toLowerCase())
    : null;
  const restToday = hasSchedule && !scheduledFor(today);
  const supps = state.logs.supps[today] || {};
  // I Sverige ger solen för lite UVB för egen D-vitaminproduktion under vinterhalvåret
  const darkMonths = [9, 10, 11, 0, 1, 2].includes(new Date().getMonth());
  const dayRecipe = todaysPlannedDinner();
  const sleepToday = state.logs.sleep.find(s => s.date === today);
  const stressToday = state.logs.stress.find(s => s.date === today);

  const kcalPct = Math.min(1, tot.kcal / t.kcal);
  const R = 52, CIRC = 2 * Math.PI * R;

  const streak = currentStreak();
  const df = computeDagsform();
  // Spara dagens poäng i historiken (för trendgrafen under Mål)
  if (df.hasAnyData && state.dagsformLog[today] !== df.score) {
    if (!state.dagsformLog) state.dagsformLog = {};
    state.dagsformLog[today] = df.score;
    save();
  }
  // Halvcirkel-gauge: 0–100 över 180°
  const GR = 54, GC = Math.PI * GR; // halv omkrets
  const gaugeOff = GC * (1 - df.score / 100);

  wrap.innerHTML = `
    <div style="display:flex;align-items:baseline;gap:1rem;flex-wrap:wrap;margin-bottom:1.4rem">
      <h2 style="font-size:1.9rem">${greet}, ${esc(state.profile.name)}.</h2>
      ${streak >= 2 ? `<span class="streak-badge">🔥 ${streak} dagar i rad</span>` : ""}
    </div>

    <div class="card dagsform-card" style="margin-bottom:1.2rem">
      <div style="display:flex;align-items:center;gap:1.6rem;flex-wrap:wrap">
        <div class="gauge-wrap">
          <svg width="140" height="84" viewBox="0 0 140 84">
            <path d="M 16 76 A ${GR} ${GR} 0 0 1 124 76" fill="none" stroke="var(--bg-deep)" stroke-width="11" stroke-linecap="round"/>
            <path d="M 16 76 A ${GR} ${GR} 0 0 1 124 76" fill="none" stroke="${df.color}" stroke-width="11" stroke-linecap="round"
              stroke-dasharray="${GC.toFixed(1)}" stroke-dashoffset="${gaugeOff.toFixed(1)}" class="gauge-fill"/>
          </svg>
          <div class="gauge-center">
            <div class="gauge-num">${df.hasAnyData ? df.score : "–"}</div>
            <div class="gauge-sub">av 100</div>
          </div>
        </div>
        <div style="flex:1;min-width:220px">
          <div class="card-kicker">Dagsform${df.ouraBlend ? " · vägd med Oura readiness" : ""}</div>
          ${df.hasAnyData ? `
            <h2 style="color:${df.color}">${df.ico} ${df.label}</h2>
            <p class="sub">${df.rec}</p>
          ` : `
            <h2>Ingen data ännu</h2>
            <p class="sub">Synka din ring eller klocka (steg, vilopuls, sömn — och Ouras readiness om du har den) eller logga sömn & stress, så räknar appen ut din dagsform.</p>
          `}
          <div style="display:flex;gap:.6rem;margin-top:.8rem;flex-wrap:wrap">
            <button class="btn ghost small" id="dfDetail">Så räknas den</button>
            <button class="btn ghost small" id="dfSync">↻ Synka enheter</button>
          </div>
        </div>
      </div>
    </div>

    ${walksToday.length < t.walksPerDay ? `
    <div class="card accent" style="margin-bottom:1.2rem;display:flex;justify-content:space-between;align-items:center;gap:1rem;flex-wrap:wrap">
      <div>
        <div class="card-kicker">🚶 Powerwalks idag: ${walksToday.length} av ${t.walksPerDay}</div>
        <h2>${walksToday.length === 0 ? "Dags för dagens första powerwalk" : "Nästa powerwalk väntar"}</h2>
        <p class="sub">${t.walkMin} minuter i raskt tempo. Regelbundna promenader är den enskilt bästa investeringen för hjärta, leder och humör efter 50.</p>
      </div>
      <button class="btn" id="logWalkBtn">Logga promenad</button>
    </div>` : `
    <div class="card sage-c" style="margin-bottom:1.2rem;display:flex;justify-content:space-between;align-items:center;gap:1rem;flex-wrap:wrap">
      <div>
        <div class="card-kicker sage-k">🚶 Powerwalks idag: ${walksToday.length} av ${t.walksPerDay} ✓</div>
        <h2>${walksToday.reduce((a, w) => a + w.minutes, 0)} minuter avklarade — dagens mål nått</h2>
        <p class="sub">Snyggt jobbat. ${walksThisWeek().length} av ${t.walksPerWeek} promenader den här veckan.</p>
      </div>
      <button class="btn ghost small" id="logWalkBtn">+ Logga fler</button>
    </div>`}

    ${state.devices.length ? (() => {
      const dd = state.deviceData[today] || {};
      const devNames = state.devices.map(id => (DEVICES.find(x => x.id === id) || {}).name).filter(Boolean).join(" · ");
      return `
      <div class="card" style="margin-bottom:1.2rem">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:1rem;flex-wrap:wrap">
          <div class="card-kicker">⌚ Från dina enheter · ${esc(devNames)}</div>
          <button class="btn ghost small" id="syncDev">↻ Synka dagens värden</button>
        </div>
        <div style="display:flex;gap:2.4rem;flex-wrap:wrap;margin-top:.5rem">
          <div><div class="big-num" style="font-size:2rem">${dd.steps != null ? dd.steps.toLocaleString("sv-SE") : "–"}</div><p class="sub">steg · mål ${t.steps.toLocaleString("sv-SE")}</p>
            ${dd.steps != null ? pbar(dd.steps, t.steps, "sky-f") : ""}</div>
          <div><div class="big-num" style="font-size:2rem">${dd.rhr != null ? dd.rhr : "–"}</div><p class="sub">vilopuls</p></div>
          <div><div class="big-num" style="font-size:2rem">${dd.sleep != null ? String(dd.sleep).replace(".", ",") : "–"}</div><p class="sub">tim sömn (enhet)</p></div>
        </div>
      </div>`;
    })() : ""}

    <div class="grid-2">
      <div class="card">
        <div class="card-kicker">Energi idag</div>
        <div class="ring-wrap">
          <div style="position:relative;width:130px;height:130px;flex-shrink:0">
            <svg class="ring" width="130" height="130">
              <circle class="track" cx="65" cy="65" r="${R}" stroke-width="11" fill="none"/>
              <circle class="fill" cx="65" cy="65" r="${R}" stroke-width="11" fill="none"
                stroke-dasharray="${CIRC}" stroke-dashoffset="${CIRC * (1 - kcalPct)}"/>
            </svg>
            <div class="ring-center">
              <div style="font-family:var(--font-display);font-weight:900;font-size:1.5rem">${Math.round(tot.kcal)}</div>
              <div style="font-size:.7rem;color:var(--cream-faint)">av ${t.kcal} kcal</div>
            </div>
          </div>
          <div style="flex:1;min-width:140px">
            <label style="margin-bottom:.2rem">Protein</label>
            ${pbar(tot.p, t.protein, "sage-f")}
            <button class="btn small" style="margin-top:1rem" id="goMat">+ Logga mat</button>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-kicker">${nextWkWhen === "Idag" ? "Dagens pass" : "Nästa pass"}${nextWkWhen && nextWkWhen !== "Idag" ? " · " + nextWkWhen : ""}</div>
        ${doneToday ? `<p class="sub" style="color:var(--sage);margin-bottom:.6rem">✓ Dagens pass är loggat — bra jobbat.</p>` : ""}
        ${restToday && !doneToday ? `<p class="sub" style="color:var(--sage);margin-bottom:.6rem">Idag är vilodag i ditt schema. Vila är en del av programmet.</p>` : ""}
        ${nextWk ? `
          <h2>${esc(nextWk.name)}</h2>
          <p class="sub">${esc(nextWk.focus || "")}${nextWk.auto ? "" : " · " + nextWk.exercises.length + (nextWk.exercises.length === 1 ? " övning" : " övningar")} · ${wkSessions.length}/${t.workoutsPerWeek} pass gjorda i veckan</p>
          <div style="display:flex;gap:.6rem;margin-top:1rem;flex-wrap:wrap;align-items:center">
            ${nextWk.auto ? "" : `<button class="btn" id="startWkBtn">Starta passet ▶</button>`}
            <button class="btn ${nextWk.auto ? "" : "ghost "}small" id="genWkBtn">⚡ Generera ${nextWk.auto ? "dagens pass" : "nytt"}</button>
          </div>
        ` : `<p class="sub" style="margin-bottom:.8rem">Inga pass upplagda ännu.</p><button class="btn small" id="genWkBtn">⚡ Generera ett pass</button>`}
      </div>

      <div class="card">
        <div class="card-kicker">Tillskott</div>
        <div class="supp-row">
          <button class="supp ${supps.d ? "on" : ""}" id="suppD">
            <span class="supp-mark">${supps.d ? "✓" : ""}</span>
            <span><b>D-vitamin</b><small>${darkMonths ? "10 µg — extra viktigt nu i mörkret" : "10 µg per dag"}</small></span>
          </button>
          <button class="supp ${supps.kreatin ? "on" : ""}" id="suppK">
            <span class="supp-mark">${supps.kreatin ? "✓" : ""}</span>
            <span><b>Kreatin</b><small>3–5 g monohydrat</small></span>
          </button>
        </div>
        <p class="sub" style="margin-top:.7rem;font-size:.82rem">${darkMonths
          ? "Oktober–mars producerar huden i Sverige i princip inget D-vitamin — då kommer allt från mat och tillskott."
          : "Kreatin är ett av de bäst belagda tillskotten för muskel och styrka efter 50. Ta det varje dag, inte bara träningsdagar."}</p>
      </div>

      <div class="card">
        <div class="card-kicker">💧 Vatten</div>
        <div style="display:flex;align-items:center;justify-content:space-between;gap:1rem">
          <div class="big-num">${water}<small> / ${t.waterGlasses} glas</small></div>
          <button class="btn small sage" id="waterBtn">+ Ett glas</button>
        </div>
        <div style="margin-top:.8rem;font-size:1.3rem;letter-spacing:.15em">${"💧".repeat(Math.min(water, 12))}${"<span style='opacity:.18'>💧</span>".repeat(Math.max(0, t.waterGlasses - water))}</div>
      </div>

      <div class="card">
        <div class="card-kicker">🌙 Kvällskoll</div>
        <p class="sub" style="margin-bottom:.7rem">
          ${sleepToday ? "Sömn: <strong>" + sleepToday.hours + " tim</strong>" : "Sömn ej loggad"} ·
          ${stressToday ? "Stress: <strong>" + stressToday.level + "/5</strong>" : "stress ej loggad"}
        </p>
        <button class="btn ghost small" id="goSinne">Logga sömn & stress →</button>
      </div>
    </div>

    <div class="section-title">Om du inte vet vad du ska äta<span class="st-line"></span></div>
    <div class="card" style="display:flex;justify-content:space-between;align-items:center;gap:1.2rem;flex-wrap:wrap">
      <div>
        <div class="card-kicker">Middag enligt veckans matsedel</div>
        <h2>${esc(dayRecipe.name)}</h2>
        <p class="sub">${esc(dayRecipe.desc)} · <b style="color:var(--amber-soft)">${dayRecipe.kcal} kcal · ${dayRecipe.p} g protein</b></p>
      </div>
      <div style="display:flex;gap:.6rem;flex-wrap:wrap">
        <button class="btn small" id="eatSugg">🎲 Slumpa dagens matsedel</button>
        <button class="btn ghost small" id="openDayRecipe">Visa recept</button>
        <button class="btn ghost small" id="goRecept">Matsedel & inköpslista</button>
      </div>
    </div>`;

  $("#logWalkBtn").onclick = openWalkLogger;
  $("#goMat").onclick = () => switchView("mat");
  $("#goSinne").onclick = () => switchView("sinne");
  $("#goRecept").onclick = () => switchView("recept");
  $("#openDayRecipe").onclick = () => openRecipe(dayRecipe);
  $("#eatSugg").onclick = () => openDayPlan();
  $("#dfDetail").onclick = openDagsformDetail;
  $("#dfSync").onclick = openDeviceSync;
  const sync = $("#syncDev");
  if (sync) sync.onclick = openDeviceSync;
  if (nextWk) { const b = $("#startWkBtn"); if (b) b.onclick = () => startSession(nextWk.id); }
  const gwb = $("#genWkBtn");
  if (gwb) gwb.onclick = openWorkoutGen;
  const toggleSupp = k => {
    if (!state.logs.supps[today]) state.logs.supps[today] = {};
    state.logs.supps[today][k] = !state.logs.supps[today][k];
    save(); renderIdag(wrap);
  };
  $("#suppD").onclick = () => toggleSupp("d");
  $("#suppK").onclick = () => toggleSupp("kreatin");
  $("#waterBtn").onclick = () => {
    state.logs.water[today] = (state.logs.water[today] || 0) + 1; save();
    if (state.logs.water[today] === state.targets.waterGlasses) toast("💧", "Vattenmål nått!", "Bra jobbat — full pott idag.");
    renderIdag(wrap);
  };
}

function openWalkLogger() {
  openModal(`
    <h2>Logga promenad</h2>
    <p class="sub" style="margin-bottom:1.2rem">Hur länge var du ute?</p>
    <div class="chip-row" id="walkChips" style="margin-bottom:1.2rem">
      ${[15, 20, 30, 45, 60].map(m => `<button class="chip" data-m="${m}">${m} min</button>`).join("")}
    </div>
    <div><label>Eller egen tid (minuter)</label><input id="walkMin" type="number" min="1" max="600" placeholder="35"></div>
    <div class="ob-nav"><button class="btn" id="walkSave">Spara promenad</button></div>`);
  let chosen = null;
  $$("#walkChips .chip").forEach(c => c.onclick = () => {
    chosen = +c.dataset.m; $("#walkMin").value = "";
    $$("#walkChips .chip").forEach(x => x.classList.toggle("selected", x === c));
  });
  $("#walkSave").onclick = () => {
    const m = +$("#walkMin").value || chosen;
    if (!m) { toast("⚠️", "Ange tid", "Välj eller skriv in hur många minuter du gick."); return; }
    state.logs.walks.push({ date: dkey(), minutes: m }); save(); closeModal();
    const n = state.logs.walks.filter(w => w.date === dkey()).length;
    toast("🚶", "Powerwalk " + n + " av " + state.targets.walksPerDay + " loggad",
      n >= state.targets.walksPerDay ? m + " minuter — dagens promenadmål är nått!" : m + " minuter — bra jobbat!");
    switchView(currentView);
  };
}

/* Synka enhetsdata manuellt (steg, vilopuls, sömn, Oura readiness) */
function openDeviceSync() {
  const today = dkey();
  const dd = state.deviceData[today] || {};
  const devNames = state.devices.map(id => (DEVICES.find(x => x.id === id) || {}).name).filter(Boolean).join(", ");
  const hasOura = state.devices.includes("oura");
  openModal(`
    <h2>Synka dagens värden</h2>
    <p class="sub" style="margin:.4rem 0 1.2rem">Öppna ${esc(devNames || "din hälsoapp")} och skriv av dagens siffror — det tar tio sekunder. Oura tillåter tyvärr inte automatisk hämtning från webbappar.</p>
    <div class="ob-grid">
      <div><label>Steg idag</label><input id="dvSteps" type="number" min="0" value="${dd.steps != null ? dd.steps : ""}" placeholder="8 500"></div>
      <div><label>Vilopuls (slag/min)</label><input id="dvRhr" type="number" min="30" max="120" value="${dd.rhr != null ? dd.rhr : ""}" placeholder="58"></div>
      <div><label>Sömn i natt (timmar)</label><input id="dvSleep" type="number" step="0.1" min="0" max="14" value="${dd.sleep != null ? dd.sleep : ""}" placeholder="7,5"></div>
      ${hasOura ? `<div><label>Oura readiness (0–100)</label><input id="dvReadiness" type="number" min="0" max="100" value="${dd.readiness != null ? dd.readiness : ""}" placeholder="82"></div>` : ""}
    </div>
    <div class="ob-nav"><button class="btn" id="dvSave">Spara värden</button></div>`);
  $("#dvSave").onclick = () => {
    const num = id => { const el = $(id); return el && el.value !== "" ? +String(el.value).replace(",", ".") : null; };
    const steps = num("#dvSteps"), rhr = num("#dvRhr"), sleep = num("#dvSleep"), readiness = num("#dvReadiness");
    state.deviceData[today] = { steps, rhr, sleep, readiness };
    if (sleep && !state.logs.sleep.find(s => s.date === today)) state.logs.sleep.push({ date: today, hours: sleep });
    save(); closeModal();
    toast("⌚", "Enhetsdata sparad", "Dagsformen är uppdaterad med dina nya värden.");
    switchView(currentView);
  };
}

/* ─────────────── KALENDEREXPORT AV PÅMINNELSER (.ics) ───────────────
   Webbappar kan inte skicka pushnotiser utan en server — men telefonens
   kalender kan. Exporten skapar återkommande händelser med larm. */
function buildICS(include) {
  const pad = n => String(n).padStart(2, "0");
  const today = new Date();
  const stamp = today.getFullYear() + pad(today.getMonth() + 1) + pad(today.getDate());
  const lines = [
    "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//STARK50//Paminnelser//SV",
    "CALSCALE:GREGORIAN", "X-WR-CALNAME:STARK50", "METHOD:PUBLISH",
  ];
  // Radbrytningar och kommatecken måste escapas, annars blir filen ogiltig
  const esc7 = s => String(s).replace(/\\/g, "\\\\").replace(/[;,]/g, m => "\\" + m).replace(/\r?\n/g, "\\n");
  /* Startdatum för en veckovis händelse måste ligga på samma veckodag som BYDAY,
     annars lägger en del kalenderappar in en extra händelse på startdagen. */
  const firstDate = dow => {
    if (dow == null) return stamp;
    const d = new Date(today);
    d.setDate(today.getDate() + ((dow - today.getDay() + 7) % 7));
    return d.getFullYear() + pad(d.getMonth() + 1) + pad(d.getDate());
  };
  /* UID:t är stabilt per påminnelsetyp (inte per exporttillfälle). Då ersätter en
     ny export de gamla händelserna istället för att lägga dubbletter bredvid. */
  const event = (uidKey, title, desc, hhmm, rrule, durMin, leadMin, dow) => {
    const [h, m] = hhmm.split(":").map(Number);
    const day = firstDate(dow);
    const start = day + "T" + pad(h) + pad(m) + "00";
    const endM = h * 60 + m + durMin;
    const end = day + "T" + pad(Math.floor(endM / 60) % 24) + pad(endM % 60) + "00";
    lines.push(
      "BEGIN:VEVENT",
      "UID:stark50-" + uidKey + "@stark50.app",
      "DTSTAMP:" + stamp + "T000000Z",
      "DTSTART:" + start,
      "DTEND:" + end,
      "RRULE:" + rrule,
      "SUMMARY:" + esc7(title),
      "DESCRIPTION:" + esc7(desc),
      "BEGIN:VALARM", "ACTION:DISPLAY", "DESCRIPTION:" + esc7(title),
      "TRIGGER:" + (leadMin ? "-PT" + leadMin + "M" : "PT0M"), "END:VALARM",
      "END:VEVENT");
  };
  const r = state.reminders;
  const lead = include.lead || 0;
  if (include.walks) (r.walks || []).forEach(t =>
    event("walk-" + t, "🚶 Powerwalk — STARK50", "Rask promenad " + state.targets.walkMin + " min. Logga i appen efteråt.", t, "FREQ=DAILY", 30, lead));
  if (include.wind && r.windDown)
    event("wind", "🌙 Nedvarvning — STARK50", "Släck skärmarna. Logga sömn & stress i appen.", r.windDown, "FREQ=DAILY", 15, lead);
  if (include.weigh && r.weighDay != null)
    event("weigh", "⚖️ Veckovägning — STARK50", "Väg dig före frukost och logga under Mål.", r.weighTime || "07:30",
      "FREQ=WEEKLY;BYDAY=" + DAY_ICS[r.weighDay], 15, lead, r.weighDay);
  // Ett återkommande event per schemalagd träningsdag, med passets namn och övningar
  if (include.training) scheduleDays().forEach(dow => {
    const w = workoutForDay(dow);
    if (!w) return;
    const desc = w.auto
      ? "Öppna STARK50 och generera dagens pass — dagsformen styr intensiteten."
      : (w.focus ? w.focus + ".\n" : "") + w.exercises.map(e => "• " + e.name + " — " + e.sets + " × " + e.reps).join("\n");
    event("train-" + dow, "▲ " + (w.auto ? "Träningspass" : w.name) + " — STARK50", desc,
      scheduleTime(), "FREQ=WEEKLY;BYDAY=" + DAY_ICS[dow], 60, lead, dow);
  });
  lines.push("END:VCALENDAR");
  /* RFC 5545: rader får vara max 75 oktetter — längre rader viks med inledande
     mellanslag. Måste räknas i oktetter, inte tecken, och får aldrig klyva ett
     UTF-8-tecken mitt itu (åäö och emoji är fleroktettstecken). */
  const fold = line => {
    const bytes = new TextEncoder().encode(line);
    if (bytes.length <= 75) return line;
    const out = [];
    let cur = "", curLen = 0, limit = 75;
    for (const ch of line) { // itererar kodpunkter, inte kodenheter
      const n = new TextEncoder().encode(ch).length;
      if (curLen + n > limit) { out.push(cur); cur = " "; curLen = 1; limit = 75; }
      cur += ch; curLen += n;
    }
    if (cur) out.push(cur);
    return out.join("\r\n");
  };
  return lines.map(fold).join("\r\n");
}

function openCalendarExport() {
  const r = state.reminders;
  const schDays = scheduleDays();
  const schLabel = schDays.length
    ? schDays.map(n => DAY_SHORT[n].toLowerCase() + "ar").join(", ") + " kl " + scheduleTime()
    : "inget schema satt";
  openModal(`
    <div class="card-kicker">📅 Riktiga notiser via kalendern</div>
    <h2>Lägg påminnelserna i telefonen</h2>
    <p class="sub" style="margin:.4rem 0 1.2rem">En webbapp kan inte skicka pushnotiser när den är stängd — det kan däremot din kalender.
    Ladda ner filen och öppna den, så läggs återkommande påminnelser med larm in i iPhone/Android-kalendern.
    Det är den enda vägen som säkert plingar när appen inte är igång.</p>
    <div style="display:grid;gap:.7rem;margin-bottom:1.1rem">
      <label class="ics-opt"><input type="checkbox" id="icsTraining" ${schDays.length ? "checked" : "disabled"}> ▲ Träningspass — ${schLabel}</label>
      <label class="ics-opt"><input type="checkbox" id="icsWalks" checked> 🚶 Powerwalks — dagligen kl ${(r.walks || []).join(", ") || "–"}</label>
      <label class="ics-opt"><input type="checkbox" id="icsWind" ${r.windDown ? "checked" : "disabled"}> 🌙 Nedvarvning — dagligen kl ${r.windDown || "ej satt"}</label>
      <label class="ics-opt"><input type="checkbox" id="icsWeigh" ${r.weighDay != null ? "checked" : "disabled"}> ⚖️ Veckovägning — ${r.weighDay != null ? ["söndagar", "måndagar", "tisdagar", "onsdagar", "torsdagar", "fredagar", "lördagar"][r.weighDay] + " kl " + (r.weighTime || "07:30") : "ej satt"}</label>
    </div>
    <label style="font-size:.82rem">Larm
      <select id="icsLead" style="margin-top:.3rem">
        <option value="0">På utsatt tid</option>
        <option value="15">15 minuter innan</option>
        <option value="30" selected>30 minuter innan</option>
        <option value="60">1 timme innan</option>
      </select>
    </label>
    <div class="ob-nav" style="margin-top:1.3rem">
      <button class="btn" id="icsDownload">⬇ Ladda ner kalenderfil</button>
    </div>
    <p class="sub" style="font-size:.82rem;margin-top:1rem">På iPhone: öppna filen → "Lägg till alla" i Kalender.
    Ändrar du schemat senare kan du exportera igen — händelserna har fasta ID:n, så de flesta kalendrar uppdaterar de befintliga istället för att skapa dubbletter.</p>`);
  $("#icsDownload").onclick = () => {
    const on = id => { const el = $(id); return el.checked && !el.disabled; };
    const include = {
      walks: on("#icsWalks"),
      wind: on("#icsWind"),
      weigh: on("#icsWeigh"),
      training: on("#icsTraining"),
      lead: +$("#icsLead").value || 0,
    };
    if (!include.walks && !include.wind && !include.weigh && !include.training) {
      toast("⚠️", "Inget valt", "Kryssa i minst en påminnelse att lägga i kalendern."); return;
    }
    const ics = buildICS(include);
    const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "stark50-paminnelser.ics";
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 5000);
    toast("📅", "Kalenderfil skapad", "Öppna filen på telefonen och lägg till händelserna i kalendern.");
  };
}

/* Dagsform — detaljvy med faktorer */
function openDagsformDetail() {
  const df = computeDagsform();
  openModal(`
    <div class="card-kicker">Dagsform · ${df.score} av 100</div>
    <h2 style="color:${df.color}">${df.ico} ${df.label}</h2>
    <p class="sub" style="margin:.4rem 0 1.3rem">${df.rec}</p>
    ${df.factors.map(f => `
      <div style="margin-bottom:1rem">
        <div style="display:flex;justify-content:space-between;align-items:baseline;gap:1rem">
          <span style="font-weight:700">${f.name} <span style="font-family:var(--font-mono);font-size:.72rem;color:var(--cream-faint)">${f.w} %</span></span>
          <span class="mi-macro">${esc(f.detail)}</span>
        </div>
        <div class="pbar" style="margin-top:.35rem"><div class="${f.score >= 75 ? "sage-f" : f.score >= 50 ? "" : "over"}" style="width:${f.score}%"></div></div>
      </div>`).join("")}
    ${df.ouraBlend ? `<p class="sub" style="font-size:.85rem;margin-top:.4rem">Slutpoängen är ett snitt av faktorerna ovan (50 %) och din Oura readiness (50 %).</p>` : ""}
    <p class="sub" style="font-size:.85rem;margin-top:.6rem">Faktorer utan data räknas neutralt — ju mer du synkar och loggar, desto träffsäkrare blir dagsformen.</p>`);
}

/* ═══════════════ MATFOTO → KALORIER ═══════════════
   Anropar Claude direkt från webbläsaren med användarens egen API-nyckel.
   Ingen server inblandad — nyckeln lämnar aldrig den här enheten (annat än
   till api.anthropic.com). Bilden sparas medvetet inte i state: localStorage
   rymmer ~5 MB och några foton skulle spränga kvoten och slå ut hela appen. */
const AI_MODELS = [
  { id: "claude-opus-5", label: "Claude Opus 5 — mest träffsäker", cost: "~0,20 kr per bild" },
  { id: "claude-sonnet-5", label: "Claude Sonnet 5 — billigare", cost: "~0,08 kr per bild" },
];
const PHOTO_MAX_PX = 1024;   // långsida; räcker gott för portionsbedömning
const PHOTO_SYSTEM = `Du är en svensk kostrådgivare som uppskattar näringsinnehåll från foton av mat.
Du får en bild på en måltid. Identifiera varje komponent på tallriken och uppskatta portionsstorlek och näringsinnehåll.

Riktlinjer:
- Utgå från svensk mat och svenska portioner (husmanskost, mellanmål, restaurangportioner).
- Ange portion i gram, deciliter eller styck — det som är naturligast för livsmedlet.
- Använd tallrik, bestick och glas i bilden som storleksreferens.
- Ge en tydlig, användbar gissning hellre än ett undanglidande svar. Är du osäker: gissa på det mest sannolika och förklara osäkerheten i "note".
- Räkna med tillagningsfett (smör, olja) om maten ser stekt eller ugnsbakad ut.
- Sätt confidence till "låg" om bilden är otydlig, maten är svår att identifiera eller mycket är dolt.
- Om bilden inte föreställer mat: returnera en tom items-lista, nollor, confidence "låg" och förklara i "note".
- Skriv all text på svenska.`;

const PHOTO_SCHEMA = {
  type: "object", additionalProperties: false,
  required: ["items", "total_kcal", "total_protein", "confidence", "note"],
  properties: {
    items: {
      type: "array",
      items: {
        type: "object", additionalProperties: false,
        required: ["name", "portion", "kcal", "protein"],
        properties: {
          name: { type: "string", description: "Livsmedlets namn på svenska" },
          portion: { type: "string", description: "Uppskattad portion, t.ex. '150 g' eller '1 dl'" },
          kcal: { type: "integer", description: "Kalorier för portionen" },
          protein: { type: "integer", description: "Protein i gram för portionen" },
        },
      },
    },
    total_kcal: { type: "integer" },
    total_protein: { type: "integer" },
    confidence: { type: "string", enum: ["hög", "medel", "låg"] },
    note: { type: "string", description: "Kort kommentar på svenska om vad som är osäkert" },
  },
};

/* Skala ner och komprimera bilden i webbläsaren innan den skickas.
   Full upplösning kostar 3–4× fler bildtokens utan att förbättra portionsgissningen. */
function fileToScaledJpeg(file, maxPx = PHOTO_MAX_PX) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      const scale = Math.min(1, maxPx / Math.max(img.width, img.height));
      const w = Math.max(1, Math.round(img.width * scale));
      const h = Math.max(1, Math.round(img.height * scale));
      const cv = document.createElement("canvas");
      cv.width = w; cv.height = h;
      cv.getContext("2d").drawImage(img, 0, 0, w, h);
      const dataUrl = cv.toDataURL("image/jpeg", 0.8);
      const comma = dataUrl.indexOf(",");
      if (comma < 0) { reject(new Error("Kunde inte läsa bilden")); return; }
      resolve(dataUrl.slice(comma + 1));
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error("Kunde inte läsa bilden — är det en giltig bildfil?")); };
    img.src = url;
  });
}

/* Ett anrop mot Messages API. Kastar Error med ett svenskt meddelande vid fel. */
async function analyseFoodPhoto(base64) {
  const key = (state.aiKey || "").trim();
  if (!key) throw new Error("Ingen API-nyckel angiven. Lägg in den under Inställningar.");

  let res;
  try {
    res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": key,
        "anthropic-version": "2023-06-01",
        // Krävs för att API:et ska tillåta anrop direkt från en webbläsare
        "anthropic-dangerous-direct-browser-access": "true",
      },
      body: JSON.stringify({
        model: state.aiModel || "claude-opus-5",
        // Opus 5 tänker som standard och max_tokens täcker tänkande + svar.
        // För snålt värde ger ett avhugget svar mitt i JSON:en.
        max_tokens: 2048,
        system: PHOTO_SYSTEM,
        output_config: { effort: "low", format: { type: "json_schema", schema: PHOTO_SCHEMA } },
        messages: [{
          role: "user",
          content: [
            { type: "image", source: { type: "base64", media_type: "image/jpeg", data: base64 } },
            { type: "text", text: "Vad ligger på tallriken, och hur mycket energi och protein innehåller måltiden?" },
          ],
        }],
      }),
    });
  } catch (e) {
    throw new Error("Nådde inte Claude. Kontrollera att du har uppkoppling.");
  }

  if (!res.ok) {
    let detail = "";
    try { detail = (await res.json()).error?.message || ""; } catch (e) { /* inget svar att läsa */ }
    if (res.status === 401) throw new Error("Nyckeln avvisades. Kontrollera API-nyckeln under Inställningar.");
    if (res.status === 403) throw new Error("Nyckeln saknar behörighet för den valda modellen.");
    if (res.status === 429) throw new Error("För många anrop just nu — vänta en stund och försök igen.");
    if (res.status === 400 && /credit|balance/i.test(detail)) throw new Error("Kontot saknar krediter hos Anthropic.");
    if (res.status >= 500) throw new Error("Claude svarar inte just nu. Försök igen om en stund.");
    throw new Error("Anropet misslyckades (" + res.status + ")" + (detail ? ": " + detail : "."));
  }

  const data = await res.json();
  // stop_reason måste kollas INNAN content läses — vid refusal är content tom
  if (data.stop_reason === "refusal") throw new Error("Claude avböjde att analysera bilden. Prova en annan bild.");
  if (data.stop_reason === "max_tokens") throw new Error("Svaret blev avhugget. Prova igen med en enklare bild.");
  const text = (data.content || []).filter(b => b.type === "text").map(b => b.text).join("");
  if (!text.trim()) throw new Error("Tomt svar från Claude. Försök igen.");
  try { return JSON.parse(text); } catch (e) { throw new Error("Kunde inte tolka svaret från Claude. Försök igen."); }
}

/* Måltidstyp utifrån klockan — bara ett förval, går att ändra i modalen. */
function guessMealType() {
  const h = new Date().getHours();
  return h < 10 ? "frukost" : h < 14 ? "lunch" : h < 17 ? "mellanmål" : h < 22 ? "middag" : "mellanmål";
}

function startFoodPhoto(onDone) {
  if (!(state.aiKey || "").trim()) {
    openModal(`
      <div class="card-kicker">📷 Matfoto</div>
      <h2>Lägg in din API-nyckel först</h2>
      <p class="sub" style="margin:.6rem 0 1rem">För att läsa av maten på ett foto behöver appen en egen API-nyckel från Anthropic.
      Den sparas bara i den här webbläsaren och används enbart när du fotograferar mat. Du betalar per bild, ungefär 10–20 öre.</p>
      <p class="sub" style="margin-bottom:1.3rem">Skaffa en nyckel på <b>console.anthropic.com</b> → API keys, och klistra in den under Inställningar.</p>
      <div class="ob-nav" style="margin-top:0"><button class="btn" id="goSettings">Till inställningar →</button></div>`);
    $("#goSettings").onclick = () => { closeModal(); switchView("installningar"); };
    return;
  }
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "image/*";
  input.setAttribute("capture", "environment"); // öppnar kameran direkt på mobilen
  input.style.display = "none";
  document.body.appendChild(input);
  input.onchange = async () => {
    const file = input.files && input.files[0];
    input.remove();
    if (!file) return;
    openModal(`
      <div class="card-kicker">📷 Matfoto</div>
      <h2>Läser av tallriken…</h2>
      <div class="ai-loading"><div class="ai-spinner"></div>
        <p class="sub">Claude tittar på bilden och uppskattar portioner. Det tar några sekunder.</p></div>`);
    try {
      const b64 = await fileToScaledJpeg(file);
      const result = await analyseFoodPhoto(b64);
      showPhotoResult(result, onDone);
    } catch (err) {
      openModal(`
        <div class="card-kicker">📷 Matfoto</div>
        <h2>Det gick inte</h2>
        <p class="sub" style="margin:.6rem 0 1.3rem">${esc(err.message)}</p>
        <div class="ob-nav" style="margin-top:0">
          <button class="btn ghost" id="aiRetry">Försök igen</button>
          <button class="btn" id="aiManual">Logga manuellt</button>
        </div>`);
      $("#aiRetry").onclick = () => { closeModal(); startFoodPhoto(onDone); };
      $("#aiManual").onclick = () => { closeModal(); openFoodPicker(guessMealType(), onDone); };
    }
  };
  input.click();
}

/* Resultatet visas som redigerbara rader — en uppskattning ska alltid gå att rätta. */
function showPhotoResult(res, onDone) {
  const items = Array.isArray(res.items) ? res.items : [];
  const meal = guessMealType();
  const confClass = res.confidence === "hög" ? "sage" : res.confidence === "låg" ? "clay" : "amber";

  if (!items.length) {
    openModal(`
      <div class="card-kicker">📷 Matfoto</div>
      <h2>Hittade ingen mat på bilden</h2>
      <p class="sub" style="margin:.6rem 0 1.3rem">${esc(res.note || "Prova ett foto rakt uppifrån där hela tallriken syns.")}</p>
      <div class="ob-nav" style="margin-top:0">
        <button class="btn ghost" id="aiRetry">Ta ny bild</button>
        <button class="btn" id="aiManual">Logga manuellt</button>
      </div>`);
    $("#aiRetry").onclick = () => { closeModal(); startFoodPhoto(onDone); };
    $("#aiManual").onclick = () => { closeModal(); openFoodPicker(meal, onDone); };
    return;
  }

  openModal(`
    <div class="card-kicker">📷 Matfoto · träffsäkerhet <span class="ai-conf ${confClass}">${esc(res.confidence || "medel")}</span></div>
    <h2>Det här ser jag på tallriken</h2>
    <p class="sub" style="margin:.5rem 0 1.1rem">Justera siffrorna om något ser fel ut — det är din uppskattning som loggas.</p>
    <div class="ai-items" id="aiItems">
      ${items.map((it, i) => `
        <div class="ai-item" data-row="${i}">
          <div class="ai-item-main">
            <span class="ai-item-name">${esc(it.name || "Okänt")}</span>
            <span class="ai-item-portion">${esc(it.portion || "")}</span>
          </div>
          <label class="ai-num">kcal<input type="number" min="0" data-kcal="${i}" value="${Math.max(0, Math.round(it.kcal) || 0)}"></label>
          <label class="ai-num">protein<input type="number" min="0" data-prot="${i}" value="${Math.max(0, Math.round(it.protein) || 0)}"></label>
          <button class="mi-del" data-drop="${i}" title="Ta bort raden">✕</button>
        </div>`).join("")}
    </div>
    <div class="ai-total" id="aiTotal"></div>
    ${res.note ? `<p class="sub" style="font-size:.85rem;margin-top:.9rem">💡 ${esc(res.note)}</p>` : ""}
    ${res.confidence === "låg" ? `<p class="sub" style="font-size:.85rem;margin-top:.5rem;color:var(--clay)">Låg träffsäkerhet — dubbelkolla siffrorna innan du loggar.</p>` : ""}
    <div style="margin-top:1.2rem">
      <label>Logga som</label>
      <select id="aiMeal">${["frukost", "lunch", "middag", "mellanmål"].map(m =>
        `<option value="${m}" ${m === meal ? "selected" : ""}>${m[0].toUpperCase() + m.slice(1)}</option>`).join("")}</select>
    </div>
    <div class="ob-nav">
      <button class="btn ghost" id="aiRetake">Ta ny bild</button>
      <button class="btn" id="aiSave">Logga måltiden</button>
    </div>`);

  const dropped = new Set();
  const rowVal = (attr, i) => { const el = $(`[data-${attr}="${i}"]`); return el ? Math.max(0, +el.value || 0) : 0; };
  const live = () => items.map((_, i) => i).filter(i => !dropped.has(i));

  function refresh() {
    const kcal = live().reduce((a, i) => a + rowVal("kcal", i), 0);
    const prot = live().reduce((a, i) => a + rowVal("prot", i), 0);
    const left = Math.round(state.targets.kcal - dayTotals(matDate).kcal - kcal);
    $("#aiTotal").innerHTML = `<b>${kcal} kcal</b> · <b>${prot} g protein</b>
      <span class="sub" style="margin-left:.5rem">${left >= 0 ? left + " kcal kvar av dagens budget" : Math.abs(left) + " kcal över budget"}</span>`;
  }
  $$("#aiItems input").forEach(inp => inp.oninput = refresh);
  $$("[data-drop]").forEach(b => b.onclick = () => {
    const i = +b.dataset.drop;
    dropped.add(i);
    const row = $(`[data-row="${i}"]`);
    if (row) row.remove();
    if (!live().length) { closeModal(); return; }
    refresh();
  });
  refresh();

  $("#aiRetake").onclick = () => { closeModal(); startFoodPhoto(onDone); };
  $("#aiSave").onclick = () => {
    const mealType = $("#aiMeal").value;
    const rows = live();
    if (!rows.length) { toast("⚠️", "Inget att logga", "Alla rader är borttagna."); return; }
    if (!state.logs.meals[matDate]) state.logs.meals[matDate] = [];
    rows.forEach(i => state.logs.meals[matDate].push({
      name: items[i].name || "Okänt", kcal: rowVal("kcal", i), p: rowVal("prot", i), meal: mealType,
    }));
    save(); closeModal(); onDone();
    const tot = dayTotals(matDate);
    toast("📷", "Måltiden loggad", rows.length + (rows.length === 1 ? " post" : " poster") + " tillagda som " + mealType + ".");
    if (matDate === dkey() && tot.p >= state.targets.protein) toast("💪", "Proteinmål nått!", "Du har fått i dig dagens protein — viktigt för muskler efter 50.");
  };
}

/* ═══════════════ VY: MAT ═══════════════ */
let matDate = dkey();

function renderMat(wrap) {
  const tot = dayTotals(matDate);
  const t = state.targets;
  const groups = ["frukost", "lunch", "middag", "mellanmål"];
  const meals = mealsFor(matDate);
  const gp = proteinByMeal(matDate);
  const pTarget = proteinPerMeal();
  const hits = MAIN_MEALS.filter(m => gp[m] >= pTarget.threshold).length;

  wrap.innerHTML = `
    <div class="date-nav">
      <button id="dPrev">←</button><h2>${prettyDate(matDate)}</h2><button id="dNext" ${matDate === dkey() ? "disabled style='opacity:.3'" : ""}>→</button>
      <button class="btn small" id="photoBtn" style="margin-left:auto">📷 Fotografera maten</button>
      <button class="btn ghost small" id="eatSugg2">🎲 Vad ska jag äta idag?</button>
    </div>
    <div class="grid-2" style="margin-bottom:1.6rem">
      <div class="card"><div class="card-kicker">Kalorier</div>${pbar(tot.kcal, t.kcal)}</div>
      <div class="card"><div class="card-kicker">Protein</div>${pbar(tot.p, t.protein, "sage-f")}</div>
    </div>

    <div class="card ${hits >= 3 ? "sage-c" : ""}" style="margin-bottom:1.6rem">
      <div class="card-kicker">Proteinfördelning · ${hits} av 3 huvudmål över ${pTarget.threshold} g</div>
      <div class="prot-dist">
        ${MAIN_MEALS.map(m => `
          <div class="pd-col">
            <div class="pd-bar"><span class="${gp[m] >= pTarget.threshold ? "hit" : ""}"
              style="height:${Math.min(100, Math.round(gp[m] / Math.max(1, pTarget[m]) * 100))}%"></span>
              <span class="pd-line" style="bottom:${Math.min(100, Math.round(pTarget.threshold / Math.max(1, pTarget[m]) * 100))}%"></span>
            </div>
            <span class="pd-lbl">${m.slice(0, 3)}</span>
            <span class="pd-val ${gp[m] >= pTarget.threshold ? "hit" : ""}">${Math.round(gp[m])}</span>
          </div>`).join("")}
        <div class="pd-col">
          <div class="pd-bar"><span class="muted" style="height:${Math.min(100, Math.round(gp["mellanmål"] / Math.max(1, pTarget["mellanmål"] || 1) * 100))}%"></span></div>
          <span class="pd-lbl">mel</span>
          <span class="pd-val">${Math.round(gp["mellanmål"])}</span>
        </div>
      </div>
      <p class="sub" style="margin-top:.9rem;font-size:.85rem">
        ${hits >= 3
          ? "Bra fördelat — alla tre huvudmål nådde tröskeln. Det är så du skyddar muskelmassan."
          : `Efter 50 svarar muskeln trögare på protein. Sikta på minst <b>${pTarget.threshold} g</b> vid varje huvudmål istället för en stor dos på kvällen — samma dagssumma, mer muskel.`}
      </p>
    </div>
    ${groups.map(g => {
      const items = meals.filter(m => m.meal === g);
      const gk = items.reduce((a, m) => a + m.kcal, 0);
      return `
      <div class="meal-group">
        <div class="meal-group-head">
          <h3>${g[0].toUpperCase() + g.slice(1)}</h3>
          <div style="display:flex;gap:1rem;align-items:baseline">
            <span class="mg-kcal">${gk ? gk + " kcal" : ""}</span>
            <button class="link-btn" data-add="${g}">+ Lägg till</button>
          </div>
        </div>
        ${(() => {
          const got = Math.round(gp[g]), tgt = pTarget[g];
          if (!tgt) return "";
          const hit = got >= tgt, near = got >= tgt * 0.75;
          const isMain = MAIN_MEALS.includes(g);
          return `<div class="mg-prot ${hit ? "hit" : near ? "near" : ""}">
            <span class="mg-prot-bar"><span style="width:${Math.min(100, Math.round(got / tgt * 100))}%"></span></span>
            <span class="mg-prot-txt">${got} / ${tgt} g protein${hit ? " ✓" : isMain && got > 0 && !near ? " — lågt för ett huvudmål" : ""}</span>
          </div>`;
        })()}
        ${items.length ? items.map((m, i) => `
          <div class="meal-item">
            <span>${esc(m.name)}</span>
            <span style="display:flex;gap:.9rem;align-items:center">
              <span class="mi-macro">${m.kcal} kcal · ${m.p} g</span>
              <button class="mi-del" data-del="${meals.indexOf(m)}">✕</button>
            </span>
          </div>`).join("") : `<div class="meal-empty">Inget loggat.</div>`}
      </div>`;
    }).join("")}`;

  $("#eatSugg2").onclick = () => openDayPlan();
  $("#photoBtn").onclick = () => startFoodPhoto(() => renderMat(wrap));
  $("#dPrev").onclick = () => { const d = fromKey(matDate); d.setDate(d.getDate() - 1); matDate = dkey(d); renderMat(wrap); };
  $("#dNext").onclick = () => { const d = fromKey(matDate); d.setDate(d.getDate() + 1); if (dkey(d) <= dkey()) { matDate = dkey(d); renderMat(wrap); } };
  $$("[data-add]").forEach(b => b.onclick = () => openFoodPicker(b.dataset.add, () => renderMat(wrap)));
  $$("[data-del]").forEach(b => b.onclick = () => {
    state.logs.meals[matDate].splice(+b.dataset.del, 1); save(); renderMat(wrap);
  });
}

function openFoodPicker(mealType, onDone) {
  openModal(`
    <h2>Lägg till — ${mealType}</h2>
    <div style="margin:1rem 0 .4rem"><input id="foodSearch" placeholder="Sök livsmedel…" autocomplete="off"></div>
    <div class="food-search-list" id="foodList"></div>
    <div class="section-title" style="font-size:1.1rem;margin-top:1.4rem">Eget livsmedel<span class="st-line"></span></div>
    <div class="ob-grid" style="margin-bottom:0">
      <div class="full"><label>Namn</label><input id="cfName" placeholder="T.ex. Grillad kyckling"></div>
      <div><label>Kcal</label><input id="cfKcal" type="number" min="0" placeholder="450"></div>
      <div><label>Protein (g)</label><input id="cfP" type="number" min="0" placeholder="35"></div>
    </div>
    <div class="ob-nav"><button class="btn" id="cfAdd">Lägg till eget</button></div>`);

  function addMeal(name, kcal, p) {
    if (!state.logs.meals[matDate]) state.logs.meals[matDate] = [];
    state.logs.meals[matDate].push({ name, kcal, p, meal: mealType });
    save(); closeModal(); onDone();
    const tot = dayTotals(matDate);
    if (matDate === dkey() && tot.p >= state.targets.protein) toast("💪", "Proteinmål nått!", "Du har fått i dig dagens protein — viktigt för muskler efter 50.");
  }
  function renderList(q = "") {
    const hits = FOODS.filter(f => f.n.toLowerCase().includes(q.toLowerCase()))
      .sort((a, b) => (b.c === mealType) - (a.c === mealType));
    $("#foodList").innerHTML = hits.map((f, i) => `
      <button class="food-hit" data-i="${FOODS.indexOf(f)}">
        <span>${esc(f.n)}</span><span class="fh-macro">${f.kcal} kcal · ${f.p} g</span>
      </button>`).join("") || `<p class="sub" style="padding:.6rem">Inga träffar — lägg till som eget livsmedel nedan.</p>`;
    $$("#foodList .food-hit").forEach(b => b.onclick = () => { const f = FOODS[+b.dataset.i]; addMeal(f.n, f.kcal, f.p); });
  }
  renderList();
  $("#foodSearch").oninput = e => renderList(e.target.value);
  $("#foodSearch").focus();
  $("#cfAdd").onclick = () => {
    const n = $("#cfName").value.trim();
    if (!n) { toast("⚠️", "Namn saknas", "Skriv vad du åt."); return; }
    addMeal(n, +$("#cfKcal").value || 0, +$("#cfP").value || 0);
  };
}

/* ═══════════════ VY: TRÄNING ═══════════════ */
function renderTraning(wrap) {
  const t = state.targets;
  const wkS = sessionsThisWeek();
  const wkW = walksThisWeek();
  const hist = [...state.logs.sessions].reverse().slice(0, 8);

  const ph = currentPhase();
  const toNext = nextPhaseIn();
  const prNames = Object.keys(state.progress).filter(n => state.progress[n].weight);
  const total = state.logs.sessions.length;
  const sinceDeload = total % 18;
  const deloadSoon = total >= 16 && sinceDeload >= 16;
  const schDays = scheduleDays();
  const schConflicts = recoveryConflicts();
  const disc = disciplineOf();
  const blk = currentBlock();
  if (blk.dirty) save(); // bara när currentBlock faktiskt ankrade om programmet

  wrap.innerHTML = `
    <div class="card accent" style="margin-bottom:1.2rem;display:flex;justify-content:space-between;align-items:center;gap:1rem;flex-wrap:wrap">
      <div>
        <div class="card-kicker">${DISC_META[disc].label} · ${total} pass totalt</div>
        <h2>${ph.name} <span style="font-family:var(--font-mono);font-size:.85rem;color:var(--amber-soft)">· ${ph.sub}</span></h2>
        <p class="sub">${ph.note}${toNext ? " Nästa fas om " + toNext + " pass." : " Du är i högsta fasen — fortsätt öka vikterna stegvis."}</p>
        <div class="blk">
          <div class="blk-head">
            <span class="blk-name">Block ${blk.block} · vecka ${blk.week} — ${blk.meta.name}</span>
            <span class="blk-rpe">${blk.meta.rpe}</span>
          </div>
          <div class="blk-dots">
            ${BLOCK_WEEKS.map(w => `<span class="blk-dot ${w.n === blk.week ? "now" : w.n < blk.week ? "done" : ""} ${w.n === 4 ? "deload" : ""}" title="Vecka ${w.n} — ${w.name}"></span>`).join("")}
          </div>
          <p class="sub" style="font-size:.85rem;margin-top:.5rem">${blk.meta.note}</p>
          ${blk.restarted ? `<p class="sub" style="font-size:.85rem;margin-top:.4rem;color:var(--amber-soft)">Du har varit borta över ${ABSENCE_DAYS} dagar, så blocket har börjat om på uppbyggnad.</p>` : ""}
        </div>
        ${deloadSoon ? `<p class="sub" style="margin-top:.5rem;color:var(--amber-soft)"><b>💤 Dags för en deload snart.</b> Efter ~6–8 veckor mår kroppen bra av en lättare vecka: sänk vikterna 40 % och kör som vanligt. Extra viktigt när man passerat 50.</p>` : ""}
      </div>
      <button class="btn" id="rndWk">⚡ Generera dagens pass</button>
    </div>

    <div class="grid-2" style="margin-bottom:1.6rem">
      <div class="card"><div class="card-kicker">Pass denna vecka</div>
        <div class="big-num">${wkS.length}<small> / ${t.workoutsPerWeek}</small></div>${pbar(wkS.length, t.workoutsPerWeek)}</div>
      <div class="card"><div class="card-kicker">Promenader denna vecka</div>
        <div class="big-num">${wkW.length}<small> / ${t.walksPerWeek}</small></div>${pbar(wkW.length, t.walksPerWeek, "sage-f")}</div>
    </div>

    <div class="section-title">Veckoschema<span class="st-line"></span></div>
    <div class="card" style="margin-bottom:1.6rem">
      <p class="sub" style="margin-bottom:.9rem">Lägg passen på fasta dagar — då blir träningen en rutin istället för ett beslut. Appen påminner dig och kan lägga in dem i telefonens kalender.</p>
      <div class="sch-days" id="schDays">
        ${[1, 2, 3, 4, 5, 6, 0].map(n => `
          <button class="sch-day ${schDays.includes(n) ? "on" : ""}" data-dow="${n}" title="${DAYS[n]}">${DAY_SHORT[n].slice(0, 1)}${DAY_SHORT[n].slice(1, 2).toLowerCase()}</button>`).join("")}
      </div>
      ${schDays.length ? `
        <div class="sch-rows" id="schRows">
          ${schDays.map(n => `
            <div class="sch-row">
              <span class="sch-row-day">${DAYS[n]}</span>
              <select data-pick="${n}">
                <option value="auto" ${state.schedule.days[n] === "auto" ? "selected" : ""}>⚡ Auto — genereras efter dagsform</option>
                ${state.workouts.map(w => `<option value="${esc(w.id)}" ${state.schedule.days[n] === w.id ? "selected" : ""}>${esc(w.name)}</option>`).join("")}
              </select>
            </div>`).join("")}
        </div>
        <div class="sch-foot">
          <label>Tid <input id="schTime" value="${esc(scheduleTime())}" placeholder="17:00" inputmode="numeric"></label>
          <label class="sch-check"><input type="checkbox" id="schRemind" ${state.schedule.remind !== false ? "checked" : ""}> Påminn mig</label>
          <button class="btn ghost small" id="schIcs">📅 Lägg i kalendern</button>
        </div>
        ${schConflicts.length ? `
          <div class="sch-warn">
            <span class="sch-warn-ico">⚠️</span>
            <div><b>${schConflicts.map(c => DAYS[c.a] + " → " + DAYS[c.b].toLowerCase()).join(", ")}</b> tränar samma muskler två dagar i rad.
            Muskeln bygger sig i 24–48 timmar efter passet, och den tiden blir längre med åldern — lägg en dag emellan så får du mer av samma träning.</div>
          </div>` : ""}
        <div class="sch-week">
          ${weekSchedule().map(d => `
            <div class="sch-cell ${d.today ? "today" : ""}">
              <span class="sch-cell-day">${DAY_SHORT[d.dow]}</span>
              <span class="sch-mark ${d.done ? "done" : !d.planned ? "rest" : d.past ? "missed" : "plan"}">${d.done ? "✓" : !d.planned ? "·" : d.past ? "○" : "●"}</span>
              <span class="sch-cell-lbl">${d.done ? "Klart" : !d.planned ? "Vila" : d.past ? "Missat" : "Pass"}</span>
            </div>`).join("")}
        </div>`
      : `<p class="sub" style="color:var(--cream-faint)">Inga dagar valda — tryck på veckodagarna ovan för att lägga upp ett schema.</p>`}
    </div>

    ${prNames.length ? `
    <div class="section-title">Progressive overload — dina vikter<span class="st-line"></span></div>
    <div class="card" style="margin-bottom:1.6rem">
      ${prNames.slice(0, 8).map(n => {
        const pr = state.progress[n], nxt = overloadNext(n);
        return `<div class="hist-item"><span>${esc(n)}</span>
          <span class="h-date">${pr.weight} kg ${pr.full && nxt > pr.weight ? `→ <b style="color:var(--amber-soft)">sikta på ${String(nxt).replace(".", ",")} kg</b>` : "· samma vikt tills alla set sitter"}</span></div>`;
      }).join("")}
    </div>` : ""}

    <div class="section-title">Dina pass<span class="st-line"></span>
      <button class="btn ghost small" id="addWk">+ Nytt pass</button></div>
    <div id="wkCards" class="grid-2"></div>

    <div class="section-title">Promenad<span class="st-line"></span></div>
    <div class="card sage-c" style="display:flex;justify-content:space-between;align-items:center;gap:1rem;flex-wrap:wrap">
      <div><h2 style="font-size:1.25rem">Snabblogga en promenad</h2>
      <p class="sub">Mål: ${t.walksPerWeek} promenader à ${t.walkMin} min per vecka.</p></div>
      <button class="btn sage" id="walkBtn2">🚶 Logga promenad</button>
    </div>

    <div class="section-title">Historik<span class="st-line"></span></div>
    <div class="card">
      ${hist.length ? hist.map(s => `
        <div class="hist-item"><span>▲ ${esc(s.name)}</span><span class="h-date">${prettyDate(s.date)}</span></div>`).join("")
      : `<p class="sub">Inga loggade pass ännu — starta ditt första ovan.</p>`}
    </div>`;

  const cards = $("#wkCards");
  cards.innerHTML = state.workouts.map((w, i) => `
    <div class="wk-card" style="margin-bottom:0">
      <div class="wk-card-head"><h3>${esc(w.name)}</h3><span class="wk-focus">${esc(w.focus || "")}</span></div>
      <ul class="wk-ex-list">
        ${w.exercises.slice(0, 4).map(e => `<li><span>${esc(e.name)}</span><span class="sets">${e.sets} × ${esc(e.reps)}</span></li>`).join("")}
        ${w.exercises.length > 4 ? `<li><span style="color:var(--cream-faint)">+ ${w.exercises.length - 4} till…</span><span></span></li>` : ""}
      </ul>
      <div class="wk-actions">
        <button class="btn small" data-start="${esc(w.id)}">Starta ▶</button>
        <button class="link-btn" data-edit="${i}">Redigera</button>
        <button class="link-btn danger" data-del="${i}">Ta bort</button>
      </div>
    </div>`).join("") || `<p class="sub">Inga pass ännu.</p>`;

  // Veckoschema
  $$("#schDays .sch-day").forEach(b => b.onclick = () => {
    const n = +b.dataset.dow;
    if (state.schedule.days[n] != null) delete state.schedule.days[n];
    else state.schedule.days[n] = state.workouts.length ? state.workouts[scheduleDays().length % state.workouts.length].id : "auto";
    save(); renderTraning(wrap);
  });
  $$("[data-pick]").forEach(s => s.onchange = () => {
    state.schedule.days[+s.dataset.pick] = s.value;
    save(); renderTraning(wrap);
  });
  const schTime = $("#schTime");
  if (schTime) schTime.onchange = () => {
    const v = schTime.value.trim();
    if (!/^\d{1,2}:\d{2}$/.test(v)) { toast("⚠️", "Ogiltig tid", "Skriv tiden som TT:MM, till exempel 17:00."); schTime.value = scheduleTime(); return; }
    state.schedule.time = v.length === 4 ? "0" + v : v;
    save(); renderTraning(wrap);
    toast("🗓", "Schema sparat", scheduleDays().map(n => DAY_SHORT[n]).join(", ") + " kl " + state.schedule.time + ".");
  };
  const schRem = $("#schRemind");
  if (schRem) schRem.onchange = () => { state.schedule.remind = schRem.checked; save(); };
  const schIcs = $("#schIcs");
  if (schIcs) schIcs.onclick = openCalendarExport;

  $("#addWk").onclick = () => openWorkoutBuilder(null, () => { save(); renderTraning(wrap); }, state.workouts);
  $("#rndWk").onclick = openWorkoutGen;
  $("#walkBtn2").onclick = openWalkLogger;
  $$("[data-start]", cards).forEach(b => b.onclick = () => startSession(b.dataset.start));
  $$("[data-edit]", cards).forEach(b => b.onclick = () => openWorkoutBuilder(+b.dataset.edit, () => { save(); renderTraning(wrap); }, state.workouts));
  $$("[data-del]", cards).forEach(b => b.onclick = () => {
    if (confirm("Ta bort passet \"" + state.workouts[+b.dataset.del].name + "\"?")) {
      state.workouts.splice(+b.dataset.del, 1); save(); renderTraning(wrap);
    }
  });
}

/* Passgenerator — välj tid, utrustning och fokus; dagsformen vägs in automatiskt */
function openWorkoutGen() {
  const prefs = state.genPrefs || { time: 45, eq: "gym", focus: "auto" };
  const gDisc = disciplineOf();
  // Ett sparat fokusval från en annan inriktning finns inte i den här listan
  if (!DISC_FOCUS[gDisc].some(([v]) => v === prefs.focus)) prefs.focus = "auto";
  const gBlk = currentBlock();
  if (gBlk.dirty) save();
  const df = computeDagsform();
  const chip = (group, val, label, sel) => `<button class="chip ${sel ? "selected" : ""}" data-g="${group}" data-v="${val}">${label}</button>`;
  openModal(`
    <div class="card-kicker">⚡ Passgenerator</div>
    <h2>Skräddarsy dagens pass</h2>
    <p class="sub" style="margin:.4rem 0 .6rem">Block ${gBlk.block} · vecka ${gBlk.week} av ${BLOCK_LEN} — <b style="color:var(--amber-soft)">${gBlk.meta.name}</b>, ${gBlk.meta.rpe}.</p>
    ${df.hasAnyData ? `<p class="sub" style="margin:0 0 1.1rem">Dagsform just nu: <b style="color:${df.color}">${df.ico} ${df.score} — ${df.label}</b>. Dagsformen går före blocket — är den låg blir passet lättare oavsett vecka.</p>` : `<p class="sub" style="margin:0 0 1.1rem">Ingen dagsform synkad — passet genereras med blockveckans volym.</p>`}
    <label>Hur mycket tid har du?</label>
    <div class="chip-row" style="margin-bottom:1.1rem">
      ${[20, 30, 45, 60].map(t => chip("time", t, t + " min", prefs.time === t)).join("")}
    </div>
    <label>Utrustning</label>
    <div class="chip-row" style="margin-bottom:1.1rem">
      ${chip("eq", "gym", "🏋️ Gym", prefs.eq === "gym")}
      ${chip("eq", "hantlar", "Hantlar hemma", prefs.eq === "hantlar")}
      ${chip("eq", "kropp", "Ingen utrustning", prefs.eq === "kropp")}
    </div>
    <label>Fokus — ${DISC_META[gDisc].label}</label>
    <div class="chip-row" style="margin-bottom:1.4rem">
      ${DISC_FOCUS[gDisc].map(([v, l]) => chip("focus", v, l, prefs.focus === v)).join("")}
    </div>
    <div class="ob-nav" style="margin-top:0"><button class="btn" id="wgGen">⚡ Generera pass</button></div>`);
  $$("[data-g]").forEach(c => c.onclick = () => {
    const g = c.dataset.g;
    prefs[g] = g === "time" ? +c.dataset.v : c.dataset.v;
    $$(`[data-g="${g}"]`).forEach(x => x.classList.toggle("selected", x === c));
  });
  $("#wgGen").onclick = () => {
    state.genPrefs = prefs; save();
    openWorkoutPreview(generateWorkout({ seed: Math.floor(Math.random() * 1e9), ...prefs }), prefs);
  };
}

function openWorkoutPreview(w, prefs) {
  openModal(`
    <div class="card-kicker">⚡ ${esc(w.focus)}</div>
    <h2>${esc(w.name)}</h2>
    ${w.note ? `<p class="sub" style="margin:.4rem 0 .9rem;color:var(--amber-soft)">${esc(w.note)}</p>` : ""}
    <p class="sub" style="margin:.2rem 0 1.2rem">${state.logs.sessions.length} loggade pass → ${currentPhase().name.toLowerCase()}. Övningar du körde förra passet är bortsorterade för variation.</p>
    <ul class="wk-ex-list" style="margin-bottom:1.4rem">
      ${w.exercises.map(e => {
        const nxt = overloadNext(e.name);
        return `<li><span>${esc(e.name)}${nxt ? ` <span style="color:var(--amber-soft);font-family:var(--font-mono);font-size:.75rem">~${String(nxt).replace(".", ",")} kg</span>` : ""}</span><span class="sets">${e.sets} × ${esc(e.reps)}</span></li>`;
      }).join("")}
    </ul>
    <div class="ob-nav" style="margin-top:0;flex-wrap:wrap">
      <button class="btn" id="rwStart">Kör passet nu ▶</button>
      <button class="btn ghost" id="rwReroll">⚡ Generera om</button>
      <button class="btn ghost" id="rwSave">Spara</button>
      <button class="link-btn" id="rwBack">Ändra val</button>
    </div>`);
  $("#rwStart").onclick = () => startSession(w);
  $("#rwReroll").onclick = () => openWorkoutPreview(generateWorkout({ seed: Math.floor(Math.random() * 1e9), ...prefs }), prefs);
  $("#rwBack").onclick = openWorkoutGen;
  $("#rwSave").onclick = () => {
    state.workouts.push(w); save(); closeModal();
    toast("💾", "Pass sparat", "\"" + w.name + "\" ligger nu bland dina pass under Träning.");
    switchView(currentView);
  };
}

/* Aktiv träningssession — med vikter för progressive overload */
function startSession(idOrWorkout) {
  const w = typeof idOrWorkout === "string" ? state.workouts.find(x => x.id === idOrWorkout) : idOrWorkout;
  if (!w) return;
  const done = w.exercises.map(e => Array(clampSets(e.sets)).fill(false));
  const weights = w.exercises.map(e => {
    const nxt = overloadNext(e.name);
    return nxt != null ? nxt : "";
  });

  function render() {
    const total = done.flat().length, checked = done.flat().filter(Boolean).length;
    openModal(`
      <div class="card-kicker">Pågående pass · ${checked}/${total} set</div>
      <h2>${esc(w.name)}</h2>
      <p class="sub" style="margin-bottom:1.4rem">Bocka av varje set och fyll i vikten du kör med — nästa gång föreslår appen en liten ökning om alla set satt. Det är progressive overload.</p>
      ${w.exercises.map((e, ei) => {
        const pr = state.progress[e.name];
        return `
        <div class="session-ex">
          <h3>${esc(e.name)} <span style="font-family:var(--font-mono);font-size:.8rem;color:var(--amber-soft)">${e.sets} × ${esc(e.reps)}</span></h3>
          <div style="display:flex;gap:.9rem;align-items:center;flex-wrap:wrap">
            <div class="set-row">
              ${done[ei].map((v, si) => `<button class="set-check ${v ? "done" : ""}" data-e="${ei}" data-s="${si}">${si + 1}</button>`).join("")}
            </div>
            <div style="display:flex;align-items:center;gap:.4rem">
              <input data-w="${ei}" type="number" step="0.5" min="0" value="${weights[ei]}" placeholder="vikt"
                style="width:78px;padding:.45rem .5rem;font-size:.9rem"> <span style="font-size:.8rem;color:var(--cream-faint)">kg</span>
            </div>
          </div>
          ${pr && pr.weight ? `<p class="sub" style="font-size:.8rem;margin-top:.3rem">Förra passet: ${String(pr.weight).replace(".", ",")} kg${pr.full ? " (alla set klarade — dags att öka)" : ""}</p>` : ""}
        </div>`;
      }).join("")}
      <div class="pbar" style="margin-top:.4rem"><div style="width:${total ? (checked / total) * 100 : 0}%"></div></div>
      <div class="ob-nav">
        <button class="btn ghost" id="sessAbort">Avbryt</button>
        <button class="btn" id="sessDone">Avsluta & logga ✓</button>
      </div>`);
    const syncW = () => $$("[data-w]").forEach(inp => { weights[+inp.dataset.w] = inp.value; });
    $$("[data-w]").forEach(inp => inp.onchange = syncW);
    $$(".set-check").forEach(b => b.onclick = () => {
      syncW();
      done[+b.dataset.e][+b.dataset.s] = !done[+b.dataset.e][+b.dataset.s]; render();
    });
    $("#sessAbort").onclick = closeModal;
    $("#sessDone").onclick = () => {
      syncW();
      w.exercises.forEach((e, ei) => {
        const kg = parseFloat(String(weights[ei]).replace(",", "."));
        if (kg > 0) state.progress[e.name] = { weight: kg, full: done[ei].every(Boolean) };
      });
      state.logs.sessions.push({ date: dkey(), workoutId: w.id, name: w.name });
      save(); closeModal();
      const n = sessionsThisWeek().length;
      const toNext = nextPhaseIn();
      toast("💪", "Pass loggat!", (n >= state.targets.workoutsPerWeek
        ? "Veckans mål nått — " + n + " av " + state.targets.workoutsPerWeek + " pass. Stark vecka!"
        : n + " av " + state.targets.workoutsPerWeek + " pass klara den här veckan.")
        + (toNext && toNext <= 3 ? " Bara " + toNext + " pass kvar till nästa fas." : ""));
      switchView(currentView);
    };
  }
  render();
}

/* ═══════════════ VY: RECEPT ═══════════════ */
let recipeFilter = "alla";

function renderRecept(wrap) {
  ensureMealPlan();
  const tags = ["alla", "favoriter", "högprotein", "snabb", "fettförbränning", "hjärtsmart", "matlåda", "genererad", "helg"];
  const allowed = allowedRecipes();
  const list = recipeFilter === "alla" ? allowed
    : recipeFilter === "favoriter" ? allowed.filter(r => isFav(r.id))
    : allowed.filter(r => r.tags.includes(recipeFilter));
  const dayNames = ["Måndag", "Tisdag", "Onsdag", "Torsdag", "Fredag", "Lördag", "Söndag"];
  const todayIdx = (new Date().getDay() + 6) % 7;
  const shopLeft = state.shopping.filter(i => !i.done).length;

  wrap.innerHTML = `
    <div class="slump-hero">
      <div>
        <div class="card-kicker">Vet inte vad du ska laga?</div>
        <h2>Låt slumpen bestämma middagen.</h2>
        <p class="sub">Förslagen följer dina matpreferenser${state.prefs.avoid.length ? " (undviker: " + state.prefs.avoid.map(a => (PREF_OPTS.find(o => o.id === a) || {}).label || a).join(", ").toLowerCase() + ")" : ""}. Ändra dem under Inställningar.</p>
      </div>
      <div style="display:flex;gap:.7rem;flex-wrap:wrap">
        <button class="btn" id="slumpBtn" style="font-size:1.05rem;padding:.95rem 1.7rem"><span id="dice">🎲</span> Slumpa recept</button>
        <button class="btn ghost" id="genBtn" style="font-size:1.05rem;padding:.95rem 1.7rem">🧪 Generera nytt recept</button>
      </div>
    </div>

    <div class="section-title">Veckans matsedel<span class="st-line"></span>
      <button class="btn ghost small" id="rerollWeek">🎲 Slumpa om veckan</button>
      <button class="btn small" id="makeShop">🛒 Skapa inköpslista</button>
    </div>
    <div class="card" style="padding:.6rem 1.5rem">
      ${state.mealPlan.ids.map((id, i) => {
        const r = findRecipe(id);
        const bf = (state.mealPlan.breakfasts || [])[i];
        const lu = (state.mealPlan.lunches || [])[i];
        return `<div class="hist-item" style="align-items:flex-start;${i === todayIdx ? "background:linear-gradient(90deg,rgba(224,138,60,.1),transparent);margin:0 -1rem;padding:.7rem 1rem;border-radius:8px" : ""}">
          <span style="min-width:0">
            <b style="font-family:var(--font-mono);font-size:.75rem;color:${i === todayIdx ? "var(--amber)" : "var(--cream-faint)"};text-transform:uppercase;letter-spacing:.1em">${dayNames[i]}${i === todayIdx ? " · idag" : ""}</b><br>
            <button class="link-btn" data-open="${esc(id)}" style="text-decoration:none;color:var(--cream);font-size:1rem">◉ ${esc(r ? r.name : "")}</button><br>
            <span class="plan-sub">☀ ${bf ? (bf.rid ? `<button class="link-btn plan-sub-link" data-open="${esc(bf.rid)}">${esc(bf.name)}</button>` : esc(bf.name)) : "—"}
            &nbsp;·&nbsp; ✦ ${lu ? (lu.rid ? `<button class="link-btn plan-sub-link" data-open="${esc(lu.rid)}">${esc(lu.name)}</button>` : esc(lu.name)) : "—"}</span>
          </span>
          <span class="h-date" style="white-space:nowrap">${r ? (r.kcal + (bf ? bf.kcal : 0) + (lu ? lu.kcal : 0)) + " kcal · " + (r.p + (bf ? bf.p : 0) + (lu ? lu.p : 0)) + " g" : ""}</span>
        </div>`;
      }).join("")}
      <p class="sub" style="font-size:.78rem;padding:.5rem 0 .7rem">◉ middag · ☀ frukost · ✦ lunch — kcal/protein per dag avser alla tre. Mellanmål fyller du på med via "Slumpa dagens matsedel" på Idag.</p>
    </div>

    ${state.shopping.length ? `
    <div class="section-title">Inköpslista<span class="st-line"></span>
      <button class="btn ghost small" id="shareShop">↗ Dela</button>
      <button class="btn ghost small" id="copyShop">⧉ Kopiera</button>
      <button class="link-btn danger" id="clearShop">Rensa</button></div>
    <div class="card">
      <p class="sub" style="margin-bottom:.8rem">${shopLeft ? shopLeft + " varor kvar att handla — baserat på veckans matsedel." : "Allt är avbockat ✓"}</p>
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));gap:.2rem .9rem">
        ${state.shopping.map((it, i) => `
          <label style="display:flex;align-items:center;gap:.55rem;text-transform:none;letter-spacing:0;font-size:.95rem;font-weight:500;color:${it.done ? "var(--cream-faint)" : "var(--cream)"};cursor:pointer;padding:.25rem 0;${it.done ? "text-decoration:line-through" : ""}">
            <input type="checkbox" data-shop="${i}" ${it.done ? "checked" : ""} style="width:auto;accent-color:var(--amber)">${esc(it.t)}
          </label>`).join("")}
      </div>
      <div style="display:flex;gap:.5rem;margin-top:1rem;max-width:420px">
        <input id="shopAdd" placeholder="Lägg till egen vara — t.ex. kaffe, hushållspapper…">
        <button class="btn small" id="shopAddBtn">+</button>
      </div>
      <p class="sub" style="margin-top:.8rem;font-size:.82rem">Till ICA: tryck "⧉ Kopiera", öppna <a href="https://www.ica.se/inkopslistan/" target="_blank" rel="noopener" style="color:var(--amber)">ICA:s inköpslista</a> (eller ICA-appen) och klistra in varorna. ICA har inget öppet API för direktkoppling — "Dela" skickar listan till valfri app via mobilens delningsmeny.</p>
    </div>` : ""}

    <div class="section-title">Alla recept<span class="st-line"></span></div>
    <div class="chip-row" id="rFilters">
      ${tags.map(t => `<button class="chip ${recipeFilter === t ? "selected" : ""}" data-t="${t}">${t[0].toUpperCase() + t.slice(1)}</button>`).join("")}
    </div>

    <div class="recipe-grid" id="rGrid">
      ${list.map(r => `
        <button class="recipe-card" data-r="${esc(r.id)}">
          <div class="recipe-band" style="background:${r.color}"></div>
          <span class="fav-star ${isFav(r.id) ? "faved" : ""}" data-fav="${esc(r.id)}" title="Favoritmarkera">${isFav(r.id) ? "★" : "☆"}</span>
          <div class="recipe-body">
            <h3>${esc(r.name)}</h3>
            <p class="r-desc">${esc(r.desc)}</p>
            <div class="recipe-meta"><span><b>${r.kcal}</b> kcal</span><span><b>${r.p} g</b> protein</span><span><b>${r.min}</b> min</span></div>
            <div class="tag-row">${r.tags.map(t => `<span class="tag">${t}</span>`).join("")}</div>
          </div>
        </button>`).join("")}
    </div>`;

  $$("#rFilters .chip").forEach(c => c.onclick = () => { recipeFilter = c.dataset.t; renderRecept(wrap); });
  $$("#rGrid .recipe-card").forEach(b => b.onclick = () => openRecipe(findRecipe(b.dataset.r)));
  $$(".fav-star").forEach(st => st.onclick = e => {
    e.stopPropagation();
    toggleFav(st.dataset.fav);
    renderRecept(wrap);
  });
  $("#genBtn").onclick = () => openRecipeGen();
  $$("[data-open]").forEach(b => b.onclick = () => openRecipe(findRecipe(b.dataset.open)));
  $("#rerollWeek").onclick = () => {
    genMealPlan((state.mealPlan.roll || 0) + 1);
    if (state.shopping.length) buildShopping();
    renderRecept(wrap);
    toast("🎲", "Ny matsedel", "Veckans middagar är omslumpade utifrån dina preferenser.");
  };
  $("#makeShop").onclick = () => {
    buildShopping(); renderRecept(wrap);
    toast("🛒", "Inköpslista klar", state.shopping.length + " varor från veckans sju middagar.");
  };
  const copyBtn = $("#copyShop");
  if (copyBtn) copyBtn.onclick = () => {
    const txt = "Inköpslista STARK50 — vecka " + state.mealPlan.monday + "\n" + state.shopping.filter(i => !i.done).map(i => "• " + i.t).join("\n");
    navigator.clipboard.writeText(txt).then(() => toast("⧉", "Kopierad", "Listan ligger i urklipp — klistra in i valfri app."))
      .catch(() => toast("⚠️", "Kunde inte kopiera", "Markera och kopiera listan manuellt."));
  };
  const clearBtn = $("#clearShop");
  if (clearBtn) clearBtn.onclick = () => { state.shopping = []; save(); renderRecept(wrap); };
  const shareBtn = $("#shareShop");
  if (shareBtn) shareBtn.onclick = () => {
    const txt = "Inköpslista STARK50\n" + state.shopping.filter(i => !i.done).map(i => "• " + i.t).join("\n");
    if (navigator.share) navigator.share({ title: "Inköpslista STARK50", text: txt }).catch(() => {});
    else navigator.clipboard.writeText(txt).then(() => toast("⧉", "Kopierad", "Delning stöds inte här — listan ligger i urklipp istället."));
  };
  const addBtn = $("#shopAddBtn");
  if (addBtn) {
    const doAdd = () => {
      const v = $("#shopAdd").value.trim();
      if (!v) return;
      state.shopping.push({ t: v, done: false }); save(); renderRecept(wrap);
    };
    addBtn.onclick = doAdd;
    $("#shopAdd").onkeydown = e => { if (e.key === "Enter") doAdd(); };
  }
  $$("[data-shop]").forEach(cb => cb.onchange = () => {
    state.shopping[+cb.dataset.shop].done = cb.checked; save(); renderRecept(wrap);
  });
  $("#slumpBtn").onclick = () => {
    const dice = $("#dice");
    dice.classList.remove("dice-anim"); void dice.offsetWidth; dice.classList.add("dice-anim");
    const pool = list.length ? list : allowed;
    setTimeout(() => openRecipe(pool[Math.floor(Math.random() * pool.length)], true), 420);
  };
}

function openRecipe(r, wasRandom) {
  openModal(`
    ${wasRandom ? `<div class="card-kicker">🎲 Slumpen valde…</div>` : ""}
    <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:1rem">
      <h2>${esc(r.name)}</h2>
      <button class="fav-star ${isFav(r.id) ? "faved" : ""} fav-inline" id="rFav" title="Favoritmarkera">${isFav(r.id) ? "★" : "☆"}</button>
    </div>
    <p class="sub" style="margin:.3rem 0 .8rem">${esc(r.desc)}</p>
    <div class="recipe-meta" style="margin-bottom:1.2rem"><span><b>${r.kcal}</b> kcal</span><span><b>${r.p} g</b> protein</span><span><b>${r.min}</b> min</span></div>
    <div class="section-title" style="font-size:1.1rem;margin-top:0">Ingredienser<span class="st-line"></span></div>
    <ul class="tips-list" style="margin-bottom:1rem">${r.ing.map(i => `<li style="padding:.4rem 0">${esc(i)}</li>`).join("")}</ul>
    <div class="section-title" style="font-size:1.1rem">Gör så här<span class="st-line"></span></div>
    <ol style="padding-left:1.2rem;color:var(--cream-dim);line-height:1.7;margin-bottom:1.4rem">
      ${r.steps.map(s => `<li style="margin-bottom:.4rem">${esc(s)}</li>`).join("")}
    </ol>
    <div class="ob-nav" style="margin-top:0;flex-wrap:wrap">
      <button class="btn" id="rLog">+ Logga som middag</button>
      <button class="btn ghost" id="rShop">🛒 Lägg i inköpslista</button>
      <button class="btn ghost" id="rAgain">🎲 Slumpa igen</button>
    </div>`);
  $("#rFav").onclick = () => {
    toggleFav(r.id);
    $("#rFav").textContent = isFav(r.id) ? "★" : "☆";
    $("#rFav").classList.toggle("faved", isFav(r.id));
    toast("★", isFav(r.id) ? "Favoritmarkerad" : "Borttagen från favoriter", isFav(r.id) ? r.name + " dyker nu upp i veckans matsedel oftare." : "");
  };
  $("#rLog").onclick = () => {
    const today = dkey();
    if (!state.logs.meals[today]) state.logs.meals[today] = [];
    state.logs.meals[today].push({ name: r.name, kcal: r.kcal, p: r.p, meal: "middag" });
    save(); closeModal();
    toast("✦", "Loggad i matdagboken", r.name + " tillagd som middag idag.");
    switchView(currentView);
  };
  $("#rShop").onclick = () => {
    const seen = new Set(state.shopping.map(i => i.t.toLowerCase()));
    let added = 0;
    r.ing.forEach(i => { if (!seen.has(i.toLowerCase())) { state.shopping.push({ t: i, done: false }); added++; } });
    save(); closeModal();
    toast("🛒", "Tillagt i inköpslistan", added + " varor från " + r.name + ". Se listan under Recept.");
    switchView(currentView);
  };
  $("#rAgain").onclick = () => openRecipe(allowedRecipes()[Math.floor(Math.random() * allowedRecipes().length)], true);
}

/* ═══════════════ VY: SINNE ═══════════════ */
function renderSinne(wrap) {
  const today = dkey();
  const sleepToday = state.logs.sleep.find(s => s.date === today);
  const stressToday = state.logs.stress.find(s => s.date === today);
  const wk = weekKeys();
  const wkSleep = state.logs.sleep.filter(s => wk.includes(s.date));
  const avgSleep = wkSleep.length ? (wkSleep.reduce((a, s) => a + s.hours, 0) / wkSleep.length).toFixed(1) : "–";
  const shortNights = wkSleep.filter(s => s.hours < 7).length;
  const wkAlco = wk.reduce((a, k) => a + mealsFor(k).filter(m => m.alco).length, 0);

  wrap.innerHTML = `
    ${shortNights >= 3 && state.profile.goal === "fett" ? `
    <div class="card" style="margin-bottom:1.2rem;border-color:rgba(201,107,82,.5)">
      <div class="card-kicker" style="color:var(--clay)">⚠ Sömn & viktnedgång</div>
      <p class="sub">Du har sovit under 7 timmar ${shortNights} nätter den här veckan. Forskningen är tydlig: vid kaloriunderskott och för lite sömn kommer en större del av viktnedgången från muskler istället för fett — och aptiten ökar. Prioritera sömnen den här veckan lika högt som träningen.</p>
    </div>` : ""}
    <div class="grid-2">
      <div class="card sage-c">
        <div class="card-kicker sage-k">Andningsövning</div>
        <h2>Två minuter som sänker pulsen</h2>
        <p class="sub">4-7-8-metoden: in genom näsan, håll, långsamt ut. Kör 4 varv — perfekt före sömn eller efter ett tufft möte.</p>
        <button class="btn sage" style="margin-top:1rem" id="breathBtn">Starta övningen ◐</button>
      </div>

      <div class="card">
        <div class="card-kicker">Stressnivå idag</div>
        <p class="sub" style="margin-bottom:.8rem">Hur känns det just nu?</p>
        <div class="mood-row" id="moodRow">
          ${[["😌", "Lugn", 1], ["🙂", "Bra", 2], ["😐", "Spänd", 3], ["😟", "Stressad", 4], ["😫", "Pressad", 5]].map(([e, l, v]) => `
            <button class="mood-btn ${stressToday && stressToday.level === v ? "selected" : ""}" data-v="${v}">${e}<small>${l}</small></button>`).join("")}
        </div>
      </div>

      <div class="card">
        <div class="card-kicker">Sömn i natt</div>
        ${sleepToday ? `<div class="big-num">${sleepToday.hours}<small> timmar</small></div>
          <p class="sub">Veckosnitt: ${avgSleep} tim · mål ${state.targets.sleepHours} tim</p>` :
          `<p class="sub" style="margin-bottom:.8rem">Hur många timmar sov du?</p>`}
        <div class="chip-row" id="sleepChips" style="margin-top:.7rem">
          ${[5, 6, 6.5, 7, 7.5, 8, 9].map(h => `<button class="chip ${sleepToday && sleepToday.hours === h ? "selected" : ""}" data-h="${h}">${String(h).replace(".", ",")} h</button>`).join("")}
        </div>
      </div>

      <div class="card">
        <div class="card-kicker">Alkohol denna vecka</div>
        <div style="display:flex;align-items:center;justify-content:space-between;gap:1rem">
          <div class="big-num">${wkAlco}<small> enheter</small></div>
          <button class="btn small ghost" id="logAlco">+ Logga en enhet</button>
        </div>
        <p class="sub" style="margin-top:.7rem;font-size:.86rem">Alkohol stör djupsömnen, bromsar återhämtningen och räknas in i kaloribudgeten. Inget förbud — bara medvetenhet.</p>
      </div>

      <div class="card">
        <div class="card-kicker">Veckans återhämtning</div>
        <div style="display:flex;gap:2rem;margin-top:.4rem;flex-wrap:wrap">
          <div><div class="big-num" style="font-size:2rem">${avgSleep}</div><p class="sub">tim sömn/natt</p></div>
          <div><div class="big-num" style="font-size:2rem">${state.logs.stress.filter(s => wk.includes(s.date)).length}</div><p class="sub">stress-checkar</p></div>
          <div><div class="big-num" style="font-size:2rem">${walksThisWeek().length}</div><p class="sub">promenader</p></div>
        </div>
      </div>
    </div>

    <div class="section-title">Kunskap som ger bättre nätter<span class="st-line"></span></div>
    <div class="card"><ul class="tips-list">
      ${RELAX_TIPS.map(t => `<li><b>${esc(t.t)}</b>${esc(t.d)}</li>`).join("")}
    </ul></div>`;

  $("#breathBtn").onclick = openBreath;
  $("#logAlco").onclick = () => {
    openModal(`
      <h2>Logga alkohol</h2>
      <p class="sub" style="margin:.4rem 0 1.1rem">Läggs i dagens kaloribudget under Mat. En "enhet" ≈ 33 cl öl, 12–15 cl vin eller 4 cl sprit.</p>
      <div class="chip-row" id="alcoChips">
        ${[["Öl 33 cl", 140], ["Starköl 50 cl", 240], ["Glas vin", 125], ["Sprit 4 cl", 95], ["Cider", 180], ["Drink", 220]].map(([n, k]) => `<button class="chip" data-n="${n}" data-k="${k}">${n} · ${k} kcal</button>`).join("")}
      </div>`);
    $$("#alcoChips .chip").forEach(c => c.onclick = () => {
      const td = dkey();
      if (!state.logs.meals[td]) state.logs.meals[td] = [];
      state.logs.meals[td].push({ name: c.dataset.n, kcal: +c.dataset.k, p: 0, meal: "mellanmål", alco: true });
      save(); closeModal();
      toast("🍺", "Loggad", c.dataset.n + " · " + c.dataset.k + " kcal tillagt i dagens budget.");
      renderSinne(wrap);
    });
  };
  $$("#moodRow .mood-btn").forEach(b => b.onclick = () => {
    const v = +b.dataset.v;
    const ex = state.logs.stress.find(s => s.date === today);
    if (ex) ex.level = v; else state.logs.stress.push({ date: today, level: v });
    save();
    if (v >= 4) toast("◐", "Hög stress noterad", "Testa andningsövningen — två minuter gör faktiskt skillnad.");
    renderSinne(wrap);
  });
  $$("#sleepChips .chip").forEach(b => b.onclick = () => {
    const h = +b.dataset.h;
    const ex = state.logs.sleep.find(s => s.date === today);
    if (ex) ex.hours = h; else state.logs.sleep.push({ date: today, hours: h });
    save(); renderSinne(wrap);
  });
}

/* Andningsövning 4-7-8 */
let breathTimer = null;
function openBreath() {
  openModal(`
    <h2 style="text-align:center">Andas med cirkeln</h2>
    <div class="breath-stage">
      <div class="breath-circle" id="bCircle">Redo?</div>
      <div class="breath-count" id="bCount">4 varv · ca 2 minuter</div>
    </div>
    <div class="ob-nav" style="justify-content:center">
      <button class="btn sage" id="bStart">Börja</button>
    </div>`);
  $("#bStart").onclick = runBreath;
}
function runBreath() {
  const circle = $("#bCircle"), count = $("#bCount"), btn = $("#bStart");
  if (!circle) return;
  btn.style.display = "none";
  const phases = [
    { cls: "inhale", label: "Andas in", sec: 4 },
    { cls: "hold", label: "Håll", sec: 7 },
    { cls: "exhale", label: "Andas ut", sec: 8 },
  ];
  let round = 1, pi = 0, sec = phases[0].sec;
  const tick = () => {
    const p = phases[pi];
    circle.className = "breath-circle " + p.cls;
    circle.textContent = p.label;
    count.textContent = sec + " sek · varv " + round + " av 4";
    sec--;
    if (sec < 0) {
      pi++;
      if (pi >= phases.length) { pi = 0; round++; }
      if (round > 4) {
        clearInterval(breathTimer); breathTimer = null;
        circle.className = "breath-circle"; circle.textContent = "Klart ✓";
        count.textContent = "Bra jobbat. Känn efter — lugnare?";
        return;
      }
      sec = phases[pi].sec;
    }
  };
  tick();
  breathTimer = setInterval(tick, 1000);
}
function stopBreath() { if (breathTimer) { clearInterval(breathTimer); breathTimer = null; } }

/* ═══════════════ VY: MÅL ═══════════════ */
function renderMal(wrap) {
  const t = state.targets;
  const p = state.profile;
  const wk = weekKeys();
  const wkS = sessionsThisWeek(), wkW = walksThisWeek();
  const wkMeals = wk.map(k => dayTotals(k)).filter(x => x.kcal > 0);
  const avgKcal = wkMeals.length ? Math.round(wkMeals.reduce((a, x) => a + x.kcal, 0) / wkMeals.length) : 0;
  const avgProt = wkMeals.length ? Math.round(wkMeals.reduce((a, x) => a + x.p, 0) / wkMeals.length) : 0;
  const wkSleep = state.logs.sleep.filter(s => wk.includes(s.date));
  const avgSleep = wkSleep.length ? (wkSleep.reduce((a, s) => a + s.hours, 0) / wkSleep.length).toFixed(1) : null;
  const weights = state.logs.weight;
  const lastW = weights.length ? weights[weights.length - 1].kg : p.weight;
  const tr = weightTrend();
  const lastBp = state.logs.bp.length ? state.logs.bp[state.logs.bp.length - 1] : null;
  const bpAvg = bpAverage();
  const bpCat = bpAvg ? bpCategory(bpAvg.sys, bpAvg.dia) : null;
  const dayLbl = ["M", "T", "O", "T", "F", "L", "S"];
  const alco = wk.reduce((a, k) => a + mealsFor(k).filter(m => m.alco).length, 0);
  const streak = currentStreak();
  const at = adaptiveTDEE();
  const lastBody = state.body.length ? state.body[state.body.length - 1] : null;
  const whtr = lastBody ? Math.round((lastBody.waist / p.height) * 100) / 100 : null;
  const tooFast = tr && p.goal === "fett" && -tr.perWeek > p.weight * 0.011;

  const spark = (() => {
    if (weights.length < 2) return `<p class="sub" style="margin-top:.6rem">Väg dig gärna dagligen (samma tid, före frukost) — appen visar trenden, inte dagsbruset.</p>`;
    const pts = weights.slice(-21);
    const min = Math.min(...pts.map(x => x.kg)) - 1, max = Math.max(...pts.map(x => x.kg)) + 1;
    const W = 300, H = 70;
    const xy = pts.map((x, i) => [(i / Math.max(1, pts.length - 1)) * W, H - ((x.kg - min) / (max - min)) * H]);
    const line = xy.map(pt => pt.map(n => n.toFixed(1)).join(",")).join(" ");
    return `<svg class="spark" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none">
      <polygon class="area" points="0,${H} ${line} ${W},${H}"/><polyline points="${line}"/></svg>`;
  })();

  wrap.innerHTML = `
    <div class="card accent" style="margin-bottom:1.6rem">
      <div class="card-kicker">Veckorapport · ${GOAL_META[p.goal].label}${streak ? " · 🔥 " + streak + " dagar i rad" : ""}</div>
      <div style="display:flex;gap:2.2rem;flex-wrap:wrap;margin-top:.5rem">
        <div><div class="big-num" style="font-size:1.9rem">${wkS.length}/${t.workoutsPerWeek}</div><p class="sub">pass</p></div>
        <div><div class="big-num" style="font-size:1.9rem">${wkW.length}/${t.walksPerWeek}</div><p class="sub">powerwalks</p></div>
        <div><div class="big-num" style="font-size:1.9rem">${avgKcal || "–"}</div><p class="sub">kcal/dag (mål ${t.kcal})</p></div>
        <div><div class="big-num" style="font-size:1.9rem">${avgProt || "–"}</div><p class="sub">g protein/dag (mål ${t.protein})</p></div>
        <div><div class="big-num" style="font-size:1.9rem">${avgSleep || "–"}</div><p class="sub">tim sömn/natt</p></div>
        <div><div class="big-num" style="font-size:1.9rem">${tr ? (tr.perWeek > 0 ? "+" : "") + String(tr.perWeek).replace(".", ",") : "–"}</div><p class="sub">kg/vecka trend</p></div>
        ${alco ? `<div><div class="big-num" style="font-size:1.9rem">${alco}</div><p class="sub">alkoholenheter</p></div>` : ""}
      </div>
      ${tooFast ? `<p class="sub" style="margin-top:.8rem;color:var(--clay)"><b>⚠ Du tappar över 1 % av kroppsvikten per vecka</b> — det ökar risken att muskler följer med. Överväg takten "Medel" eller "Lugn" nedan.</p>` : ""}
    </div>

    ${(() => {
      // Dagsform — senaste 14 dagarna som staplar med statusfärg
      const log = state.dagsformLog || {};
      const days = [];
      for (let i = 13; i >= 0; i--) {
        const d = new Date(); d.setDate(d.getDate() - i);
        const k = dkey(d);
        days.push({ k, lbl: ["S", "M", "T", "O", "T", "F", "L"][d.getDay()], score: log[k] != null ? log[k] : null, isToday: i === 0 });
      }
      const scored = days.filter(d => d.score != null);
      if (!scored.length) return "";
      const avg = Math.round(scored.reduce((a, d) => a + d.score, 0) / scored.length);
      const col = s => s >= 80 ? "var(--sage)" : s >= 60 ? "var(--amber-soft)" : s >= 40 ? "var(--amber)" : "var(--clay)";
      return `
      <div class="section-title">Dagsform — trend<span class="st-line"></span></div>
      <div class="card" style="margin-bottom:1.6rem">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:1.5rem;flex-wrap:wrap">
          <div><div class="card-kicker">Snitt senaste 14 dagarna</div>
            <div class="big-num" style="color:${col(avg)}">${avg}<small> av 100</small></div></div>
          <div class="df-bars" role="img" aria-label="Dagsform per dag, senaste 14 dagarna">
            ${days.map(d => `
              <div class="df-col" title="${d.k}${d.score != null ? " · " + d.score : " · ingen data"}">
                <div class="df-bar-track"><div class="df-bar" style="height:${d.score != null ? Math.max(8, d.score) : 0}%;background:${d.score != null ? col(d.score) : "transparent"}"></div></div>
                <span class="df-lbl ${d.isToday ? "today" : ""}">${d.lbl}</span>
              </div>`).join("")}
          </div>
        </div>
        <p class="sub" style="margin-top:.8rem;font-size:.85rem">Leta mönster: dyk efter sena kvällar, alkohol eller hårda pass? Grön ≥ 80 · ljusbärnsten ≥ 60 · bärnsten ≥ 40 · lera under 40. Dagar utan data lämnas tomma.</p>
      </div>`;
    })()}

    <div class="section-title">Din energibudget<span class="st-line"></span></div>
    <div class="grid-2" style="margin-bottom:1.2rem">
      <div class="card">
        <div class="card-kicker">Förbränning</div>
        <div class="hist-item"><span>BMR — grundförbränning i vila</span><span class="h-date"><b style="color:var(--cream)">${t.bmr}</b> kcal</span></div>
        <div class="hist-item"><span>TDEE enligt formel (Mifflin-St Jeor)</span><span class="h-date"><b style="color:var(--cream)">${t.mifflin}</b> kcal</span></div>
        ${at ? `<div class="hist-item"><span>Uppmätt TDEE — från din vikttrend & loggade mat</span><span class="h-date"><b style="color:var(--amber-soft)">${at.est}</b> kcal</span></div>` : ""}
        <div class="hist-item"><span>${t.kcalAdj < 0 ? "Underskott (" + (PACES[p.pace || "medel"].pct) + " % kroppsvikt/v)" : t.kcalAdj > 0 ? "Överskott för muskelbygge" : "Balans"}</span><span class="h-date"><b style="color:var(--cream)">${t.kcalAdj > 0 ? "+" : ""}${t.kcalAdj}</b> kcal</span></div>
        <div class="hist-item" style="border-bottom:none"><span><b>Ditt dagliga mål</b></span><span class="h-date"><b style="color:var(--amber);font-size:1.05rem">${t.kcal}</b> kcal</span></div>
        ${at && !t.adaptive ? `<button class="btn ghost small" style="margin-top:.7rem" id="useAdaptive">Använd uppmätt TDEE (${at.est} kcal) istället</button>` : ""}
        ${t.adaptive ? `<p class="sub" style="margin-top:.6rem">✓ Adaptiv TDEE aktiv — baserad på dina verkliga data. <button class="link-btn" id="dropAdaptive">Återgå till formel</button></p>` : ""}
      </div>
      <div class="card">
        <div class="card-kicker">Makrokomposition per dag</div>
        <div style="margin-top:.4rem">
          <label style="margin-bottom:.2rem">Protein · ${t.protein} g (${Math.round(t.protein * 4 / t.kcal * 100)} %)</label>
          ${pbar(t.protein * 4, t.kcal, "sage-f")}
          <label style="margin:1rem 0 .2rem">Fett · ${t.fat} g (${Math.round(t.fat * 9 / t.kcal * 100)} %)</label>
          ${pbar(t.fat * 9, t.kcal)}
          <label style="margin:1rem 0 .2rem">Kolhydrater · ${t.carbs} g (${Math.round(t.carbs * 4 / t.kcal * 100)} %)</label>
          ${pbar(t.carbs * 4, t.kcal, "sky-f")}
        </div>
        <p class="sub" style="margin-top:.9rem;font-size:.85rem">Protein ${GOAL_META[p.goal].protein}${p.goal === "fett" && p.pace === "tuff" ? "→2,2" : ""} g/kg för muskelbevarande · fettgolv 0,6 g/kg · kolhydrater läggs runt passen.</p>
      </div>
    </div>
    ${p.goal === "fett" ? `
    <div class="card" style="margin-bottom:1.2rem">
      <div class="card-kicker">Viktminskningstakt</div>
      <div class="chip-row" style="margin-top:.6rem" id="paceRow">
        ${Object.entries(PACES).map(([k, pc]) => `<button class="chip ${(p.pace || "medel") === k ? "selected" : ""}" data-p="${k}" title="${pc.desc}">${pc.label} · ${String(pc.pct).replace(".", ",")} %/v</button>`).join("")}
      </div>
      <p class="sub" style="margin-top:.7rem">${PACES[p.pace || "medel"].desc}. Forskningen: håll dig under 1 %/vecka för att behålla musklerna.</p>
    </div>` : ""}

    <div class="section-title">Vikt — trend, inte dagsform<span class="st-line"></span></div>
    <div class="card" style="margin-bottom:1.2rem">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:1rem;flex-wrap:wrap">
        <div style="display:flex;gap:2.2rem;flex-wrap:wrap">
          <div><div class="card-kicker">7-dagars trendvikt</div><div class="big-num">${tr ? String(tr.avg7).replace(".", ",") : String(lastW).replace(".", ",")}<small> kg</small></div>
            <p class="sub" style="font-size:.85rem">senaste vägning: ${String(lastW).replace(".", ",")} kg</p></div>
          ${tr ? `<div><div class="card-kicker">Takt</div><div class="big-num" style="color:${tr.perWeek < 0 ? "var(--sage)" : "var(--cream)"}">${tr.perWeek > 0 ? "+" : ""}${String(tr.perWeek).replace(".", ",")}<small> kg/v</small></div></div>` : ""}
          ${tr && tr.etaWeeks && p.targetWeight ? `<div><div class="card-kicker">Målvikt ${p.targetWeight} kg</div><div class="big-num">~${Math.round(tr.etaWeeks)}<small> veckor kvar</small></div></div>` : ""}
        </div>
        <div style="display:flex;gap:.5rem;align-items:flex-end;flex-wrap:wrap">
          <div style="width:104px"><label>Dagens vikt</label><input id="wIn" type="number" step="0.1" min="40" max="250" placeholder="${lastW}"></div>
          <button class="btn small" id="wSave">Logga</button>
          <div style="width:104px"><label>Målvikt (kg)</label><input id="twIn" type="number" step="0.5" min="40" max="250" value="${p.targetWeight || ""}" placeholder="t.ex. 90"></div>
          <button class="btn ghost small" id="twSave">Sätt mål</button>
        </div>
      </div>
      ${spark}
    </div>

    <div class="section-title">Kroppssammansättning<span class="st-line"></span></div>
    <div class="grid-2">
      <div class="card">
        <div class="card-kicker">Mät med måttband — säger mer än vågen</div>
        <p class="sub" style="margin:.5rem 0 1rem">Midja i navelhöjd (avslappnad), hals strax under struphuvudet. Mät på morgonen, samma dag varje vecka.</p>
        <div style="display:flex;gap:.5rem;align-items:flex-end;flex-wrap:wrap">
          <div style="width:104px"><label>Midja (cm)</label><input id="waistIn" type="number" step="0.5" min="50" max="200" placeholder="${lastBody ? lastBody.waist : "98"}"></div>
          <div style="width:104px"><label>Hals (cm)</label><input id="neckIn" type="number" step="0.5" min="25" max="60" placeholder="${lastBody ? lastBody.neck : "40"}"></div>
          <button class="btn small" id="bodySave">Logga mått</button>
        </div>
      </div>
      <div class="card ${whtr != null && whtr < 0.5 ? "sage-c" : ""}">
        <div class="card-kicker">${lastBody ? "Senaste mätning · " + prettyDate(lastBody.date) : "Dina nyckeltal"}</div>
        ${lastBody ? `
          <div style="display:flex;gap:2rem;flex-wrap:wrap;margin-top:.4rem">
            <div><div class="big-num" style="font-size:1.9rem">${String(whtr).replace(".", ",")}</div><p class="sub">midja/längd (mål &lt; 0,5)</p></div>
            ${lastBody.bf != null ? `<div><div class="big-num" style="font-size:1.9rem">${String(lastBody.bf).replace(".", ",")} %</div><p class="sub">kroppsfett (US Navy)</p></div>` : ""}
            <div><div class="big-num" style="font-size:1.9rem">${lastBody.waist}</div><p class="sub">cm midja</p></div>
          </div>
          <p class="sub" style="margin-top:.7rem">${lastBody.bf != null ? bfCategory(lastBody.bf) + ". " : ""}${state.body.length > 1 ? "Förändring midja: " + (lastBody.waist - state.body[0].waist > 0 ? "+" : "") + String(Math.round((lastBody.waist - state.body[0].waist) * 10) / 10).replace(".", ",") + " cm sedan start." : "Följ förändringen — inte den exakta siffran."}</p>
        ` : `<p class="sub" style="margin-top:.5rem">Logga midja och hals så räknar appen ut midja/längd-kvot (starkaste hemmamåttet enligt forskningen) och kroppsfett enligt US Navy-formeln. Perfekt när vågen står still men fettet minskar.</p>`}
      </div>
    </div>

    <div class="section-title">Blodtryck<span class="st-line"></span></div>
    <div class="grid-2">
      <div class="card">
        <div class="card-kicker">Mät en gång i veckan</div>
        <p class="sub" style="margin:.5rem 0 1rem">Sitt still i fem minuter först, fötterna i golvet, manschetten i hjärthöjd. Mät två gånger med en minuts mellanrum och logga det andra värdet — det första är nästan alltid högre.</p>
        <div style="display:flex;gap:.5rem;align-items:flex-end;flex-wrap:wrap">
          <div style="width:104px"><label>Övertryck</label><input id="bpSys" type="number" min="60" max="260" placeholder="${lastBp ? lastBp.sys : "128"}"></div>
          <div style="width:104px"><label>Undertryck</label><input id="bpDia" type="number" min="40" max="160" placeholder="${lastBp ? lastBp.dia : "82"}"></div>
          <button class="btn small" id="bpSave">Logga</button>
        </div>
      </div>
      <div class="card ${bpAvg ? bpCat.cls + "-c" : ""}">
        <div class="card-kicker">${bpAvg ? "Snitt av senaste " + bpAvg.n + (bpAvg.n === 1 ? " mätningen" : " mätningarna") : "Varför blodtryck?"}</div>
        ${bpAvg ? `
          <div style="display:flex;gap:2rem;flex-wrap:wrap;align-items:baseline;margin-top:.4rem">
            <div><div class="big-num" style="font-size:1.9rem">${bpAvg.sys}/${bpAvg.dia}</div><p class="sub">mmHg</p></div>
            <div><div class="big-num" style="font-size:1.3rem;color:var(--${bpCat.cls})">${bpCat.label}</div>
              <p class="sub">senaste: ${lastBp.sys}/${lastBp.dia} · ${prettyDate(lastBp.date)}</p></div>
          </div>
          <p class="sub" style="margin-top:.7rem">${bpCat.advice}</p>
          ${state.logs.bp.length > 1 ? `<div class="bp-spark">${state.logs.bp.slice(-12).map(b => {
            const c = bpCategory(b.sys, b.dia);
            return `<span class="bp-dot ${c.cls}" style="height:${Math.max(12, Math.min(52, Math.round((b.sys - 90) * 0.55)))}px" title="${b.sys}/${b.dia} · ${b.date}"></span>`;
          }).join("")}</div><p class="sub" style="font-size:.78rem;margin-top:.35rem">Senaste ${Math.min(12, state.logs.bp.length)} mätningarna — följ riktningen, inte enstaka värden.</p>` : ""}
        ` : `<p class="sub" style="margin-top:.5rem">Blodtrycket förutsäger hjärt- och kärlrisk bättre än vågen gör, och det märks inte förrän det är högt. En mätning i veckan räcker.
          Träning, viktnedgång, promenader, mindre salt och mindre alkohol sänker det mätbart — allt sådant du redan jobbar med här.</p>`}
      </div>
    </div>`;

  const ua = $("#useAdaptive");
  if (ua) ua.onclick = () => {
    p.tdeeOverride = at.est;
    state.targets = calcTargets(p); save();
    toast("◎", "Adaptiv TDEE aktiv", "Kalorimålet utgår nu från din uppmätta förbrukning: " + at.est + " kcal.");
    renderMal(wrap);
  };
  const da = $("#dropAdaptive");
  if (da) da.onclick = () => {
    delete p.tdeeOverride;
    state.targets = calcTargets(p); save(); renderMal(wrap);
  };
  $$("#paceRow .chip").forEach(c => c.onclick = () => {
    p.pace = c.dataset.p;
    state.targets = calcTargets(p); save();
    toast("◎", "Takt: " + PACES[p.pace].label, "Nytt kalorimål: " + state.targets.kcal + " kcal/dag.");
    renderMal(wrap);
  });
  $("#wSave").onclick = () => {
    const kg = +String($("#wIn").value).replace(",", ".");
    if (!kg) { toast("⚠️", "Ange vikt", "Skriv in din vikt i kilo."); return; }
    const today = dkey();
    const ex = state.logs.weight.find(w => w.date === today);
    if (ex) ex.kg = kg; else state.logs.weight.push({ date: today, kg });
    state.profile.weight = kg;
    state.targets = calcTargets(state.profile);
    save();
    toast("◎", "Vikt loggad", kg + " kg. Trenden och kalorimålet är uppdaterade.");
    renderMal(wrap);
  };
  $("#twSave").onclick = () => {
    const tw = +String($("#twIn").value).replace(",", ".");
    p.targetWeight = tw || null; save();
    toast("◎", tw ? "Målvikt satt: " + tw + " kg" : "Målvikt borttagen", tw ? "Prognosen visas när vikttrenden har tillräckligt med data." : "");
    renderMal(wrap);
  };
  $("#bpSave").onclick = () => {
    const sys = Math.round(+$("#bpSys").value), dia = Math.round(+$("#bpDia").value);
    if (!sys || !dia) { toast("⚠️", "Fyll i båda värdena", "Både över- och undertryck behövs."); return; }
    if (sys < 60 || sys > 260 || dia < 40 || dia > 160 || dia >= sys) {
      toast("⚠️", "Kontrollera siffrorna", "Övertrycket ska vara det högre värdet, t.ex. 128/82."); return;
    }
    const today = dkey();
    const ex = state.logs.bp.find(b => b.date === today);
    if (ex) { ex.sys = sys; ex.dia = dia; } else state.logs.bp.push({ date: today, sys, dia });
    save();
    const c = bpCategory(sys, dia);
    toast(c.cls === "sage" ? "✓" : c.cls === "amber" ? "◎" : "⚠️", "Blodtryck loggat: " + sys + "/" + dia,
      c.label + ". " + (state.logs.bp.length < 3 ? "Mät några gånger till — enstaka värden svänger mycket." : c.advice));
    renderMal(wrap);
  };
  $("#bodySave").onclick = () => {
    const waist = +String($("#waistIn").value).replace(",", ".");
    const neck = +String($("#neckIn").value).replace(",", ".");
    if (!waist) { toast("⚠️", "Ange midjemått", "Minst midjan behövs — halsen är valfri men ger kroppsfett-%."); return; }
    const bf = neck ? navyBodyFat(waist, neck, p.height) : null;
    const today = dkey();
    const ex = state.body.find(b => b.date === today);
    const entry = { date: today, waist, neck: neck || null, bf };
    if (ex) Object.assign(ex, entry); else state.body.push(entry);
    save();
    toast("📏", "Mått loggade", "Midja/längd: " + String(Math.round(waist / p.height * 100) / 100).replace(".", ",") + (bf != null ? " · kroppsfett ~" + String(bf).replace(".", ",") + " %" : ""));
    renderMal(wrap);
  };
}

/* ═══════════════ VY: INSTÄLLNINGAR ═══════════════ */
function renderInstallningar(wrap) {
  const p = state.profile, r = state.reminders;
  wrap.innerHTML = `
    <div class="card" style="margin-bottom:1.2rem">
      <div class="card-kicker">Profil & mål</div>
      <div class="ob-grid" style="margin:1rem 0">
        <div><label>Namn</label><input id="sName" value="${esc(p.name)}"></div>
        <div><label>Ålder</label><input id="sAge" type="number" min="${PROFILE_LIMITS.age[0]}" max="${PROFILE_LIMITS.age[1]}" value="${p.age}"></div>
        <div><label>Längd (cm)</label><input id="sHeight" type="number" min="${PROFILE_LIMITS.height[0]}" max="${PROFILE_LIMITS.height[1]}" value="${p.height}"></div>
        <div><label>Vikt (kg)</label><input id="sWeight" type="number" min="${PROFILE_LIMITS.weight[0]}" max="${PROFILE_LIMITS.weight[1]}" step="0.1" value="${p.weight}"></div>
        <div><label>Mål</label><select id="sGoal">
          ${Object.entries(GOAL_META).map(([k, g]) => `<option value="${k}" ${p.goal === k ? "selected" : ""}>${g.label}</option>`).join("")}
        </select></div>
        <div><label>Träningsinriktning</label><select id="sDisc">
          ${Object.entries(DISC_META).map(([k, m]) => `<option value="${k}" ${(p.discipline || "allman") === k ? "selected" : ""}>${m.label}</option>`).join("")}
        </select></div>
        <div><label>Pass / vecka</label><select id="sDays">${[2, 3, 4, 5, 6].map(n => `<option ${p.trainingDays === n ? "selected" : ""}>${n}</option>`).join("")}</select></div>
        <div><label>Powerwalks / dag</label><select id="sWpd">${[1, 2, 3].map(n => `<option value="${n}" ${(p.walksPerDay || 1) === n ? "selected" : ""}>${n === 3 ? "3 eller fler" : n}</option>`).join("")}</select></div>
      </div>
      <button class="btn small" id="sSave">Spara & räkna om mål</button>
    </div>

    <div class="card" style="margin-bottom:1.2rem">
      <div class="card-kicker">Matpreferenser</div>
      <p class="sub" style="margin:.6rem 0 .8rem">Styr receptförslag, veckans matsedel och inköpslistan.</p>
      <label>Jag undviker</label>
      <div class="chip-row" id="sAvoid" style="margin-bottom:1rem">
        ${PREF_OPTS.map(o => `<button class="chip ${state.prefs.avoid.includes(o.id) ? "selected" : ""}" data-t="${o.id}">${o.label}</button>`).join("")}
      </div>
      <div class="chip-row">
        <button class="chip ${state.prefs.vego ? "selected" : ""}" id="sVego">🌱 Vegetariskt så ofta det går</button>
      </div>
    </div>

    <div class="card" style="margin-bottom:1.2rem">
      <div class="card-kicker">Enheter & hälsodata</div>
      <p class="sub" style="margin:.6rem 0 .8rem">Markera dina enheter så visas steg, vilopuls och sömn på översikten.
      En webbapp kan inte läsa enheterna automatiskt — du för över dagens siffror med ett klick via "Synka" på Idag-sidan.</p>
      <div class="chip-row" id="sDev">
        ${DEVICES.map(dv => `<button class="chip ${state.devices.includes(dv.id) ? "selected" : ""}" data-d="${dv.id}">${dv.ico} ${dv.name}</button>`).join("")}
      </div>
      <button class="btn ghost small" style="margin-top:1rem" id="sSync">↻ Synka dagens värden</button>
    </div>

    <div class="card" style="margin-bottom:1.2rem">
      <div class="card-kicker">📷 Matfoto — AI-nyckel</div>
      <p class="sub" style="margin:.6rem 0 .9rem">Med en egen API-nyckel från Anthropic kan du fotografera tallriken under Mat och få kalorier och protein uppskattade automatiskt.
      Skaffa nyckeln på <b>console.anthropic.com</b> → API keys.</p>
      <label>API-nyckel</label>
      <input id="sAiKey" type="password" value="${esc(state.aiKey || "")}" placeholder="sk-ant-..." autocomplete="off" spellcheck="false">
      <div style="margin-top:.9rem"><label>Modell</label>
        <select id="sAiModel">${AI_MODELS.map(m => `<option value="${m.id}" ${(state.aiModel || "claude-opus-5") === m.id ? "selected" : ""}>${m.label} · ${m.cost}</option>`).join("")}</select>
      </div>
      <div style="display:flex;gap:.7rem;margin-top:1rem;flex-wrap:wrap">
        <button class="btn small" id="sAiSave">Spara nyckel</button>
        <button class="btn ghost small" id="sAiTest">Testa anslutningen</button>
        ${state.aiKey ? `<button class="btn ghost small" id="sAiClear" style="border-color:var(--clay);color:var(--clay)">Ta bort nyckel</button>` : ""}
      </div>
      <p class="sub" style="margin-top:.9rem;font-size:.82rem"><b>Om säkerheten:</b> nyckeln sparas i den här webbläsaren och skickas bara till Anthropic när du fotograferar mat.
      Den följer med i dataexporten — dela därför inte backupfilen med någon. Använd appen på en personlig enhet, och spärra nyckeln i konsolen om du tappar bort telefonen.</p>
      <p class="sub" style="margin-top:.5rem;font-size:.82rem">Du betalar Anthropic direkt per bild. Bilderna skalas ner till ${PHOTO_MAX_PX} px innan de skickas och sparas aldrig i appen.</p>
    </div>

    <div class="card" style="margin-bottom:1.2rem">
      <div class="card-kicker">Påminnelser</div>
      <div style="margin:1rem 0">
        <label>Promenadtider (kommaseparerade, HH:MM)</label>
        <input id="sWalks" value="${r.walks.join(", ")}" placeholder="10:00, 15:00">
      </div>
      <div class="ob-grid">
        <div><label>Vattenpåminnelser</label><select id="sWater"><option value="1" ${r.water ? "selected" : ""}>På</option><option value="0" ${!r.water ? "selected" : ""}>Av</option></select></div>
        <div><label>Nedvarvning (tom = av)</label><input id="sWind" value="${r.windDown || ""}" placeholder="21:30"></div>
        <div><label>Veckovägning — dag</label><select id="sWeighDay">
          <option value="">Av</option>
          ${["Söndag", "Måndag", "Tisdag", "Onsdag", "Torsdag", "Fredag", "Lördag"].map((d, i) => `<option value="${i}" ${r.weighDay === i ? "selected" : ""}>${d}</option>`).join("")}
        </select></div>
        <div><label>Veckovägning — tid</label><input id="sWeighTime" value="${r.weighTime || "07:30"}" placeholder="07:30"></div>
        <div><label>Måltidspåminnelser (12:45 & 20:00)</label><select id="sMealPing"><option value="1" ${r.mealPing ? "selected" : ""}>På</option><option value="0" ${!r.mealPing ? "selected" : ""}>Av</option></select></div>
        <div><label>Träningspass (schemat under Träning)</label><select id="sTrainPing"><option value="1" ${state.schedule.remind !== false ? "selected" : ""}>På</option><option value="0" ${state.schedule.remind === false ? "selected" : ""}>Av</option></select></div>
      </div>
      <div style="display:flex;gap:.7rem;margin-top:1rem;flex-wrap:wrap">
        <button class="btn small" id="sRemSave">Spara påminnelser</button>
        <button class="btn ghost small" id="sNotif">🔔 Tillåt systemnotiser</button>
        <button class="btn ghost small" id="sCalExport">📅 Exportera till kalendern</button>
      </div>
      <p class="sub" style="margin-top:.8rem">Missar du en påminnelse för att appen var stängd visas den när du öppnar appen igen (inom tre timmar).</p>
      <p class="sub" style="margin-top:.5rem;font-size:.82rem"><b>På iPhone</b> kräver systemnotiser att appen är tillagd på hemskärmen (Dela → Lägg till på hemskärmen, iOS 16.4 eller senare). För notiser när appen är helt stängd är kalenderexporten den enda vägen — telefonens kalender larmar även när appen inte är igång.</p>
    </div>

    <div class="card">
      <div class="card-kicker">Data</div>
      <p class="sub" style="margin:.6rem 0 1rem">All data ligger lokalt i din webbläsare. Exportera en säkerhetskopia då och då.</p>
      <div style="display:flex;gap:.7rem;flex-wrap:wrap">
        <button class="btn ghost small" id="sExport">⬇ Exportera data</button>
        <button class="btn ghost small" id="sImport">⬆ Importera data</button>
        <input type="file" id="sImportFile" accept=".json,application/json" style="display:none">
        <button class="btn ghost small" id="sOnboard">Kör om onboardingen</button>
        <button class="btn ghost small" id="sReset" style="border-color:var(--clay);color:var(--clay)">Nollställ allt</button>
      </div>
      <p class="sub" style="margin-top:.8rem;font-size:.82rem">Kör du appen på både dator och mobil? Exportera på den ena, importera på den andra — så följer allt med.</p>
      ${state.aiKey ? `<p class="sub" style="margin-top:.5rem;font-size:.82rem;color:var(--amber-soft)">⚠️ Din API-nyckel följer med i exportfilen. Dela den inte vidare.</p>` : ""}
      <p class="sub" id="sVersion" style="margin-top:.8rem;font-size:.78rem;font-family:var(--font-mono)">Version: kontrollerar…</p>
    </div>`;

  swVersion().then(v => {
    const el = $("#sVersion");
    if (!el) return;
    el.textContent = v ? "Version: " + v.cache + " · " + v.built
      : "Version: ingen service worker aktiv (appen körs direkt från nätet)";
  });

  $$("#sAvoid .chip").forEach(c => c.onclick = () => {
    const t = c.dataset.t;
    state.prefs.avoid.includes(t) ? state.prefs.avoid.splice(state.prefs.avoid.indexOf(t), 1) : state.prefs.avoid.push(t);
    c.classList.toggle("selected");
    genMealPlan(0); if (state.shopping.length) buildShopping();
    save();
  });
  $("#sVego").onclick = e => {
    state.prefs.vego = !state.prefs.vego;
    e.target.classList.toggle("selected", state.prefs.vego);
    genMealPlan(0); if (state.shopping.length) buildShopping();
    save();
  };
  $$("#sDev .chip").forEach(c => c.onclick = () => {
    const t = c.dataset.d;
    state.devices.includes(t) ? state.devices.splice(state.devices.indexOf(t), 1) : state.devices.push(t);
    c.classList.toggle("selected"); save();
  });
  $("#sSync").onclick = openDeviceSync;
  $("#sSave").onclick = () => {
    // Orimliga värden ger negativ BMR och därmed negativa mål för kalorier,
    // protein och fett. Avvisa istället för att spara tyst.
    const num = (sel, key, label, unit) => {
      const raw = $(sel).value.trim();
      if (!raw) return p[key];
      const [lo, hi] = PROFILE_LIMITS[key];
      const n = Number(raw.replace(",", "."));
      if (!Number.isFinite(n) || n < lo || n > hi) {
        toast("⚠️", "Orimlig " + label, label[0].toUpperCase() + label.slice(1) + " måste ligga mellan " + lo + " och " + hi + " " + unit + ".");
        return null;
      }
      return n;
    };
    const nAge = num("#sAge", "age", "ålder", "år");
    const nHeight = num("#sHeight", "height", "längd", "cm");
    const nWeight = num("#sWeight", "weight", "vikt", "kg");
    if (nAge === null || nHeight === null || nWeight === null) return;

    p.name = $("#sName").value.trim() || p.name;
    p.age = nAge;
    p.height = nHeight;
    p.weight = nWeight;
    p.goal = $("#sGoal").value;
    p.trainingDays = +$("#sDays").value;
    // Byte av inriktning startar ett nytt block — annars hamnar man mitt i en
    // deload på ett program man precis bytt bort
    const newDisc = $("#sDisc").value;
    if (newDisc !== (p.discipline || "allman")) {
      p.discipline = newDisc;
      state.program = { start: dkey(mondayOf()), block: 1 };
      toast(DISC_META[newDisc].ico, "Inriktning: " + DISC_META[newDisc].label,
        "Ett nytt block startar den här veckan. Dina sparade pass ligger kvar — generera nya under Träning när du vill.");
    }
    p.walksPerDay = +$("#sWpd").value;
    state.targets = calcTargets(p);
    save();
    toast("✓", "Sparat", "Dina mål är omräknade: " + state.targets.kcal + " kcal och " + state.targets.protein + " g protein per dag.");
    switchView("installningar");
  };
  $("#sRemSave").onclick = () => {
    const valid = t => /^\d{1,2}:\d{2}$/.test(t);
    state.reminders.walks = $("#sWalks").value.split(",").map(s => s.trim()).filter(valid);
    state.reminders.water = $("#sWater").value === "1";
    const wind = $("#sWind").value.trim();
    state.reminders.windDown = valid(wind) ? wind : "";
    state.reminders.weighDay = $("#sWeighDay").value === "" ? null : +$("#sWeighDay").value;
    const wt = $("#sWeighTime").value.trim();
    state.reminders.weighTime = valid(wt) ? wt : "07:30";
    state.reminders.mealPing = $("#sMealPing").value === "1";
    state.schedule.remind = $("#sTrainPing").value === "1";
    save();
    toast("🔔", "Påminnelser sparade", "Promenader: " + (state.reminders.walks.join(", ") || "inga") + (state.reminders.weighDay != null ? " · vägning " + ["sön", "mån", "tis", "ons", "tor", "fre", "lör"][state.reminders.weighDay] + " " + state.reminders.weighTime : "") + ".");
  };
  $("#sAiSave").onclick = () => {
    state.aiKey = $("#sAiKey").value.trim();
    state.aiModel = $("#sAiModel").value;
    save();
    toast(state.aiKey ? "✓" : "🔕", state.aiKey ? "Nyckel sparad" : "Nyckel borttagen",
      state.aiKey ? "Du kan nu fotografera maten under Mat." : "Matfoto är avstängt.");
    switchView("installningar");
  };
  $("#sAiModel").onchange = () => { state.aiModel = $("#sAiModel").value; save(); };
  const aiClear = $("#sAiClear");
  if (aiClear) aiClear.onclick = () => {
    if (!confirm("Ta bort API-nyckeln från den här webbläsaren?")) return;
    state.aiKey = ""; save(); switchView("installningar");
    toast("🔕", "Nyckel borttagen", "Matfoto är avstängt tills du lägger in en ny nyckel.");
  };
  $("#sAiTest").onclick = async () => {
    const btn = $("#sAiTest");
    state.aiKey = $("#sAiKey").value.trim();
    state.aiModel = $("#sAiModel").value;
    if (!state.aiKey) { toast("⚠️", "Ingen nyckel", "Klistra in nyckeln i fältet ovan först."); return; }
    save();
    btn.disabled = true; btn.textContent = "Testar…";
    // En 1×1-pixel som testbild: verifierar nyckel, modell och CORS utan att kosta något nämnvärt
    const PX = "/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/wAALCAABAAEBAREA/8QAFAABAAAAAAAAAAAAAAAAAAAACf/EABQQAQAAAAAAAAAAAAAAAAAAAAD/2gAIAQEAAD8AKp//2Q==";
    try {
      await analyseFoodPhoto(PX);
      toast("✓", "Anslutningen fungerar", "Nyckeln och modellen svarar som de ska.");
    } catch (err) {
      toast("⚠️", "Testet misslyckades", err.message);
    } finally { btn.disabled = false; btn.textContent = "Testa anslutningen"; }
  };
  $("#sCalExport").onclick = openCalendarExport;
  $("#sNotif").onclick = async () => {
    if (!("Notification" in window)) { toast("ℹ️", "Stöds inte", "Din webbläsare stöder inte systemnotiser."); return; }
    const perm = await Notification.requestPermission();
    if (perm === "granted") { notify("STARK50", "Notiser är påslagna — så här kommer påminnelserna att se ut."); }
    toast(perm === "granted" ? "✓" : "🔕", perm === "granted" ? "Notiser aktiverade" : "Notiser nekade",
      perm === "granted" ? "En testnotis skickades just. Kom inget? På iPhone måste appen ligga på hemskärmen."
        : "Påminnelser visas bara inne i appen. Kalenderexporten fungerar oavsett.");
  };
  $("#sExport").onclick = () => {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "stark50-backup-" + dkey() + ".json";
    a.click();
  };
  $("#sImport").onclick = () => $("#sImportFile").click();
  $("#sImportFile").onchange = e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      // Bygg upp och verifiera i en lokal variabel — state byts ut och sparas
      // först när vi vet att den nya datan faktiskt går att rendera.
      let next;
      try {
        const data = JSON.parse(reader.result);
        if (!data.profile || !data.logs) throw new Error("fel format");
        next = normalizeState(data);
        next.targets = calcTargets(next.profile);
      } catch (err) {
        toast("⚠️", "Kunde inte läsa filen", "Är det verkligen en STARK50-export? (" + err.message + ")");
        return;
      }
      if (!confirm("Ersätt all data i den här webbläsaren med innehållet i \"" + file.name + "\"?")) return;
      const prev = state;
      state = next;
      try {
        switchView("idag");
      } catch (err) {
        state = prev;                     // inget sparat ännu — den gamla datan är orörd
        switchView("installningar");
        toast("⚠️", "Filen gick inte att visa", "Importen avbröts och din tidigare data ligger kvar. (" + err.message + ")");
        return;
      }
      save();
      toast("✓", "Data importerad", "Välkommen tillbaka, " + state.profile.name + " — allt är på plats.");
    };
    reader.readAsText(file);
  };
  $("#sOnboard").onclick = () => startOnboarding(true);
  $("#sReset").onclick = () => {
    if (confirm("Detta raderar ALL din data — pass, loggar, allt. Säker?")) {
      localStorage.removeItem(STORE_KEY);
      state = defaultState();
      startOnboarding(false);
    }
  };
}

/* ═══════════════ START ═══════════════ */
function boot() {
  if (!state.onboarded) {
    startOnboarding(false);
  } else {
    // Räkna alltid om targets från profilen — fångar nya fält efter appuppdateringar
    state.targets = calcTargets(state.profile);
    save();
    $("#app").classList.remove("hidden");
    switchView("idag");
  }
  checkReminders();
}

/* Kraschar starten får appen aldrig bli en vit skärm: då sitter både export och
   "Nollställ allt" inlåsta i ett gränssnitt som aldrig renderas. Vi backar därför
   till ett tomt state och låter användaren börja om — den sparade datan ligger
   kvar i localStorage tills hen faktiskt väljer att skriva över den. */
function init() {
  try {
    state = load();
    boot();
  } catch (e) {
    console.error("STARK50 kunde inte starta med sparad data:", e);
    state = normalizeState(null);
    try {
      boot();
      toast("⚠️", "Din data kunde inte läsas", "Appen startade tom. Har du en backup går den att importera i Inställningar.");
    } catch (e2) {
      console.error("STARK50 kunde inte starta alls:", e2);
      document.body.innerHTML = '<p style="padding:24px;font:16px system-ui;color:#e8e2d5;background:#12100e">STARK50 kunde inte starta. Ladda om sidan.</p>';
    }
  }
}
init();
