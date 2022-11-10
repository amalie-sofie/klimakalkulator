const outputElement = document.querySelector("#output");
const outputElement2 = document.querySelector("#output2");
const outputElement3 = document.querySelector("#output3");
const outputElement4 = document.querySelector("#output4");
const outputElement5 = document.querySelector("#output5");
const outputElement6 = document.querySelector("#output6");

function refresh() {
// UTREGNING STREAM
  const sum = ((get("streamtv") * 100) / 1000) * 52;
  const sum2 = ((get("streammusikk") * 36) / 1000) * 52;

  const sum3 = sum + sum2;

  outputElement.textContent = sum3;
 
  // UTREGNING SKYLAGRING

  const sum4 = ((get("skylagring") * 0.81) *442) / 1000;
 
  outputElement2.textContent = sum4;

  // UTREGNING INTERNETTBRUK - ER EN FEIL HER JEG IKKE SKJØNENR!!!

  const sum5 = ((get("epost") * 20) / 1000) * 52;
  const sum6 = ((get("internett") * 52) / 1000) * 1;

  const sum7 = sum5 + sum6;

  outputElement3.textContent = sum7;

  // UTREGNING MOROSAME TING - 

  const sum8 = ((get("spillkonsoll") * 50) / 1000) * 52;
  const sum9 = ((get("spillpc") * 90) / 1000) * 52;
  const sum10 = ((get("kino") * 2400) / 1000) * 52;

  const sum11 = sum8 + sum9 + sum10;

  outputElement4.textContent = sum11;

  // UTREGNING ELARTIKLER - denne rea
  const sum12 = ((get("elartikkelpc") * 280));
  const sum13 = ((get("elartikkelmobil") * 62));
  const sum14 = ((get("elartikkeltv") * 175));

  const sum15 = sum12 + sum13 + sum14;

  outputElement5.textContent = sum15;

  // TOTALT UTSLIPP

  const sum50 = sum3 + sum4 + sum7 + sum11 + sum15;

  outputElement6.textContent = sum50;
}
