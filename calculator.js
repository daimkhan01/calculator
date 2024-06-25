const expressionInput = document.getElementById("expression");
const resultOutput = document.getElementById("result");
const historyContainer = document.getElementById("history");

let history = [];

function appendToExpression(value) {
  expressionInput.value += value;
}

function clearExpression() {
  expressionInput.value = "";
  resultOutput.textContent = "Result: ";
}

function deleteLast() {
  expressionInput.value = expressionInput.value.slice(0, -1);
}

function evaluateExpression() {
  const expression = expressionInput.value.trim();
  if (expression === "") return;

  try {
    const result = evaluate(expression);
    resultOutput.textContent = `Result: ${result.toFixed(0, 3)}`;
    addToHistory(expression, result);
  } catch (error) {
    resultOutput.textContent = `Error: ${error.message}`;
  }
}

function addToHistory(expression, result) {
  const historyItem = document.createElement("div");
  historyItem.classList.add("history-item");
  historyItem.innerHTML = `
    <span>${expression} = ${result.toFixed(0, 3)}</span>
    <button onclick="deleteHistoryItem(this)">x</button>
  `;
  historyItem.onclick = () => {
    expressionInput.value = expression;
  };
  historyContainer.appendChild(historyItem);
}

function deleteHistoryItem(button) {
  historyContainer.removeChild(button.parentElement);
}

function evaluate(expression) {
  expression = expression.replace(/sqrt\(([^)]+)\)/g, (_, expr) =>
    Math.sqrt(evaluate(expr))
  );
  expression = expression.replace(/sin\(([^)]+)\)/g, (_, expr) =>
    Math.sin(evaluate(expr))
  );
  expression = expression.replace(/cos\(([^)]+)\)/g, (_, expr) =>
    Math.cos(evaluate(expr))
  );
  expression = expression.replace(/tan\(([^)]+)\)/g, (_, expr) =>
    Math.tan(evaluate(expr))
  );

  try {
    const result = Function(`'use strict'; return (${expression})`)();
    if (result === Infinity) {
      throw new Error("Math error");
    }
    return result;
  } catch (e) {
    throw new Error("Invalid expression");
  }
}
