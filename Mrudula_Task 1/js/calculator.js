/* =============================================
   CALCULATOR — JavaScript Logic
   File: js/calculator.js

   Concepts used:
   - Variables & State management
   - Functions
   - Event Listeners (click + keyboard)
   - if / else if / else statements
   - switch statement (operator handling)
   - Loops (forEach to attach listeners)
   - Template literals
   - DOM manipulation
   ============================================= */

// ─── 1. DOM ELEMENT REFERENCES ───────────────────────────────────────────────

const expressionEl = document.getElementById("expression");
const resultEl     = document.getElementById("result");

const numberButtons   = document.querySelectorAll(".btn--number");
const operatorButtons = document.querySelectorAll(".btn--operator");
const clearBtn        = document.getElementById("clear");
const toggleBtn       = document.getElementById("toggle");
const percentBtn      = document.getElementById("percent");
const decimalBtn      = document.getElementById("decimal");
const equalsBtn       = document.getElementById("equals");


// ─── 2. CALCULATOR STATE ─────────────────────────────────────────────────────
/*
  We track everything needed to compute a result:
    currentValue  – the number currently being typed
    previousValue – the first operand (stored after an operator is pressed)
    operator      – the pending operator (+, −, ×, ÷)
    justEvaluated – flag set to true right after "=" so the next digit starts fresh
*/

let currentValue  = "0";
let previousValue = "";
let operator      = null;
let justEvaluated = false;


// ─── 3. HELPER FUNCTIONS ─────────────────────────────────────────────────────

/**
 * formatNumber
 * Prevents floating-point display artifacts like 0.1+0.2 = 0.30000000000004
 * Uses toPrecision to keep significant digits, then strips trailing zeros.
 */
function formatNumber(num) {
  if (isNaN(num))      return "Error";
  if (!isFinite(num))  return "Error";

  // toPrecision(12) handles most cases cleanly
  let formatted = parseFloat(parseFloat(num).toPrecision(12)).toString();

  // If still very long, use exponential notation
  if (formatted.length > 14) {
    formatted = parseFloat(num).toPrecision(8);
  }

  return formatted;
}

/**
 * updateDisplay
 * Writes the current state to the two display lines.
 * Shrinks the font if the number is long.
 */
function updateDisplay() {
  resultEl.textContent = currentValue;
  expressionEl.textContent = buildExpression();

  // Shrink font for long numbers
  if (currentValue.length > 9) {
    resultEl.classList.add("small");
  } else {
    resultEl.classList.remove("small");
  }
}

/**
 * buildExpression
 * Returns a string like "12 + " or "12 + 5 =" shown on the top line.
 */
function buildExpression() {
  if (operator && previousValue !== "") {
    if (justEvaluated) {
      return `${previousValue} ${operator} ${currentValue} =`;
    }
    return `${previousValue} ${operator}`;
  }
  return "";
}

/**
 * highlightOperator
 * Adds an 'active' CSS class to the operator button that is currently pending,
 * and removes it from all others.
 */
function highlightOperator(activeOp) {
  operatorButtons.forEach(function (btn) {
    if (btn.dataset.op === activeOp) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });
}

/**
 * clearOperatorHighlight
 * Removes the active highlight from all operator buttons.
 */
function clearOperatorHighlight() {
  operatorButtons.forEach(function (btn) {
    btn.classList.remove("active");
  });
}


// ─── 4. CORE CALCULATION LOGIC ───────────────────────────────────────────────

/**
 * calculate
 * Performs the arithmetic operation using a switch statement.
 * Returns the result as a formatted string.
 *
 * @param {number} a   - first operand
 * @param {string} op  - operator symbol
 * @param {number} b   - second operand
 */
function calculate(a, op, b) {
  let result;

  switch (op) {
    case "+":
      result = a + b;
      break;
    case "−":
      result = a - b;
      break;
    case "×":
      result = a * b;
      break;
    case "÷":
      if (b === 0) {
        return "Error";   // Division by zero guard
      }
      result = a / b;
      break;
    default:
      return formatNumber(a);  // No known operator — return first operand
  }

  return formatNumber(result);
}


// ─── 5. INPUT HANDLERS ───────────────────────────────────────────────────────

/**
 * handleNumber
 * Called when a digit (0-9) button is pressed.
 * Appends the digit to currentValue.
 */
function handleNumber(digit) {
  // If we just pressed "=", start fresh
  if (justEvaluated) {
    currentValue  = digit;
    justEvaluated = false;
    clearOperatorHighlight();
  } else if (currentValue === "0") {
    // Replace leading zero (but not for "0.")
    currentValue = digit;
  } else {
    // Limit input length to 12 characters
    if (currentValue.length >= 12) return;
    currentValue += digit;
  }

  updateDisplay();
}

/**
 * handleOperator
 * Called when +, −, ×, ÷ is pressed.
 * If there's already a pending operation, evaluates it first (chaining).
 */
