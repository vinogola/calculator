const display = document.getElementById("display");
const buttonsContainer = document.getElementById("buttons");
let justEvaluated = false;
const snaky = "No Way!!";

let calculatorState;
resetState();

function updateDisplay(state) {
  display.textContent = state.secondNumber ?? state.firstNumber ?? 0;
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

function resetState() {
  calculatorState = {
    firstNumber: null,
    operator: null,
    secondNumber: null,
  };
}

buttonsContainer.addEventListener("click", (event) => {
  const digit = event.target.dataset.value;
  const operator = event.target.dataset.operator;
  const wasjustEvaluated = justEvaluated;
  justEvaluated = false;

  if (operator === "clear" || calculatorState.firstNumber === snaky) {
    resetState();
  }

  if (digit) {
    if (wasjustEvaluated) {
      calculatorState.firstNumber = digit;
    } else {
      calculatorState.operator
        ? (calculatorState.secondNumber =
            (calculatorState.secondNumber || "") + digit)
        : (calculatorState.firstNumber =
            (calculatorState.firstNumber || "") + digit);
    }
  }

  const firstNumber = Number(calculatorState.firstNumber);
  const secondNumber = Number(calculatorState.secondNumber);

  if (!calculatorState.secondNumber) {
    switch (operator) {
      case "+":
      case "/":
      case "-":
      case "*":
        calculatorState.operator = operator;
        break;
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
    } else {
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
});
