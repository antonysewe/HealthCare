This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Production
When you run the npm run dev script the file loading order is:

1. layout.tsx (or layout.js)

This is loaded first for the route segment.

It wraps your page and persists between navigations (e.g., sidebar, navbar).

Layout components define the UI structure shared by all child pages.

2. page.tsx (or page.js)

Then, the specific page component for that route is loaded inside the layout.

It provides the content for the route.



app/
 ├─ layout.tsx        <-- loads first (global layout)
 ├─ page.tsx          <-- home page content
 └─ dashboard/
     ├─ layout.tsx    <-- nested layout (wraps below)
     └─ page.tsx      <-- dashboard page content

Root layout → Dashboard layout → Dashboard page










## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
