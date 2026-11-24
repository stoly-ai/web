(() => {
  const display = document.getElementById("display");
  const year = document.getElementById("year");
  const keys = document.querySelector(".keys");

  if (year) {
    year.textContent = String(new Date().getFullYear());
  }

  if (!display || !keys) return;

  let current = "0";
  let previous = null;
  let operator = null;
  let shouldReset = false;

  function updateDisplay() {
    display.textContent = current;
  }

  function inputDigit(digit) {
    if (shouldReset) {
      current = digit;
      shouldReset = false;
      updateDisplay();
      return;
    }

    if (current === "0") {
      current = digit;
    } else if (current === "-0") {
      current = "-" + digit;
    } else if (current.replace("-", "").length < 12) {
      current += digit;
    }

    updateDisplay();
  }

  function inputDecimal() {
    if (shouldReset) {
      current = "0.";
      shouldReset = false;
      updateDisplay();
      return;
    }

    if (!current.includes(".")) {
      current += ".";
      updateDisplay();
    }
  }

  function clearAll() {
    current = "0";
    previous = null;
    operator = null;
    shouldReset = false;
    updateDisplay();
  }

  function toggleSign() {
    if (current === "0") return;
    current = current.startsWith("-") ? current.slice(1) : "-" + current;
    updateDisplay();
  }

  function percent() {
    const value = parseFloat(current);
    if (Number.isNaN(value)) return;
    current = formatResult(value / 100);
    updateDisplay();
  }

  function formatResult(value) {
    if (!Number.isFinite(value)) return "错误";

    const rounded = Number(value.toPrecision(12));
    let text = String(rounded);

    if (text.includes("e")) {
      text = rounded.toFixed(8).replace(/\.?0+$/, "");
    }

    if (text.length > 12) {
      text = rounded.toExponential(6);
    }

    return text;
  }

  function compute(a, op, b) {
    switch (op) {
      case "+":
        return a + b;
      case "−":
        return a - b;
      case "×":
        return a * b;
      case "÷":
        return b === 0 ? NaN : a / b;
      default:
        return b;
    }
  }

  function setOperator(nextOperator) {
    const value = parseFloat(current);

    if (previous !== null && operator && !shouldReset) {
      const result = compute(previous, operator, value);
      current = formatResult(result);
      previous = Number.isNaN(result) ? null : parseFloat(current);
      updateDisplay();
    } else {
      previous = value;
    }

    operator = nextOperator;
    shouldReset = true;
  }

  function equals() {
    if (operator === null || previous === null) return;

    const value = parseFloat(current);
    const result = compute(previous, operator, value);
    current = formatResult(result);
    previous = null;
    operator = null;
    shouldReset = true;
    updateDisplay();
  }

  keys.addEventListener("click", (event) => {
    const button = event.target.closest("button");
    if (!button) return;

    if (button.dataset.digit !== undefined) {
      inputDigit(button.dataset.digit);
      return;
    }

    if (button.dataset.operator !== undefined) {
      setOperator(button.dataset.operator);
      return;
    }

    switch (button.dataset.action) {
      case "clear":
        clearAll();
        break;
      case "sign":
        toggleSign();
        break;
      case "percent":
        percent();
        break;
      case "decimal":
        inputDecimal();
        break;
      case "equals":
        equals();
        break;
      default:
        break;
    }
  });

  updateDisplay();
})();
