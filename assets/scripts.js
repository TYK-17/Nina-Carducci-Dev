$(document).ready(function () {
  $(".gallery").mauGallery({
    columns: { xs: 1, sm: 2, md: 3, lg: 3, xl: 3 },
    lightBox: true,
    lightboxId: "myAwesomeLightbox",
    showTags: true,
    tagsPosition: "top",
  });

  // Gestion du bouton actif sur les filtres
  $(document).on("click", ".tag-item", function () {
    $(".tag-item").removeClass("active");
    $(this).addClass("active");
  });

  // Gestion du formulaire de contact
  $("#contactForm").on("submit", function (e) {
    e.preventDefault(); // bloque l'envoi réel

    // Affiche le message de confirmation
    $("#formMessage")
      .text("Votre message a bien été envoyé (simulation) !")
      .css({ color: "green", "font-weight": "bold" });

    // Réinitialise le formulaire
    this.reset();
  });
});
