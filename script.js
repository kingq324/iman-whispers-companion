
/* ==========================================
   IMAN WHISPERS COMPANION
   Main JavaScript
========================================== */

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
    location: "Please allow location access.",
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
    location: "براہ کرم لوکیشن کی اجازت دیں۔",
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
    location: "يرجى السماح بالوصول إلى الموقع.",
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
    "#surahSearch": null,
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

    if (!element) return;

    if (selector === "#surahSearch") {
      element.placeholder = t.search;
    } else if (value !== null) {
      element.textContent = value;
    }
  });

  document.querySelectorAll("[data-filter]").forEach(button => {
    const filter = button.dataset.filter;
    button.textContent = t[filter] || filter;
  });

  document.documentElement.lang = currentLanguage;
  document.documentElement.dir =
    currentLanguage === "ur" || currentLanguage === "ar"
      ? "rtl"
      : "ltr";

  document.querySelectorAll(".arabic").forEach(element => {
    element.dir = "rtl";
  });
}

document.getElementById("languageSelect")?.addEventListener("change", event => {
  translatePage(event.target.value);
});

translatePage("en");

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
    // Choose a consistent verse for each day.
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

    if (result.code !== 200 || !Array.isArray(result.data)) {
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

    if (!response.ok) throw new Error("Surah request failed");

    const result = await response.json();
    allSurahs = result.data || [];

    renderSurahs(allSurahs);
    status.textContent = "";

  } catch (error) {
    console.error("Surah loading:", error);
    status.textContent = "Unable to load Surahs. Check your internet.";
  }
}

function renderSurahs(surahs) {
  const list = document.getElementById("surahList");
  const status = document.getElementById("quranStatus");

  if (!list) return;

  list.replaceChildren();

  if (surahs.length === 0) {
    if (status) status.textContent =
      translations[currentLanguage].noResults;
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
  const ayahList = document.getElementById("ayahList");

  if (!reader || !list || !title || !ayahList) return;

  selectedSurah = number;

  const surah = allSurahs.find(item => item.number === number);

  if (!surah) return;

  title.textContent = `${surah.name} · ${surah.englishName}`;
  ayahList.textContent = "Loading verses...";

  list.hidden = true;
  reader.hidden = false;

  await loadSurahVerses();
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

    if (!response.ok) throw new Error("Quran request failed");

    const result = await response.json();

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
      translated.textContent = translatedVerses[index].text;

      const reference = document.createElement("small");
      reference.textContent =
        `Ayah ${ayah.numberInSurah}`;

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
    document.getElementById("reader").hidden = true;
    document.getElementById("surahList").hidden = false;
  }
);

loadSurahs();

// ==========================================
// 4. PRAYER TIMES
// ==========================================

async function getLocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported."));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      position => resolve({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      }),
      error => reject(error),
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 300000
      }
    );
  });
}

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
      "Calculation method: Muslim World League.";

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
// 5. QIBLA DIRECTION
// ==========================================

let qiblaBearing = null;
let deviceHeading = null;

async function loadQibla() {
  const status = document.getElementById("qiblaStatus");
  const degrees = document.getElementById("qiblaDegrees");

  if (!status || !degrees) return;

  status.textContent = "Calculating Qibla direction...";

  try {
    const location = await getLocation();

    const response = await fetch(
      `${ALADHAN_API}/qibla/${location.latitude}/${location.longitude}`
    );

    if (!response.ok) throw new Error("Qibla API error");

    const result = await response.json();

    if (result.code !== 200) throw new Error("Qibla unavailable");

    qiblaBearing = result.data.direction;

    degrees.textContent = `${qiblaBearing.toFixed(1)}°`;
    status.textContent =
      "Qibla direction calculated. Enable your compass sensor for live guidance.";

    updateCompass();

  } catch (error) {
    console.error("Qibla:", error);
    status.textContent =
      "Unable to calculate Qibla. Please enable location.";
  }
}

function updateCompass() {
  const arrow = document.querySelector(".compass-arrow");

  if (!arrow || qiblaBearing === null) return;

  const rotation =
    deviceHeading === null
      ? qiblaBearing
      : qiblaBearing - deviceHeading;

  arrow.style.transform = `rotate(${rotation}deg)`;
}

async function enableCompass() {
  try {
    // iPhone requires explicit permission.
    if (
      typeof DeviceOrientationEvent !== "undefined" &&
      typeof DeviceOrientationEvent.requestPermission === "function"
    ) {
      const permission =
        await DeviceOrientationEvent.requestPermission();

      if (permission !== "granted") {
        throw new Error("Compass permission denied.");
      }
    }

    if (!("DeviceOrientationEvent" in window)) {
      throw new Error("Compass sensor is not supported.");
    }

    window.addEventListener("deviceorientation", event => {
      if (event.webkitCompassHeading !== undefined) {
        deviceHeading = event.webkitCompassHeading;
      } else if (event.alpha !== null) {
        deviceHeading = (360 - event.alpha) % 360;
      }

      updateCompass();
    });

    document.getElementById("qiblaStatus").textContent =
      "Compass sensor enabled. Hold your phone flat.";

  } catch (error) {
    console.error("Compass:", error);

    document.getElementById("qiblaStatus").textContent =
      "Compass unavailable or permission denied. Check your device settings.";
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
// 6. TASBEEH COUNTER
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
// 7. HADITH COLLECTION
// ==========================================

// English meanings with references.
// Verify the full wording in a trusted Hadith edition
// before publishing translations in other languages.

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
// 8. DAILY DUAS
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
// 9. DAILY REMINDERS
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

  reminderIndex = (reminderIndex + 1) % reminders.length;
}

document.getElementById("nextReminder")?.addEventListener(
  "click",
  showReminder
);

showReminder();

// ==========================================
// 10. PWA INSTALLATION
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
      "To install Iman Whispers on iPhone, open this website in Safari, tap Share, then choose Add to Home Screen. On Android, use Chrome's menu and choose Install app or Add to Home screen."
    );
  }
});

window.addEventListener("appinstalled", () => {
  if (installButton) installButton.hidden = true;
  deferredInstallPrompt = null;
});

// ==========================================
// 11. SERVICE WORKER REGISTRATION
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
        console.error("Service Worker registration failed:", error);
      });
  });
}

console.log("Iman Whispers Companion loaded successfully.");
