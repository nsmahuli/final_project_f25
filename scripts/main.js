document.addEventListener("DOMContentLoaded", () => {
  // All media cards on the season pages
  const cards = document.querySelectorAll(".media-card");
  if (!cards.length) return;

  // Build a single modal and reuse it for every card
  const modal = document.createElement("div");
  modal.className = "media-modal";
  modal.setAttribute("aria-hidden", "true");
  modal.innerHTML = `
    <div class="media-modal-backdrop" data-modal-close></div>
    <div class="media-modal-dialog" role="dialog" aria-modal="true" aria-label="Movie or TV details">
      <button class="media-modal-close" type="button" aria-label="Close details" data-modal-close>&times;</button>
      <div class="media-modal-content"></div>
    </div>
  `;
  document.body.appendChild(modal);

  const modalDialog = modal.querySelector(".media-modal-dialog");
  const modalContent = modal.querySelector(".media-modal-content");
  let jumpBtn = null;

  // Add callouts and "jump to details" behavior inside the modal
  function enhanceModalContent() {
    // First detail paragraph in the modal
    const firstDetailParagraph = modalContent.querySelector("p");
    if (!firstDetailParagraph) return;

    // Highlight the Food / Drink Pairing paragraph
    const pairingParagraph = Array.from(modalContent.querySelectorAll("p")).find(
      (p) => p.textContent.trim().startsWith("Food / Drink Pairing")
    );
    if (pairingParagraph) {
      pairingParagraph.classList.add("food-pairing");
    }

    // "Jump to details" button
    if (!jumpBtn) {
      jumpBtn = document.createElement("button");
      jumpBtn.type = "button";
      jumpBtn.className = "food-pairing-jump";
      jumpBtn.textContent = "Jump to details";
      modalDialog.insertBefore(jumpBtn, modalContent);
    } else {
      jumpBtn.hidden = false;
    }

    // Scroll to first detail paragraph and briefly highlight it
    jumpBtn.onclick = () => {
      firstDetailParagraph.scrollIntoView({ behavior: "smooth", block: "center" });
      firstDetailParagraph.classList.add("is-highlighted");
      window.setTimeout(() => {
        firstDetailParagraph.classList.remove("is-highlighted");
      }, 1600);
    };
  }

  // Open the modal with the content from a given card
  function openModalFromCard(card) {
    modalContent.innerHTML = card.innerHTML;
    enhanceModalContent();
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("no-scroll");
  }

  // Close the modal and reset its state
  function closeModal() {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    modalContent.innerHTML = "";
    document.body.classList.remove("no-scroll");
    if (jumpBtn) jumpBtn.hidden = true;
  }

  // Attach click handlers and hints to each media card
  cards.forEach((card) => {
    const posterImg = card.querySelector(".poster img");

    // Small hint text under each card
    const hint = document.createElement("span");
    hint.className = "click-hint";
    hint.textContent = "Click image to see all details";
    card.appendChild(hint);

    posterImg.style.cursor = "pointer";
    posterImg.addEventListener("click", () => openModalFromCard(card));
  });

  // Close modal on backdrop or close button click
  modal.addEventListener("click", (event) => {
    if (event.target.matches("[data-modal-close]")) {
      closeModal();
    }
  });

  // Close modal with Escape key
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && modal.classList.contains("is-open")) {
      closeModal();
    }
  });
});