//Using the DOM for all the buttons and display 
const display = document.getElementById('display');
const themeBtn = document.getElementById('theme-btn');
const buttons = document.querySelectorAll('.num-btn, .op-btn');

// For on screen buttons
buttons.forEach(button => {
    button.addEventListener('click', () => {
        const value = button.textContent;

        if (button.id === 'clear-btn') {
            display.value = '';
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

// Calculate the current formula
function calculate() {
    try {
        let formula = display.value;

        // Map display symbols (×, ÷) to JavaScript operators (*, /)
        formula = formula.replace(/×/g, '*').replace(/÷/g, '/');

        display.value = eval(formula);
        const result = eval(formula);
        // for the division by zero edge casee
        if (result === Infinity || result === -Infinity || isNaN(result)) {
            display.value = 'Error';
        } else {
            display.value = result;
        }
    } catch {
        display.value = 'Error';
    }
}


// light and dark switch
themeBtn.addEventListener('click', () => {
    const isLight = document.body.classList.toggle('light-theme');
    themeBtn.textContent = isLight ? '☀️ Light Mode' : '🌙 Dark Mode';
});


