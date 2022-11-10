const stateMap = new Map();
const calculatorInputs = document.querySelectorAll("input[data-state]");

function get(id) {
  return Number(stateMap.get(id) || 0);
}

Array.from(calculatorInputs).forEach((input) => {
  input.addEventListener("input", () => {
    stateMap.set(input.id, input.value || 0);
    refresh && refresh();
  });
});
