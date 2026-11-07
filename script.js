
/* ==========================================
   IMAN WHISPERS COMPANION
   Islamic Companion App
   Quran • Prayer • Qibla • Dhikr • Seerah
========================================== */

"use strict";

const API = "https://api.alquran.cloud/v1";
const ALADHAN_API = "https://api.aladhan.com/v1";

/* ==========================================
   1. APP LANGUAGE
========================================== */

const translations = {
  en: {
    welcome: "A Heart Close to Allah",
    explore: "Explore Quran",
    ayah: "Ayah of the Day",
    refresh: "Refresh Ayah",
    prayer: "Prayer Times",
    getPrayer: "Get Prayer Times",
    quran: "The Holy Quran",
    hadith: "Hadith Collection",
    duas: "Daily Duas",
    tasbeeh: "Digital Tasbeeh",
    count: "Count",
    reset: "Reset",
    qibla: "Qibla Direction",
    findQibla: "Find Qibla",
    sensor: "Enable Compass Sensor",
    reminder: "A Gentle Reminder",
    another: "Another Reminder",
    back: "← Back to Surahs",
    hijri: "Islamic Hijri Calendar",
    names: "99 Names of Allah",
    prophet: "Prophet Muhammad ﷺ",
    seerah: "Seerah of Prophet Muhammad ﷺ",
    salawat: "Durood and Salawat",
    sunnah: "Daily Sunnah",
    search: "Search Surah..."
  },

  ur: {
    welcome: "اللہ کے قریب ایک دل",
    explore: "قرآن پڑھیں",
    ayah: "آج کی آیت",
    refresh: "دوسری آیت",
    prayer: "نماز کے اوقات",
    getPrayer: "نماز کے اوقات حاصل کریں",
    quran: "قرآن مجید",
    hadith: "احادیث",
    duas: "روزانہ کی دعائیں",
    tasbeeh: "ڈیجیٹل تسبیح",
    count: "گنتی",
    reset: "دوبارہ شروع",
    qibla: "قبلہ کی سمت",
    findQibla: "قبلہ معلوم کریں",
    sensor: "کمپاس فعال کریں",
    reminder: "ایک خوبصورت نصیحت",
    another: "ایک اور نصیحت",
    back: "← سورتوں پر واپس جائیں",
    hijri: "اسلامی ہجری کیلنڈر",
    names: "اللہ کے 99 نام",
    prophet: "حضرت محمد ﷺ",
    seerah: "سیرت النبی ﷺ",
    salawat: "درود و سلام",
    sunnah: "روزانہ کی سنتیں",
    search: "سورت تلاش کریں..."
  },

  ar: {
    welcome: "قلب قريب من الله",
    explore: "استكشف القرآن",
    ayah: "آية اليوم",
    refresh: "آية أخرى",
    prayer: "مواقيت الصلاة",
    getPrayer: "احصل على مواقيت الصلاة",
    quran: "القرآن الكريم",
    hadith: "مجموعة الأحاديث",
    duas: "أدعية يومية",
    tasbeeh: "المسبحة الرقمية",
    count: "عدّ",
    reset: "إعادة",
    qibla: "اتجاه القبلة",
    findQibla: "اعرف اتجاه القبلة",
    sensor: "تفعيل البوصلة",
    reminder: "تذكير لطيف",
    another: "تذكير آخر",
    back: "← العودة إلى السور",
    hijri: "التقويم الهجري",
    names: "أسماء الله الحسنى",
    prophet: "النبي محمد ﷺ",
    seerah: "السيرة النبوية",
    salawat: "الصلاة والسلام",
    sunnah: "السنن اليومية",
    search: "ابحث عن سورة..."
  }
};

let currentLanguage = "en";

function setHeading(selector, value) {
  const heading = document.querySelector(selector);
  if (!heading) return;

  const icon = heading.querySelector("svg");

  heading.replaceChildren();

  if (icon) {
    heading.appendChild(icon);
    heading.appendChild(document.createTextNode(" "));
  }

  heading.appendChild(document.createTextNode(value));
}

