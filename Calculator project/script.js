document.addEventListener('DOMContentLoaded', () => {
    const converterGrid = document.querySelector('.converter-grid');
    const converterPanel = document.querySelector('.converter-panel');
    const backBtn = document.querySelector('.back-btn');
    const converterTitle = document.querySelector('.converter-title');
    const fromValue = document.getElementById('fromValue');
    const toValue = document.getElementById('toValue');
    const fromUnit = document.getElementById('fromUnit');
    const toUnit = document.getElementById('toUnit');


    const tabBtns = document.querySelectorAll('.tab-btn');
    const calculatorSection = document.getElementById('calculatorSection');
    const converterSection = document.getElementById('converterSection');
    const historySection = document.getElementById('historySection');
    const historyList = document.getElementById('historyList');
    const clearHistoryBtn = document.getElementById('clearHistoryBtn');
    const display = document.getElementById('display');

    const calculatorButtons = document.querySelector('.calculator-buttons');
    
    // Conversion units for different types
    const units = {
        length: ['Meters', 'Kilometers', 'Miles', 'Feet', 'Inches'],
        mass: ['Kilograms', 'Grams', 'Pounds', 'Ounces'],
        temperature: ['Celsius', 'Fahrenheit', 'Kelvin'],
        date: ['Date Difference'],
        // Add more unit types as needed
    };

    // Conversion functions
    const conversions = {
        length: {
            Meters: {
                Kilometers: (value) => value / 1000,
                Miles: (value) => value / 1609.344,
                Feet: (value) => value * 3.28084,
                Inches: (value) => value * 39.3701
            },

        // Add more conversion functions as needed
        },
        temperature: {
            Celsius: {
                Fahrenheit: (value) => (value * 9/5) + 32,
                Kelvin: (value) => value + 273.15
            },
            Fahrenheit: {
                Celsius: (value) => (value - 32) * 5/9,
                Kelvin: (value) => (value - 32) * 5/9 + 273.15
            },
            Kelvin: {
                Celsius: (value) => value - 273.15,
                Fahrenheit: (value) => (value - 273.15) * 9/5 + 32
            }
        },
        date: {
            'Date Difference': {
                calculate: function(fromDate, toDate) {
                    const start = new Date(fromDate);
                    const end = new Date(toDate);
                    
                    const yearDiff = end.getFullYear() - start.getFullYear();
                    const monthDiff = end.getMonth() - start.getMonth();
                    const dayDiff = end.getDate() - start.getDate();
                    
                    let months = monthDiff + yearDiff * 12;
                    let years = Math.floor(months / 12);
                    months = months % 12;
                    
                    if (dayDiff < 0) {
                        months--;
                        const tempDate = new Date(end.getFullYear(), end.getMonth() - 1, start.getDate());
                        const daysInMonth = new Date(tempDate.getFullYear(), tempDate.getMonth() + 1, 0).getDate();
                        const adjustedDays = daysInMonth - start.getDate() + end.getDate();
                        return {
                            years: years,
                            months: months >= 0 ? months : 11,
                            days: adjustedDays
                        };
                    }
                    
                    return {
                        years: years,
                        months: months,
                        days: dayDiff
                    };
                }
            }
        }
    };

// Example integration with the calculator
function handleOperator(nextOperator) {
    const inputValue = parseFloat(display.value);
    const currentExpression = display.value;

    if (operator && waitingForSecondOperand) {
        operator = nextOperator;
        return;
    }

    if (firstOperand === null) {
        firstOperand = inputValue;
    } else if (operator) {
        const result = performCalculation[operator](firstOperand, inputValue);
        display.value = String(result);
        firstOperand = result;

        // Save the result to history after calculation
        updateHistory(currentExpression + ' ' + operator + ' ' + inputValue, result);
    }

    waitingForSecondOperand = true;
    operator = nextOperator;
}


    
    converterGrid.addEventListener('click', (e) => {
        const item = e.target.closest('.converter-item');
        if (!item) return;

        const type = item.dataset.type;
        converterGrid.style.display = 'none';
        converterPanel.classList.remove('hidden');
        converterTitle.textContent = item.querySelector('p').textContent;

        if (type === 'date') {
            // Create date difference calculator UI
            converterPanel.innerHTML = `
                <button class="back-btn">
                    <span class="material-icons">arrow_back</span>
                </button>
                <h2 class="converter-title">Date</h2>
                <div class="date-calculator">
                    <div class="input-group">
                        <label>From</label>
                        <input type="date" id="fromDate" value="${new Date().toISOString().split('T')[0]}">
                    </div>
                    <div class="input-group">
                        <label>To</label>
                        <input type="date" id="toDate" value="${new Date().toISOString().split('T')[0]}">
                    </div>
                    <div class="date-difference">
                        <h3>Difference</h3>
                        <div class="difference-grid">
                            <div class="difference-item">
                                <span id="yearDiff">0</span>
                                <label>Years</label>
                            </div>
                            <div class="difference-item">
                                <span id="monthDiff">0</span>
                                <label>Months</label>
                            </div>
                            <div class="difference-item">
                                <span id="dayDiff">0</span>
                                <label>Days</label>
                            </div>
                        </div>
                        <div class="date-summary">
                            <div class="summary-item">
                                <label>From</label>
                                <span id="fromDateSummary"></span>
                            </div>
                            <div class="summary-item">
                                <label>To</label>
                                <span id="toDateSummary"></span>
                            </div>
                        </div>
                    </div>
                </div>
            `;

            // Add event listeners for date inputs
            
            const fromDate = document.getElementById('fromDate');
            const toDate = document.getElementById('toDate');
            const yearDiff = document.getElementById('yearDiff');
            const monthDiff = document.getElementById('monthDiff');
            const dayDiff = document.getElementById('dayDiff');
            const fromDateSummary = document.getElementById('fromDateSummary');
            const toDateSummary = document.getElementById('toDateSummary');
            
            function updateDateDifference() {
                const diff = conversions.date['Date Difference'].calculate(fromDate.value, toDate.value);
                yearDiff.textContent = diff.years;
                monthDiff.textContent = diff.months;
                dayDiff.textContent = diff.days;
                
                fromDateSummary.textContent = new Date(fromDate.value).toLocaleDateString();
                toDateSummary.textContent = new Date(toDate.value).toLocaleDateString();
            }

            fromDate.addEventListener('change', updateDateDifference);
            toDate.addEventListener('change', updateDateDifference);
            
            // Initialize the date difference
            updateDateDifference();
            
            // Update back button functionality
            const newBackBtn = document.querySelector('.back-btn');
            newBackBtn.addEventListener('click', () => {
                converterGrid.style.display = 'grid';
                converterPanel.classList.add('hidden');
            });
            
            return; // Skip the regular unit population
        }

        // Clear previous options
        fromUnit.innerHTML = '';
        toUnit.innerHTML = '';

        // Add new options based on converter type
        if (units[type]) {
            units[type].forEach(unit => {
                fromUnit.add(new Option(unit, unit));
                toUnit.add(new Option(unit, unit));
            });
        }
    });

    // Handle back button
    backBtn.addEventListener('click', () => {
        converterGrid.style.display = 'grid';
        converterPanel.classList.add('hidden');
        fromValue.value = '';
        toValue.value = '';
    });

    // Handle conversion
    fromValue.addEventListener('input', convert);
    fromUnit.addEventListener('change', convert);
    toUnit.addEventListener('change', convert);

    function convert() {
        const value = parseFloat(fromValue.value);
        if (isNaN(value)) {
            toValue.value = '';
            return;
        }

        const from = fromUnit.value;
        const to = toUnit.value;

        if (from === to) {
            toValue.value = value;
            return;
        }

        // Find the converter type
        let converterType;
        for (const type in units) {
            if (units[type].includes(from)) {
                converterType = type;
                break;
            }
        }

        if (conversions[converterType] && conversions[converterType][from] && conversions[converterType][from][to]) {
            toValue.value = conversions[converterType][from][to](value).toFixed(4);
        }
    }

// Calculator Variables
let firstOperand = null;
let operator = null;
let waitingForSecondOperand = false;
let history = []; // To store calculation history

// Tab Functionality
tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        tabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // Hide all sections
        calculatorSection.classList.add('hidden');
        converterSection.classList.add('hidden');
        historySection.classList.add('hidden');

        // Show the selected section
        if (btn.dataset.tab === 'calculator') {
            calculatorSection.classList.remove('hidden');
        } else if (btn.dataset.tab === 'converter') {
            converterSection.classList.remove('hidden');
        } else if (btn.dataset.tab === 'history') {
            historySection.classList.remove('hidden');
            updateHistoryDisplay(); // Update the history whenever the tab is opened
        }
    });
});

