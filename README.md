# AddressBook Web

A dark, responsive Next.js frontend for the AddressBook API.

## Included

- Login and signup
- JWT-authenticated contact creation and updates
- Firebase custom-token sign-in
- Direct Firestore contact reads
- Search and responsive contact cards
- Resend welcome email after signup
- Dark shadcn/ui-inspired interface
- TypeScript, Zod and React Hook Form

## Run locally

```bash
cp .env.example .env.local
npm install
npm run dev
```

Open `http://localhost:3000`.

## API URL

Set:

```env
NEXT_PUBLIC_API_URL=https://your-api.example.com/api
```

The frontend expects:

- `POST /auth/signup`
- `POST /auth/login`
- `POST /contacts`
- `PATCH /contacts/:id`
- `GET /health`

## Firestore model

By default, the frontend reads:

```text
contacts/{contactId}
```

and filters by:

```text
ownerId == authenticated API user ID
```

If your backend uses a different collection or owner property, change:

```env
NEXT_PUBLIC_FIREBASE_CONTACTS_COLLECTION=contacts
NEXT_PUBLIC_FIREBASE_OWNER_FIELD=ownerId
```

The owner field must be readable under your Firestore security rules.

## Resend

Add a Resend API key and a sender on a verified domain:

```env
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=AddressBook <hello@example.com>
```

A welcome email is requested after successful signup. Signup itself does not fail when email delivery fails.

## Security note

The backend JWT is kept in `localStorage` because the supplied API returns it in JSON and does not expose a refresh-token or HttpOnly-cookie flow. For production, an HttpOnly session/BFF approach would be safer if the backend contract can be changed.