function translatePage(language) {
  currentLanguage = translations[language] ? language : "en";

  const t = translations[currentLanguage];

  const headings = {
    ".hero h1": t.welcome,
    "#dailyAyah h2": t.ayah,
    "#prayerTimes h2": t.prayer,
    "#quran h2": t.quran,
    "#hadith h2": t.hadith,
    "#duas h2": t.duas,
    "#tasbeeh h2": t.tasbeeh,
    "#qibla h2": t.qibla,
    "#reminders h2": t.reminder,
    "#hijriCalendar h2": t.hijri,
    "#namesAllah h2": t.names,
    "#prophet h2": t.prophet,
    "#seerah h2": t.seerah,
    "#salawat h2": t.salawat,
    "#sunnah h2": t.sunnah
  };

  Object.entries(headings).forEach(([selector, value]) => {
    setHeading(selector, value);
  });

  const buttons = {
    ".hero .primary-btn": t.explore,
    "#newAyah": t.refresh,
    "#getPrayer": t.getPrayer,
    "#countBtn": t.count,
    "#resetBtn": t.reset,
    "#qiblaBtn": t.findQibla,
    "#sensorBtn": t.sensor,
    "#nextReminder": t.another,
    "#backSurahs": t.back
  };

  Object.entries(buttons).forEach(([selector, value]) => {
    const element = document.querySelector(selector);
    if (element) element.textContent = value;
  });

  const search = document.getElementById("surahSearch");
  if (search) search.placeholder = t.search;

  document.documentElement.lang = currentLanguage;
  document.documentElement.dir =
    currentLanguage === "ur" || currentLanguage === "ar"
      ? "rtl"
      : "ltr";
}

document.getElementById("languageSelect")?.addEventListener(
  "change",
  event => translatePage(event.target.value)
);

translatePage(
  document.getElementById("languageSelect")?.value || "en"
);

/* ==========================================
   2. DAILY AYAH
========================================== */

async function loadDailyAyah() {
  const arabic = document.getElementById("ayahArabic");
  const translation = document.getElementById("ayahTranslation");
  const reference = document.getElementById("ayahRef");

  if (!arabic || !translation || !reference) return;

  arabic.textContent = "Loading...";
  translation.textContent = "Loading...";

  try {
    const dayNumber = Math.floor(
      (Date.now() - new Date(new Date().getFullYear(), 0, 0)) /
      86400000
    );

    const ayahNumber = ((dayNumber * 17) % 6236) + 1;

    const response = await fetch(
      `${API}/ayah/${ayahNumber}/editions/quran-uthmani,en.sahih`
    );

    if (!response.ok) throw new Error("Ayah request failed");

    const result = await response.json();

    if (result.code !== 200 || !Array.isArray(result.data) ||
        result.data.length < 2) {
      throw new Error("Invalid Ayah response");
    }

    const arabicAyah = result.data[0];
    const englishAyah = result.data[1];

    arabic.textContent = arabicAyah.text;
    translation.textContent = englishAyah.text;

    reference.textContent =
      `Surah ${englishAyah.surah.englishName} · ` +
      `${englishAyah.surah.number}:${englishAyah.numberInSurah}`;

  } catch (error) {
    console.error("Daily Ayah:", error);
    translation.textContent = "Unable to load the Ayah. Please try again.";
  }
}

document.getElementById("newAyah")?.addEventListener(
  "click",
  loadDailyAyah
);

loadDailyAyah();

/* ==========================================
   3. QURAN TRANSLATIONS
========================================== */

const quranEditions = {
  "en.sahih": { direction: "ltr" },
  "ur.jalandhry": { direction: "rtl" },
  "bn.bengali": { direction: "ltr" },
  "fr.hamidullah": { direction: "ltr" },
  "id.indonesian": { direction: "ltr" },
  "tr.diyanet": { direction: "ltr" },
  "es.cortes": { direction: "ltr" }
};

