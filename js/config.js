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
    name: "Sithara",                                  // SAMPLE - shown large in the hero
    fullName: "Sithara Antony",                        // SAMPLE
    role: "The Bride",
    parents: "Daughter of Mr. & Mrs. Antony",          // SAMPLE
    photo: "images/bride.svg",                        // SAMPLE - replace with images/bride.jpg
    about:
      "Warm, thoughtful and endlessly creative, Sithara lights up every room she walks into. " +
      "She loves old songs, early mornings and long conversations over chai."  // SAMPLE
  },

  groom: {
    name: "Renath",                                   // SAMPLE
    fullName: "Renath Sunny",                          // SAMPLE
    role: "The Groom",
    parents: "Son of Mr. & Mrs. Sunny",                // SAMPLE
    photo: "images/groom.svg",                        // SAMPLE - replace with images/groom.jpg
    about:
      "Calm, kind and quick to laugh, Renath is the friend everyone calls first. " +
      "He loves travel, good food and finding the best view in every city."    // SAMPLE
  },

  /* ---- Date & time ----------------------------------------------------- */
  // Format: YYYY-MM-DDTHH:MM:SS+05:30   (the +05:30 is India Standard Time)
  date: "2027-02-14T10:30:00+05:30",                  // SAMPLE
  timeZone: "Asia/Kolkata",                           // times are always shown in the venue's time zone
  durationHours: 5,                                   // used for "Add to calendar"

  /* ---- Invitation text -------------------------------------------------- */
  invitation: {
    eyebrow: "You are invited",
    heading: "Join us in celebrating our love",
    message: [
      "With the blessings of our parents and the joy of our families, " +
      "we request the honour of your presence as we begin our new life together.",
      "Your love and good wishes mean the world to us - we can't wait to celebrate with you."
    ],
    signature: "With love, the families of Antony & Sunny"   // SAMPLE
  },

  /* ---- Venue & map ------------------------------------------------------ */
  venue: {
    name: "City Palace",                              // SAMPLE
    address: "Gangori Ghat Rd, Udaipur, Rajasthan 313001, India",   // SAMPLE
    city: "Udaipur, Rajasthan",                       // shown in the hero
    // What Google Maps should search for. Usually the venue name + city works best.
    mapQuery: "City Palace, Udaipur, Rajasthan",      // SAMPLE
    // Optional: paste a full Google Maps share link to override the buttons.
    mapLink: "",
    // Optional: paste an <iframe src> from Google Maps > Share > Embed a map.
    mapEmbedUrl: "",
    // Optional travel notes (leave [] to hide)
    notes: [
      "Nearest airport: Maharana Pratap Airport (UDR), about 40 minutes away.",
      "Complimentary valet parking will be available at the main gate.",
      "A block of rooms has been reserved for out-of-town guests - please ask the family."
    ]
  },

  dressCode: "Traditional attire in soft jewel tones",   // optional; "" to hide

  /* ---- Event schedule --------------------------------------------------- */
  // Add, remove or reorder events freely. `start` uses the same format as `date`.
  events: [
    {
      title: "Mehendi & Music",
      start: "2027-02-12T16:00:00+05:30",
      venue: "Garden Courtyard",
      description: "An afternoon of henna, folk music and good company."
    },
    {
      title: "Haldi",
      start: "2027-02-13T10:00:00+05:30",
      venue: "Poolside Lawn",
      description: "Bright yellows, marigolds and plenty of laughter. Wear something you don't mind staining."
    },
    {
      title: "Wedding Ceremony",
      start: "2027-02-14T10:30:00+05:30",
      venue: "Main Pavilion",
      description: "The sacred ceremony, followed by blessings and a celebratory lunch."
    },
    {
      title: "Reception & Dinner",
      start: "2027-02-14T19:00:00+05:30",
      venue: "Grand Ballroom",
      description: "An evening of dinner, dancing and toasts to the newlyweds."
    }
  ],

  /* ---- Photo gallery ---------------------------------------------------- */
  // Put your photos in the /images folder and list them here.
  // `ratio` is optional ("3/4", "1/1", "4/3") - it keeps the layout tidy while photos load.
  // The .svg files below are SAMPLE artwork - replace them with your real photographs (.jpg/.webp).
  gallery: [
    { src: "images/gallery-1.svg", alt: "The couple together",        ratio: "3/4" },
    { src: "images/gallery-2.svg", alt: "A quiet moment",             ratio: "1/1" },
    { src: "images/gallery-3.svg", alt: "Laughing together",          ratio: "4/5" },
    { src: "images/gallery-4.svg", alt: "Walking hand in hand",       ratio: "4/3" },
    { src: "images/gallery-5.svg", alt: "The proposal",               ratio: "3/4" },
    { src: "images/gallery-6.svg", alt: "Adventures together",        ratio: "1/1" },
    { src: "images/gallery-7.svg", alt: "Celebrating with family",    ratio: "4/5" },
    { src: "images/gallery-8.svg", alt: "Our favourite place",        ratio: "4/3" }
  ],

  /* ---- Splash (welcome) screen -------------------------------------------
     A short intro: two butterflies fly together and become a heart, which beats
     twice, then the invitation is revealed automatically (about 5 seconds).
     Visitors can tap anywhere or press Esc/Enter to skip it. */
  splash: {
    enabled: true            // false = go straight to the invitation
  },

  /* ---- Background music --------------------------------------------------
     By default a soft, original piano-style melody is generated live in the
     browser (nothing to download). Browsers only allow sound after the guest
     taps/clicks something, so it begins on their first interaction, and a small
     button (bottom-right) lets them pause or resume it.
     To use your own song instead, copy an MP3 into the /audio folder and set
     src: "audio/our-song.mp3". Only use music you own or have licence to use. */
  music: {
    enabled: true,          // false removes the music button entirely
    src: "",                // e.g. "audio/our-song.mp3"  ("" = built-in melody)
    volume: 0.4             // 0 (silent) to 1 (full)
  },

  /* ---- Hero, hashtag, footer -------------------------------------------- */
  // Optional full-screen hero photo (e.g. "images/hero.jpg"). Leave "" for the elegant default.
  heroImage: "",
  hashtag: "#SitharaWedsRenath",                         // SAMPLE - "" to hide

  // Shown in the footer: "Designed & Developed by <developerName>"
  developerName: "[YOUR NAME]",
  developerLink: ""                                    // optional website / portfolio URL
};
