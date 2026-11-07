
/* ==========================================
   IMAN WHISPERS COMPANION
   Complete Main JavaScript
========================================== */

"use strict";

const API = "https://api.alquran.cloud/v1";
const ALADHAN_API = "https://api.aladhan.com/v1";

// ==========================================
// 1. LANGUAGE SYSTEM
// ==========================================

const translations = {
  en: {
    welcome: "A Heart Close to Allah",
    explore: "Explore Quran",
    ayah: "Ayah of the Day",
    refresh: "Refresh Ayah",
    prayer: "Prayer Times",
    getPrayer: "Get Prayer Times",
    quran: "The Holy Quran",
    search: "Search Surah...",
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
    morning: "Morning",
    evening: "Evening",
    daily: "Daily",
    all: "All",
    loading: "Loading...",
    noResults: "No Surahs found.",
    error: "Something went wrong. Please try again."
  },

  ur: {
    welcome: "اللہ کے قریب ایک دل",
    explore: "قرآن پڑھیں",
    ayah: "آج کی آیت",
    refresh: "دوسری آیت",
    prayer: "نماز کے اوقات",
    getPrayer: "نماز کے اوقات حاصل کریں",
    quran: "قرآن مجید",
    search: "سورت تلاش کریں...",
    hadith: "احادیث کا مجموعہ",
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
    morning: "صبح",
    evening: "شام",
    daily: "روزانہ",
    all: "تمام",
    loading: "لوڈ ہو رہا ہے...",
    noResults: "کوئی سورت نہیں ملی۔",
    error: "کچھ مسئلہ پیش آیا۔ دوبارہ کوشش کریں۔"
  },

  ar: {
    welcome: "قلب قريب من الله",
    explore: "استكشف القرآن",
    ayah: "آية اليوم",
    refresh: "آية أخرى",
    prayer: "مواقيت الصلاة",
    getPrayer: "احصل على مواقيت الصلاة",
    quran: "القرآن الكريم",
    search: "ابحث عن سورة...",
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
    morning: "الصباح",
    evening: "المساء",
    daily: "يومي",
    all: "الكل",
    loading: "جار التحميل...",
    noResults: "لم يتم العثور على سور.",
    error: "حدث خطأ. حاول مرة أخرى."
  }
};

let currentLanguage = "en";

function translatePage(language) {
  currentLanguage = translations[language] ? language : "en";

  const t = translations[currentLanguage];

  const textMap = {
    ".hero h1": t.welcome,
    ".hero .primary-btn": t.explore,
    "#dailyAyah h2": t.ayah,
    "#newAyah": t.refresh,
    "#prayerTimes h2": t.prayer,
    "#getPrayer": t.getPrayer,
    "#quran h2": t.quran,
    "#hadith h2": t.hadith,
    "#duas h2": t.duas,
    "#tasbeeh h2": t.tasbeeh,
    "#countBtn": t.count,
    "#resetBtn": t.reset,
    "#qibla h2": t.qibla,
    "#qiblaBtn": t.findQibla,
    "#sensorBtn": t.sensor,
    "#reminders h2": t.reminder,
    "#nextReminder": t.another,
    "#backSurahs": t.back
  };

  Object.entries(textMap).forEach(([selector, value]) => {
    const element = document.querySelector(selector);

    if (element) {
      element.textContent = value;
    }
  });

  const search = document.getElementById("surahSearch");

  if (search) {
    search.placeholder = t.search;
  }

  document.querySelectorAll("[data-filter]").forEach(button => {
    const filter = button.dataset.filter;
    button.textContent = t[filter] || filter;
  });

  document.documentElement.lang = currentLanguage;

  document.documentElement.dir =
    currentLanguage === "ur" || currentLanguage === "ar"
      ? "rtl"
      : "ltr";
}

const languageSelect = document.getElementById("languageSelect");

languageSelect?.addEventListener("change", event => {
  translatePage(event.target.value);
});

translatePage(languageSelect?.value || "en");

// ==========================================
// 2. DAILY AYAH
// ==========================================

