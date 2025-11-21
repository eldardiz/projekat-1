// Visual Board – IPI Student Fun Zone

const board = document.getElementById("board");
const addNoteBtn = document.getElementById("addNoteBtn");
const addImageBtn = document.getElementById("addImageBtn");
const addQuoteBtn = document.getElementById("addQuoteBtn");
const saveBtn = document.getElementById("saveBtn");
const clearBtn = document.getElementById("clearBtn");
const recentContainer = document.getElementById("recentItems");
const clearRecentBtn = document.getElementById("clearRecentBtn");
const exportPdfBtn = document.getElementById("exportPdfBtn");
const sendMailBtn = document.getElementById("sendMailBtn");

// mail popup elementi
const mailPopup = document.getElementById("mailPopup");
const mailCloseBtn = document.getElementById("mailCloseBtn");
const mailCancelBtn = document.getElementById("mailCancelBtn");
const mailSendBtn = document.getElementById("mailSendBtn");
const recipientEmail = document.getElementById("recipientEmail");
const recipientError = document.getElementById("recipientError");

let recentRemoved = [];
const RECENT_KEY = "visualBoardRecent";
const STORAGE_KEY = "visualBoardItems";

// boje post-it bilješki
const colors = ["color1", "color2", "color3", "color4", "color5", "color6"];

const IMG_BASE = "slike/vision/";
const sampleImages = [
  "vision1.jpg",
  "vision2.jpg",
  "vision3.jpg",
  "vision4.jpg",
  "vision5.jpg",
  "vision6.jpg",
  "vision7.jpg",
  "vision8.jpg",
].map((n) => IMG_BASE + n);

const sampleQuotes = [
  "Danas učiš malo, sutra ti to spašava projekat.",
  "Neka radi, neka bude ispravno, neka bude brzo.",
  "Nije bitno da je savršeno, bitno je da radi.",
  "Prvo napravi da radi, pa onda uljepšaj.",
  "Svaki bug je samo još jedna lekcija.",
];

function makeDraggable(el) {
  let offsetX, offsetY;

  const delBtn = document.createElement("button");
  delBtn.textContent = "📌";
  delBtn.className = "delete-btn";
  el.appendChild(delBtn);

  delBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    const data = serializeElement(el);
    el.remove();
    pushRecent(data);
    renderRecent();
  });

  el.addEventListener("mousedown", dragStart);

  function dragStart(e) {
    if (e.target === delBtn) return;
    offsetX = e.clientX - el.offsetLeft;
    offsetY = e.clientY - el.offsetTop;
    document.addEventListener("mousemove", drag);
    document.addEventListener("mouseup", dragEnd);
  }

  function drag(e) {
    e.preventDefault();
    el.style.left = e.clientX - offsetX + "px";
    el.style.top = e.clientY - offsetY + "px";
  }

  function dragEnd() {
    document.removeEventListener("mousemove", drag);
    document.removeEventListener("mouseup", dragEnd);
  }
}

// dodaj post-it
addNoteBtn.addEventListener("click", () => {
  const note = document.createElement("div");
  note.className = "note " + colors[Math.floor(Math.random() * colors.length)];
  note.contentEditable = "true";
  note.style.left = Math.random() * 520 + "px";
  note.style.top = Math.random() * 280 + "px";
  note.textContent = "Napiši nešto...";
  makeDraggable(note);
  board.appendChild(note);
});

// dodaj sliku
addImageBtn.addEventListener("click", () => {
  const div = document.createElement("div");
  div.className = "pinned-img";
  div.style.left = Math.random() * 460 + "px";
  div.style.top = Math.random() * 240 + "px";

  const img = document.createElement("img");
  img.src = sampleImages[Math.floor(Math.random() * sampleImages.length)];
  img.alt = "Vision slika";
  div.appendChild(img);

  makeDraggable(div);
  board.appendChild(div);
});

// dodaj citat
addQuoteBtn.addEventListener("click", () => {
  const q = document.createElement("div");
  q.className = "quote";
  q.textContent = sampleQuotes[Math.floor(Math.random() * sampleQuotes.length)];
  q.style.left = Math.random() * 460 + "px";
  q.style.top = Math.random() * 240 + "px";
  q.contentEditable = "true";
  makeDraggable(q);
  board.appendChild(q);
});

// snimi / očisti
saveBtn.addEventListener("click", () => saveBoard());
clearBtn.addEventListener("click", () => {
  if (confirm("Obrisati cijelu ploču?")) {
    board.innerHTML = "";
    localStorage.removeItem(STORAGE_KEY);
  }
});

// print pdf
exportPdfBtn.addEventListener("click", () => {
  window.print();
});

