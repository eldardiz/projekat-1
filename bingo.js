// Bingo igra za IPI Student Fun Zone

const BINGO_SIZE = 5;
const FREE_TEXT = "BESPLATNO POLJE";

const statements = [
  "Dolazi na vježbe prije početka časa.",
  "Voli raditi projekte u timu.",
  "Koristi tamni način rada (dark mode).",
  "Najdraži predmet mu je iz IT oblasti.",
  "Pije kafu prije predavanja.",
  "Koristi VS Code za programiranje.",
  "Voli HTML i CSS.",
  "Zanima ga frontend development.",
  "Sluša muziku dok uči.",
  "Voli rješavati logičke zadatke.",
  "Često koristi online kurseve za učenje.",
  "Radi projekte i van fakulteta.",
  "Voli JavaScript.",
  "Redovno provjerava e-mail sa faksa.",
  "Voli raditi dizajn web stranica.",
  "Prijavio se na barem jedan dodatni kurs.",
  "Ima omiljenu tipkovničku prečicu.",
  "Radi projekte kasno navečer.",
  "Radije uči uz video materijale.",
  "Voli raditi u timu od troje ljudi.",
  "Ima GitHub profil.",
  "Koristi barem jedan Linux distro.",
  "Prati tech YouTube kanale.",
  "Ne voli prezentirati pred velikom grupom.",
  "Voli raditi s podacima u Excelu.",
  "Ima ideju za vlastiti startup.",
  "Prati IT vijesti.",
  "Voli raditi wireframe u bilježnici.",
  "Ima spremljen folder sa korisnim kod primjerima.",
  "Pokušao je napraviti vlastiti portfolio sajt.",
];

const boardEl = document.getElementById("bingoBoard");
const generateBtn = document.getElementById("generateCardBtn");
const resetMarksBtn = document.getElementById("resetMarksBtn");
const exportBtn = document.getElementById("exportPdfBtn");
const statusEl = document.getElementById("bingoStatus");
const overlay = document.getElementById("bingoOverlay");
const bingoCloseBtn = document.getElementById("bingoCloseBtn");
const bingoNewGameBtn = document.getElementById("bingoNewGameBtn");
const bingoResetBtn = document.getElementById("bingoResetBtn");
const bingoPrintBtn = document.getElementById("bingoPrintBtn");

let winShown = false;

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

function generateCard() {
  statusEl.textContent = "";
  statusEl.classList.remove("win");
  winShown = false;
  const pool = shuffle(statements);
  const needed = BINGO_SIZE * BINGO_SIZE - 1; // minus free center
  const chosen = pool.slice(0, needed);

  const cells = [];
  let idx = 0;

  for (let r = 0; r < BINGO_SIZE; r++) {
    const row = [];
    for (let c = 0; c < BINGO_SIZE; c++) {
      if (r === 2 && c === 2) {
        row.push({ text: FREE_TEXT, free: true, marked: true });
      } else {
        row.push({ text: chosen[idx++], free: false, marked: false });
      }
    }
    cells.push(row);
  }

  renderBoard(cells);
}

function renderBoard(cells) {
  boardEl.innerHTML = "";
  cells.forEach((row, r) => {
    const tr = document.createElement("tr");
    row.forEach((cell, c) => {
      const td = document.createElement("td");
      td.textContent = cell.text;
      td.dataset.row = r;
      td.dataset.col = c;
      td.className = "bingo-cell" + (cell.free ? " free marked" : "");
      td.addEventListener("click", () => {
        td.classList.toggle("marked");
        checkWin();
      });
      tr.appendChild(td);
    });
    boardEl.appendChild(tr);
  });
}

