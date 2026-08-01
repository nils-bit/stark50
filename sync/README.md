# STARK50 synkserver

En Cloudflare Worker som lagrar **en krypterad blob**. Servern kan inte läsa din
data — appen krypterar med AES-GCM innan något skickas, och nyckeln lämnar aldrig
telefonen.

Kostar 0 kr. Fri nivå ger 100 000 läsningar och 1 000 skrivningar per dygn; appen
landar på några tiotal skrivningar om dagen.

---

## Sätt upp den — en gång, cirka fem minuter

Du behöver ett Cloudflare-konto (gratis) och Node på datorn.

### 1. Skapa nyckeln i appen först

Öppna STARK50 → **Inställningar** → **Synk mellan enheter** → **Skapa synknyckel**.

Appen visar två saker:

- **Synknyckeln** — den hemliga. Spara den i lösenordshanteraren nu. Tappar du
  den går serverkopian inte att läsa igen, av dig eller någon annan.
- **Servertoken** — en hash av synknyckeln. Den ska in i servern nedan. Den kan
  inte användas för att dekryptera något.

### 2. Logga in och skapa lagringen

```sh
cd sync
npx wrangler login
npx wrangler kv namespace create STARK50
```

Sista kommandot skriver ut ett `id`. Klistra in det i `wrangler.toml` i stället
för `FYLL_I_EFTER_KV_CREATE`.

### 3. Lägg in servertoken

```sh
npx wrangler secret put SYNC_TOKEN
```

Klistra in **servertoken** från steg 1 när den frågar. Inte synknyckeln.

### 4. Deploya

```sh
npx wrangler deploy
```

Du får en adress i stil med `https://stark50-sync.ditt-konto.workers.dev`.
Kontrollera att den lever:

```sh
curl https://stark50-sync.ditt-konto.workers.dev/v1/health
# {"ok":true}
```

### 5. Koppla appen

Tillbaka i **Inställningar → Synk mellan enheter**: klistra in adressen och tryck
**Spara och synka**.

### 6. Andra enheten

Öppna appen där, **Inställningar → Synk mellan enheter → Anslut med befintlig
nyckel**, klistra in samma serveradress och samma synknyckel. Data slås ihop —
inget skrivs över.

---

## API

| Metod | Väg | Svar |
|---|---|---|
| `GET` | `/v1/state` | `{ rev, blob }`, eller `{ rev: 0, blob: null }` om inget finns |
| `PUT` | `/v1/state` | Body `{ rev, blob }` → `{ rev }`. Vid krock `409` med serverns `{ rev, blob }` |
| `GET` | `/v1/health` | `{ ok: true }` |

Allt utom `/v1/health` kräver `Authorization: Bearer <servertoken>`.

`rev` räknas upp vid varje skrivning. Klienten skickar det `rev` den senast såg.
Stämmer det inte har en annan enhet hunnit före, och klienten får tillbaka
serverns innehåll för att slå ihop och skicka igen. Det är därför två enheter kan
logga samtidigt utan att någons data försvinner.

---

## Byta nyckel

Skapa en ny i appen, kör `npx wrangler secret put SYNC_TOKEN` igen med den nya
servertoken, och anslut varje enhet på nytt. Den gamla blobben blir oläsbar —
töm den med `npx wrangler kv key delete --binding STARK50 state` om du vill.

## Ta bort alltihop

```sh
npx wrangler delete
```

Din data ligger kvar i telefonen. Synken är en kopia, aldrig originalet.
