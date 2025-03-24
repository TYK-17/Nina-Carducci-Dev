$(document).ready(function () {
  $(".gallery").mauGallery({
    columns: { xs: 1, sm: 2, md: 3, lg: 3, xl: 3 },
    lightBox: true,
    lightboxId: "myAwesomeLightbox",
    showTags: true,
    tagsPosition: "top",
  });

  // Ajouter la gestion du bouton actif sur les filtres
  $(document).on("click", ".tag-item", function () {
    $(".tag-item").removeClass("active");
    $(this).addClass("active");
  });
});
