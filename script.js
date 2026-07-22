const display = document.getElementById("display");
const buttonsContainer = document.getElementById("buttons");
let justEvaluated = false;

let calculatorState = { firstNumber: null, operator: null, secondNumber: null };

function updateDisplay(state) {
  state.secondNumber
    ? (display.textContent = state.secondNumber)
    : (display.textContent = state.firstNumber);
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
      return a / b;
  }
}

buttonsContainer.addEventListener("click", (event) => {
  const digit = event.target.dataset.value;
  const operator = event.target.dataset.operator;
  const wasjustEvaluated = justEvaluated;
  justEvaluated = false;

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

  switch (operator) {
    case "+":
    case "/":
    case "-":
    case "*":
      calculatorState.operator = operator;
      break;
  }

  if (calculatorState.secondNumber && operator === "=") {
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
  }

  updateDisplay(calculatorState);
  console.log(calculatorState);
});
