# Specification

## Summary
**Goal:** Create a minimal developer website for TetrisVerse that hosts the `app-ads.txt` file for Google AdMob verification.

**Planned changes:**
- Add a route `/app-ads.txt` that serves the exact plain text content `google.com, pub-7936595519986908, DIRECT, f08c47fec0942fa0` with `Content-Type: text/plain`
- Add a home page (`/`) with TetrisVerse branding, a brief description explaining this is the official developer site hosting the app-ads.txt for AdMob verification, and a visible link to `/app-ads.txt`
- Apply a dark, game-inspired visual theme with bright accent colors and bold typography to the landing page

**User-visible outcome:** Visitors and crawlers can access the AdMob verification file at `/app-ads.txt`, and the home page displays TetrisVerse branding with a link to the file.
