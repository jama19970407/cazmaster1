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
        headers: {
            'Authorization': getAuthorizationToken()
        }
    });
    const data = await response.json();
    const state = data.current_state;


    let responseText = document.getElementById('responseText');
    if (!responseText) {
        console.error('Element with ID responseText not found.');
        return;
    }

    if (state === "betting" && Date.now() - lastBettingTime > 5000) {
        let resultText = `${randomNumber1}x`;
        document.getElementById("responseText").textContent = resultText;
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
        headers: {
            'Authorization': getAuthorizationToken()
        }
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
    

    if (coefficients !== 1) {
        coefficientsDiv.innerText = `x${coefficients}`; 
        coefficientsDiv.classList.remove('smallt');
        coefficientsDiv.classList.add('kif');
        
        
        
    } 
}
function fadeIn() {
    const preloader = document.querySelector(".preloader")
    setTimeout(() => {
      preloader.classList.add("hidden")
      preloader.style.display = "none"
      document.body.classList.remove("hidden")
      document.body.classList.add("fade-in")
    }, 1700)
  }

fetchDataAndUpdate();
setInterval(fetchDataAndUpdate, 100);
fadeIn();
let intervalId = setInterval(checkSignal, 100);
checkSignal();

// Generate realistic coefficient based on real game statistics
function generateRealisticCoefficient() {
    const random = Math.random() * 100;
    
    if (random < 60) {
        // 60% chance: 1.0x - 2.0x (most common)
        return (Math.random() * (2.0 - 1.01) + 1.01).toFixed(2);
    } else if (random < 85) {
        // 25% chance: 2.0x - 5.0x (common)
        return (Math.random() * (5.0 - 2.0) + 2.0).toFixed(2);
    } else if (random < 95) {
        // 10% chance: 5.0x - 10.0x (rare)
        return (Math.random() * (10.0 - 5.0) + 5.0).toFixed(2);
    } else {
        // 5% chance: 10.0x - 100.0x (very rare)
        return (Math.random() * (100.0 - 10.0) + 10.0).toFixed(2);
    }
}

// Generate predictions for multiple rounds
document.getElementById('calculateBtn').addEventListener('click', function() {
    const roundsCount = parseInt(document.getElementById('roundsCount').value);
    
    if (!roundsCount || roundsCount <= 0) {
        alert('Iltimos, raundlar sonini kiriting!');
        return;
    }
    
    if (roundsCount > 20) {
        alert('Maksimal 20 ta raund uchun prognoz olishingiz mumkin!');
        return;
    }
      // Generate predictions with realistic distribution
    const predictions = [];
    for (let i = 1; i <= roundsCount; i++) {
        const coefficient = generateRealisticCoefficient();
        predictions.push({
            round: i,
            coefficient: coefficient
        });
    }
    
    // Display predictions
    const container = document.getElementById('predictionsContainer');
    container.innerHTML = ''; // Clear previous results
    
    predictions.forEach(pred => {
        const item = document.createElement('div');
        item.className = 'prediction-item';
        item.innerHTML = `
            <span class="prediction-round">Raund ${pred.round}:</span>
            <span class="prediction-coefficient">x${pred.coefficient}</span>
        `;
        container.appendChild(item);
    });
    
    // Show container with animation
    container.classList.add('show');
    
    // Update main display with first prediction
    const firstPrediction = predictions[0];
    const coefficientsDiv = document.getElementById('coefficients');
    coefficientsDiv.innerText = `x${firstPrediction.coefficient}`;
    coefficientsDiv.classList.remove('smallt');
    coefficientsDiv.classList.add('kif');
    
    const responseText = document.getElementById('responseText');
    responseText.textContent = `${firstPrediction.coefficient}x`;
    responseText.className = 'text betting';
    
    // Store in localStorage
    localStorage.setItem('predictions', JSON.stringify(predictions));
    localStorage.setItem('roundsCount', roundsCount);
});
