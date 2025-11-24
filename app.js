// Mise à jour de l'année dans le footer
const yearEl = document.getElementById("year");
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

// Gestion des groupes d'étoiles (1 à gauche, 5 à droite)
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

// Gestion visuelle des boutons Oui / Non
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

// Gestion de l'envoi du formulaire (validation côté client, envoi classique vers Apps Script)
const form = document.getElementById("surveyForm");
const successEl = document.getElementById("formSuccess");
const formErrorEl = document.getElementById("formError");

if (form) {
  form.addEventListener("submit", (event) => {
    // On cache d'éventuels anciens messages
    if (formErrorEl) formErrorEl.classList.remove("visible");
    if (successEl) successEl.classList.remove("visible");

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

    // Si erreur, on bloque l'envoi vers Apps Script
    if (hasError) {
      event.preventDefault();
      return;
    }

    // Si pas d'erreur :
    // NE PAS appeler preventDefault :
    // on laisse le navigateur envoyer le formulaire
    // vers l'URL indiquée dans l'attribut action du <form>.
  });
}