let allSurahs = [];
let selectedSurah = null;

async function loadSurahs() {
  const list = document.getElementById("surahList");
  const status = document.getElementById("quranStatus");

  if (!list || !status) return;

  status.textContent = "Loading Surahs...";

  try {
    const response = await fetch(`${API}/surah`);

    if (!response.ok) throw new Error("Surah request failed");

    const result = await response.json();

    allSurahs = (result.data || []).sort(
      (a, b) => a.number - b.number
    );

    renderSurahs(allSurahs);
    status.textContent = "";

  } catch (error) {
    console.error("Surahs:", error);
    status.textContent = "Unable to load Surahs. Check your internet.";
  }
}

function renderSurahs(surahs) {
  const list = document.getElementById("surahList");
  const status = document.getElementById("quranStatus");

  if (!list) return;

  list.replaceChildren();

  if (surahs.length === 0) {
    if (status) status.textContent = "No Surahs found.";
    return;
  }

  if (status) status.textContent = "";

  surahs.forEach(surah => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "surah-card";

    const name = document.createElement("span");
    name.textContent = `${surah.number}. ${surah.englishName}`;

    const arabic = document.createElement("span");
    arabic.textContent = surah.name;
    arabic.className = "arabic";
    arabic.dir = "rtl";

    const details = document.createElement("small");
    details.textContent =
      `${surah.englishNameTranslation} · ${surah.numberOfAyahs} Ayahs`;

    button.append(name, arabic, details);

    button.addEventListener("click", () => {
      openSurah(surah.number);
    });

    list.appendChild(button);
  });
}

document.getElementById("surahSearch")?.addEventListener(
  "input",
  event => {
    const query = event.target.value.toLowerCase().trim();

    const filtered = allSurahs.filter(surah =>
      surah.englishName.toLowerCase().includes(query) ||
      surah.name.includes(query) ||
      surah.englishNameTranslation.toLowerCase().includes(query) ||
      String(surah.number) === query
    );

    renderSurahs(filtered);
  }
);

async function openSurah(number) {
  const reader = document.getElementById("reader");
  const list = document.getElementById("surahList");
  const title = document.getElementById("surahTitle");

  if (!reader || !list || !title) return;

  selectedSurah = number;

  const surah = allSurahs.find(item => item.number === number);
  if (!surah) return;

  title.textContent = `${surah.name} · ${surah.englishName}`;

  list.hidden = true;
  reader.hidden = false;

  await loadSurahVerses();

  reader.scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
}

async function loadSurahVerses() {
  const ayahList = document.getElementById("ayahList");
  const selector = document.getElementById("translation");

  if (!ayahList || !selectedSurah) return;

  const edition = quranEditions[selector?.value]
    ? selector.value
    : "en.sahih";

  const selectedEdition = quranEditions[edition];

  ayahList.textContent = "Loading verses...";

  try {
    const response = await fetch(
      `${API}/surah/${selectedSurah}/editions/quran-uthmani,${edition}`
    );

    if (!response.ok) throw new Error("Quran request failed");

    const result = await response.json();

    if (result.code !== 200 || !result.data || result.data.length < 2) {
      throw new Error("Invalid Quran response");
    }

    const arabicVerses = result.data[0].ayahs;
    const translatedVerses = result.data[1].ayahs;

    ayahList.replaceChildren();

    arabicVerses.forEach((ayah, index) => {
      const article = document.createElement("article");
      article.className = "ayah-card";

      const arabic = document.createElement("p");
      arabic.className = "arabic";
      arabic.lang = "ar";
      arabic.dir = "rtl";
      arabic.textContent = `${ayah.text} ۞ ${ayah.numberInSurah}`;

      const translated = document.createElement("p");
      translated.className = "translation-text";
      translated.lang = edition.split(".")[0];
      translated.dir = selectedEdition.direction;
      translated.textContent = translatedVerses[index]?.text || "";

      const reference = document.createElement("small");
      reference.textContent =
        `Surah ${selectedSurah}, Ayah ${ayah.numberInSurah}`;

      article.append(arabic, translated, reference);
      ayahList.appendChild(article);
    });

  } catch (error) {
    console.error("Quran verses:", error);
    ayahList.textContent =
      "Unable to load this translation. Please try another language.";
  }
}

