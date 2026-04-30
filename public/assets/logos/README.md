# Logo Asset Pipeline

Do not place logo data in React components.

Drop licensed or verified historical logo files into the matching era folder:

```text
public/assets/logos/<era-id>/<school-id>.svg
```

Then update `src/data/logoManifest.ts` with the `assetPath`, `accuracy`, `isHistoricalExact`, and any note/source reminder.

If no era-specific logo is listed in the manifest, the app uses `public/assets/logos/placeholders/<school-id>.svg`, then initials as a final fallback.
