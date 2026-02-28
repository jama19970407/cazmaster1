let lastBettingTime = 0;
let tokenIndex = 0;

const tokens = [
  "demo",
  "demo",
  "demo"
];

function getAuthorizationToken() {
  const token = tokens[tokenIndex];
  tokenIndex = (tokenIndex + 1) % tokens.length;
  return `Bearer ${token}`;
}

function getRan(min, max) {
  return Math.random() * (max - min) + min;
}

async function checkSignal() {
  let randomNumber1 = getRan(1.1, 5.0).toFixed(2);
  const url = 'https://crash-gateway-cr.100hp.app/state?id_n=1play_luckyjet';

  const response = await fetch(url, {
    headers: { 'Authorization': getAuthorizationToken() }
  });

  const data = await response.json();
  const state = data.current_state;

  const responseText = document.getElementById('responseText');
  if (!responseText) {
    console.error('Element with ID responseText not found.');
    return;
  }

  if (state === "betting" && Date.now() - lastBettingTime > 5000) {
    const resultText = `${randomNumber1}x`;
    responseText.textContent = resultText;
    localStorage.setItem('resultText', resultText);
    responseText.className = 'text betting';
    lastBettingTime = Date.now();
  } else if (state === "ending") {
    responseText.textContent = "Waiting..";
    responseText.className = 'text fly';
  }
}

function fetchDataAndUpdate() {
  const url = 'https://crash-gateway-cr.100hp.app/state?id_n=1play_luckyjet';

  fetch(url, {
    headers: { 'Authorization': getAuthorizationToken() }
  })
    .then(response => response.json())
    .then(data => {
      const kef = parseFloat(data.current_coefficients);
      updateCoefficients(kef);
    })
    .catch(error => console.error('Error fetching data:', error));
}

function updateCoefficients(coefficients) {
  const coefficientsDiv = document.getElementById('coefficients');
  if (!coefficientsDiv) return;

  if (coefficients !== 1) {
    coefficientsDiv.innerText = `x${coefficients}`;
    coefficientsDiv.classList.remove('smallt');
    coefficientsDiv.classList.add('kif');
  }
}

function fadeIn() {
  const preloader = document.querySelector(".preloader");
  if (!preloader) return;

  setTimeout(() => {
    preloader.classList.add("hidden");
    preloader.style.display = "none";
    document.body.classList.remove("hidden");
    document.body.classList.add("fade-in");
  }, 1700);
}

// === USER INPUT -> COEFFICIENT (kiritgan son bo'yicha) ===
function submitNumber() {
  const input = document.getElementById('userNumber');
  const resultEl = document.getElementById('result');

  if (!input || !resultEl) return;

  const v = Number(input.value);

  if (!Number.isFinite(v)) {
    resultEl.textContent = "Son kiriting!";
    return;
  }

  // 1.00x .. 10.00x
  const coeff = (1 + (Math.abs(v) % 900) / 100).toFixed(2);
  resultEl.textContent = `Koeffitsient: ${coeff}x`;
}

document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('userNumber');
  if (!input) return;

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') submitNumber();
  });
});

// init
fetchDataAndUpdate();
setInterval(fetchDataAndUpdate, 100);

fadeIn();

setInterval(checkSignal, 100);
checkSignal();