document.getElementById("translation")?.addEventListener(
  "change",
  loadSurahVerses
);

document.getElementById("backSurahs")?.addEventListener(
  "click",
  () => {
    const reader = document.getElementById("reader");
    const list = document.getElementById("surahList");

    if (reader) reader.hidden = true;
    if (list) list.hidden = false;
  }
);

loadSurahs();

/* ==========================================
   4. LOCATION
========================================== */

async function getLocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Location is not supported."));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      position => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
      },
      error => reject(error),
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 300000
      }
    );
  });
}

/* ==========================================
   5. PRAYER TIMES
========================================== */

async function loadPrayerTimes() {
  const status = document.getElementById("prayerStatus");
  const grid = document.getElementById("prayerGrid");

  if (!status || !grid) return;

  status.textContent = "Finding your location...";
  grid.replaceChildren();

  try {
    const location = await getLocation();
    const today = Math.floor(Date.now() / 1000);

    // Method 1 = University of Islamic Sciences, Karachi.
    const url =
      `${ALADHAN_API}/timings/${today}` +
      `?latitude=${location.latitude}` +
      `&longitude=${location.longitude}` +
      `&method=1`;

    const response = await fetch(url);

    if (!response.ok) throw new Error("Prayer API error");

    const result = await response.json();

    if (result.code !== 200) throw new Error("Prayer data unavailable");

    const timings = result.data.timings;

    const prayers = [
      ["Fajr", timings.Fajr],
      ["Sunrise", timings.Sunrise],
      ["Dhuhr", timings.Dhuhr],
      ["Asr", timings.Asr],
      ["Maghrib", timings.Maghrib],
      ["Isha", timings.Isha]
    ];

    prayers.forEach(([name, time]) => {
      const card = document.createElement("div");
      card.className = "prayer-card";

      const prayerName = document.createElement("strong");
      prayerName.textContent = name;

      const prayerTime = document.createElement("span");
      prayerTime.textContent = time;

      card.append(prayerName, prayerTime);
      grid.appendChild(card);
    });

    status.textContent =
      `Prayer times for ${result.data.date.readable}. ` +
      "Confirm calculation settings with your local mosque.";

  } catch (error) {
    console.error("Prayer times:", error);
    status.textContent =
      "Unable to get prayer times. Please enable location and try again.";
  }
}

document.getElementById("getPrayer")?.addEventListener(
  "click",
  loadPrayerTimes
);

/* ==========================================
   6. QIBLA COMPASS
========================================== */

let qiblaBearing = null;
let deviceHeading = null;
let compassListening = false;

function createCompassNeedle() {
  const compass = document.getElementById("compass");
  if (!compass) return null;

  let arrow = compass.querySelector(".compass-arrow");

  if (!arrow) {
    arrow = document.createElement("div");
    arrow.className = "compass-arrow";
    arrow.textContent = "▲";
    compass.appendChild(arrow);
  }

  return arrow;
}

