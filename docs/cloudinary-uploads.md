# Authenticated direct Cloudinary uploads

Task 06 was implemented with verification deferred. Task 16 has now verified actual credentials, signed presets and generated PNG/WAV direct uploads through authenticated app signing/completion. Only generated fixtures were deleted; existing saved URLs/media are retained. Extended UI/format/device/deployment cases remain pending.

## Flow

The crop/photo and audio fields keep their existing UX. The browser validates size/format and creates the cropped JPEG locally. `/api/cloudinary/upload` now accepts at most 8 KiB of same-origin JSON metadata, authenticates Supabase, checks invitation ownership through RLS, and returns signed Cloudinary parameters. It never accepts or forwards multipart file bytes.

The browser sends those bytes directly to Cloudinary over HTTPS with XMLHttpRequest progress, then calls `/api/cloudinary/complete` with an owner-bound HMAC ticket. The server rechecks authentication/ownership and reads that exact public ID through Cloudinary's authenticated Admin API. It checks actual resource type, format, bytes, and delivery URL before returning the URL to attach to the private draft. No secret or Admin authorization header is returned to the browser.

Signing fixes the owner/invitation folder, random public ID, allowed formats, preset, timestamp, delivery type, and overwrite=false. The caller supplies only an allowlisted legacy editor slot (`hero`, `gallery`, `couple/bride`, `couple/groom`, or `music`). Actual paths are `wed-pro/owners/<owner-id>/invitations/<invitation-id>/<slot>`. Neither another owner's invitation nor an arbitrary folder can be signed. Each replacement receives a new random ID; old media is not overwritten/deleted.

Allowed resource types are image and video (Cloudinary's audio upload type); raw and auto are unsupported. Images are JPG/JPEG, PNG, WebP, and HEIC up to 8 MiB. Crop export remains JPEG with the existing aspect ratios. Browser HEIC decoding support varies; export JPG/WebP if cropping fails. Audio is MP3, M4A, WAV, AAC, or OGG up to 12 MiB. Video tracks are rejected during completion. M4A format reporting/audio metadata must be exercised with disposable fixtures in task 16; no assumption about account-specific decoding was checked.

Progress remains below completion until metadata confirmation succeeds. Cancel, crop-dialog close, or field unmount aborts the local operation and ignores late responses. Authorization/upload/completion have a combined two-minute browser timeout, with a 100-second XHR timeout and a 15-second server metadata-read timeout. A failure keeps the prior saved URL and shows a retryable message. Crop processing itself is local; an undecodable file shows an image-loading error. If abort occurs after provider storage, the remote asset may exist without being attached. No cleanup/deletion is performed automatically.

## Required configuration

Set these in `.env.local` and the eventual Vercel environment; `.env.example` lists placeholders:

| Variable | Requirement |
| --- | --- |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Actual product environment cloud name; public |
| `CLOUDINARY_API_KEY` | Server-only key authorized for signed uploads and Admin resource lookup |
| `CLOUDINARY_API_SECRET` | Server-only secret; never expose through NEXT_PUBLIC variables or client code |
| `CLOUDINARY_IMAGE_UPLOAD_PRESET` | Dedicated **signed** preset with image allowed formats, appropriate incoming image transforms, and no conflicting ID/folder behavior |
| `CLOUDINARY_AUDIO_UPLOAD_PRESET` | Dedicated **signed** preset with audio allowed formats and no conflicting transformations/ID/folder behavior |
| `CLOUDINARY_FOLDER_MODE` | Actual product environment mode: `fixed` or `dynamic` |

Fixed mode signs folder plus a random public ID; dynamic mode signs asset_folder plus the full owner-scoped public ID. Presets must support these explicit parameters. The old NEXT_PUBLIC unsigned preset is no longer used by the upload controls. Do not assume a public unsigned preset enforces ownership: signed mode and the owner checks are required. Any old exposed unsigned presets remain a deployment configuration review item; changing or disabling them requires separate authorization.

The server fails with a configuration message when required values are missing. Task 16 confirmed all six variables are present, credentials authenticate to the Admin API, and both presets are signed. Configured fixed-folder mode produced the expected owner/invitation-scoped IDs in generated PNG/WAV tests. Preset overwrite defaults are overridden by signed `overwrite=false`; existing presets/settings were not changed. Plan/rate/cost ceilings, HTTPS proxy/CORS/CSP rules and extended upload UI/format/error cases remain pending. The five server-only settings plus explicit NEXT_PUBLIC_SITE_URL are now saved for Vercel Preview only under user authorization. Existing public cloud/Supabase settings remain; a fresh deployment and HTTPS verification are required. Production settings and merge remain pending.

## Limits and provider boundary

Cloudinary [authentication signatures](https://cloudinary.com/documentation/authentication_signatures) cover sorted upload parameters with a timestamp, and exclude file bytes, cloud name, resource_type, and API key. This implementation uses SHA-256, fixed signed IDs, overwrite=false, and a one-hour owner-bound completion ticket. Never describe these signatures as single-use byte-bound tokens. Changing the fixed folder/ID/formats/preset parameters invalidates their signature; replay to an excluded resource endpoint is checked again during completion.

Cloudinary [upload presets](https://cloudinary.com/documentation/upload_presets) do **not** support per-preset file-size ceilings. The 8/12 MiB product limits therefore run in the browser, the signing metadata check, and an actual-byte check during completion. An altered client can upload a larger asset subject to Cloudinary's account limits, but completion refuses to attach it. These checks do not prevent temporary provider storage/cost for a rejected or cancelled asset. Before beta rollout, establish acceptable account-level limits and operational handling/rate limits for unused uploads; do not claim a preset provides a hard pre-storage product-size guarantee.

The signed formats are restricted per the [Upload API](https://cloudinary.com/documentation/image_upload_api_reference); actual bytes/type/format come from the [Admin resource API](https://cloudinary.com/documentation/admin_api#get_details_of_a_single_resource). Completion consumes an Admin API read per upload, so credentials and plan limits must permit that flow. Existing external media URLs remain supported through publish URL validation; this flow does not retroactively prove provenance or delete old assets.

Task 16 must exercise signed parameter tampering, replay/type switching, owner isolation, actual size limits, wrong MIME/format, presets/folder modes, slow/offline requests, malformed responses, progress, cancellation, crop/audio replacement, late field responses, Admin errors/rate limits, and Vercel deployment payload/origin rules in an explicitly authorized test setup. Use disposable fixtures only. No production uploads or settings changes are authorized by this implementation task.

Task 14 removes the unused CloudinaryUploadField compatibility wrapper and next-cloudinary dependency. Active CroppedImageUploadField/AudioUploadField continue to use this signed direct-upload flow; existing saved URLs and configuration requirements are unchanged. See [cleanup decisions](cleanup-decisions.md).


## Task 16 local correction

The bounded JSON reader compares Origin with the HTTP Host authority and request protocol, rather than blindly using Next's internal localhost URL. This fixes legitimate local 127.0.0.1 requests while rejecting cross-origin requests; arbitrary forwarded-host headers are not accepted. Contract tests cover authority mismatch, cross-origin rejection, the 8 KiB ceiling and malformed bodies. Production-build anonymous signing/completion return 401 for valid same-origin JSON. Real authenticated PNG/WAV signing/upload/completion pass locally. Browser crop/audio cancellation and failed-completion retry pass across desktop/mobile Chrome/WebKit; reverse-proxy HTTPS verification remains a preview-release gate.
