# OneTrust Cookie Consent Setup

Diese Anwendung verwendet **OneTrust** für professionelles Cookie-Management und DSGVO-Compliance.

## 🚀 Schnellstart

### 1. OneTrust Account erstellen

1. Gehe zu [onetrust.com](https://www.onetrust.com/)
2. Erstelle einen kostenlosen Account (oder verwende deinen bestehenden)
3. Folge dem Onboarding-Prozess

### 2. Domain Script ID erhalten

1. Logge dich in dein OneTrust-Dashboard ein
2. Navigiere zu: **Admin** → **Data Domain Scripts**
3. Kopiere deine **Data Domain Script ID**
   - Format: `01234567-89ab-cdef-0123-456789abcdef`

### 3. Environment Variable setzen

1. Kopiere die `.env.example` Datei:
   ```bash
   cp .env.example .env.local
   ```

2. Füge deine OneTrust Domain ID ein:
   ```env
   NEXT_PUBLIC_ONETRUST_DOMAIN_ID=deine-onetrust-domain-id-hier
   ```

### 4. Cookie-Banner konfigurieren

1. Gehe zu OneTrust Dashboard → **Cookie Compliance**
2. Konfiguriere dein Cookie-Banner:
   - **Design**: Passe Farben an (empfohlen: #DC2626 für Primärfarbe)
   - **Text**: Deutsche Texte für Barbershop-Branding
   - **Kategorien**: Aktiviere die benötigten Cookie-Kategorien

### 5. Cookie-Kategorien

Die Anwendung verwendet folgende OneTrust-Kategorien:

| Kategorie | ID | Beschreibung | Verwendung |
|-----------|-----|--------------|------------|
| Strictly Necessary | C0001 | Technisch notwendig | Session, Security |
| Performance | C0002 | Analytics & Performance | Analytics Tracking |
| Functional | C0003 | Funktionalität | User Preferences |
| Targeting | C0004 | Marketing & Ads | (Aktuell nicht verwendet) |
| Social Media | C0005 | Social Media | (Aktuell nicht verwendet) |

## 📊 Analytics Integration

Die Analytics werden **nur** getrackt, wenn der User **Performance Cookies** (C0002) akzeptiert hat.

### Consent-Check im Code:

```typescript
import { hasConsent, oneTrustConfig } from "@/lib/config";

// Prüfe ob User Consent gegeben hat
if (hasConsent(oneTrustConfig.categories.performance)) {
  // Track Analytics
  trackEvent("button_click", { label: "Instagram" });
}
```

## 🎨 Design-Anpassungen

### Cookie-Banner Farben (OneTrust Dashboard):

- **Primärfarbe**: `#DC2626` (Barber Red)
- **Sekundärfarbe**: `#991B1B` (Dark Red)
- **Akzent**: `#D4AF37` (Gold)

### Cookie-Settings Button

Der Button erscheint im Footer:
```
Impressum • Datenschutz • Cookie-Einstellungen
```

User können ihre Einstellungen jederzeit ändern.

## 🧪 Testing

### Lokales Testen ohne OneTrust:

Ohne OneTrust Domain ID:
- ❌ Cookie-Banner wird NICHT angezeigt
- ❌ Analytics werden NICHT getrackt
- ⚠️ Console-Warnung: "OneTrust Domain ID fehlt"

### Mit OneTrust Domain ID:

- ✅ Cookie-Banner erscheint beim ersten Besuch
- ✅ Analytics trackt nur mit Consent
- ✅ Settings-Button funktioniert

### Dev-Modus testen:

```bash
# 1. Start dev server
npm run dev

# 2. Öffne Browser
open http://localhost:3000

# 3. Öffne Developer Console
# - Sollte "Analytics blocked: User has not consented" sehen
# - Akzeptiere Cookies
# - Sollte "Analytics tracking..." sehen
```

## 📝 DSGVO-Compliance Checklist

- ✅ Cookie-Banner beim ersten Besuch
- ✅ Opt-in für nicht-notwendige Cookies
- ✅ Klare Kategorisierung der Cookies
- ✅ Einstellungen können jederzeit geändert werden
- ✅ Analytics nur mit Consent
- ✅ Cookie-Policy verlinkt (erstelle /datenschutz Seite!)

## 🔧 Erweiterte Konfiguration

### Weitere Cookie-Kategorien hinzufügen:

Bearbeite `lib/config.ts`:

```typescript
export const oneTrustConfig = {
  domainId: process.env.NEXT_PUBLIC_ONETRUST_DOMAIN_ID || "",
  categories: {
    strictlyNecessary: "C0001",
    performance: "C0002",
    functional: "C0003",
    targeting: "C0004",
    socialMedia: "C0005",
  },
};
```

### Neue Analytics mit Consent:

```typescript
import { hasConsent, oneTrustConfig } from "@/lib/config";

// Google Analytics Beispiel
if (hasConsent(oneTrustConfig.categories.performance)) {
  // Initialize Google Analytics
  gtag('config', 'GA_MEASUREMENT_ID');
}

// Facebook Pixel Beispiel
if (hasConsent(oneTrustConfig.categories.targeting)) {
  // Initialize Facebook Pixel
  fbq('init', 'FB_PIXEL_ID');
}
```

## 🆘 Troubleshooting

### Cookie-Banner erscheint nicht

1. ✅ Prüfe `.env.local` → Domain ID gesetzt?
2. ✅ Browser-Cache leeren
3. ✅ OneTrust Dashboard → Script aktiviert?
4. ✅ Console Errors checken

### Analytics wird nicht getrackt

1. ✅ Cookies akzeptiert?
2. ✅ Performance-Kategorie aktiviert?
3. ✅ Console: "Analytics blocked" oder "Analytics tracking"?
4. ✅ API-Endpoint `/api/analytics` erreichbar?

### Settings-Button funktioniert nicht

1. ✅ OneTrust Script geladen? (Check Network Tab)
2. ✅ Console Error: "OneTrust is not defined"?
3. ✅ Warte bis OneTrust vollständig geladen ist

## 📚 Weitere Ressourcen

- [OneTrust Dokumentation](https://developer.onetrust.com/)
- [DSGVO Compliance Guide](https://gdpr.eu/)
- [Cookie Law Explained](https://www.cookielaw.org/)

## 💡 Best Practices

1. **Teste vor Go-Live**: Teste Cookie-Banner auf allen Geräten
2. **Datenschutzerklärung**: Erstelle eine detaillierte Cookie-Policy
3. **Regelmäßige Updates**: Halte Cookie-Liste aktuell
4. **User-Friendly**: Klare, verständliche Texte verwenden
5. **Performance**: OneTrust Script cached für schnelle Ladezeiten

---

Bei Fragen zur OneTrust-Integration, siehe [OneTrust Support](https://support.onetrust.com/)
