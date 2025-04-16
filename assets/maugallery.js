(function ($) {
  $.fn.mauGallery = function (options) {
    const settings = $.extend({}, $.fn.mauGallery.defaults, options);
    const tagsCollection = new Set();

    return this.each(function () {
      const $gallery = $(this);

      $.fn.mauGallery.methods.createRowWrapper($gallery);

      if (settings.lightBox) {
        $.fn.mauGallery.methods.createLightBox(
          $gallery,
          settings.lightboxId,
          settings.navigation
        );
      }

      $.fn.mauGallery.listeners(settings);

      $gallery.children(".gallery-item").each(function () {
        const $item = $(this);
        const theTag = $item.data("gallery-tag");

        $.fn.mauGallery.methods.responsiveImageItem($item);
        $.fn.mauGallery.methods.moveItemInRowWrapper($item);
        $.fn.mauGallery.methods.wrapItemInColumn($item, settings.columns);

        if (settings.showTags && theTag !== undefined) {
          tagsCollection.add(theTag);
        }
      });

      if (settings.showTags) {
        $.fn.mauGallery.methods.showItemTags(
          $gallery,
          settings.tagsPosition,
          Array.from(tagsCollection)
        );
      }

      $gallery.fadeIn(500);
    });
  };

  $.fn.mauGallery.defaults = {
    columns: 3,
    lightBox: true,
    lightboxId: null,
    showTags: true,
    tagsPosition: "bottom",
    navigation: true,
  };

  $.fn.mauGallery.listeners = function (settings) {
    $(".gallery-item").on("click", function () {
      if (settings.lightBox && $(this).prop("tagName") === "IMG") {
        $.fn.mauGallery.methods.openLightBox($(this), settings.lightboxId);
      }
    });

    $(document).on("click", ".nav-link", $.fn.mauGallery.methods.filterByTag);
    $(document).on("click", ".mg-prev", () =>
      $.fn.mauGallery.methods.prevImage(settings.lightboxId)
    );
    $(document).on("click", ".mg-next", () =>
      $.fn.mauGallery.methods.nextImage(settings.lightboxId)
    );
  };

  $.fn.mauGallery.methods = {
    createRowWrapper($el) {
      if (!$el.children().first().hasClass("row")) {
        $el.append('<div class="gallery-items-row row"></div>');
      }
    },

    wrapItemInColumn($item, columns) {
      if (typeof columns === "number") {
        $item.wrap(
          `<div class="item-column mb-4 col-${Math.ceil(12 / columns)}"></div>`
        );
      } else if (typeof columns === "object") {
        let columnClasses = "";
        ["xs", "sm", "md", "lg", "xl"].forEach((bp) => {
          if (columns[bp]) {
            columnClasses += ` col-${bp}-${Math.ceil(12 / columns[bp])}`;
          }
        });
        $item.wrap(`<div class="item-column mb-4${columnClasses}"></div>`);
      } else {
        console.error(`Unsupported columns format: ${typeof columns}`);
      }
    },

    moveItemInRowWrapper($item) {
      $item.appendTo(".gallery-items-row");
    },

    responsiveImageItem($item) {
      if ($item.prop("tagName") === "IMG") {
        $item.addClass("img-fluid");
      }
    },

    openLightBox($item, lightboxId) {
      $(`#${lightboxId}`).find(".lightboxImage").attr("src", $item.attr("src"));
      $(`#${lightboxId}`).modal("toggle");
    },

    getActiveImage() {
      const currentSrc = $(".lightboxImage").attr("src");
      return $("img.gallery-item")
        .filter(function () {
          return $(this).attr("src") === currentSrc;
        })
        .first();
    },

    getImagesCollection(activeTag) {
      const images = [];
      $(".item-column").each(function () {
        const $img = $(this).children("img");
        if (activeTag === "all" || $img.data("gallery-tag") === activeTag) {
          if ($img.length) images.push($img);
        }
      });
      return images;
    },

    prevImage() {
      const activeTag =
        $(".tags-bar .active-tag").data("images-toggle") || "all";
      const images = $.fn.mauGallery.methods.getImagesCollection(activeTag);
      const activeImage = $.fn.mauGallery.methods.getActiveImage();
      const currentIndex = images.findIndex(
        (img) => img.attr("src") === activeImage.attr("src")
      );
      const prevIndex = (currentIndex - 1 + images.length) % images.length;
      $(".lightboxImage").attr("src", images[prevIndex].attr("src"));
    },

    nextImage() {
      const activeTag =
        $(".tags-bar .active-tag").data("images-toggle") || "all";
      const images = $.fn.mauGallery.methods.getImagesCollection(activeTag);
      const activeImage = $.fn.mauGallery.methods.getActiveImage();
      const currentIndex = images.findIndex(
        (img) => img.attr("src") === activeImage.attr("src")
      );
      const nextIndex = (currentIndex + 1) % images.length;
      $(".lightboxImage").attr("src", images[nextIndex].attr("src"));
    },

    createLightBox($gallery, lightboxId, navigation) {
      $gallery.append(`
          <div class="modal fade" id="${
            lightboxId || "galleryLightbox"
          }" tabindex="-1" role="dialog" aria-hidden="true">
            <div class="modal-dialog" role="document">
              <div class="modal-content">
                <div class="modal-body">
                  ${
                    navigation
                      ? `
                    <div class="mg-prev" role="button" tabindex="0" aria-label="Image précédente"
                      style="cursor:pointer;position:absolute;top:50%;left:-15px;background:white;">&lt;</div>`
                      : ""
                  }
                  <img class="lightboxImage img-fluid" alt="Image affichée dans la modale" />
                  ${
                    navigation
                      ? `
                    <div class="mg-next" role="button" tabindex="0" aria-label="Image suivante"
                      style="cursor:pointer;position:absolute;top:50%;right:-15px;background:white;">&gt;</div>`
                      : ""
                  }
                </div>
              </div>
            </div>
          </div>
        `);
    },

    showItemTags($gallery, position, tags) {
      let tagItems = `
  <li class="nav-item">
    <button class="nav-link active active-tag" type="button" data-images-toggle="all">Tous</button>
  </li>`;

      tags.forEach((tag) => {
        tagItems += `
        <li class="nav-item">
          <button class="nav-link" data-images-toggle="${tag}" type="button">${tag}</button>
        </li>`;
      });
      const tagsBar = `<ul class="my-4 tags-bar nav nav-pills">${tagItems}</ul>`;

      if (position === "top") {
        $gallery.prepend(tagsBar);
      } else if (position === "bottom") {
        $gallery.append(tagsBar);
      } else {
        console.error(`Unknown tags position: ${position}`);
      }
    },

    filterByTag() {
      if ($(this).hasClass("active-tag")) return;

      $(".active-tag").removeClass("active active-tag");
      $(this).addClass("active active-tag");

      const tag = $(this).data("images-toggle");

      $(".gallery-item").each(function () {
        const $column = $(this).parents(".item-column");
        $column.hide();
        if (tag === "all" || $(this).data("gallery-tag") === tag) {
          $column.show(300);
        }
      });
    },
  };
})(jQuery);
