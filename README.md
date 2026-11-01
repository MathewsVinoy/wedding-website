# Premium Wedding Website

A fast, responsive wedding invitation site built with plain HTML, CSS and JavaScript.
No build step, no frameworks, no server needed.

```
wedding-website/
├── index.html        page structure
├── css/style.css     all styling (colours are CSS variables at the top)
├── js/config.js      <- YOUR DETAILS GO HERE
├── js/main.js        behaviour (countdown, gallery, RSVP, ...)
└── images/           your photographs
```

## 1. Personalise it (only `js/config.js`)

Open `js/config.js` in any text editor. Everything marked `SAMPLE` is demo content.

| What                                           | Where in config.js                             |
| ---------------------------------------------- | ---------------------------------------------- |
| Bride / groom names, parents, short bio, photo | `bride`, `groom`                               |
| Wedding date & time                            | `date` (format `2027-02-14T10:30:00+05:30`)    |
| Venue, address, Google Map                     | `venue` (`mapQuery` drives the map)            |
| Event schedule                                 | `events` (add / remove / reorder freely)       |
| Invitation wording                             | `invitation`                                   |
| Gallery photos                                 | `gallery`                                      |
| RSVP delivery                                  | `rsvp`                                         |
| Contact people                                 | `contacts`                                     |
| Hero background photo                          | `heroImage`                                    |
| Background music                               | `music` (volume, or `src` for your own MP3)    |
| Your name in the footer                        | `developerName` (and optional `developerLink`) |

## 2. Add your photos

1. Copy photos into `images/` (JPG or WebP, ideally 1600 px on the long edge, under 400 KB each).
2. Update the file names in `bride.photo`, `groom.photo` and `gallery`.
3. Delete the sample `.svg` files once they are no longer used.

Portraits look best at a 3:4 ratio (portrait orientation).

## 3. Make the RSVP form deliver replies

The form validates input in the browser. How the reply **reaches you** depends on `rsvp.mode`:

- **`"whatsapp"`** - opens WhatsApp with the reply pre-written; the guest taps Send.
  Set `whatsappNumber` to country code + number, digits only (e.g. `"919876543210"`).
- **`"email"`** - opens the guest's email app with the reply pre-written; the guest presses Send.
  Set `email`.
- **`"endpoint"`** - sends silently, nothing for the guest to tap. Recommended for the smoothest experience.
  1. Create a free form at [formspree.io](https://formspree.io) (or a similar form service).
  2. Paste its URL into `endpoint`, e.g. `"https://formspree.io/f/xxxxxxxx"`.
  3. Replies arrive by email, and the service keeps a copy.

Until one of these is configured, the form shows guests a polite "online RSVP is not switched on yet"
message rather than pretending to send. **Test it yourself with a real submission before sharing the link.**

## 4. Preview locally

Just double-click `index.html`. To mimic a real server (optional):

```bash
python3 -m http.server 8000     # then open http://localhost:8000
```

## 5. Publish

Any static host works, all with free plans: **Netlify Drop** (drag the folder onto app.netlify.com/drop),
**GitHub Pages**, **Vercel**, or **Cloudflare Pages**. Upload the whole `wedding-website` folder.
You can then point a custom domain (e.g. `SitharaandRenath.com`) at it.

## Background music

By default the site plays a soft, original romantic melody generated live in the browser, so there is nothing
to download and no copyright to worry about. Browsers never allow sound before the visitor interacts with the
page, so it starts on their **first tap, click or key press**, and the small button at the bottom-right lets
them pause or resume it. To use your own song, put an MP3 in `audio/` and set `music.src` in `config.js`
(only use music you own or are licensed to use). Set `music.enabled` to `false` to remove it.

## Notes

- The map uses Google's keyless embed, so no API key is required. For a precise pin, paste a Google Maps
  "Embed a map" `src` URL into `venue.mapEmbedUrl`.
- Fonts (Cormorant Garamond, Jost, Pinyon Script) load from Google Fonts; the site falls back gracefully offline.
- Share previews (WhatsApp / social) read the `<title>` and `og:` tags in `index.html`; update the names there too
  if you want link previews to show your real names. The page itself updates from `config.js` automatically.
- The site respects "reduce motion" settings and is keyboard accessible (lightbox: Esc, ←, →).
- The theme is light cream and pink. Edit the colours in `css/style.css` under `:root`.
