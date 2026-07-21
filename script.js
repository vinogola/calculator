const display = document.getElementById("display");
const buttonsContainer = document.getElementById("buttons");

let calculatorState = { firstNumber: null, operator: null, secondNumber: null };

function updateDisplay(state) {
  state.secondNumber
    ? (display.textContent = state.secondNumber)
    : (display.textContent = state.firstNumber);
}

buttonsContainer.addEventListener("click", (event) => {
  const digit = event.target.dataset.value;
  const operator = event.target.dataset.operator;

  if (digit) {
    calculatorState.operator
      ? (calculatorState.secondNumber = digit)
      : (calculatorState.firstNumber = digit);
  }
  if (operator) calculatorState.operator = operator;

  updateDisplay(calculatorState);
  console.log(calculatorState);
});
