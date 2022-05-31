const calc = document.querySelector('.calc');
const themeSwitcher = document.querySelector('#theme-switcher');
const total = document.querySelector('.result__total');
const temp = document.querySelector('.result__temp');
const controls = document.querySelector('.controls');
const operators = ['/', '*', '-', '+',];
let initial = true;

document.addEventListener('keydown', (e) => typeChar(e));
controls.addEventListener('click', (e) => clickChar(e));
themeSwitcher.addEventListener('click', () => calc.classList.toggle('calc_light-theme'));

function typeChar(e) {
    inputChar(e.key);
}

function clickChar(e) {
    const btn = e.target.closest('.btn');
    
    if (btn.value) {
        inputChar(btn.value);
    } 
    else if (btn.id) {
        inputChar(btn.id);
    }
}

function inputChar(btn) {

    if (temp.value === 'Error') {
        reset();
    }

    if (isForbiddenAsFirst(btn)) {
        return;
    }

    if (isFinite(btn)) { // 0..9
        temp.value += btn;
    }
    else if (operators.includes(btn)) { // if allowed operator
        
        temp.value += btn;

        switch (temp.value) {
            case '-+':
            case '--':
            case '+-':
            case '++':
                temp.value = temp.value.slice(1);
                break;
        }

        if (initial) {
            btn == '-' ? temp.value = '-' : temp.value;
            btn == '+' ? temp.value = '+' : temp.value;
        }

        initial = false;

        if (isOperandComplete()) {
            if (temp.value.length === 1) { // if '+' or '-' is first
                return;
            }
            
            if (total.value === '0') {
                displayTotal();                
            }
            else if (operators.includes(total.value[total.value.length-1])) {
                let parsed = parseTemp();
                let operand1 = getResult(...parsed);
                getPrepare(operand1, btn);
            }
            else if (total.value !== '0' && temp.value !== '0') {
                getPrepare(total.value, btn);
            }

            temp.value = 0;
            initial = true;
        }
    }
    else if (btn === '%') {
        if (total.value === '0') {
            temp.value /= 100;
            displayTotal();
        } else {
            temp.value /= 100;
        }
    }
    else if (btn === '.') {
        if (temp.value.includes('.')) {
            return;
        }
        temp.value += btn;
        initial = false;
    }
    else if (btn === 'Backspace' || btn === 'backspace') {
        deleteLastChar();
    }
    else if (btn === '=' || btn === 'Enter' || btn === 'equals') {
        if (total.value === '0' && isFinite(temp.value)) {
            displayTotal();
        } else {
            const parsed = parseTemp();
            getResult(...parsed);
        }
    }
    else if (btn === 'Delete' || btn === 'clear') {
        reset();
    }


    if (isOutOfLimit()) {
        deleteLastChar();
    }

    if (initial) {
        temp.value = temp.value.slice(1);
        initial = false;
    }

    setZero();
}

function isForbiddenAsFirst(btn) {
    return (
        (temp.value[0] === '0' && temp.value.length === 1) && (btn === '0' || btn === '/' || btn === '*')
    )
}

function setZero() {
    if (temp.value === '') {
        temp.value = 0;
        initial = true;
    }
}

function isOutOfLimit() {
    return temp.value.length > temp.maxLength;
}

function displayTotal() {
    temp.value.startsWith('+') ? temp.value = temp.value.slice(1) : temp.value;

    total.value = temp.value;

    if (total.value.length === temp.maxLength) {
        total.style.padding = 0;
    } else {
        total.style.padding = '0px 20px';
    }
}

function deleteLastChar() {
    temp.value = temp.value.slice(0, temp.value.length-1);
}

function reset() {
    temp.value = 0;
    total.value = 0;
    initial = true;
    displayTotal();
};

function isOperandComplete() {
    return isNaN(temp.value);
}

function getPrepare(operand1, operator) {
    total.value = operand1 + operator;
}

function parseTemp() {
    let operand1 = parseFloat(total.value);
    let operand2 = isFinite(temp.value) ? temp.value : parseFloat(temp.value);
    let operator = total.value[total.value.length-1];

    if (operand2 === '0' && operator === '/') {
        return temp.value = ' Error';
    };

    return [operand1, operand2, operator]
}

function getResult(operand1, operand2, operator) {
    let result = 0;
 
    if (!operator) return temp.value = operand2;
    
    switch (operator) {
        case '/':
            result = operand1 / operand2;
            break;
        case '*':
            result = operand1 * operand2;
            break;
        case '-':
            result = operand1 - operand2;
            break;
        case '+':
            result = +operand1 + +operand2;
            break;            
        default:
            break;
    }

    temp.value = toFixed(result);
    displayTotal();
    return temp.value;
}

function toFixed(value) {
    const power = Math.pow(10, 14);
    return String(Math.round(value * power) / power);
}