function checkWin() {
  const cells = Array.from(boardEl.querySelectorAll("td"));
  const grid = Array.from({ length: BINGO_SIZE }, () =>
    Array(BINGO_SIZE).fill(false)
  );

  cells.forEach((td) => {
    const r = +td.dataset.row;
    const c = +td.dataset.col;
    if (td.classList.contains("marked")) grid[r][c] = true;
  });

  // rows
  for (let r = 0; r < BINGO_SIZE; r++) {
    if (grid[r].every((v) => v)) {
      return declareWin("Red " + (r + 1));
    }
  }

  // cols
  for (let c = 0; c < BINGO_SIZE; c++) {
    let colOk = true;
    for (let r = 0; r < BINGO_SIZE; r++) {
      if (!grid[r][c]) {
        colOk = false;
        break;
      }
    }
    if (colOk) {
      return declareWin("Kolona " + (c + 1));
    }
  }

  // diag TL-BR
  if (
    Array.from({ length: BINGO_SIZE }, (_, i) => grid[i][i]).every((v) => v)
  ) {
    return declareWin("Dijagonala 1");
  }

  // diag TR-BL
  if (
    Array.from(
      { length: BINGO_SIZE },
      (_, i) => grid[i][BINGO_SIZE - 1 - i]
    ).every((v) => v)
  ) {
    return declareWin("Dijagonala 2");
  }
}

function declareWin(type) {
  if (winShown) return;
  winShown = true;
  statusEl.textContent = "Bingo! " + type + " je kompletiran.";
  statusEl.classList.add("win");
  showOverlay(type);
}

function showOverlay(type) {
  overlay.classList.add("visible");
  const msgEl = document.getElementById("bingoWinMsg");
  if (msgEl) {
    msgEl.innerHTML = `Čestitamo – osvojio si <strong>${type}</strong>!`;
  }

  spawnConfettiDots(40);
  bingoNewGameBtn && bingoNewGameBtn.focus();
}

function hideOverlay() {
  overlay.classList.remove("visible");
}

function spawnConfettiDots(count) {
  const card = overlay.querySelector(".modal-card");
  if (!card) return;
  const cardRect = card.getBoundingClientRect();
  const width = cardRect.width;
  const height = cardRect.height;

  for (let i = 0; i < count; i++) {
    const dot = document.createElement("div");
    dot.className = "confetti-dot";
    const size = 8 + Math.random() * 14;
    dot.style.width = size + "px";
    dot.style.height = size + "px";

    const left = Math.random() * (width - size);
    const top = Math.random() * (height * 0.6);

    dot.style.left = left + "px";
    dot.style.top = top + "px";

    const colors = ["#1d4ed8", "#3b82f6", "#f97316", "#22c55e", "#eab308"];
    dot.style.background = colors[Math.floor(Math.random() * colors.length)];

    card.appendChild(dot);
    dot.style.animationDuration = (3.2 + Math.random() * 2).toFixed(2) + "s";
    setTimeout(() => dot.remove(), 5200);
  }
}

function resetMarks() {
  statusEl.textContent = "";
  statusEl.classList.remove("win");
  winShown = false;
  boardEl
    .querySelectorAll("td:not(.free)")
    .forEach((td) => td.classList.remove("marked"));
  boardEl.querySelector("td.free")?.classList.add("marked");
}

function exportPdf() {
  // jednostavno: print → korisnik bira "Save as PDF"
  window.print();
}

// event listeneri
generateBtn.addEventListener("click", () => {
  generateCard();
  //winShown = false;
  hideOverlay();
});

resetMarksBtn.addEventListener("click", resetMarks);
exportBtn.addEventListener("click", exportPdf);

bingoCloseBtn && bingoCloseBtn.addEventListener("click", hideOverlay);

bingoNewGameBtn &&
  bingoNewGameBtn.addEventListener("click", () => {
    generateCard();
    hideOverlay();
  });

bingoResetBtn &&
  bingoResetBtn.addEventListener("click", () => {
    resetMarks();
    hideOverlay();
  });

// inicijalno generisanje
generateCard();

if (bingoPrintBtn) {
  bingoPrintBtn.addEventListener("click", () => {
    hideOverlay(); // zatvori popup
    exportPdf(); // pokreni print → PDF
  });
}
