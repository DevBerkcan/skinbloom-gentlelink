# 🎯 Tracking System - Setup Anleitung

Ich habe ein umfassendes Tracking-System für deine Barber Dario Website eingebaut!

## ✅ Was wurde implementiert?

### 1. Backend (API)
- ✅ **Tracking-Felder in Datenbank** hinzugefügt:
  - `ReferrerUrl` - Woher kam der Besucher? (z.B. von Instagram, Google, etc.)
  - `UtmSource` - Quelle (z.B. "instagram", "google", "facebook")
  - `UtmMedium` - Medium (z.B. "social", "cpc", "email")
  - `UtmCampaign` - Kampagne (z.B. "winter_promo")
  - `UtmContent` - Content (z.B. "story_video", "feed_post")
  - `UtmTerm` - Suchbegriff (z.B. "barber_düsseldorf")

- ✅ **API erweitert**: Buchungen speichern jetzt automatisch die Tracking-Daten

### 2. Frontend (Website)
- ✅ **Google Analytics 4** integriert
- ✅ **Vercel Analytics** vorbereitet
- ✅ **UTM-Parameter Tracking** - Speichert automatisch woher Besucher kommen
- ✅ **Event-Tracking** im Buchungsprozess:
  - Service ausgewählt
  - Datum ausgewählt
  - Zeitslot ausgewählt
  - Kundendaten eingegeben
  - Buchung abgeschlossen (Conversion!)

---

## 🚀 Deployment

### Schritt 1: Backend hochladen (MonsterASP)

1. **Öffne FileZilla**
2. **Verbinde zu:** `site48430.siteapp.net`
3. **Navigiere zu:** `/wwwroot`
4. **Lösche alle alten Dateien** im wwwroot
5. **Lade alle Dateien hoch** aus:
   ```
   /Users/berkcan/Dropbox/Mac (2)/Documents/Dario_Friseur Homepage/barberdario-api/BarberDario.Api/publish
   ```
6. **Gehe zu MonsterASP** → **Restart** Website

### Schritt 2: Datenbank-Migration ausführen

**WICHTIG:** Die Datenbank muss aktualisiert werden!

**Option A: Über MonsterASP SQL Manager**
1. Gehe zu **MonsterASP** → **Databases** → **SQL Manager**
2. Führe diesen SQL-Befehl aus:
   ```sql
   ALTER TABLE Bookings ADD ReferrerUrl NVARCHAR(500) NULL;
   ALTER TABLE Bookings ADD UtmSource NVARCHAR(100) NULL;
   ALTER TABLE Bookings ADD UtmMedium NVARCHAR(100) NULL;
   ALTER TABLE Bookings ADD UtmCampaign NVARCHAR(100) NULL;
   ALTER TABLE Bookings ADD UtmContent NVARCHAR(100) NULL;
   ALTER TABLE Bookings ADD UtmTerm NVARCHAR(100) NULL;
   ```

**Option B: Über lokalen PC (wenn Remote Access aktiviert ist)**
1. Öffne Terminal
2. Navigiere zum Backend:
   ```bash
   cd "/Users/berkcan/Dropbox/Mac (2)/Documents/Dario_Friseur Homepage/barberdario-api/BarberDario.Api"
   ```
3. Führe Migration aus:
   ```bash
   dotnet ef database update
   ```

### Schritt 3: Frontend deployen

Das Frontend wird automatisch deployed, wenn du die Änderungen pushst:

```bash
cd "/Users/berkcan/Dropbox/Mac (2)/Documents/Dario_Friseur Homepage/limktree_keinfriseur"
git add .
git commit -m "Add comprehensive tracking system (Google Analytics, UTM, Events)"
git push
```

Vercel wird automatisch deployen (2-3 Minuten).

---

## 🔧 Google Analytics 4 Setup

### 1. Google Analytics Property erstellen

1. Gehe zu: https://analytics.google.com/
2. Klicke auf **"Verwaltung"** (Zahnrad unten links)
3. Klicke auf **"Property erstellen"**
4. Gib einen Namen ein: **"Barber Dario Website"**
5. Wähle Zeitzone: **Deutschland**
6. Wähle Währung: **Euro (EUR)**
7. Klicke **"Weiter"**
8. Wähle Branche: **Schönheit & Fitness**
9. Unternehmensgröße: **Klein**
10. Klicke **"Erstellen"**

### 2. Datenstream einrichten

1. Wähle **"Web"** als Plattform
2. Website-URL: `https://limktree-keinfriseur.vercel.app`
3. Stream-Name: **"Barber Dario Website"**
4. Klicke **"Stream erstellen"**

### 3. Mess-ID (Measurement ID) kopieren

Du siehst jetzt eine **Mess-ID** im Format: `G-XXXXXXXXXX`

**WICHTIG:** Diese ID brauchst du gleich!

### 4. Environment Variable in Vercel setzen

