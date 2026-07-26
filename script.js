const display = document.getElementById("display");
const buttonsContainer = document.getElementById("buttons");
// Set after "=" so the next digit starts fresh instead of appending to the result.
let justEvaluated = false;
const snaky = "No Way!!"; // shown instead of Infinity/NaN on divide-by-zero

let calculatorState;
resetState();

// null means "no value yet" - keeps that distinct from a real 0 or "".
function resetState() {
  calculatorState = {
    firstNumber: null,
    operator: null,
    secondNumber: null,
  };
}

function updateDisplay(state) {
  let displayValue = state.secondNumber ?? state.firstNumber ?? 0;

  if (typeof displayValue === "number") {
    // Rounds the displayed copy only; calculatorState keeps full precision.
    displayValue = Math.round(displayValue * Math.pow(10, 6)) / Math.pow(10, 6);
  }

  display.textContent = displayValue;
}

function mathOperator(operator) {
  switch (operator) {
    case "+":
    case "/":
    case "-":
    case "*":
      return operator;
  }
}

// Pure lookups: return the matching key value, or undefined if unhandled.
function digitFromKey(key) {
  switch (key) {
    case "0":
    case "1":
    case "2":
    case "3":
    case "4":
    case "5":
    case "6":
    case "7":
    case "8":
    case "9":
    case ".":
      return key;
  }
}

function operatorFromKey(key) {
  switch (key) {
    case "+":
    case "-":
    case "*":
    case "/":
    case "=":
      return key;
  }
}

function calculate(operator, a, b) {
  switch (operator) {
    case "+":
      return a + b;
    case "-":
      return a - b;
    case "*":
      return a * b;
    case "/":
      if (b === 0) return snaky;
      return a / b;
  }
}

function appendDigit(currentValue, digit) {
  if (digit === ".") {
    if (!currentValue) {
      return "0.";
    } else if (currentValue.includes(".")) {
      return currentValue;
    } else {
      return currentValue + digit;
    }
  } else {
    return (currentValue || "") + digit;
  }
}

function removeDigit(currentValue) {
  if (!currentValue) {
    return null;
  } else {
    if (typeof currentValue === "number") {
      currentValue = currentValue.toString();
    }

    let trimmedNumber = currentValue.slice(0, -1);

    if (!trimmedNumber) {
      return null;
    }
    return trimmedNumber;
  }
}

// Shared by the click and keydown listeners - the only place calculatorState is mutated.
function handleInput(digit, operator) {
  const wasjustEvaluated = justEvaluated;
  justEvaluated = false;

  if (operator === "clear" || calculatorState.firstNumber === snaky) {
    resetState();
  }

  if (operator === "backspace") {
    calculatorState.operator
      ? (calculatorState.secondNumber = removeDigit(
          calculatorState.secondNumber,
        ))
      : (calculatorState.firstNumber = removeDigit(
          calculatorState.firstNumber,
        ));
  }

  if (digit) {
    if (wasjustEvaluated) {
      calculatorState.firstNumber = appendDigit(null, digit);
    } else {
      calculatorState.operator
        ? (calculatorState.secondNumber = appendDigit(
            calculatorState.secondNumber,
            digit,
          ))
        : (calculatorState.firstNumber = appendDigit(
            calculatorState.firstNumber,
            digit,
          ));
    }
  }

  const firstNumber = Number(calculatorState.firstNumber);
  const secondNumber = Number(calculatorState.secondNumber);

  // Requires firstNumber first, or the next digit would route into secondNumber
  // and firstNumber would stay null.
  if (!calculatorState.secondNumber && calculatorState.firstNumber) {
    if (mathOperator(operator)) {
      calculatorState.operator = operator;
    }
  }

  if (calculatorState.secondNumber && operator) {
    if (operator === "=") {
      justEvaluated = true;
      calculatorState = {
        firstNumber: calculate(
          calculatorState.operator,
          firstNumber,
          secondNumber,
        ),
        operator: null,
        secondNumber: null,
      };
    } else if (mathOperator(operator)) {
      calculatorState = {
        firstNumber: calculate(
          calculatorState.operator,
          firstNumber,
          secondNumber,
        ),
        operator: operator,
        secondNumber: null,
      };
    }
  }

  updateDisplay(calculatorState);
}

buttonsContainer.addEventListener("click", (event) => {
  const digit = event.target.dataset.value;
  const operator = event.target.dataset.operator;

  handleInput(digit, operator);
});

// keydown, not keypress - keypress never fires for Escape or Backspace.
window.addEventListener("keydown", (event) => {
  const digit = digitFromKey(event.key);
  let operator;

  // Handled here, not in operatorFromKey, since preventDefault needs the event object.
  if (event.key === "Escape") {
    event.preventDefault();
    operator = "clear";
  } else if (event.key === "Backspace") {
    event.preventDefault(); // stops the browser's back-navigation on Backspace
    operator = "backspace";
  } else if (event.key === "Enter") {
    event.preventDefault(); // stops Enter from also activating a focused button
    operator = "=";
  } else {
    operator = operatorFromKey(event.key);
  }

  handleInput(digit, operator);
});
