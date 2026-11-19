/* ==========================================================================
   WEDDING CONFIGURATION
   --------------------------------------------------------------------------
   This is the ONLY file you need to edit to personalise the website.
   Everything marked "SAMPLE" is demo content - replace it with the real
   details. Save the file and refresh the browser to see your changes.
   ========================================================================== */

window.WEDDING_CONFIG = {
  /* ---- The couple ------------------------------------------------------ */
  bride: {
    name: "Sithara", // SAMPLE - shown large in the hero
    fullName: "Sithara Antony", // SAMPLE
    role: "The Bride",
    parents: "Daughter of Mr. & Mrs. Antony", // SAMPLE
    about:
      "Warm, thoughtful and endlessly creative, Sithara lights up every room she walks into. " +
      "She loves old songs, early mornings and long conversations over chai.", // SAMPLE
  },

  groom: {
    name: "Renath", // SAMPLE
    fullName: "Renath Sunny", // SAMPLE
    role: "The Groom",
    parents: "Son of Mr. & Mrs. Sunny", // SAMPLE
    about:
      "Calm, kind and quick to laugh, Renath is the friend everyone calls first. " +
      "He loves travel, good food and finding the best view in every city.", // SAMPLE
  },

  /* ---- Couple portrait ("Meet the couple" section) ----------------------
     ONE photograph of the two of you together. Copy it into /images (e.g. images/couple.webp or .jpg),
     ideally landscape and about 1600 px wide. Until the file exists, a clearly marked placeholder
     frame ("Our photograph - coming soon") is shown in its place.
     ratio: shape of the frame ("3/2" landscape, "4/5" portrait, "1/1" square).
     position: which part to keep when cropping, e.g. "center 30%" keeps faces higher up. */
  couple: {
    enabled: true,
    photo: "images/new.webp",
    alt: "Renath and Sithara together",
    ratio: "3/2",
    position: "center 30%",
  },

  /* ---- Date & time ----------------------------------------------------- */
  // Format: YYYY-MM-DDTHH:MM:SS+05:30   (the +05:30 is India Standard Time)
  date: "2026-12-31T10:30:00+05:30", // Wedding day (31 Dec 2026). TIME IS A PLACEHOLDER - set the real ceremony time
  timeZone: "Asia/Kolkata", // times are always shown in the venue's time zone
  durationHours: 5, // used for "Add to calendar"

  /* ---- Invitation text -------------------------------------------------- */
  invitation: {
    eyebrow: "You are invited",
    heading: "Join us in celebrating our love",
    message: [
      "With the blessings of our parents and the joy of our families, " +
        "we request the honour of your presence as we begin our new life together.",
      "Your love and good wishes mean the world to us - we can't wait to celebrate with you.",
    ],
    signature: "With love, the families of Sunny & Antony", // SAMPLE
  },

  /* ---- Venue & map ------------------------------------------------------ */
  // Where the wedding ceremony is held
  venue: {
    name: "Infant Jesus Church",
    address: "Infant Jesus Church, Ranni, Kerala",
    city: "Ranni, Kerala", // shown in the hero
    // What Google Maps should search for (drives the embedded map).
    mapQuery: "Infant Jesus Church, Ranni, Kerala",
    // Opened by the "Get directions" / "Open in Google Maps" buttons.
    mapLink: "https://maps.app.goo.gl/1GEhWhbeKaZLDyqQ6?g_st=ic",
    // Optional: paste an <iframe src> from Google Maps > Share > Embed a map for an exact pin.
    mapEmbedUrl: "",
    // Optional travel notes (leave [] to hide)
    notes: [],
  },

  // Where the wedding reception is held (remove this whole block to show only one venue)
  reception: {
    name: "Mar Athanasius Marthoma Auditorium & Convention Nagar",
    address:
      "Mar Athanasius Marthoma Auditorium & Convention Nagar, Ranni, Kerala",
    mapQuery:
      "Mar Athanasius Marthoma Auditorium & Convention Nagar, Ranni, Kerala",
    mapLink: "https://maps.app.goo.gl/wEXsBJVhpAiiy7LF6?g_st=ic",
    mapEmbedUrl: "",
    notes: [],
  },

  dressCode: "Traditional attire in soft jewel tones", // optional; "" to hide

  /* ---- Event schedule --------------------------------------------------- */
  // Add, remove or reorder events freely. `start` uses the same format as `date`.
  events: [
    {
      title: "Engagement",
      start: "2026-12-29T16:00:00+05:30", // TIME IS A PLACEHOLDER
      venue: "",
      description: "Exchanging rings and promises together with our families.",
    },
    {
      title: "Wedding Ceremony",
      start: "2026-12-31T10:30:00+05:30", // TIME IS A PLACEHOLDER
      venue: "Infant Jesus Church, Ranni",
      description:
        "The sacred ceremony, followed by blessings and the families' greetings.",
    },
    {
      title: "Wedding Reception",
      start: "2026-12-31T18:00:00+05:30", // TIME IS A PLACEHOLDER
      venue: "Mar Athanasius Marthoma Auditorium & Convention Nagar, Ranni",
      description: "An evening of dinner, celebration and good wishes.",
    },
  ],

  /* ---- Photo gallery ---------------------------------------------------- */
  // Put your photos in the /images folder and list them here.
  // `ratio` is optional ("3/4", "1/1", "4/3") - it keeps the layout tidy while photos load.
  // The .svg files below are SAMPLE artwork - replace them with your real photographs (.jpg/.webp).
  gallery: [
    { src: "images/gallery-1.webp", alt: "The couple ", ratio: "3/4" },
    { src: "images/gallery-2.webp", alt: "A quiet moment", ratio: "1/1" },
    { src: "images/gallery-3.webp", alt: "Laughing together", ratio: "4/5" },
    { src: "images/gallery-4.webp", alt: "Walking hand in hand", ratio: "4/3" },
    { src: "images/gallery-5.webp", alt: "The proposal", ratio: "3/4" },
    { src: "images/gallery-6.webp", alt: "Adventures together", ratio: "1/1" },
    {
      src: "images/gallery-7.webp",
      alt: "Celebrating with family",
      ratio: "4/5",
    },
    { src: "images/gallery-8.webp", alt: "Our favourite place", ratio: "4/3" },
  ],

  /* ---- Splash (welcome) screen -------------------------------------------
     A short intro: two butterflies fly together and become a heart, which beats
     twice, then the invitation is revealed automatically (about 5 seconds).
     Visitors can tap anywhere or press Esc/Enter to skip it. */
  splash: {
    enabled: true, // false = go straight to the invitation
  },

  /* ---- Background music --------------------------------------------------
     By default a soft, original piano-style melody is generated live in the
     browser (nothing to download). Browsers only allow sound after the guest
     taps/clicks something, so it begins on their first interaction, and a small
     button (bottom-right) lets them pause or resume it.
     To use your own song instead, copy an MP3 into the /audio folder and set
     src: "audio/our-song.mp3". Only use music you own or have licence to use. */
  music: {
    enabled: true, // false removes the music button entirely
    src: "", // e.g. "audio/our-song.mp3"  ("" = built-in melody)
    volume: 0.4, // 0 (silent) to 1 (full)
  },

  /* ---- Video section ------------------------------------------------------
     Shown between the gallery and the countdown. Set `src` to ONE of:
       - a video file you add to the /video folder, e.g. "video/our-film.mp4" (MP4 / H.264 plays everywhere)
       - a YouTube or Vimeo link, e.g. "https://www.youtube.com/watch?v=XXXXXXXXXXX"
     `poster` is an optional cover picture (e.g. "images/film-cover.webp").
     `ratio` is "16/9" (normal) or "9/16" (video filmed upright on a phone).
     Leave `src` empty to show a "coming soon" card; `enabled: false` hides the section. */
  video: {
    enabled: true,
    eyebrow: "Our story",
    title: "A little film for you",
    caption: "A few moments from our journey, before the big day.",
    src: "", // <- put your video here
    poster: "",
    ratio: "16/9",
  },

  /* ---- Family regards (shown just above the footer) ---------------------- */
  // Each group is a heading with a list of names. Add, remove or reorder freely.
  regards: {
    enabled: true,
    eyebrow: "With love & gratitude",
    heading: "With warm regards",
    message: [
      "Every blessing, every prayer and every kind word has carried us to this day. " +
        "Our families have been our strength, and we are grateful beyond words.",
      "Thank you for being part of our story. Your presence will make our day complete.",
    ],
    // Each person is { name, relation }. A plain text name also works.
    groups: [
      {
        title: "Renath's Family",
        names: [
          { name: "Sunny Abraham", relation: "Father" },
          { name: "Jiji Sunny", relation: "Mother" },
          { name: "Tessel Sunny", relation: "Brother" },
          { name: "Sajitha Sunny", relation: "Sister-in-law" },
          { name: "Raiden Tessel Sunny", relation: "Nephew" },
        ],
      },
      {
        title: "Sithara's Family",
        names: [
          { name: "V T Antony", relation: "Father" },
          { name: "Jessy Antony", relation: "Mother" },
          { name: "Sagara Antony", relation: "Sister" },
          { name: "Sandesh V Antony", relation: "Brother" },
        ],
      },
    ],
    closing: "With love and gratitude,", // "" to hide
    signoff: "Renath & Sithara", // "" to hide
  },

  /* ---- Hero, hashtag, footer -------------------------------------------- */
  // Optional full-screen hero photo (e.g. "images/hero.jpg"). Leave "" for the elegant default.
  heroImage: "images/hero.webp", // SAMPLE - replace with your own photo
  hashtag: "#RenathWedsSithara", // SAMPLE - "" to hide

  // Shown in the footer: "Designed & Developed by <developerName>"
  developerName: "Mathews Vinoy",
  developerLink: "https://github.com/MathewsVinoy", // optional website / portfolio URL
};
