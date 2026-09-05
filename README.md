# Aither Clock

A polished, mobile-first clock app for the web and iPhone.

## Version 13

Aither Clock v13 uses the shared **AitherBackend** account service so the same Aither account can be used across Aither services.

## Shared Aither Account

- Create an account or sign in with the same email/password used by other Aither apps
- Session restore through `GET /api/auth/session`
- Registration through `POST /api/auth/register`
- Login through `POST /api/auth/login`
- Logout through `POST /api/auth/logout`
- Secure credentialed requests using the Aither session cookie
- Default backend: `https://aither-backend.onrender.com`

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
- Sound effects for alerts and a test-sound button
- Optional browser notifications
- Dark/light appearance
- Five accent colors
- Four background styles
- Rounded, soft, and square card styles
- Compact, normal, and large clock sizing
- Fullscreen mode
- Force Update refresh button
- AitherBackend health and version checks
- Mobile/iPhone-friendly touch controls
- Shared Aither account

## AitherBackend

Aither Clock uses the public AitherBackend API contract. The account system and backend client share the same default service used by the Aither ecosystem.

- `GET /api/health`
- `GET /api/version`
- `GET /api/auth/session`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`

The backend URL can still be changed in Settings for local development.

## Run

Open `index.html` in a browser, or publish the repository with GitHub Pages.

## Files

- `index.html` — app structure and controls
- `style.css` — responsive UI, themes, backgrounds, cards, typography, and backend settings styling
- `app.js` — clock, World Clock, stopwatch, timer, alarms, sound, notifications, search, copy, preferences, and backend status UI
- `backend.js` — AitherBackend client with the shared default backend URL
- `auth.js` — shared Aither account registration, login, session, and logout UI

## Project

Aither Clock is part of the Aither project family by OGAitherTech.