async function loadQibla() {
  const status = document.getElementById("qiblaStatus");
  const degrees = document.getElementById("qiblaDegrees");

  if (!status || !degrees) return;

  status.textContent = "Finding your location...";

  try {
    const location = await getLocation();

    const response = await fetch(
      `${ALADHAN_API}/qibla/${location.latitude}/${location.longitude}`
    );

    if (!response.ok) throw new Error("Qibla API error");

    const result = await response.json();

    if (result.code !== 200) throw new Error("Qibla unavailable");

    qiblaBearing = Number(result.data.direction);

    degrees.textContent =
      `Qibla bearing: ${qiblaBearing.toFixed(1)}° from North`;

    status.textContent =
      "Qibla calculated. Enable your compass sensor for live guidance.";

    createCompassNeedle();
    updateCompass();

  } catch (error) {
    console.error("Qibla:", error);
    status.textContent =
      "Unable to calculate Qibla. Please allow location access.";
  }
}

function updateCompass() {
  const arrow = createCompassNeedle();

  if (!arrow || qiblaBearing === null) return;

  const rotation = deviceHeading === null
    ? qiblaBearing
    : qiblaBearing - deviceHeading;

  arrow.style.transform =
    `translateX(-50%) rotate(${rotation}deg)`;
}

function handleOrientation(event) {
  let heading = null;

  if (typeof event.webkitCompassHeading === "number") {
    heading = event.webkitCompassHeading;
  } else if (event.absolute === true && event.alpha !== null) {
    heading = (360 - event.alpha + 360) % 360;
  }

  if (heading !== null) {
    deviceHeading = heading;
    updateCompass();

    const status = document.getElementById("qiblaStatus");

    if (status) {
      status.textContent =
        "Live compass active. Hold your phone flat.";
    }
  }
}

async function enableCompass() {
  const status = document.getElementById("qiblaStatus");

  try {
    if (!("DeviceOrientationEvent" in window)) {
      throw new Error("Compass sensor not supported");
    }

    if (
      typeof DeviceOrientationEvent.requestPermission === "function"
    ) {
      const permission =
        await DeviceOrientationEvent.requestPermission();

      if (permission !== "granted") {
        throw new Error("Compass permission denied");
      }
    }

    if (!compassListening) {
      window.addEventListener("deviceorientation", handleOrientation);
      window.addEventListener("deviceorientationabsolute", handleOrientation);
      compassListening = true;
    }

    if (status) {
      status.textContent =
        "Move your phone gently to activate the compass.";
    }

  } catch (error) {
    console.error("Compass:", error);

    if (status) {
      status.textContent =
        "Compass unavailable. Check device support and permissions.";
    }
  }
}

document.getElementById("qiblaBtn")?.addEventListener(
  "click",
  loadQibla
);

document.getElementById("sensorBtn")?.addEventListener(
  "click",
  enableCompass
);

/* ==========================================
   7. DIGITAL TASBEEH
========================================== */

let tasbeehCount = Number(
  localStorage.getItem("imanWhispersTasbeeh") || 0
);

const countDisplay = document.getElementById("count");

function updateTasbeeh() {
  if (countDisplay) {
    countDisplay.textContent = tasbeehCount;
  }

  localStorage.setItem(
    "imanWhispersTasbeeh",
    String(tasbeehCount)
  );
}

document.getElementById("countBtn")?.addEventListener(
  "click",
  () => {
    tasbeehCount++;
    updateTasbeeh();
  }
);

document.getElementById("resetBtn")?.addEventListener(
  "click",
  () => {
    tasbeehCount = 0;
    updateTasbeeh();
  }
);

updateTasbeeh();

/* ==========================================
   8. HADITH COLLECTION
========================================== */

const hadiths = [
  {
    text: "Actions are judged by intentions.",
    source: "Sahih al-Bukhari 1; Sahih Muslim 1907"
  },
  {
    text: "The best among you are those who learn the Quran and teach it.",
    source: "Sahih al-Bukhari 5027"
  },
  {
    text: "None of you truly believes until he loves for his brother what he loves for himself.",
    source: "Sahih al-Bukhari 13; Sahih Muslim 45"
  }
];

