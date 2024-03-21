## Stack

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

- NextJS / React
- Typescript
- TailwindCSS
- Firebase
- AWS for Cloud storage

## Getting Started

Install dependencies:

```bash
npm install
```

Next, run the development server:

```bash
npm run dev
```

Open [http://localhost:3001](http://localhost:3001) with your browser to see the result.

## Secrets

Inside .env file, you should have a GOOGLE_APPLICATION_CREDENTIALS key that points to `firebase.json`, which contains credentials to initilize Firebase Admin SDK.

This .json credential can be generated from the firebase console

`GOOGLE_APPLICATION_CREDENTIALS="./firebase.json"`

BACKEND_URL = "http://localhost:3002"

AWS_KEY = "AWS key"
AWS_KEY_SECRET = "AWS key secret"

Developed by [Blue Pilkinton-Ching](https://www.bluepc.me)
