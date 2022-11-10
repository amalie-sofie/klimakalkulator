const outputElement = document.querySelector("#output");
const outputElement2 = document.querySelector("#output2");

function refresh() {
  // Logikk for å oppdatere kalkulator
  const streaming = ((get("streamtv") * 100) / 1000) * 52);
  const sum2 = ((get("test1") * 100) / 1000) * 52;

  const sum3 = sum + sum2;

  outputElement.textContent = streaming;
  outputElement2.textContent = sum3;
}