function renderHadiths() {
  const container = document.getElementById("hadithList");
  if (!container) return;

  container.replaceChildren();

  hadiths.forEach(hadith => {
    const article = document.createElement("article");
    article.className = "hadith-card";

    const text = document.createElement("p");
    text.textContent = hadith.text;

    const source = document.createElement("small");
    source.textContent = hadith.source;

    article.append(text, source);
    container.appendChild(article);
  });
}

renderHadiths();

/* ==========================================
   9. DAILY DUAS
========================================== */

const duas = [
  {
    category: "morning",
    arabic: "اللَّهُمَّ بِكَ أَصْبَحْنَا وَبِكَ أَمْسَيْنَا",
    meaning: "O Allah, by You we enter the morning and by You we enter the evening.",
    source: "Sunan Abi Dawud 5068"
  },
  {
    category: "evening",
    arabic: "بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا",
    meaning: "In Your name, O Allah, I die and I live.",
    source: "Sahih al-Bukhari 6324"
  },
  {
    category: "daily",
    arabic: "رَبِّ زِدْنِي عِلْمًا",
    meaning: "My Lord, increase me in knowledge.",
    source: "Quran 20:114"
  },
  {
    category: "daily",
    arabic: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ",
    meaning: "Our Lord, give us good in this world and good in the Hereafter, and protect us from the punishment of the Fire.",
    source: "Quran 2:201"
  }
];

function renderDuas(category = "all") {
  const container = document.getElementById("duaList");
  if (!container) return;

  container.replaceChildren();

  const filtered = category === "all"
    ? duas
    : duas.filter(dua => dua.category === category);

  filtered.forEach(dua => {
    const article = document.createElement("article");
    article.className = "dua-card";

    const arabic = document.createElement("p");
    arabic.className = "arabic";
    arabic.dir = "rtl";
    arabic.textContent = dua.arabic;

    const meaning = document.createElement("p");
    meaning.textContent = dua.meaning;

    const source = document.createElement("small");
    source.textContent = dua.source;

    article.append(arabic, meaning, source);
    container.appendChild(article);
  });
}

document.querySelectorAll("[data-filter]").forEach(button => {
  button.addEventListener("click", () => {
    renderDuas(button.dataset.filter);
  });
});

renderDuas();

/* ==========================================
   10. ISLAMIC HIJRI CALENDAR
========================================== */

async function loadHijriCalendar() {
  const arabic = document.getElementById("hijriDate");
  const english = document.getElementById("hijriDateEnglish");
  const status = document.getElementById("hijriStatus");
  const events = document.getElementById("hijriEvents");

  if (!arabic || !english) return;

  status.textContent = "Loading Islamic date...";

  try {
    const today = Math.floor(Date.now() / 1000);

    const response = await fetch(
      `${ALADHAN_API}/timings/${today}?latitude=24.8607&longitude=67.0011&method=1`
    );

    if (!response.ok) throw new Error("Hijri calendar request failed");

    const result = await response.json();

    if (result.code !== 200) throw new Error("Hijri date unavailable");

    const hijri = result.data.date.hijri;

    arabic.textContent = hijri.date;
    english.textContent =
      `${hijri.day} ${hijri.month.en} ${hijri.year} AH`;

    status.textContent =
      "Islamic date provided by the AlAdhan calendar service. " +
      "Local moon sighting may differ.";

    if (events) {
      events.replaceChildren();

      const month = document.createElement("p");
      month.textContent = `Current Hijri month: ${hijri.month.en}`;

      const year = document.createElement("p");
      year.textContent = `Hijri year: ${hijri.year} AH`;

      events.append(month, year);
    }

  } catch (error) {
    console.error("Hijri calendar:", error);
    status.textContent =
      "Unable to load the Hijri date. Please try again later.";
  }
}

loadHijriCalendar();

/* ==========================================
   11. 99 NAMES OF ALLAH
========================================== */

let allAllahNames = [];

