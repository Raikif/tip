# Firebase Realtime Database (RTDB) setup checklist

## 1) Security Rules (wajib)
Untuk tahap ini (penulisan pakai `firebase-admin` server-side), rekomendasi aturan paling aman:

- Firebase Console → Realtime Database → Rules
```json
{
  "rules": {
    ".read": false,
    ".write": false
  }
}
```

> Catatan: ini membuat client browser **tidak bisa read/write** RTDB. Hanya server/admin yang bisa.

## 2) Environment variables
Pastikan `.env.local` berisi:

- `FIREBASE_PROJECT_ID`
- `FIREBASE_CLIENT_EMAIL`
- `FIREBASE_PRIVATE_KEY`
- `FIREBASE_DATABASE_URL` (disarankan tanpa trailing slash)

## 3) Aktifkan rules
Setelah mengubah Rules, klik **Publish**.

## 4) Testing yang harus dilakukan
- Submit form di `/pendaftaran` → cek data muncul di RTDB node `registrations/{id}`
- Test endpoint API `/api/registrations`:
  - happy path (payload valid)
  - error path (payload kosong)
  - server response code (200/400)
