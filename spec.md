# Specification

## Summary
**Goal:** Make the `app-ads.txt` file publicly accessible at the `/app-ads.txt` URL path for Google AdMob publisher verification.

**Planned changes:**
- Place/ensure `frontend/public/app-ads.txt` (containing the AdMob publisher line) is served as a static file at `/app-ads.txt`

**User-visible outcome:** Visiting `https://tetrisverse-5h9.caffeine.xyz/app-ads.txt` returns the raw AdMob publisher verification content.