1. Gehe zu: https://vercel.com/dashboard
2. Wähle Projekt: **limktree-keinfriseur**
3. Gehe zu: **Settings** → **Environment Variables**
4. Klicke **"Add New"**
5. **Name:** `NEXT_PUBLIC_GA_ID`
6. **Value:** `G-XXXXXXXXXX` (deine Mess-ID von oben)
7. Environment: **Production**, **Preview**, **Development** (alle auswählen)
8. Klicke **"Save"**

### 5. Redeploy Frontend

1. Gehe zu: **Deployments** Tab
2. Klicke auf das **letzte Deployment**
3. Klicke auf **"..."** → **"Redeploy"**
4. Warte 2-3 Minuten

✅ **Fertig!** Google Analytics trackt jetzt automatisch!

---

## 📊 Vercel Analytics aktivieren

Vercel Analytics ist kostenpflichtig (10$/Monat), aber einfach zu aktivieren:

1. Gehe zu: https://vercel.com/dashboard
2. Wähle Projekt: **limktree-keinfriseur**
3. Gehe zu: **Analytics** Tab
4. Klicke **"Enable Analytics"**
5. Wähle Plan (10$/Monat)
6. Bestätige

✅ **Fertig!** Vercel trackt jetzt automatisch (DSGVO-konform, keine Cookies).

---

## 🎯 Wie du UTM-Links erstellst

Mit UTM-Parametern kannst du genau sehen, welche Kanäle Buchungen bringen!

### Instagram Story/Post

```
https://limktree-keinfriseur.vercel.app?utm_source=instagram&utm_medium=social&utm_campaign=january_promo&utm_content=story_video
```

Bedeutung:
- `utm_source=instagram` → Kam von Instagram
- `utm_medium=social` → Social Media
- `utm_campaign=january_promo` → Januar Promo-Kampagne
- `utm_content=story_video` → Genau aus einem Story-Video

### Google Ads

```
https://limktree-keinfriseur.vercel.app?utm_source=google&utm_medium=cpc&utm_campaign=barber_ads&utm_term=barber_düsseldorf
```

### Facebook Post

```
https://limktree-keinfriseur.vercel.app?utm_source=facebook&utm_medium=social&utm_campaign=grand_opening
```

### Link Generator Tool

Benutze dieses Tool, um Links einfach zu erstellen:
https://ga-dev-tools.google/campaign-url-builder/

---

## 📈 Was wird getrackt?

### 1. Page Views
- Jede Seite die besucht wird
- Mit Google Analytics siehst du: Welche Seiten sind beliebt?

### 2. Buchungsprozess Events

**Schritt 1: Service ausgewählt**
- Event: `service_selected`
- Daten: Service-Name, Preis

**Schritt 2: Datum ausgewählt**
- Event: `date_selected`
- Daten: Gewähltes Datum

**Schritt 3: Zeitslot ausgewählt**
- Event: `timeslot_selected`
- Daten: Gewählte Uhrzeit

**Schritt 4: Kundendaten eingegeben**
- Event: `customer_data_entered`

**Buchung abgeschlossen (CONVERSION!)**
- Event: `booking_completed` + `purchase`
- Daten: Buchungsnummer, Service, Preis, UTM-Parameter
- **Das ist die wichtigste Metrik!**

### 3. Traffic-Quellen (in Datenbank gespeichert!)

Bei **jeder Buchung** wird gespeichert:
- Woher kam der Kunde? (Instagram, Google, Facebook, etc.)
- Welche Kampagne? (z.B. "winter_promo")
- Welches Medium? (Social, CPC, Email, etc.)

**Admin Dashboard Zugriff:**
Du kannst in der Datenbank sehen, welche Kanäle am besten funktionieren!

Beispiel-Query (über MonsterASP SQL Manager):
```sql
-- Welche UTM-Source bringt die meisten Buchungen?
SELECT
  UtmSource,
  COUNT(*) as AnzahlBuchungen,
  SUM(CASE WHEN Service.Price IS NOT NULL THEN Service.Price ELSE 0 END) as Umsatz
FROM Bookings
LEFT JOIN Services ON Bookings.ServiceId = Services.Id
WHERE UtmSource IS NOT NULL
GROUP BY UtmSource
ORDER BY AnzahlBuchungen DESC;
```

---

## 🎉 Beispiel: Instagram Story mit Tracking

1. **Erstelle einen Link:**
   ```
   https://limktree-keinfriseur.vercel.app?utm_source=instagram&utm_medium=story&utm_campaign=newyear2025
   ```

2. **Poste ihn in deiner Instagram Story** mit "Link in Bio" oder "Swipe Up"

3. **Was passiert:**
   - Kunde klickt auf Link
   - Website speichert automatisch: `utm_source=instagram, utm_medium=story, utm_campaign=newyear2025`
   - Kunde bucht einen Termin
   - In der Datenbank steht jetzt bei dieser Buchung: **"Kam von Instagram Story (New Year 2025 Kampagne)"**

4. **Du siehst in Google Analytics:**
   - Wie viele Klicks kamen von diesem Link?
   - Wie viele davon haben gebucht? (Conversion Rate)
   - Welcher Service wurde am meisten gebucht?

