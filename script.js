
// Iman Whispers - App Installation + Qur'an Reader

// ------------------------------------
// 1. APP INSTALLATION (existing code)
// ------------------------------------

let deferredPrompt;

const installBtn = document.getElementById("installBtn");

window.addEventListener("beforeinstallprompt", (event) => {
  event.preventDefault();
  deferredPrompt = event;

  if (installBtn) {
    installBtn.hidden = false;
  }
});

if (installBtn) {
  installBtn.addEventListener("click", async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    await deferredPrompt.userChoice;

    deferredPrompt = null;
    installBtn.hidden = true;
  });
}

window.addEventListener("appinstalled", () => {
  if (installBtn) {
    installBtn.hidden = true;
  }
});


// ------------------------------------
// 2. QUR'AN READER
// ------------------------------------

const surahList = document.getElementById("quranSurahList");
const quranLoading = document.getElementById("quran-loading");
const quranReader = document.getElementById("quranReader");
const surahTitle = document.getElementById("surahTitle");
const quranVerses = document.getElementById("quranVerses");
const backToSurahs = document.getElementById("backToSurahs");

const API = "https://api.alquran.cloud/v1";

async function loadSurahs() {
  if (!surahList || !quranLoading) return;

  try {
    quranLoading.textContent = "Loading all 114 Surahs...";

    const response = await fetch(`${API}/surah`);

    if (!response.ok) {
      throw new Error("Unable to connect to Qur'an service.");
    }

    const result = await response.json();

    if (result.code !== 200) {
      throw new Error("Surah list could not be loaded.");
    }

    surahList.replaceChildren();

    result.data.forEach((surah) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "surah-card";

      const number = document.createElement("span");
      number.textContent = surah.number + ".";

      const details = document.createElement("span");
      details.className = "surah-details";

      const english = document.createElement("strong");
      english.textContent = surah.englishName;

      const meaning = document.createElement("small");
      meaning.textContent =
        `${surah.englishNameTranslation} • ${surah.numberOfAyahs} Ayahs`;

      const arabic = document.createElement("span");
      arabic.className = "surah-arabic";
      arabic.textContent = surah.name;
      arabic.lang = "ar";
      arabic.dir = "rtl";

      details.append(english, meaning);
      button.append(number, details, arabic);

      button.addEventListener("click", () => {
        loadSurah(surah.number, surah.englishName);
      });

      surahList.appendChild(button);
    });

    quranLoading.hidden = true;

  } catch (error) {
    quranLoading.textContent =
      "Unable to load Surahs. Please check your internet and refresh the page.";
    console.error(error);
  }
}


// ------------------------------------
// 3. LOAD ARABIC + ENGLISH VERSES
// ------------------------------------

async function loadSurah(number, name) {
  if (!quranReader || !quranVerses) return;

  quranLoading.hidden = false;
  quranLoading.textContent = "Loading Surah...";
  surahList.hidden = true;
  quranReader.hidden = true;

  try {
    const [arabicResponse, englishResponse] = await Promise.all([
      fetch(`${API}/surah/${number}/quran-uthmani`),
      fetch(`${API}/surah/${number}/en.sahih`)
    ]);

    if (!arabicResponse.ok || !englishResponse.ok) {
      throw new Error("Unable to load this Surah.");
    }

    const arabicResult = await arabicResponse.json();
    const englishResult = await englishResponse.json();

    if (
      arabicResult.code !== 200 ||
      englishResult.code !== 200
    ) {
      throw new Error("Qur'an data is unavailable.");
    }

    const arabicAyahs = arabicResult.data.ayahs;
    const englishAyahs = englishResult.data.ayahs;

    surahTitle.textContent =
      `${name} • ${arabicResult.data.name}`;

    quranVerses.replaceChildren();

    arabicAyahs.forEach((ayah, index) => {
      const verse = document.createElement("article");
      verse.className = "verse-card";

      const verseNumber = document.createElement("small");
      verseNumber.textContent = `Ayah ${ayah.numberInSurah}`;

      const arabicText = document.createElement("p");
      arabicText.className = "arabic-verse";
      arabicText.textContent = ayah.text;
      arabicText.lang = "ar";
      arabicText.dir = "rtl";

      const translation = document.createElement("p");
      translation.className = "english-translation";
      translation.textContent =
        englishAyahs[index]?.text || "Translation unavailable.";

      verse.append(verseNumber, arabicText, translation);
      quranVerses.appendChild(verse);
    });

    quranLoading.hidden = true;
    quranReader.hidden = false;

  } catch (error) {
    quranLoading.textContent =
      "Unable to load this Surah. Please try again.";
    surahList.hidden = false;
    console.error(error);
  }
}


// ------------------------------------
// 4. BACK TO SURAH LIST
// ------------------------------------

if (backToSurahs) {
  backToSurahs.addEventListener("click", () => {
    quranReader.hidden = true;
    surahList.hidden = false;
    quranLoading.hidden = true;
  });
}


// ------------------------------------
// 5. START QUR'AN READER
// ------------------------------------

loadSurahs();
