//Using the DOM for all the buttons and display 
const display = document.getElementById('display');
const themeBtn = document.getElementById('theme-btn');
const buttons = document.querySelectorAll('.num-btn, .op-btn');
const clearHistoryBtn = document.getElementById('clear-history-btn');
const historyList = document.getElementById('history-list');

let history = [];

// For on screen buttons
buttons.forEach(button => {
    button.addEventListener('click', () => {
        const value = button.textContent;

        if (button.id === 'clear-btn') {
            display.value = '';
        } else if (button.id === 'backspace-btn') {
            backspace();
        } else if (button.id === 'equals-btn') {
            calculate();
        } else {
            // if we had error before and now typing again
            if (display.value === 'Error') {
                display.value = '';
            }
            display.value += value;
        }
    });
});

// Backspace function
function backspace() {
    if (display.value === 'Error') {
        display.value = '';
    } else {
        display.value = display.value.slice(0, -1);
    }
}

// Calculate the current formula
function calculate() {
    try {
        let originalFormula = display.value;
        if (!originalFormula || originalFormula === 'Error') return;

        let formula = originalFormula;

        // Map display symbols (×, ÷) to JavaScript operators (*, /)
        formula = formula.replace(/×/g, '*').replace(/÷/g, '/');

        let result = eval(formula);

        // for the division by zero edge case
        if (result === Infinity || result === -Infinity || isNaN(result)) {
            display.value = 'Error';
            addToHistory(originalFormula, 'Error');
        } else {
            // Keep float decimals nice
            if (!Number.isInteger(result)) {
                result = parseFloat(result.toFixed(10));
            }
            display.value = result;
            addToHistory(originalFormula, result);
        }
    } catch {
        display.value = 'Error';
    }
}

// History functions
function updateHistoryUI() {
    historyList.innerHTML = '';
    if (history.length === 0) {
        historyList.innerHTML = '<li class="history-empty">No history yet</li>';
        return;
    }
    history.forEach((item) => {
        const li = document.createElement('li');
        li.className = 'history-item';
        li.innerHTML = `
            <span class="history-formula">${item.formula}</span>
            <span class="history-result">${item.result}</span>
        `;
        li.addEventListener('click', () => {
            if (item.result !== 'Error') {
                display.value = item.result;
            }
        });
        historyList.appendChild(li);
    });
}

function addToHistory(formula, result) {
    if (!formula || formula === result) return;
    history.push({ formula, result });
    if (history.length > 50) {
        history.shift();
    }
    updateHistoryUI();
}

clearHistoryBtn.addEventListener('click', () => {
    history = [];
    updateHistoryUI();
});

// light and dark switch
themeBtn.addEventListener('click', () => {
    const isLight = document.body.classList.toggle('light-theme');
    themeBtn.textContent = isLight ? '☀️ Light Mode' : '🌙 Dark Mode';
});

// Keyboard support
document.addEventListener('keydown', (event) => {
    const key = event.key;

    if (key >= '0' && key <= '9') {
        if (display.value === 'Error') display.value = '';
        display.value += key;
    } else if (key === '.') {
        if (display.value === 'Error') display.value = '';
        display.value += key;
    } else if (key === '+') {
        if (display.value === 'Error') display.value = '';
        display.value += '+';
    } else if (key === '-') {
        if (display.value === 'Error') display.value = '';
        display.value += '-';
    } else if (key === '*') {
        if (display.value === 'Error') display.value = '';
        display.value += '×';
    } else if (key === '/') {
        event.preventDefault(); // Prevent default browser search/find bar
        if (display.value === 'Error') display.value = '';
        display.value += '÷';
    } else if (key === 'Enter' || key === '=') {
        event.preventDefault();
        calculate();
    } else if (key === 'Backspace') {
        backspace();
    } else if (key === 'Escape' || key.toLowerCase() === 'c' || key === 'Delete') {
        display.value = '';
    }
});
