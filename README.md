# Aither Clock

A polished, mobile-first clock app for the web and iPhone.

## Version 13

Aither Clock v13 adds a real integration layer for **AitherBackend**. The app can connect to a deployed AitherBackend instance, test its health and API version, remember the backend URL on the device, and continue working locally when the backend is unavailable.

## Features

- Live digital clock with 12-hour and 24-hour formats
- Live analog clock with animated hands
- Optional seconds display
- Analog + digital, digital-only, and analog-only layouts
- World clocks with saved cities
- World Clock search and 12h/24h switching
- City timezone and UTC offset display
- Copy a city's current time
- Stopwatch with laps
- Countdown timer with progress bar
- Saved alarms with on/off and delete controls
- Alarm time validation for formats like `7:30 AM` and `19:30`
- Sound effects for alerts and a test-sound button
- Optional browser notifications where supported and permitted
- Dark/light appearance
- Five accent colors
- Four background styles
- Rounded, soft, and square card styles
- Compact, normal, and large clock sizing
- System, monospace, and rounded font styles
- Fullscreen mode
- Force Update refresh button
- AitherBackend URL configuration
- AitherBackend health and version checks
- Backend latency display
- Graceful offline/local fallback
- Backend URL saved locally on the device
- No private API/provider keys in the frontend
- Settings, World Clock cities, alarms, and sound preferences saved locally
- Mobile/iPhone-friendly touch controls
- Stopwatch Space-bar shortcut and `F` fullscreen shortcut

## AitherBackend

Aither Clock uses the public AitherBackend API contract when a backend URL is configured. The backend client calls:

- `GET /api/health`
- `GET /api/version`

The backend URL is configured from the **Aither Backend** section inside Aither Clock. No backend URL is hard-coded because a GitHub Pages site requires an actual deployed HTTPS backend. HTTP is accepted only for local development on `localhost` or `127.0.0.1`.

AitherBackend also provides the broader Aither API foundation, including authentication, apps, updates, notifications, config, and status APIs.

## Run

Open `index.html` in a browser, or publish the repository with GitHub Pages.

For backend connectivity, deploy AitherBackend at a real HTTPS URL, configure its CORS settings to allow the Aither Clock GitHub Pages origin, then enter that URL in Aither Clock.

## Files

- `index.html` — app structure and controls
- `style.css` — responsive UI, themes, backgrounds, cards, typography, and backend settings styling
- `app.js` — clock, World Clock, stopwatch, timer, alarms, sound, notifications, search, copy, preferences, and backend status UI
- `backend.js` — lightweight AitherBackend client with health/version requests and local URL storage

## Project

Aither Clock is part of the Aither project family by OGAitherTech.
