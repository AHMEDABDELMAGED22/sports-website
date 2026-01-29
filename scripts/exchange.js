const exchangeApiKey = 'a239ee9cbb16ec33ee530cb2'; // ExchangeRate-API Key

const fromCurrency = document.getElementById('fromCurrency');
const toCurrency = document.getElementById('toCurrency');
const amountInput = document.getElementById('amount');
const convertBtn = document.getElementById('convertBtn');
const swapBtn = document.getElementById('swapBtn');
const resultValue = document.getElementById('resultValue');
const conversionResult = document.getElementById('conversionResult');
const popularRatesGrid = document.getElementById('popularRates');
const fromFlag = document.getElementById('fromFlag');
const toFlag = document.getElementById('toFlag');

// Currency Code to Country Code Map for Flags
const countryCodes = {
    'USD': 'us',
    'EUR': 'eu',
    'GBP': 'gb',
    'SAR': 'sa',
    'EGP': 'eg',
    'AED': 'ae',
    'KWD': 'kw',
    'JPY': 'jp',
    'CAD': 'ca',
    'AUD': 'au'
};

// Update Flags on selection change
fromCurrency.addEventListener('change', () => updateFlag(fromCurrency, fromFlag));
toCurrency.addEventListener('change', () => updateFlag(toCurrency, toFlag));

function updateFlag(select, img) {
    const code = countryCodes[select.value] || 'unknown';
    img.src = `https://flagcdn.com/w40/${code}.png`;
}

// Convert Function
async function convertCurrency() {
    const from = fromCurrency.value;
    const to = toCurrency.value;
    const amount = amountInput.value;

    if (amount <= 0) {
        alert("Please enter a valid amount");
        return;
    }

    resultValue.innerText = "Loading...";

    try {
        const response = await fetch(`https://v6.exchangerate-api.com/v6/${exchangeApiKey}/latest/${from}`);
        const data = await response.json();

        if (data.result === 'success') {
            const rate = data.conversion_rates[to];
            const result = (amount * rate).toFixed(2);

            resultValue.innerText = `${result} ${to}`;
            conversionResult.innerText = `1 ${from} = ${rate.toFixed(4)} ${to}`;
        } else {
            resultValue.innerText = "Error";
        }
    } catch (error) {
        console.error("Exchange Error:", error);
        resultValue.innerText = "Error";
    }
}

// Event Listeners
convertBtn.addEventListener('click', convertCurrency);

swapBtn.addEventListener('click', () => {
    const temp = fromCurrency.value;
    fromCurrency.value = toCurrency.value;
    toCurrency.value = temp;

    updateFlag(fromCurrency, fromFlag);
    updateFlag(toCurrency, toFlag);
    convertCurrency();
});

// Fetch Popular Rates (Base USD)
async function fetchPopularRates() {
    try {
        const response = await fetch(`https://v6.exchangerate-api.com/v6/${exchangeApiKey}/latest/USD`);
        const data = await response.json();

        if (data.result === 'success') {
            const targets = ['EUR', 'GBP', 'SAR', 'AED', 'EGP', 'KWD'];
            popularRatesGrid.innerHTML = '';

            targets.forEach(currency => {
                const rate = data.conversion_rates[currency];
                const countryCode = countryCodes[currency];

                const card = document.createElement('div');
                card.className = 'rate-card';
                card.innerHTML = `
                    <div class="rate-header">
                        <img src="https://flagcdn.com/w40/${countryCode}.png" class="rate-flag" alt="${currency}">
                        <span>USD to ${currency}</span>
                    </div>
                    <div class="rate-value">${rate.toFixed(2)}</div>
                `;
                popularRatesGrid.appendChild(card);
            });
        }
    } catch (error) {
        popularRatesGrid.innerHTML = '<p style="color:red">Failed to load rates</p>';
    }
}

// Initialize
window.addEventListener('DOMContentLoaded', () => {
    convertCurrency(); // Initial conversion
    fetchPopularRates();
});
