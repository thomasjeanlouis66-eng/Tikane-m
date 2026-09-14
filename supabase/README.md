# Backend Ti Kanè m

Ti Kanè m is prepared for a Supabase backend while remaining deployable on GitHub Pages.

## 1. Create the Supabase project

Create a project in Supabase and keep these two public client values:

- Project URL
- Publishable/anon key

Do **not** put the `service_role` secret in the website.

## 2. Create the database

Open the Supabase SQL Editor and run:

`supabase/schema.sql`

The schema creates profiles, plans, orders, marketplace products, conversations, members, and messages, with Row Level Security policies.

## 3. Connect the website

Edit:

`public/supabase-config.js`

and set:

```js
window.TIKANE_SUPABASE = {
  url: 'https://YOUR-PROJECT.supabase.co',
  anonKey: 'YOUR_PUBLIC_ANON_OR_PUBLISHABLE_KEY'
};
```

The public anon/publishable key is designed for browser use when RLS is correctly configured. Never use a service-role key in `index.html` or any file under `public/`.

## 4. Authentication

Enable the sign-in method(s) you want in Supabase Authentication. Email/password is the simplest first production option. Phone OTP can be added later if needed.

## Current status

The GitHub Pages frontend is still the working prototype. LocalStorage remains available until Supabase credentials are connected and the UI is switched to the remote data layer. This avoids breaking the live prototype before the backend project is configured.