function handleOperator(op) {
  // If we already have a pending operator AND the user hasn't just pressed "=",
  // chain: evaluate immediately before storing the new operator.
  if (operator !== null && !justEvaluated) {
    const a = parseFloat(previousValue);
    const b = parseFloat(currentValue);
    currentValue = calculate(a, operator, b);
  }

  previousValue = currentValue;
  operator      = op;
  justEvaluated = false;

  // Move current to "waiting for second operand" mode
  currentValue  = "0";

  highlightOperator(op);
  updateDisplay();
}

/**
 * handleEquals
 * Evaluates the pending operation and shows the result.
 */
function handleEquals() {
  // Nothing to calculate if there's no operator or previous value
  if (operator === null || previousValue === "") return;

  const a = parseFloat(previousValue);
  const b = parseFloat(currentValue);

  const result = calculate(a, operator, b);

  // Build the expression line before we clear state
  const exprSnapshot = `${previousValue} ${operator} ${currentValue} =`;
  expressionEl.textContent = exprSnapshot;

  currentValue  = result;
  previousValue = "";
  operator      = null;
  justEvaluated = true;

  clearOperatorHighlight();
  updateDisplay();
}

/**
 * handleClear
 * Resets everything back to the initial state.
 */
function handleClear() {
  currentValue  = "0";
  previousValue = "";
  operator      = null;
  justEvaluated = false;
  expressionEl.textContent = "";
  clearOperatorHighlight();
  updateDisplay();
}

/**
 * handleToggleSign
 * Flips the sign of the current number (positive ↔ negative).
 */
function handleToggleSign() {
  if (currentValue === "0" || currentValue === "Error") return;

  if (currentValue.startsWith("-")) {
    currentValue = currentValue.slice(1);        // Remove the minus sign
  } else {
    currentValue = "-" + currentValue;           // Prepend minus sign
  }

  updateDisplay();
}

/**
 * handlePercent
 * Converts the current number to a percentage (divides by 100).
 */
function handlePercent() {
  if (currentValue === "Error") return;

  const num = parseFloat(currentValue);
  currentValue = formatNumber(num / 100);
  updateDisplay();
}

/**
 * handleDecimal
 * Adds a decimal point if one doesn't already exist.
 */
function handleDecimal() {
  // If we just evaluated, start a new decimal number
  if (justEvaluated) {
    currentValue  = "0.";
    justEvaluated = false;
    updateDisplay();
    return;
  }

  // Don't add a second decimal point
  if (currentValue.includes(".")) return;

  currentValue += ".";
  updateDisplay();
}


// ─── 6. EVENT LISTENERS ──────────────────────────────────────────────────────

/*
  Loop through every number button and attach a click listener.
  dataset.num holds the digit value set in the HTML data-num attribute.
*/
numberButtons.forEach(function (btn) {
  btn.addEventListener("click", function () {
    handleNumber(btn.dataset.num);
  });
});

/*
  Loop through every operator button and attach a click listener.
  dataset.op holds the operator symbol set in the HTML data-op attribute.
*/
operatorButtons.forEach(function (btn) {
  btn.addEventListener("click", function () {
    handleOperator(btn.dataset.op);
  });
});

// Individual button listeners
clearBtn.addEventListener("click",   handleClear);
toggleBtn.addEventListener("click",  handleToggleSign);
percentBtn.addEventListener("click", handlePercent);
decimalBtn.addEventListener("click", handleDecimal);
equalsBtn.addEventListener("click",  handleEquals);


// ─── 7. KEYBOARD SUPPORT ─────────────────────────────────────────────────────
/*
  Maps keyboard keys to calculator actions.
  Uses an if / else if chain to decide which handler to call.
*/

document.addEventListener("keydown", function (event) {
  const key = event.key;

  if (key >= "0" && key <= "9") {
    // Digit keys 0-9
    handleNumber(key);

  } else if (key === "+") {
    handleOperator("+");

  } else if (key === "-") {
    handleOperator("−");

  } else if (key === "*") {
    handleOperator("×");

  } else if (key === "/") {
    event.preventDefault();   // Prevent browser quick-find shortcut
    handleOperator("÷");

  } else if (key === "Enter" || key === "=") {
    handleEquals();

  } else if (key === "Backspace") {
    // Backspace: delete last digit, or clear if only one digit left
    if (justEvaluated || currentValue.length === 1) {
      handleClear();
    } else {
      currentValue = currentValue.slice(0, -1) || "0";
      updateDisplay();
    }

  } else if (key === "Escape") {
    handleClear();

  } else if (key === ".") {
    handleDecimal();

  } else if (key === "%") {
    handlePercent();
  }
});


// ─── 8. INITIALISE ───────────────────────────────────────────────────────────
// Render the initial state on page load
updateDisplay();
