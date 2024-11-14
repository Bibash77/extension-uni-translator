document.addEventListener("keydown", function (event) {
  if (event.ctrlKey && event.key.toLowerCase() === "q") {
    createDialog();
  }
});

function createDialog() {
  let existingDialogWrapper = document.getElementById("custom-dialog-wrapper");
  if (existingDialogWrapper) return;

  // Fetch the HTML content for the dialog
  fetch(chrome.runtime.getURL("dialog.html"))
    .then(response => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.text();
    })
    .then(html => {
      document.body.insertAdjacentHTML("beforeend", html);
      document.getElementById("translate-button").addEventListener("click", translateText);
      document.getElementById("close-button").addEventListener("click", () => {
        document.body.removeChild(document.getElementById("custom-dialog-wrapper"));
      });
    })
    .catch(error => {
      console.error("Failed to load the dialog HTML:", error);
    });
}

function translateText() {
  let selectedLanguage = document.getElementById("language-select").value;
  let inputText = document.getElementById("text-input").value;
  let translationOutput = document.getElementById("translation-output");

  let apiUrl = `http://localhost:3000/api/translate?selectedLanguage=${encodeURIComponent(selectedLanguage)}&data=${encodeURIComponent(inputText)}`;
  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      translationOutput.textContent = `Translation: ${data.translatedText}`;
    })
    .catch(error => {
      translationOutput.textContent = "Error: Unable to translate the text.";
      console.error("Translation API Error:", error);
    });
}
