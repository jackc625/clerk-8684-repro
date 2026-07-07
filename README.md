# Minimal reproduction — clerk/javascript#8684

The prebuilt **`<SignUp/>`** widget sends **two `email_code` verification emails**
for a single sign-up submission. Two distinct POSTs each trigger a send:

1. `POST /v1/client/sign_ups` — `signUp.create({ emailAddress, password })`
2. `POST /v1/client/sign_ups/<id>/prepare_verification` — `signUp.prepareEmailAddressVerification({ strategy: 'email_code' })`

The user receives two codes; the first is invalidated by the second.

Upstream issue: https://github.com/clerk/javascript/issues/8684

## Run it — no setup required

A throwaway public dev-instance key is already committed in `src/main.tsx`, so the
repro is one-click. The instance is configured with **Email verification code**
enabled, so you'll receive real codes at whatever email you sign up with.

### Option A — StackBlitz (no install)
Open: `https://stackblitz.com/github/jackc625/clerk-8684-repro`

### Option B — locally
```bash
npm install
npm run dev               # or: npm run build && npm run preview
```

Optionally point it at your own instance by setting `VITE_CLERK_PUBLISHABLE_KEY`
(see `.env.example`); it overrides the committed key.

> The committed `pk_test_...` key is publishable by design — it ships in every client
> bundle and grants no dashboard or secret access. It's a disposable instance that
> will be deleted once this issue is resolved.

## Steps

1. Start the app (Option A or B) and open the page.
2. DevTools → **Network** tab → filter `clerk.` → clear the log.
3. Enter a fresh email + a valid password → **Continue**.
4. Watch the Network panel **and** that inbox.

## Expected vs. observed

| | Expected | Observed |
|---|---|---|
| `POST /v1/client/sign_ups` | 1 | 1 |
| `POST /v1/client/sign_ups/<id>/prepare_verification` | 0 (widget should reuse the verification `create` already primed) | 1 |
| Verification emails received | **1** | **2** (first invalidated by the second) |

## Notes that pre-empt the usual deflections

- **Not a React StrictMode artifact.** The two emails come from **two different
  endpoints** (`create` then `prepare_verification`), not the same call fired twice.
  `StrictMode` is kept here to match the original report; you can confirm with a prod
  build (`npm run build && npm run preview`) — the two distinct POSTs remain.
- **Not fixed by bumping the SDK.** `@clerk/react` does not pin `@clerk/clerk-js`
  (its only deps are `tslib` + `@clerk/shared`); the widget is hot-loaded from Clerk's
  CDN at the **major** version. So this reproduces on whatever `clerk-js@6.x` Clerk
  serves today, regardless of the `@clerk/react` version pinned here.
- **Not a duplicate of #887.** #887 is the sign-in side, and its workaround (omit
  `strategy` from `create()`, then call the prepare method yourself) requires a custom
  `useSignUp()` flow. The prebuilt `<SignUp/>` widget owns both calls internally, so
  there is no consumer-side lever to apply that workaround.
