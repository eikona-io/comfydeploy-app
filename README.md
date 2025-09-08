Dev

```
bun dev
```

Build

```
bun run build
```

## Large File Uploads (COM-1646)
Behavior:
- Files < 500MB: single-part (existing flow)
- Files ≥ 500MB: multipart upload with retries, progress, and cancel

Implementation:
- Client calls initiate-multipart-upload and uses returned partSize/maxConcurrency.
- Progress is aggregated across concurrent part uploads and persists via Zustand.
- Cancel aborts the multipart upload and updates UI state.

S3 CORS:
- Ensure the bucket exposes ETag in ExposeHeaders so the browser can read it when uploading parts.
