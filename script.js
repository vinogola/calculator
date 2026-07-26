const display = document.getElementById("display");
const buttonsContainer = document.getElementById("buttons");
let justEvaluated = false;
const snaky = "No Way!!";

let calculatorState;
resetState();

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
  console.log(calculatorState);
}

buttonsContainer.addEventListener("click", (event) => {
  const digit = event.target.dataset.value;
  const operator = event.target.dataset.operator;

  handleInput(digit, operator);
});

window.addEventListener("keydown", (event) => {
  const digit = digitFromKey(event.key);
  let operator;

  if (event.key === "Escape") {
    event.preventDefault();
    operator = "clear";
  } else if (event.key === "Backspace") {
    event.preventDefault();
    operator = "backspace";
  } else if (event.key === "Enter") {
    event.preventDefault();
    operator = "=";
  } else {
    operator = operatorFromKey(event.key);
  }

  handleInput(digit, operator);
});
