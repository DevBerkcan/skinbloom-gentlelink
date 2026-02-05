# Microsoft Clarity Setup Guide

Microsoft Clarity ist jetzt integriert! 🎉

## Was du bekommst:

- 📹 **Session Recordings** - Ansehen wie echte User deine Seite nutzen
- 🔥 **Heatmaps** - Visualisierung wo User klicken und scrollen
- 📊 **Click Analytics** - Automatisches Tracking aller Button-Klicks
- 📱 **Device Analytics** - Mobile vs Desktop Verhalten
- 🎯 **Funnel Analysis** - Wo brechen User im Booking-Prozess ab
- 🆓 **Komplett kostenlos** - Keine Limits!

---

## Setup in 3 Schritten:

### 1. Microsoft Clarity Account erstellen

1. Gehe zu **https://clarity.microsoft.com/**
2. Melde dich mit einem Microsoft-Account an (oder erstelle einen)
3. Klicke auf **"New Project"**
4. Gib einen Namen ein: **"Skinbloom Aesthetics"**
5. Gib die Website-URL ein: **https://skinbloom-aesthetics.ch**

### 2. Project ID kopieren

Nach dem Erstellen des Projekts:
1. Gehe zu **Settings** > **Setup**
2. Kopiere die **Project ID** (sieht aus wie: `abcdefgh12`)
3. Du findest sie auch im Tracking Code unter "Install tracking code"

### 3. Environment Variable hinzufügen

Füge die Project ID zu deiner `.env.local` Datei hinzu:

```bash
# Microsoft Clarity Project ID
NEXT_PUBLIC_CLARITY_PROJECT_ID=deine_project_id_hier
```

**Beispiel:**
```bash
NEXT_PUBLIC_CLARITY_PROJECT_ID=k5m8n3p9q2
```

---

## Deployment

### Für Production (Vercel):

1. Gehe zu deinem Vercel Project
2. Klicke auf **Settings** > **Environment Variables**
3. Füge hinzu:
   - **Key:** `NEXT_PUBLIC_CLARITY_PROJECT_ID`
   - **Value:** Deine Clarity Project ID
   - **Environment:** Production (und Preview wenn gewünscht)
4. Redeploy das Projekt

---

## Features die automatisch getrackt werden:

✅ **Alle Button-Klicks**
- "Jetzt Termin vereinbaren"
- Instagram, WhatsApp, Google Maps Links
- Booking-Schritte (Weiter, Zurück, Buchen)

✅ **User-Journey**
- Wie User durch den Booking-Prozess gehen
- Wo sie abbrechen
- Welche Services am meisten angeschaut werden

✅ **Heatmaps**
- Desktop vs Mobile Klick-Verhalten
- Scroll-Tiefe (wie weit scrollen User)
- Rage Clicks (frustrierte User)

---

## Custom Events (Optional)

Falls du später spezifische Events tracken möchtest, kannst du die Clarity Custom Events nutzen:

```typescript
import { ClarityEvents } from "@/components/analytics/MicrosoftClarity";

// Track Button-Klick
ClarityEvents.trackButtonClick("instagram", { source: "footer" });

// Track Service-Auswahl
ClarityEvents.trackServiceSelection("Hyaluron Behandlung", 249);

// Track erfolgreiche Buchung
ClarityEvents.trackBookingSuccess("BK-12345", "Vampire Lifting");
```

Diese Custom Events helfen dir noch genauer zu verstehen, welche Services am beliebtesten sind.

---

## Dashboard-Features:

### 1. **Recordings** 📹
- Ansehen wie echte User deine Seite nutzen
- Filter nach Device (Mobile/Desktop)
- Filter nach Seite (/booking, /, etc.)
- Filter nach Land (Schweiz)

### 2. **Heatmaps** 🔥
- Click Heatmaps: Wo wird geklickt
- Scroll Heatmaps: Wie weit wird gescrollt
- Area Heatmaps: Welche Bereiche sind interessant

### 3. **Dashboard** 📊
- Sessions pro Tag
- Durchschnittliche Session-Dauer
- Pages per Session
- Rage Clicks (frustrierte User)
- Dead Clicks (Klicks auf nicht-klickbare Elemente)
- Excessive Scrolling

### 4. **Insights** 💡
Clarity zeigt automatisch an:
- Welche Seiten am meisten besucht werden
- Wo User Probleme haben
- Mobile vs Desktop Unterschiede
- Conversion-Funnel Performance

---

## DSGVO / Privacy

✅ **DSGVO-Compliant**
- Clarity ist DSGVO-konform
- Keine persönlichen Daten wie Namen oder Emails werden in Recordings angezeigt
- IP-Adressen werden anonymisiert
- Clarity trackt nur in **Production** (nicht in Development)

Optional: Du kannst in deiner Datenschutzerklärung erwähnen:
```
Wir verwenden Microsoft Clarity um zu verstehen, wie Besucher unsere Website nutzen.
Clarity erfasst keine persönlichen Daten und ist DSGVO-konform.
```

---

## Testen

1. Deploye die Änderungen zu Production
2. Warte 5-10 Minuten
3. Besuche deine Website (https://skinbloom-aesthetics.ch)
4. Klicke auf verschiedene Buttons, navigiere durch den Booking-Prozess
5. Gehe zu **Clarity Dashboard** > **Recordings**
6. Du solltest deine Session sehen können! 🎉

---

## Tipps für beste Nutzung:

1. **Wöchentlich Sessions ansehen**
   - Lerne wie echte User die Seite nutzen
   - Finde UX-Probleme die du nicht erwartet hast

2. **Heatmaps checken**
   - Welche Buttons werden ignoriert?
   - Wo klicken User am meisten?

3. **Funnel-Analyse**
   - Filter Sessions nach "Booking-Seite besucht"
   - Siehe wie viele User den Prozess abschließen
   - Finde heraus wo sie abbrechen

4. **Mobile vs Desktop**
   - Unterschiede im Verhalten erkennen
   - Mobile-Optimierungen priorisieren

---

## Support

- **Clarity Dashboard:** https://clarity.microsoft.com/
- **Dokumentation:** https://docs.microsoft.com/en-us/clarity/
- **Support:** https://clarity.microsoft.com/support

---

Viel Erfolg mit Microsoft Clarity! 🚀
Du wirst beeindruckt sein, wie viel du über deine User lernst.
