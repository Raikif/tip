# TODO

## Firebase Admin init fix
- [ ] Update `src/lib/firebase/admin.ts` to use modular Firebase Admin imports (`cert`, `initializeApp`, `getApps`) instead of `admin.credential.cert`.
- [ ] Ensure Realtime Database instance is returned via modular API (`getDatabase`).
- [ ] Preserve env validation + private key newline normalization (`replace(/\\n/g, "\n")`).
- [ ] Re-test `/api/registrations` POST flow.