async function loadDailyAyah() {
  const arabic = document.getElementById("ayahArabic");
  const translation = document.getElementById("ayahTranslation");
  const reference = document.getElementById("ayahRef");

  if (!arabic || !translation || !reference) return;

  arabic.textContent = "Loading...";
  translation.textContent = "Loading...";

  try {
    const dayNumber = Math.floor(
      (Date.now() -
        new Date(new Date().getFullYear(), 0, 0)) /
        86400000
    );

    const ayahNumber = ((dayNumber * 17) % 6236) + 1;

    const response = await fetch(
      `${API}/ayah/${ayahNumber}/editions/quran-uthmani,en.sahih`
    );

    if (!response.ok) {
      throw new Error("Ayah request failed");
    }

    const result = await response.json();

    if (
      result.code !== 200 ||
      !Array.isArray(result.data) ||
      result.data.length < 2
    ) {
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

    translation.textContent =
      "Please check your internet connection and try again.";
  }
}

document.getElementById("newAyah")?.addEventListener(
  "click",
  loadDailyAyah
);

loadDailyAyah();

// ==========================================
// 3. QURAN AND SURAH READER
// ==========================================

let allSurahs = [];
let selectedSurah = null;

async function loadSurahs() {
  const list = document.getElementById("surahList");
  const status = document.getElementById("quranStatus");

  if (!list || !status) return;

  status.textContent = "Loading Surahs...";

  try {
    const response = await fetch(`${API}/surah`);

    if (!response.ok) {
      throw new Error("Surah request failed");
    }

    const result = await response.json();

    // Always display Surahs in Quran order: 1 to 114.
    allSurahs = (result.data || []).sort(
      (a, b) => a.number - b.number
    );

    renderSurahs(allSurahs);

    status.textContent = "";

  } catch (error) {
    console.error("Surah loading:", error);

    status.textContent =
      "Unable to load Surahs. Check your internet.";
  }
}

function renderSurahs(surahs) {
  const list = document.getElementById("surahList");
  const status = document.getElementById("quranStatus");

  if (!list) return;

  list.replaceChildren();

  if (surahs.length === 0) {
    if (status) {
      status.textContent =
        translations[currentLanguage].noResults;
    }
    return;
  }

  if (status) status.textContent = "";

  surahs.forEach(surah => {
    const button = document.createElement("button");

    button.type = "button";
    button.className = "surah-card";

    const name = document.createElement("span");

    name.textContent =
      `${surah.number}. ${surah.englishName}`;

    const arabic = document.createElement("span");

    arabic.textContent = surah.name;
    arabic.className = "arabic";
    arabic.dir = "rtl";

    const details = document.createElement("small");

    details.textContent =
      `${surah.englishNameTranslation} · ` +
      `${surah.numberOfAyahs} Ayahs`;

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
  const ayahList = document.getElementById("ayahList");

  if (!reader || !list || !title || !ayahList) return;

  selectedSurah = number;

  const surah = allSurahs.find(
    item => item.number === number
  );

  if (!surah) return;

  title.textContent =
    `${surah.name} · ${surah.englishName}`;

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
  const translationSelect = document.getElementById("translation");

  if (!ayahList || !selectedSurah) return;

  const edition =
    translationSelect?.value === "ur"
      ? "ur.jalandhry"
      : "en.sahih";

  ayahList.textContent = "Loading verses...";

  try {
    const response = await fetch(
      `${API}/surah/${selectedSurah}/editions/quran-uthmani,${edition}`
    );

    if (!response.ok) {
      throw new Error("Quran request failed");
    }

    const result = await response.json();

    if (
      result.code !== 200 ||
      !result.data ||
      result.data.length < 2
    ) {
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
      arabic.dir = "rtl";
      arabic.textContent =
        `${ayah.text} ۞ ${ayah.numberInSurah}`;

      const translated = document.createElement("p");

      translated.textContent =
        translatedVerses[index]?.text || "";

      const reference = document.createElement("small");

      reference.textContent =
        `Surah ${selectedSurah}, Ayah ${ayah.numberInSurah}`;

      article.append(arabic, translated, reference);

      ayahList.appendChild(article);
    });

  } catch (error) {
    console.error("Quran verses:", error);

    ayahList.textContent =
      "Unable to load verses. Please try again.";
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

// ==========================================
// 4. LOCATION SYSTEM
// ==========================================

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

// ==========================================
// 5. PRAYER TIMES
// ==========================================

async function loadPrayerTimes() {
  const status = document.getElementById("prayerStatus");
  const grid = document.getElementById("prayerGrid");

  if (!status || !grid) return;

  status.textContent = "Finding your location...";
  grid.replaceChildren();

  try {
    const location = await getLocation();

    const today = Math.floor(Date.now() / 1000);

    const url =
      `${ALADHAN_API}/timings/${today}` +
      `?latitude=${location.latitude}` +
      `&longitude=${location.longitude}` +
      `&method=1`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Prayer API error");
    }

    const result = await response.json();

    if (result.code !== 200) {
      throw new Error("Prayer data unavailable");
    }

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
      "Calculation method: Karachi.";

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

// ==========================================
// 6. QIBLA DIRECTION AND LIVE COMPASS
// ==========================================

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

    if (!response.ok) {
      throw new Error("Qibla API error");
    }

    const result = await response.json();

    if (result.code !== 200) {
      throw new Error("Qibla direction unavailable");
    }

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

  const rotation =
    deviceHeading === null
      ? qiblaBearing
      : qiblaBearing - deviceHeading;

  arrow.style.transform =
    `translateX(-50%) rotate(${rotation}deg)`;
}

function handleOrientation(event) {
  let heading = null;

  // iPhone compass heading
  if (typeof event.webkitCompassHeading === "number") {
    heading = event.webkitCompassHeading;
  }

  // Android absolute orientation
  else if (event.absolute === true && event.alpha !== null) {
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

    // Permission required on some iPhones
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
      window.addEventListener(
        "deviceorientation",
        handleOrientation
      );

      window.addEventListener(
        "deviceorientationabsolute",
        handleOrientation
      );

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

// ==========================================
// 7. TASBEEH COUNTER
// ==========================================

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

// ==========================================
// 8. HADITH COLLECTION
// ==========================================

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

// ==========================================
// 9. DAILY DUAS
// ==========================================

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

  const filtered =
    category === "all"
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

// ==========================================
// 10. DAILY REMINDERS
// ==========================================

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

  reminderIndex =
    (reminderIndex + 1) % reminders.length;
}

document.getElementById("nextReminder")?.addEventListener(
  "click",
  showReminder
);

showReminder();

// ==========================================
// 11. PWA INSTALLATION
// ==========================================

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
  if (installButton) {
    installButton.hidden = true;
  }

  deferredInstallPrompt = null;
});

// ==========================================
// 12. SERVICE WORKER REGISTRATION
// ==========================================

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
        console.error(
          "Service Worker registration failed:",
          error
        );
      });
  });
}

console.log("Iman Whispers Companion loaded successfully.");
