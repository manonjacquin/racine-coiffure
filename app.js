// === Mise à jour de l'année dans le footer ===
const yearEl = document.getElementById("year");
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

// === Gestion des groupes d'étoiles (1 à gauche, 5 à droite) ===
document.querySelectorAll(".stars").forEach((starsGroup) => {
  const labels = Array.from(starsGroup.querySelectorAll("label"));
  const inputName = starsGroup.querySelector("input")?.name;
  const errorEl = inputName
    ? document.querySelector(`.error-inline[data-error-for="${inputName}"]`)
    : null;

  // Clic : sélection définitive
  labels.forEach((label) => {
    label.addEventListener("click", () => {
      const clickedValue = Number(label.dataset.value);
      labels.forEach((l) => {
        l.classList.toggle("selected", Number(l.dataset.value) <= clickedValue);
      });
      if (errorEl) {
        errorEl.classList.remove("visible");
      }
    });
  });

  // Survol : prévisualisation
  labels.forEach((label) => {
    label.addEventListener("mouseenter", () => {
      const hoverValue = Number(label.dataset.value);
      labels.forEach((l) => {
        l.classList.toggle("hovered", Number(l.dataset.value) <= hoverValue);
      });
    });
  });

  // Sortie du groupe : on supprime l'effet de survol
  starsGroup.addEventListener("mouseleave", () => {
    labels.forEach((l) => l.classList.remove("hovered"));
  });
});

// === Gestion visuelle des boutons Oui / Non ===
document.querySelectorAll(".yesno-group").forEach((group) => {
  const options = group.querySelectorAll(".yesno-option");
  options.forEach((opt) => {
    const input = opt.querySelector("input");
    opt.addEventListener("click", () => {
      options.forEach((o) => o.classList.remove("active"));
      opt.classList.add("active");
      if (input) {
        input.checked = true;
      }
    });
  });
});

// === Gestion du formulaire (validation) ===
const form = document.getElementById("surveyForm");
const formErrorEl = document.getElementById("formError");

if (form) {
  form.addEventListener("submit", (event) => {
    if (formErrorEl) formErrorEl.classList.remove("visible");

    let hasError = false;

    // Satisfaction globale obligatoire
    const globalRating = form.querySelector('input[name="rating_global"]:checked');
    const globalError = document.querySelector(
      '.error-inline[data-error-for="rating_global"]'
    );

    if (!globalRating) {
      if (globalError) globalError.classList.add("visible");
      hasError = true;
    } else if (globalError) {
      globalError.classList.remove("visible");
    }

    // Si erreur, on bloque l'envoi
    if (hasError) {
      event.preventDefault();
      return;
    }

    // Sinon, on laisse le formulaire partir vers Apps Script
    // Apps Script s’occupe de la redirection vers remerciement.html
  });
}
