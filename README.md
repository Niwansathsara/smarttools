# SmartTools website

A responsive, English-first online tools website with 80 individual tool pages, Sinhala utilities, About and Contact pages, account screens, an admin updates dashboard and reserved advertisement spaces.

## What's included

- Homepage inspired by the supplied reference, but styled for an international audience (no country-specific branding).
- 8 categories and 80 tool pages, each with its own URL and page metadata.
- Responsive desktop/tablet/mobile layout.
- Client-side PDF, image, text, developer, calculator, QR/barcode and study tools.
- Sinhala tools: a small offline Singlish word helper, Unicode keyboard, Unicode text normalizer, word counter, font preview and formatter.
- Sign up / sign in / password reset UI using Firebase Authentication (requires your Firebase project configuration).
- Verified admin-only dashboard to publish/delete homepage updates (Firestore rules enforce the admin restriction).
- Contact form opens the visitor's email app and addresses `smarttoolsgns@gmail.com`.
- `Created by G Niwan Sathsara` credit.
- Privacy / Terms starter pages, robots.txt and sitemap template.

## Important: what is ready vs what needs configuration

### Ready in the static website

Most tools run in the visitor's browser and do not need an account. Some file and QR tools load open-source libraries from CDNs on first use, so an internet connection is required. The PDF compressor rasterizes pages to reduce size, so text may no longer be selectable/searchable; users are warned about this.

The Singlish-to-Sinhala tool is a basic offline word substitution helper, not a full natural-language transliteration engine. The Sinhala Text Converter normalizes Unicode; it does not claim to convert every proprietary legacy font encoding. A/L and O/L sample grade thresholds are editable and must be checked against the relevant official exam board before use. Currency conversion uses a third-party exchange-rate API and rates may be delayed.

### Firebase account and admin setup

1. Create a Firebase project at https://console.firebase.google.com/.
2. Add a Web App and copy its Firebase config.
3. Enable **Authentication → Sign-in method → Email/Password**.
4. Create a **Cloud Firestore** database.
5. Open `assets/js/firebase-config.js` and paste your Firebase `apiKey`, `authDomain`, `projectId` and `appId` into the blank values. Keep `adminEmail` as `niwansathsara76@gmail.com` (or change it only if you intend to use another admin address).
6. In Firebase Authentication, create/register the admin account using `niwansathsara76@gmail.com`, then verify that email from the verification email sent by Firebase.
7. Publish the included `firestore.rules` rules to your Firestore database. Those rules allow public reading of announcements but only the verified admin email can create/update/delete them; all other collections are denied by default.
8. Deploy the site over HTTPS. Email/password authentication and browser APIs work best on HTTPS or localhost.

**Security note:** The admin email in the JavaScript controls only the interface. Firestore Security Rules are the actual access control. Do not remove the rules or rely on front-end checks alone. Never publish a Firebase service-account key or private server credential in this project.

## Google AdSense setup

Ad spaces are marked `ADVERTISEMENT SPACE`; these are placeholders, not live adverts. To enable Google AdSense:

1. Publish the site on your own domain and add substantial original descriptions/help content for tools.
2. Add working Contact, About, Privacy Policy and Terms pages and review the privacy text for all third-party services actually enabled.
3. Apply for AdSense and wait for Google's site review/approval. Approval and revenue are not guaranteed.
4. After approval, add the exact AdSense script and ad-unit code supplied in your AdSense account. Replace the publisher placeholder with your own publisher ID. Do not use made-up IDs.
5. Add the `ads.txt` line supplied by Google to the site root. Do not copy another publisher's ID.
6. Keep ads clearly separate from tool controls. Do not force visitors to watch or click ads to use a tool, and never encourage accidental clicks.

## SEO / domain setup

- Replace `YOUR-DOMAIN.com` in `robots.txt` and `sitemap.xml` with your real domain.
- Add your real domain to Google Search Console and submit `/sitemap.xml`.
- Keep the individual tool URLs stable. Each tool already has a unique URL under `/tools/<tool-slug>/`.
- Add a canonical URL per page once the final domain is known.

## Local preview

Because the site uses ES modules and browser security APIs, do not open `index.html` directly as a file. Run a local web server from this folder, for example:

```bash
python -m http.server 8000
```

Then visit `http://localhost:8000`.

## Deployment

The site is static and can be hosted on GitHub Pages, Netlify, Cloudflare Pages or standard HTTPS hosting. Upload the contents of this folder to the site root. Firebase authentication requires the final hosting domain to be added under Firebase Authentication → Settings → Authorized domains.

## Contact and ownership details used

- Project creator credit: G Niwan Sathsara
- Admin email: niwansathsara76@gmail.com
- Public contact email: smarttoolsgns@gmail.com
