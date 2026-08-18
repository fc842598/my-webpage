(() => {
  const palaceButtons = [...document.querySelectorAll(".palace-cell")];
  const selectedPalace = document.getElementById("selectedPalace");
  const selectedStars = document.getElementById("selectedStars");
  const hexTabs = [...document.querySelectorAll(".hex-tabs [role='tab']")];
  const hexTitle = document.getElementById("hex-title");
  const hexNote = document.getElementById("hexNote");

  palaceButtons.forEach((button) => {
    button.addEventListener("click", () => {
      palaceButtons.forEach((item) => {
        const active = item === button;
        item.classList.toggle("is-active", active);
        item.setAttribute("aria-pressed", String(active));
      });

      selectedPalace.textContent = `${button.dataset.palace} · ${button.dataset.branch}`;
      selectedStars.textContent = `主星：${button.dataset.stars}`;
    });
  });

  hexTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      hexTabs.forEach((item) => item.setAttribute("aria-selected", String(item === tab)));
      hexTitle.textContent = tab.dataset.hexTitle;
      hexNote.textContent = tab.dataset.hexNote;
    });
  });
})();
