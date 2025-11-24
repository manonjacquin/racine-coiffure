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

// === Gestion du formulaire + iframe cachée ===
const form = document.getElementById("surveyForm");
const successEl = document.getElementById("formSuccess");
const formErrorEl = document.getElementById("formError");
const hiddenIframe = document.getElementById("hidden_iframe");

if (form) {
  // Validation côté client avant envoi
  form.addEventListener("submit", (event) => {
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
    // on ne fait PAS preventDefault :
    // le formulaire est envoyé vers Apps Script
    // dans l'iframe cachée (target="hidden_iframe").
  });
}

// Détection de fin d'envoi via l'iframe cachée
if (hiddenIframe && form) {
  let firstLoad = true;

  hiddenIframe.addEventListener("load", () => {
    // Le premier chargement de l'iframe au load de la page : on ignore
    if (firstLoad) {
      firstLoad = false;
      return;
    }

    // À partir du 2e load : un envoi vient d'être fait
    // => on affiche le message de succès côté site
    if (successEl) {
      successEl.classList.add("visible");
      setTimeout(() => {
        successEl.classList.remove("visible");
      }, 4000);
    }

    // On peut remettre le formulaire à zéro
    form.reset();

    // Réinitialiser les étoiles
    document
      .querySelectorAll(".stars label")
      .forEach((l) => l.classList.remove("selected", "hovered"));

    // Réinitialiser les boutons Oui / Non
    document
      .querySelectorAll(".yesno-option")
      .forEach((opt) => opt.classList.remove("active"));
  });  
}

// Bouton retour après succès
const successBtn = document.getElementById("successBtn");

if (successBtn) {
  successBtn.addEventListener("click", () => {
    // Remet la page en haut
    window.scrollTo({ top: 0, behavior: "smooth" });

    // Cache le message de succès après le clic
    if (successEl) successEl.classList.remove("visible");

    // Le formulaire est déjà reset automatiquement
  });
}

