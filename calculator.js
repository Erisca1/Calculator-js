const display = document.getElementById('display');
const keys = document.getElementById('keys');

let current = '0';
let previous = null;
let operator = null;
let startNew = false;
let memory = 0;
 
function updateDisplay() {
  display.textContent = current.replace('.', ',');

  display.classList.toggle('is-long', current.length > 6 && current.length <= 8);
  display.classList.toggle('is-longer', current.length > 8);
 
  document.querySelectorAll('[data-op]').forEach(btn => {
    btn.setAttribute('aria-pressed', btn.dataset.op === operator && startNew);
  });
}
 
function calculate(a, b, op) {
  if (op === '+') return a + b;
  if (op === '-') return a - b;
  if (op === '*') return a * b;
  if (op === '/') return b === 0 ? NaN : a / b;
}
 
function toText(number) {
  if (!isFinite(number)) return 'Ошибка';
  return String(parseFloat(number.toPrecision(10)));
}
 
function inputDigit(digit) {
  if (startNew || current === 'Ошибка') {
    current = digit;
    startNew = false;
  } else if (current.length < 9) {
    current = current === '0' ? digit : current + digit;
  }
}
 
function inputDecimal() {
  if (startNew) { current = '0.'; startNew = false; return; }
  if (!current.includes('.')) current += '.';
}
 
function chooseOperator(op) {
  if (operator && !startNew) {
    current = toText(calculate(previous, Number(current), operator));
  }
  previous = Number(current);
  operator = op;
  startNew = true;
}
 
function equals() {
  if (operator === null) return;
  current  = toText(calculate(previous, Number(current), operator));
  operator = null;
  previous = null;
  startNew = true;
}
 
function doAction(action) {
  const value = Number(current) || 0;

  if (action === 'clear') { current = '0'; previous = null; operator = null; startNew = false; }
  if (action === 'percent') { current = toText(value / 100); }
  if (action === 'decimal') { inputDecimal(); }
  if (action === 'equals')  { equals(); }

  if (action === 'm-plus')  { memory += value; startNew = true; }
  if (action === 'm-minus') { memory -= value; startNew = true; }
  if (action === 'ms') { memory  = value; startNew = true; }
  if (action === 'mr') { current = toText(memory); startNew = true; }
  if (action === 'mc') { memory  = 0; }
}
 
keys.addEventListener('click', (event) => {
  const button = event.target.closest('button');
  if (!button) return;

  if (button.dataset.digit !== undefined) inputDigit(button.dataset.digit);
  if (button.dataset.op) chooseOperator(button.dataset.op);
  if (button.dataset.action) doAction(button.dataset.action);

  updateDisplay();
});
 
document.addEventListener('keydown', (event) => {
  const k = event.key;
  if (k >= '0' && k <= '9') inputDigit(k);
  else if ('+-*/'.includes(k)) chooseOperator(k);
  else if (k === ',' || k === '.') inputDecimal();
  else if (k === 'Enter' || k === '=') { event.preventDefault(); equals(); }
  else if (k === 'Escape') doAction('clear');
  else if (k === '%') doAction('percent');
  else return;
  updateDisplay();
});

updateDisplay();