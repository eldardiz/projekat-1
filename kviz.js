const quizContainer = document.getElementById("quizRoot");
const checkBtn = document.getElementById("checkAnswersBtn");
const resultBox = document.getElementById("quizResult");
const restartBtn = document.getElementById("restartQuizBtn");
const perfectOverlay = document.getElementById("quizPerfectOverlay");
const quizCloseBtn = document.getElementById("quizCloseBtn");
const quizRestartBtn = document.getElementById("quizRestartBtn");

let perfectShown = false;

// MAPA TAČNIH ODGOVORA (MORA ODGOVARATI value atributima u HTML-u)
const answers = {
  q1: ["Stilizuje izgled stranice"],
  q2: ["HTML", "CSS", "JavaScript"],
  q3: ["<h1>"],
  q4: ["Redovan commit na GitHub", "Pisati README dokumentaciju"],
  q5: ["Sajt se prilagođava različitim veličinama ekrana"],
};

function normalize(str) {
  if (!str) return "";
  return str
    .replace(/\s+/g, " ")
    .replace(/=\s+/g, "=")
    .replace(/\\+/g, "")
    .trim();
}

function collectUserAnswers() {
  const user = {};
  Object.keys(answers).forEach((qid) => {
    const inputs = document.querySelectorAll(`[name="${qid}"]`);
    user[qid] = [];
    inputs.forEach((inp) => {
      if (inp.checked) {
        user[qid].push(inp.value);
      }
    });
  });
  return user;
}

function grade() {
  const user = collectUserAnswers();
  let total = 0;
  const max = Object.keys(answers).length;

  Object.keys(answers).forEach((qid) => {
    const correctSet = new Set(answers[qid]);
    const userSet = new Set(user[qid]);

    const allCorrectSelected = answers[qid]
      .map(normalize)
      .every((a) => Array.from(userSet).some((u) => normalize(u) === a));

    const noIncorrect = Array.from(userSet).every((a) =>
      Array.from(correctSet).map(normalize).includes(normalize(a))
    );

    if (allCorrectSelected && noIncorrect) {
      total++;
      markQuestion(qid, true);
    } else {
      markQuestion(qid, false);
    }
  });

  showResult(total, max);
}

function markQuestion(qid, ok) {
  const block = document.getElementById(`${qid}_block`);
  if (!block) return;
  block.classList.remove("correct", "incorrect");
  block.classList.add(ok ? "correct" : "incorrect");
}

function showResult(score, max) {
  resultBox.innerHTML = `Rezultat: <strong>${score}</strong> / ${max}`;
  resultBox.classList.add("visible");
  restartBtn.style.display = "inline-block";

  if (score === max && !perfectShown) {
    perfectShown = true;
    showPerfectOverlay();
  }
}

function restart() {
  // očisti selekcije
  document
    .querySelectorAll("input[type=radio], input[type=checkbox]")
    .forEach((inp) => (inp.checked = false));

  // ukloni markere
  document
    .querySelectorAll(".correct, .incorrect")
    .forEach((el) => el.classList.remove("correct", "incorrect"));

  resultBox.textContent = "";
  resultBox.classList.remove("visible");
  restartBtn.style.display = "none";

  window.scrollTo({ top: 0, behavior: "smooth" });
  perfectShown = false;
  hidePerfectOverlay();
}

function showPerfectOverlay() {
  perfectOverlay?.classList.add("visible");
  quizRestartBtn?.focus();
}

function hidePerfectOverlay() {
  perfectOverlay?.classList.remove("visible");
}

// Event listeneri
checkBtn?.addEventListener("click", (e) => {
  e.preventDefault();
  grade();
});

restartBtn?.addEventListener("click", restart);

quizCloseBtn?.addEventListener("click", hidePerfectOverlay);

quizRestartBtn?.addEventListener("click", () => {
  restart();
});