async function loadAllahNames() {
  const container = document.getElementById("namesList");
  const status = document.getElementById("namesStatus");

  if (!container || !status) return;

  status.textContent = "Loading the 99 Names of Allah...";

  try {
    const response = await fetch(
      `${ALADHAN_API}/asmaAlHusna`
    );

    if (!response.ok) throw new Error("Names request failed");

    const result = await response.json();

    if (result.code !== 200 || !Array.isArray(result.data)) {
      throw new Error("Names data unavailable");
    }

    allAllahNames = result.data;

    renderAllahNames(allAllahNames);
    status.textContent = `${allAllahNames.length} beautiful names loaded.`;

  } catch (error) {
    console.error("Names of Allah:", error);
    status.textContent =
      "Unable to load the Names of Allah. Please check your internet connection.";
  }
}

function renderAllahNames(names) {
  const container = document.getElementById("namesList");
  const status = document.getElementById("namesStatus");

  if (!container) return;

  container.replaceChildren();

  if (!names.length) {
    if (status) status.textContent = "No names found.";
    return;
  }

  names.forEach((item, index) => {
    const card = document.createElement("article");
    card.className = "name-card";

    const number = document.createElement("small");
    number.textContent = item.number || index + 1;

    const arabic = document.createElement("p");
    arabic.className = "arabic";
    arabic.lang = "ar";
    arabic.dir = "rtl";
    arabic.textContent = item.name || "";

    const transliteration = document.createElement("h3");
    transliteration.textContent = item.transliteration || "";

    const meaning = document.createElement("p");
    meaning.textContent =
      item.en?.meaning ||
      item.meaning ||
      "Meaning unavailable";

    card.append(number, arabic, transliteration, meaning);
    container.appendChild(card);
  });
}

document.getElementById("namesSearch")?.addEventListener(
  "input",
  event => {
    const query = event.target.value.trim().toLowerCase();

    const filtered = allAllahNames.filter(item => {
      const arabic = item.name || "";
      const transliteration = item.transliteration || "";
      const meaning = item.en?.meaning || item.meaning || "";

      return (
        arabic.includes(query) ||
        transliteration.toLowerCase().includes(query) ||
        meaning.toLowerCase().includes(query)
      );
    });

    renderAllahNames(filtered);
  }
);

loadAllahNames();

/* ==========================================
   12. SEERAH OF PROPHET MUHAMMAD ﷺ
========================================== */

const seerahItems = [
  {
    title: "The Birth of the Prophet ﷺ",
    description: "Prophet Muhammad ﷺ was born in Makkah in the Year of the Elephant.",
    source: "Classical Seerah accounts"
  },
  {
    title: "The First Revelation",
    description: "The first revelation came to Prophet Muhammad ﷺ in the Cave of Hira through Angel Jibril.",
    source: "Sahih al-Bukhari 3"
  },
  {
    title: "The Hijrah",
    description: "The Prophet ﷺ migrated from Makkah to Madinah with his companion Abu Bakr رضي الله عنه.",
    source: "Seerah accounts; Quran 9:40"
  },
  {
    title: "The Conquest of Makkah",
    description: "The Prophet ﷺ entered Makkah and granted forgiveness to many of its people.",
    source: "Classical Seerah accounts"
  },
  {
    title: "The Farewell Pilgrimage",
    description: "The Prophet ﷺ delivered his Farewell Sermon during his final pilgrimage.",
    source: "Sahih al-Bukhari 1739; Sahih Muslim 1218"
  }
];

function renderSeerah() {
  const container = document.getElementById("seerahList");
  if (!container) return;

  container.replaceChildren();

  seerahItems.forEach(item => {
    const article = document.createElement("article");
    article.className = "seerah-card";

    const title = document.createElement("h3");
    title.textContent = item.title;

    const description = document.createElement("p");
    description.textContent = item.description;

    const source = document.createElement("small");
    source.textContent = item.source;

    article.append(title, description, source);
    container.appendChild(article);
  });
}