// mail popup
function openMailPopup() {
  mailPopup.classList.add("visible");
  recipientEmail.value = "";
  recipientError.style.display = "none";
  recipientEmail.style.borderColor = "#d1d5db";
  recipientEmail.focus();
}
function closeMailPopup() {
  mailPopup.classList.remove("visible");
}
sendMailBtn.addEventListener("click", openMailPopup);
mailCloseBtn.addEventListener("click", closeMailPopup);
mailCancelBtn.addEventListener("click", closeMailPopup);

// mail send (studentski tekst)
mailSendBtn.addEventListener("click", () => {
  const email = recipientEmail.value.trim();
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  if (!emailValid) {
    recipientError.style.display = "block";
    recipientEmail.style.borderColor = "#dc2626";
    return;
  }

  const bodyText =
    "Hej!\n\n" + "Evo ti moj Visual Board sa Fun Zone.\n" + "Pozz!";

  const mailtoLink =
    "mailto:" +
    encodeURIComponent(email) +
    "?subject=" +
    encodeURIComponent("Moj Visual Board – Student Fun Zone") +
    "&body=" +
    encodeURIComponent(bodyText);

  window.location.href = mailtoLink;
  closeMailPopup();
});

// --- storage helpers ---
function saveBoard(silent = false) {
  const items = [];
  document.querySelectorAll("#board > div").forEach((el) => {
    items.push(serializeElement(el));
  });

  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  localStorage.setItem(RECENT_KEY, JSON.stringify(recentRemoved));

  if (!silent) alert("Ploča je snimljena!");
}

function serializeElement(el) {
  return {
    type: el.classList.contains("note")
      ? "note"
      : el.classList.contains("quote")
      ? "quote"
      : "image",
    className: el.className,
    html: el.innerHTML,
    left: el.style.left,
    top: el.style.top,
  };
}

function createElementFromData(data) {
  const div = document.createElement("div");
  div.className = data.className;
  div.style.left = data.left;
  div.style.top = data.top;
  div.innerHTML = data.html;
  if (data.type !== "image") div.contentEditable = "true";
  makeDraggable(div);
  return div;
}

function pushRecent(data) {
  recentRemoved.unshift(data);
  if (recentRemoved.length > 3) recentRemoved = recentRemoved.slice(0, 3);
  localStorage.setItem(RECENT_KEY, JSON.stringify(recentRemoved));
}

function renderRecent() {
  if (!recentContainer) return;
  recentContainer.innerHTML = "";

  if (recentRemoved.length === 0) {
    recentContainer.innerHTML = "<em>Nema skinutih elemenata.</em>";
    return;
  }

  recentRemoved.forEach((item, idx) => {
    const wrap = document.createElement("div");
    wrap.className = "recent-item";

    if (item.type === "image") {
      const temp = document.createElement("div");
      temp.innerHTML = item.html;
      const img = temp.querySelector("img");
      if (img) {
        const preview = document.createElement("img");
        preview.src = img.src;
        wrap.appendChild(preview);
      }
    } else {
      const text = document.createElement("div");
      text.textContent =
        (item.type === "note" ? "Bilješka: " : "Citat: ") +
        truncate(stripHTML(item.html), 40);
      wrap.appendChild(text);
    }

    const btn = document.createElement("button");
    btn.textContent = "Vrati";
    btn.className = "restore-btn";
    btn.addEventListener("click", () => restoreRecent(idx));
    wrap.appendChild(btn);

    recentContainer.appendChild(wrap);
  });
}

function stripHTML(html) {
  const d = document.createElement("div");
  d.innerHTML = html;
  return d.textContent || "";
}

function truncate(t, l) {
  return t.length > l ? t.slice(0, l - 3) + "..." : t;
}

function restoreRecent(index) {
  const item = recentRemoved[index];
  if (!item) return;

  const el = createElementFromData(item);
  el.style.left = Math.random() * 120 + "px";
  el.style.top = Math.random() * 90 + "px";
  board.appendChild(el);

  recentRemoved.splice(index, 1);
  localStorage.setItem(RECENT_KEY, JSON.stringify(recentRemoved));
  renderRecent();
  saveBoard(true);
}

function loadBoard() {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) return;
  JSON.parse(data).forEach((item) =>
    board.appendChild(createElementFromData(item))
  );
}

function loadRecent() {
  const data = localStorage.getItem(RECENT_KEY);
  if (!data) return;
  try {
    recentRemoved = JSON.parse(data);
  } catch {
    recentRemoved = [];
  }
  renderRecent();
}

loadBoard();
loadRecent();

clearRecentBtn?.addEventListener("click", () => {
  if (confirm("Očistiti sve skinute pinove?")) {
    recentRemoved = [];
    localStorage.setItem(RECENT_KEY, JSON.stringify(recentRemoved));
    renderRecent();
  }
});
