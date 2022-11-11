// const query = "hello";
const queryInputElem = document.getElementById('query');

const frigginForm = document.getElementById('vestigial');

frigginForm.addEventListener('submit', (event) => {
  console.log('submitting');
  event.preventDefault();
})



function sizeTheWords() {
  const variableSizeResults = document.querySelectorAll(".result.imperfect");
  variableSizeResults.forEach((result) => {
    const resultScore = parseInt(result.dataset.score, 10);
    result.style.fontSize = `${0.5 + (3.5 * resultScore) / 300}rem`;
  });
}
 
queryInputElem.addEventListener('keyup', async function(ev) {
  ev.preventDefault()
  if (ev.key == 'Enter') {
    console.log('pressed enter')
    begin();
  }
});

// assuming you already have rhyme results somewhere, for each of the first 10 results, query the word info api for the rhyming words' info and display them in a dl with that rhyming word

async function begin() {
  const rhymeResults = await fetch(`https://rhymebrain.com/talk?function=getRhymes&word=${queryInputElem.value}`);
  const rhymeResultsJson = await rhymeResults.json();
  const truncatedTo10 = rhymeResultsJson.slice(0, 10);
  console.log(truncatedTo10);

  const wordInfos = await Promise.all(
    truncatedTo10.map(async (rhyme) => {
      const wordInfo = await fetch(
        `https://rhymebrain.com/talk?function=getWordInfo&word=${rhyme.word}`
      );
      const wordInfoJson = await wordInfo.json();
      return wordInfoJson;
    })
  );

  const rhymeResultsElems = truncatedTo10.map((rhymeWord, i) => {
    let resultElem = document.createElement("div");
    resultElem.classList.add("result");
    resultElem.classList.add("imperfect");

    resultElem.dataset.score = rhymeWord.score;
    resultElem.append(rhymeWord.word);

    const wordInfoElem = document.createElement("dl");
    for (const [key, value] of Object.entries(wordInfos[i])) {
      const dt = document.createElement("dt");
      dt.append(key);
      const dd = document.createElement("dd");
      dd.append(value);
      wordInfoElem.append(dt);
      wordInfoElem.append(dd);
    }

    resultElem.append(wordInfoElem);
    return resultElem;
  });
  
  const resultsContainer = document.getElementById("results");
  // console.log(Array.from(resultsContainer.childNodes));
  Array.from(resultsContainer.childNodes).forEach((child) => {
    child.remove();
  });
  resultsContainer.append(...rhymeResultsElems);
  sizeTheWords();
}
