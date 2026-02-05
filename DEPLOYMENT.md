# Vercel Deployment Anleitung 🚀

Schritt-für-Schritt Anleitung zum Deployen der Barber Dario Linktree-Seite auf Vercel.

## 📋 Voraussetzungen

- GitHub Account
- Vercel Account (kostenlos bei [vercel.com](https://vercel.com))
- Git installiert auf deinem Computer

## 🚀 Deployment Schritte

### 1. Code zu GitHub pushen

```bash
# Im Projektordner
cd "/Users/berkcan/Dropbox/Mac (2)/Documents/Dario_Friseur Homepage/limktree_keinfriseur"

# Git initialisieren (falls noch nicht geschehen)
git init

# Alle Dateien hinzufügen
git add .

# Commit erstellen
git commit -m "Initial commit - Barber Dario Linktree"

# GitHub Repository erstellen (auf github.com)
# Dann remote hinzufügen:
git remote add origin https://github.com/DEIN-USERNAME/barber-dario-linktree.git

# Code pushen
git push -u origin main
```

### 2. Vercel Account erstellen

1. Gehe zu [vercel.com](https://vercel.com)
2. Klicke auf **"Sign Up"**
3. Wähle **"Continue with GitHub"**
4. Autorisiere Vercel für GitHub

### 3. Projekt in Vercel importieren

1. **Dashboard öffnen**: Nach Login kommst du zum Vercel Dashboard
2. **New Project**: Klicke auf "Add New..." → "Project"
3. **GitHub Repository wählen**:
   - Finde dein Repository `barber-dario-linktree`
   - Klicke auf **"Import"**

### 4. Projekt konfigurieren

#### Framework Preset
- Vercel erkennt automatisch **Next.js** ✅

#### Build Settings
- **Build Command**: `npm run build` (automatisch)
- **Output Directory**: `.next` (automatisch)
- **Install Command**: `npm install` (automatisch)

#### Environment Variables

**KEINE Environment Variables nötig!** ✅

- Klaro Cookie Consent ist bereits integriert (Open Source, kostenlos)
- Keine Registrierung oder API-Keys erforderlich
- DSGVO-konform out-of-the-box

### 5. Deploy starten

1. Klicke auf **"Deploy"**
2. Warte 1-2 Minuten ⏱️
3. **Fertig!** 🎉

### 6. Domain abrufen

Nach erfolgreichem Deployment:

1. Du bekommst eine URL wie: `barber-dario-linktree.vercel.app`
2. Klicke auf **"Visit"** um die Seite zu öffnen
3. Teile diese URL! 🔗

## 🌐 Eigene Domain verbinden (Optional)

### Domain kaufen

Bei einem dieser Anbieter:
- [Namecheap](https://www.namecheap.com) - Günstig
- [GoDaddy](https://www.godaddy.com)
- [Google Domains](https://domains.google.com)

Empfohlene Domains:
- `barberdario.de`
- `barber-dario.de`
- `dariobarber.de`

### Domain mit Vercel verbinden

1. **Vercel Dashboard** → Dein Projekt
2. Klicke auf **"Settings"** → **"Domains"**
3. Klicke auf **"Add"**
4. Gib deine Domain ein: `barberdario.de`
5. Folge den Anweisungen:

#### A) Bei Domain-Provider (z.B. Namecheap):

**CNAME Record hinzufügen:**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

**A Record für Root Domain:**
```
Type: A
Name: @
Value: 76.76.21.21
```

6. Warte 10-60 Minuten für DNS-Propagierung
7. **SSL aktiviert sich automatisch** (HTTPS) 🔒

## 📊 Nach dem Deployment

### 1. Domain in Config aktualisieren

Wenn du eine eigene Domain hast, aktualisiere `lib/config.ts`:

```typescript
export const siteConfig = {
  name: "Barber Dario - Link in Bio",
  description: "Premium Barbershop in Düsseldorf",
  url: "https://barberdario.de", // Deine echte Domain
};
```

Commit & Push:
```bash
git add lib/config.ts
git commit -m "Update domain in config"
git push
```

Vercel deployed automatisch! ✨

### 2. Social Media Links aktualisieren

Teile deine neue URL:
- Instagram Bio: `barberdario.de`
- TikTok Bio: `barberdario.de`
- Google My Business
- Visitenkarten

### 3. Analytics einrichten (Optional)

Wenn du detaillierte Analytics willst:

1. **Klaro Cookie Consent** (bereits integriert) ✅
   - Open Source & DSGVO-konform
   - Keine Konfiguration nötig

2. **Google Analytics** hinzufügen:
   - In `app/layout.tsx` Google Analytics Script einfügen
   - In Vercel Environment Variables `NEXT_PUBLIC_GA_MEASUREMENT_ID` setzen
   - Klaro fragt automatisch nach User-Consent

3. **Vercel Analytics** (empfohlen):
   - Im Vercel Dashboard: **"Analytics"** aktivieren
   - Kostenlos für 100k Pageviews/Monat
   - Keine Cookies nötig (Privacy-friendly)

## 🔄 Updates deployen

Nach Änderungen am Code:

```bash
# Änderungen committen
git add .
git commit -m "Update: Neue Links hinzugefügt"

# Pushen
git push

# Vercel deployed AUTOMATISCH! 🚀
```

Dauert ~1-2 Minuten bis die Änderungen live sind.

## 🐛 Troubleshooting

### Build Failed

**Problem**: Build schlägt fehl

**Lösung**:
```bash
# Lokal testen
npm run build

# Wenn Fehler auftreten, zuerst lokal fixen
# Dann committen & pushen
```

### Cookie Consent funktioniert nicht

**Problem**: Klaro Cookie Banner erscheint nicht

**Lösung**:
1. Browser-Cache leeren (Cmd+Shift+R / Ctrl+Shift+R)
2. Prüfe Browser-Konsole auf Fehler
3. Klaro lädt via CDN - prüfe Netzwerk-Tab im Browser

### Domain funktioniert nicht

**Problem**: Domain zeigt nichts an

**Lösung**:
1. Prüfe DNS-Einstellungen beim Domain-Provider
2. Warte bis zu 24h für DNS-Propagierung
3. Nutze [whatsmydns.net](https://www.whatsmydns.net) zum Prüfen

### 404 Fehler

**Problem**: Seite zeigt 404

**Lösung**:
- Prüfe ob Build erfolgreich war
- Prüfe Vercel Logs: Dashboard → Deployments → View Function Logs

## 📈 Performance-Tipps

### 1. Profilbild optimieren

Bevor du ein Profilbild hochlädst:

```bash
# Image in WebP konvertieren (bessere Performance)
# Online Tool: https://convertio.co/de/jpg-webp/

# Bild in /public/profile.webp speichern
```

Update in `lib/config.ts`:
```typescript
image: "/profile.webp"
```

### 2. Lighthouse Score prüfen

```bash
# Teste deine Live-Seite
npx lighthouse https://deine-domain.de --view
```

Ziel: **90+ Score** in allen Kategorien! 🎯

### 3. Vercel Analytics aktivieren

Im Vercel Dashboard:
- **Analytics** aktivieren
- Zeigt echte User-Performance

## 🎉 Fertig!

Deine Seite ist jetzt live unter:
- **Vercel URL**: `barber-dario-linktree.vercel.app`
- **Custom Domain**: `barberdario.de` (wenn konfiguriert)

### Nächste Schritte:

1. ✅ URL in Instagram Bio einfügen
2. ✅ URL in TikTok Bio einfügen
3. ✅ QR-Code generieren für Visitenkarten
4. ✅ Google My Business aktualisieren
5. ✅ Kunden informieren

## 🆘 Support

Bei Fragen:
- [Vercel Docs](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- Vercel Support Chat (im Dashboard)

---

**Viel Erfolg mit deiner neuen Link-in-Bio Seite!** 🚀💈
