This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3001](http://localhost:3001) with your browser to see the result.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

Developed by [Blue Pilkinton-Ching](https://www.bluepc.me)

## Secrets

Inside .env file, you should have a GOOGLE_APPLICATION_CREDENTIALS key that points to `firebase.json`, which contains credentials to initilize Firebase Admin SDK.

This .json credential can be generated from the firebase console

`GOOGLE_APPLICATION_CREDENTIALS="./firebase.json"`