// Function to add calculations to history
function addToHistory(expression, result) {
    const historyItem = `${expression} = ${result}`;
    history.push(historyItem); // Add to the history array
    updateHistoryDisplay(); // Update the UI dynamically
}

// Function to display the history
function updateHistoryDisplay() {
    historyList.innerHTML = ''; // Clear existing history list
    history.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item;
        historyList.appendChild(li);
    });
}

// Clear History Functionality
clearHistoryBtn.addEventListener('click', () => {
    history = []; // Clear the history array
    updateHistoryDisplay(); // Clear the UI
});

// Calculator Functions
function inputDigit(digit) {
    if (waitingForSecondOperand) {
        display.value = digit;
        waitingForSecondOperand = false;
    } else {
        display.value = display.value === '0' ? digit : display.value + digit;
    }
}

function inputDecimal() {
    if (!display.value.includes('.')) {
        display.value += '.';
    }
}

function handleOperator(nextOperator) {
    const inputValue = parseFloat(display.value);

    if (operator && waitingForSecondOperand) {
        operator = nextOperator;
        return;
    }

    if (firstOperand === null) {
        firstOperand = inputValue;
    } else if (operator) {
        const result = performCalculation[operator](firstOperand, inputValue);
        const expression = `${firstOperand} ${operator} ${inputValue}`;
        display.value = String(result);
        firstOperand = result;

        // Add calculation to history
        addToHistory(expression, result);
    }

    waitingForSecondOperand = true;
    operator = nextOperator;
}

const performCalculation = {
    '/': (firstOperand, secondOperand) => firstOperand / secondOperand,
    '*': (firstOperand, secondOperand) => firstOperand * secondOperand,
    '+': (firstOperand, secondOperand) => firstOperand + secondOperand,
    '-': (firstOperand, secondOperand) => firstOperand - secondOperand,
    '=': (firstOperand, secondOperand) => secondOperand,
};

function resetCalculator() {
    display.value = '0';
    firstOperand = null;
    operator = null;
    waitingForSecondOperand = false;
}

// Event Listener for Calculator Buttons
document.querySelector('.calculator-buttons').addEventListener('click', (event) => {
    const { target } = event;

    if (!target.matches('button')) return;

    if (target.dataset.action === 'clear') {
        resetCalculator();
    } else if (target.dataset.action === 'delete') {
        display.value = display.value.slice(0, -1) || '0';
    } else if (target.dataset.action === 'operator') {
        handleOperator(target.textContent);
    } else if (target.dataset.action === 'equals') {
        handleOperator('=');
    } else if (target.dataset.digit) {
        inputDigit(target.textContent);
    } else if (target.textContent === '.') {
        inputDecimal();
    }
});
});

