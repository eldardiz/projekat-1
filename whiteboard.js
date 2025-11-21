// Interaktivni Whiteboard – IPI Student Fun Zone

const canvas = document.getElementById("board");
const ctx = canvas.getContext("2d");

const colorPicker = document.getElementById("colorPicker");
const brushSize = document.getElementById("brushSize");
const clearBtn = document.getElementById("clearBtn");
const saveBtn = document.getElementById("saveBtn");
const eraserBtn = document.getElementById("eraserBtn");
const exportPdfBtn = document.getElementById("exportPdfBtn");
const sendMailBtn = document.getElementById("sendMailBtn");

const mailPopup = document.getElementById("mailPopup");
const mailCloseBtn = document.getElementById("mailCloseBtn");
const mailCancelBtn = document.getElementById("mailCancelBtn");
const mailSendBtn = document.getElementById("mailSendBtn");
const recipientEmail = document.getElementById("recipientEmail");
const recipientError = document.getElementById("recipientError");

let drawing = false;
let currentColor = colorPicker.value;
let isErasing = false;

// --- CRTANJE ---
function startDraw(e) {
  drawing = true;
  draw(e);
}

function endDraw() {
  drawing = false;
  ctx.beginPath();
}

function draw(e) {
  if (!drawing) return;

  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;

  const clientX = e.clientX || (e.touches && e.touches[0].clientX);
  const clientY = e.clientY || (e.touches && e.touches[0].clientY);

  const x = (clientX - rect.left) * scaleX;
  const y = (clientY - rect.top) * scaleY;

  ctx.lineWidth = brushSize.value;
  ctx.lineCap = "round";
  ctx.strokeStyle = isErasing ? "#FFFFFF" : currentColor;

  ctx.lineTo(x, y);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x, y);
}

// mouse events
canvas.addEventListener("mousedown", startDraw);
canvas.addEventListener("mouseup", endDraw);
canvas.addEventListener("mousemove", draw);

// touch events
canvas.addEventListener("touchstart", startDraw);
canvas.addEventListener("touchmove", (e) => {
  draw(e);
  e.preventDefault();
});
canvas.addEventListener("touchend", endDraw);

// --- TOOLBAR ---
colorPicker.addEventListener("input", () => {
  currentColor = colorPicker.value;
  isErasing = false;
  eraserBtn.textContent = "Briši";
});

eraserBtn.addEventListener("click", () => {
  isErasing = !isErasing;
  eraserBtn.textContent = isErasing ? "Crtaj" : "Briši";
});

clearBtn.addEventListener("click", () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawWatermark();
});

saveBtn.addEventListener("click", () => {
  const image = canvas.toDataURL("image/png");
  const link = document.createElement("a");
  link.href = image;
  link.download = "whiteboard_crtez.png";
  link.click();
});

// --- PDF PRINT ---
exportPdfBtn.addEventListener("click", () => {
  window.print();
});

// --- MAIL POPUP ---
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

mailSendBtn.addEventListener("click", () => {
  const email = recipientEmail.value.trim();
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  if (!emailValid) {
    recipientError.style.display = "block";
    recipientEmail.style.borderColor = "#dc2626";
    return;
  }

  const bodyText =
    "Pozdrav,\n\n" +
    "U prilogu/uz ovu poruku šaljem sadržaj Whiteboard aktivnosti sa IPI Student Fun Zone.\n" +
    "Ako želiš uključiti crtež, prvo klikni 'Snimi sliku' pa je dodaj kao prilog u email klijentu.\n\n" +
    "Lijep pozdrav!";

  const mailtoLink =
    "mailto:" +
    encodeURIComponent(email) +
    "?subject=" +
    encodeURIComponent("IPI Whiteboard – Student Fun Zone") +
    "&body=" +
    encodeURIComponent(bodyText);

  window.location.href = mailtoLink;
  closeMailPopup();
});

// --- watermark logo u pozadini ---
function drawWatermark() {
  const img = new Image();
  img.src = "slike/logo-ipi.png";
  img.onload = () => {
    const logoWidth = 180;
    const logoHeight = (img.height / img.width) * logoWidth;
    const x = (canvas.width - logoWidth) / 2;
    const y = (canvas.height - logoHeight) / 2;

    ctx.save();
    ctx.globalAlpha = 0.08;
    ctx.drawImage(img, x, y, logoWidth, logoHeight);
    ctx.restore();
  };
}
drawWatermark();