renderSeerah();

/* ==========================================
   13. DAILY SUNNAH
========================================== */

const sunnahItems = [
  {
    title: "Begin with Bismillah",
    description: "Remember Allah and begin appropriate daily activities in His name.",
    source: "Sahih al-Bukhari 5376; Sahih Muslim 2022"
  },
  {
    title: "Use the right hand when eating",
    description: "Eat with your right hand and eat from what is near you.",
    source: "Sahih al-Bukhari 5376; Sahih Muslim 2022"
  },
  {
    title: "Smile at others",
    description: "A smile to your brother is an act of charity.",
    source: "Jami at-Tirmidhi 1956"
  },
  {
    title: "Spread the greeting of peace",
    description: "Greet others with Assalamu Alaikum.",
    source: "Sahih Muslim 54"
  },
  {
    title: "Remember Allah often",
    description: "Keep your tongue moist with the remembrance of Allah.",
    source: "Jami at-Tirmidhi 3375"
  }
];

function renderSunnah() {
  const container = document.getElementById("sunnahList");
  if (!container) return;

  container.replaceChildren();

  sunnahItems.forEach(item => {
    const article = document.createElement("article");
    article.className = "sunnah-card";

    const title = document.createElement("h3");
    title.textContent = item.title;

    const description = document.createElement("p");
    description.textContent = item.description;

    const source = document.createElement("small");
    source.textContent = item.source;

    article.append(title, description, source);
    container.appendChild(article);
  });
}

renderSunnah();

/* ==========================================
   14. REMINDERS
========================================== */

const reminders = [
  {
    text: "Indeed, in the remembrance of Allah do hearts find rest.",
    source: "Quran 13:28"
  },
  {
    text: "So surely with hardship comes ease.",
    source: "Quran 94:5"
  },
  {
    text: "And He is with you wherever you are.",
    source: "Quran 57:4"
  },
  {
    text: "Do not despair of the mercy of Allah.",
    source: "Quran 39:53"
  },
  {
    text: "Remember Me; I will remember you.",
    source: "Quran 2:152"
  }
];

let reminderIndex = 0;

function showReminder() {
  const text = document.getElementById("reminderText");
  const reference = document.getElementById("reminderRef");

  if (!text || !reference) return;

  const reminder = reminders[reminderIndex];

  text.textContent = reminder.text;
  reference.textContent = reminder.source;

  reminderIndex = (reminderIndex + 1) % reminders.length;
}

document.getElementById("nextReminder")?.addEventListener(
  "click",
  showReminder
);

showReminder();

/* ==========================================
   15. PWA INSTALLATION
========================================== */

let deferredInstallPrompt = null;

const installButton = document.getElementById("installBtn");

window.addEventListener("beforeinstallprompt", event => {
  event.preventDefault();
  deferredInstallPrompt = event;

  if (installButton) {
    installButton.hidden = false;
  }
});

installButton?.addEventListener("click", async () => {
  if (deferredInstallPrompt) {
    deferredInstallPrompt.prompt();
    await deferredInstallPrompt.userChoice;

    deferredInstallPrompt = null;
    installButton.hidden = true;

  } else {
    alert(
      "Android: Open Chrome menu and select Install app or Add to Home screen. " +
      "iPhone: Open this website in Safari, tap Share, then Add to Home Screen."
    );
  }
});

window.addEventListener("appinstalled", () => {
  if (installButton) installButton.hidden = true;
  deferredInstallPrompt = null;
});

/* ==========================================
   16. SERVICE WORKER
========================================== */

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./service-worker.js")
      .then(registration => {
        console.log(
          "Iman Whispers Service Worker registered:",
          registration.scope
        );
      })
      .catch(error => {
        console.error("Service Worker registration failed:", error);
      });
  });
}

console.log("Iman Whispers Companion loaded successfully.");
