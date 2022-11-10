const outputElement = document.querySelector("#output");
const outputElement2 = document.querySelector("#output2");
const outputElement3 = document.querySelector("#output3");
const outputElement4 = document.querySelector("#output4");
const outputElement5 = document.querySelector("#output5");
const outputElement6 = document.querySelector("#output5");

function refresh() {
// UTREGNING STREAM
  const sum = ((get("streamtv") * 100) / 1000) * 52;
  const sum2 = ((get("streammusikk") * 36) / 1000) * 52;

  const sum3 = sum + sum2;

  outputElement.textContent = sum3;
 
  // UTREGNING SKYLAGRING

  const sum4 = ((get("skylagring") * 0.81) *442) / 1000;
 
  outputElement2.textContent = sum4;

  // UTREGNING INTERNETTBRUK

  const sum5 = ((get("epost") * 20) / 1000) * 52;
  const sum6 = ((get("internett") * 52) / 1000);

  const sum7 = sum5 + sum6;

  outputElement3.textContent = sum7;

  
}
