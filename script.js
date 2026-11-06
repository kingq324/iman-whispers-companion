
// ==========================================
// IMAN WHISPERS
// App Installation + Complete Qur'an Reader
// ==========================================


// ------------------------------------------
// 1. APP INSTALLATION
// ------------------------------------------

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


// ------------------------------------------
// 2. QUR'AN READER ELEMENTS
// ------------------------------------------

const surahList = document.getElementById("quranSurahList");
const quranLoading = document.getElementById("quran-loading");
const quranReader = document.getElementById("quranReader");
const surahTitle = document.getElementById("surahTitle");
const quranVerses = document.getElementById("quranVerses");
const backToSurahs = document.getElementById("backToSurahs");

const API = "https://api.alquran.cloud/v1";


// ------------------------------------------
// 3. LOAD ALL 114 SURAHS
// ------------------------------------------

async function loadSurahs() {
  if (!surahList || !quranLoading) return;

  quranLoading.hidden = false;
  quranLoading.textContent = "Loading all 114 Surahs...";

  try {
    const response = await fetch(`${API}/surah`);

    if (!response.ok) {
      throw new Error("Surah service unavailable.");
    }

    const result = await response.json();

    if (result.code !== 200 || !Array.isArray(result.data)) {
      throw new Error("Invalid Surah data.");
    }

    surahList.replaceChildren();

    result.data.forEach((surah) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "surah-card";

      const number = document.createElement("span");
      number.textContent = `${surah.number}.`;

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
    surahList.hidden = false;

  } catch (error) {
    console.error("Surah list error:", error);
    quranLoading.hidden = false;
    quranLoading.textContent =
      "Unable to load Surahs. Please check your internet and refresh.";
  }
}


// ------------------------------------------
// 4. LOAD COMPLETE SURAH
// Arabic: Uthmani
// English: Sahih International
// ------------------------------------------

async function loadSurah(number, name) {
  if (
    !surahList ||
    !quranLoading ||
    !quranReader ||
    !quranVerses ||
    !surahTitle
  ) return;

  surahList.hidden = true;
  quranReader.hidden = true;

  quranLoading.hidden = false;
  quranLoading.textContent = `Loading ${name}...`;

  try {
    const [arabicResponse, englishResponse] = await Promise.all([
      fetch(`${API}/surah/${number}/quran-uthmani`),
      fetch(`${API}/surah/${number}/en.sahih`)
    ]);

    if (!arabicResponse.ok || !englishResponse.ok) {
      throw new Error("Could not download Surah data.");
    }

    const arabicResult = await arabicResponse.json();
    const englishResult = await englishResponse.json();

    if (
      arabicResult.code !== 200 ||
      englishResult.code !== 200
    ) {
      throw new Error("Surah data is unavailable.");
    }

    const arabicAyahs = arabicResult.data.ayahs;
    const englishAyahs = englishResult.data.ayahs;

    if (
      !Array.isArray(arabicAyahs) ||
      !Array.isArray(englishAyahs)
    ) {
      throw new Error("Invalid verse data.");
    }

    // Match translation using verse number
    const englishByNumber = new Map(
      englishAyahs.map((ayah) => [
        ayah.numberInSurah,
        ayah.text
      ])
    );

    surahTitle.textContent =
      `${name} • ${arabicResult.data.name}`;

    quranVerses.replaceChildren();

    // Display every verse
    arabicAyahs.forEach((ayah) => {
      const verse = document.createElement("article");
      verse.className = "verse-card";

      const verseNumber = document.createElement("small");
      verseNumber.textContent =
        `Ayah ${ayah.numberInSurah}`;

      const arabicText = document.createElement("p");
      arabicText.className = "arabic-verse";
      arabicText.textContent = ayah.text;
      arabicText.lang = "ar";
      arabicText.dir = "rtl";

      const translation = document.createElement("p");
      translation.className = "english-translation";

      translation.textContent =
        englishByNumber.get(ayah.numberInSurah) ||
        "Translation unavailable.";

      verse.append(
        verseNumber,
        arabicText,
        translation
      );

      quranVerses.appendChild(verse);
    });

    quranLoading.hidden = true;
    quranReader.hidden = false;

    // Bring the reader into view
    quranReader.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });

  } catch (error) {
    console.error("Qur'an reader error:", error);

    quranLoading.hidden = false;
    quranLoading.textContent =
      "Unable to load this Surah. Please try again.";

    surahList.hidden = false;
    quranReader.hidden = true;
  }
}


// ------------------------------------------
// 5. BACK TO SURAH LIST
// ------------------------------------------

if (backToSurahs) {
  backToSurahs.addEventListener("click", () => {
    quranReader.hidden = true;
    quranLoading.hidden = true;
    surahList.hidden = false;

    surahList.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  });
}


// ------------------------------------------
// 6. START QUR'AN READER
// ------------------------------------------

loadSurahs();
