let allQuotes = [];
let currentList = [];
let currentQuote = null;
let currentCat = "all";

const quoteText = document.getElementById("quoteText");
const quoteAuthor = document.getElementById("quoteAuthor");
const cardIndex = document.getElementById("cardIndex");
const card = document.getElementById("card");
const newQuoteBtn = document.getElementById("newQuoteBtn");
const copyBtn = document.getElementById("copyBtn");
const favBtn = document.getElementById("favBtn");
const favIcon = document.getElementById("favIcon");
const favCount = document.getElementById("favCount");
const toast = document.getElementById("toast");
const catRow = document.getElementById("catRow");
const qotdText = document.getElementById("qotdText");
const favToggleBtn = document.getElementById("favToggleBtn");
const favPanel = document.getElementById("favPanel");
const closeFavBtn = document.getElementById("closeFavBtn");
const overlay = document.getElementById("overlay");
const favList = document.getElementById("favList");

const twitterBtn = document.getElementById("twitterBtn");
const linkedinBtn = document.getElementById("linkedinBtn");
const whatsappBtn = document.getElementById("whatsappBtn");

init();

async function init() {
  const res = await fetch("quotes.json");
  allQuotes = await res.json();
  currentList = allQuotes;
  setupQotd();
  updateFavCount();
  showRandomQuote();
}

function setupQotd() {
  const today = new Date();
  const dayNum = today.getFullYear() * 1000 + dayOfYear(today);
  const index = dayNum % allQuotes.length;
  const q = allQuotes[index];
  qotdText.textContent = `"${q.text}" — ${q.author}`;
}

function dayOfYear(date) {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date - start;
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

function showRandomQuote() {
  if (currentList.length === 0) return;
  let pick = currentList[Math.floor(Math.random() * currentList.length)];
  if (currentList.length > 1 && currentQuote && pick.text === currentQuote.text) {
    return showRandomQuote();
  }
  currentQuote = pick;
  renderQuote();
}

function renderQuote() {
  card.style.animation = "none";
  void card.offsetWidth;
  card.style.animation = "fadeIn 0.5s ease forwards";

  quoteText.textContent = currentQuote.text;
  quoteAuthor.textContent = currentQuote.author;

  const idx = allQuotes.indexOf(currentQuote) + 1;
  cardIndex.textContent = String(idx).padStart(3, "0");

  refreshFavIcon();
}

catRow.addEventListener("click", function (e) {
  const btn = e.target.closest(".catPill");
  if (!btn) return;

  document.querySelectorAll(".catPill").forEach(p => p.classList.remove("active"));
  btn.classList.add("active");

  currentCat = btn.dataset.cat;
  currentList = currentCat === "all" ? allQuotes : allQuotes.filter(q => q.category === currentCat);
  showRandomQuote();
});

newQuoteBtn.addEventListener("click", showRandomQuote);

copyBtn.addEventListener("click", function () {
  const full = `"${currentQuote.text}" — ${currentQuote.author}`;
  navigator.clipboard.writeText(full);
  showToast("Copied to clipboard");
});

function getFavorites() {
  const saved = localStorage.getItem("quoteFavorites");
  return saved ? JSON.parse(saved) : [];
}

function saveFavorites(list) {
  localStorage.setItem("quoteFavorites", JSON.stringify(list));
}

function isFavorited(q) {
  return getFavorites().some(f => f.text === q.text);
}

function refreshFavIcon() {
  if (isFavorited(currentQuote)) {
    favIcon.innerHTML = "&#9829;";
    favBtn.classList.add("liked");
  } else {
    favIcon.innerHTML = "&#9825;";
    favBtn.classList.remove("liked");
  }
}

favBtn.addEventListener("click", function () {
  let favs = getFavorites();
  if (isFavorited(currentQuote)) {
    favs = favs.filter(f => f.text !== currentQuote.text);
    showToast("Removed from favorites");
  } else {
    favs.push(currentQuote);
    showToast("Saved to favorites");
  }
  saveFavorites(favs);
  refreshFavIcon();
  updateFavCount();
  renderFavList();
});

function updateFavCount() {
  favCount.textContent = getFavorites().length;
}

function renderFavList() {
  const favs = getFavorites();
  if (favs.length === 0) {
    favList.innerHTML = '<p class="favEmpty">No favorites saved yet. Tap the heart on a quote to save it here.</p>';
    return;
  }
  favList.innerHTML = "";
  favs.forEach(function (f, i) {
    const item = document.createElement("div");
    item.className = "favItem";
    item.innerHTML = `
      <button class="removeBtn" data-i="${i}">&times;</button>
      <p class="txt">"${f.text}"</p>
      <p class="auth">— ${f.author}</p>
    `;
    favList.appendChild(item);
  });
}

favList.addEventListener("click", function (e) {
  const btn = e.target.closest(".removeBtn");
  if (!btn) return;
  const i = parseInt(btn.dataset.i);
  let favs = getFavorites();
  favs.splice(i, 1);
  saveFavorites(favs);
  updateFavCount();
  renderFavList();
  refreshFavIcon();
});

favToggleBtn.addEventListener("click", function () {
  renderFavList();
  favPanel.classList.add("show");
  overlay.classList.add("show");
});

function closeFavPanel() {
  favPanel.classList.remove("show");
  overlay.classList.remove("show");
}

closeFavBtn.addEventListener("click", closeFavPanel);
overlay.addEventListener("click", closeFavPanel);

function showToast(msg) {
  toast.textContent = msg;
  toast.classList.add("show");
  setTimeout(function () {
    toast.classList.remove("show");
  }, 2000);
}

twitterBtn.addEventListener("click", function () {
  const text = encodeURIComponent(`"${currentQuote.text}" — ${currentQuote.author}`);
  window.open(`https://twitter.com/intent/tweet?text=${text}`, "_blank");
});

linkedinBtn.addEventListener("click", function () {
  const text = encodeURIComponent(`"${currentQuote.text}" — ${currentQuote.author}`);
  window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${text}`, "_blank");
});

whatsappBtn.addEventListener("click", function () {
  const text = encodeURIComponent(`"${currentQuote.text}" — ${currentQuote.author}`);
  window.open(`https://wa.me/?text=${text}`, "_blank");
});