---

## 📊 Google Analytics Berichte die du nutzen solltest

Nach dem Setup findest du in Google Analytics:

### 1. Echtzeit-Bericht
- Wer ist **gerade** auf deiner Website?
- Von wo kommen sie? (Instagram, Google, etc.)

### 2. Traffic-Quellen (Akquisition)
- **Akquisition** → **Traffic-Akquisition**
- Zeigt: Instagram, Google, Facebook, Direkt, etc.
- Mit UTM-Parametern sehr detailliert!

### 3. Events
- **Berichte** → **Engagement** → **Events**
- Siehst du alle Tracking-Events:
  - `service_selected`
  - `date_selected`
  - `booking_completed` ← Die wichtigste!

### 4. Conversions
- **Berichte** → **Engagement** → **Conversions**
- Zeigt alle `purchase` Events (= Buchungen)
- **ROI berechnen:** Umsatz pro Kanal!

---

## 🔍 Tracking testen

Nach dem Deployment, teste so:

### Test 1: UTM-Parameter

1. Öffne diesen Link im Browser:
   ```
   https://limktree-keinfriseur.vercel.app?utm_source=test&utm_medium=test&utm_campaign=test_campaign
   ```

2. Öffne **Browser DevTools** (F12)

3. Gehe zu **Console** Tab

4. Du solltest sehen:
   ```
   [Tracking] UTM Parameters captured: {
     utmSource: "test",
     utmMedium: "test",
     utmCampaign: "test_campaign",
     ...
   }
   ```

### Test 2: Event-Tracking

1. Gehe durch den Buchungsprozess
2. In der **Console** siehst du alle Events:
   ```
   [Tracking Event] service_selected {service_name: "Haircut", price: 44}
   [Tracking Event] date_selected {selected_date: "2025-12-28"}
   [Tracking Event] timeslot_selected {selected_time: "10:00"}
   [Tracking Event] booking_completed {...}
   ```

3. **Optional:** Checke in Google Analytics → **Echtzeit** → **Events**

### Test 3: Datenbank

Nach einer Test-Buchung mit UTM-Parametern:

1. Gehe zu **MonsterASP** → **SQL Manager**
2. Query:
   ```sql
   SELECT TOP 10
     BookingNumber,
     ReferrerUrl,
     UtmSource,
     UtmMedium,
     UtmCampaign,
     CreatedAt
   FROM Bookings
   ORDER BY CreatedAt DESC;
   ```

3. Du solltest die UTM-Daten sehen!

---

## 🎯 Marketing-Tipps

### Instagram
- Nutze verschiedene `utm_content` für verschiedene Posts:
  - `utm_content=story_video`
  - `utm_content=feed_photo`
  - `utm_content=reel_haircut`
- So siehst du: **Welche Art von Content bringt Buchungen?**

### Google Ads
- Immer `utm_source=google&utm_medium=cpc` nutzen
- `utm_campaign` = Name deiner Kampagne
- `utm_term` = Keyword das geklickt wurde

### Facebook/Meta Ads
- `utm_source=facebook&utm_medium=cpc`
- `utm_campaign` = Kampagnenname
- `utm_content` = Ad-Variante (A/B Testing!)

### Email-Newsletter
- `utm_source=newsletter&utm_medium=email`
- `utm_campaign=monthly_newsletter`

---

## 🛠️ Troubleshooting

### Problem: Google Analytics zeigt keine Daten

**Lösung:**
1. Checke ob `NEXT_PUBLIC_GA_ID` in Vercel gesetzt ist
2. Checke ob Website neu deployed wurde **nach** dem Setzen der Variable
3. Warte 24-48 Stunden (GA4 braucht Zeit für erste Daten)
4. Teste in **Echtzeit-Bericht** (zeigt sofort Daten)

### Problem: UTM-Parameter werden nicht gespeichert

**Lösung:**
1. Checke Browser Console auf Fehler
2. Stelle sicher Backend ist neu deployed (mit neuen Tracking-Feldern)
3. Stelle sicher Datenbank-Migration wurde ausgeführt

### Problem: Events erscheinen nicht in GA4

**Lösung:**
1. Öffne Browser DevTools → Console
2. Checke ob Events geloggt werden: `[Tracking Event] ...`
3. Falls ja aber GA4 zeigt nichts: Warte 24 Stunden (GA4 verzögert manchmal)
4. Checke **Echtzeit** → **Events** in GA4 (zeigt sofort)

---

## 📞 Support

Bei Fragen oder Problemen, schreib mir einfach!

**Viel Erfolg mit dem Tracking! 🚀**

Du kannst jetzt genau sehen:
- ✅ Woher deine Kunden kommen
- ✅ Welche Marketing-Kanäle funktionieren
- ✅ Welche Services am beliebtesten sind
- ✅ Wo Kunden im Buchungsprozess abbrechen
- ✅ Deine Conversion Rate pro Kanal

**Das ist Gold wert für dein Marketing! 💰**
