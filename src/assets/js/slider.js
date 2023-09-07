(function (jQuery) {
  "use strict";
  if (jQuery('.organic-product').length > 0) {
    new Swiper('.organic-product', {
      loop: true,
      slidesPerView: 4,
      autoplay: {
        delay: 3000
      },
      spaceBetween: 20,
      breakpoints: {
        320: {
          slidesPerView: 1
        },
        550: {
          slidesPerView: 2
        },
        768: {
          slidesPerView: 2
        },
        1199: {
          slidesPerView: 2
        },
        1400: {
          slidesPerView: 3
        }
      },
      pagination: {
        el: '.swiper-pagination'
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev'
      },
    });
  }
  if (jQuery('.related-product').length > 0) {
    new Swiper('.related-product', {
      loop: true,
      slidesPerView: 4,
      autoplay: {
        delay: 3000
      },
      spaceBetween: 20,
      breakpoints: {
        320: { slidesPerView: 1 },
        550: { slidesPerView: 2 },
        991: { slidesPerView: 2 },
        1100: { slidesPerView: 3 },
        1400: { slidesPerView: 4 },
        1500: { slidesPerView: 4 },
        1920: { slidesPerView: 4 },
        2040: { slidesPerView: 4 },
        2440: { slidesPerView: 4 }
      },
      pagination: {
        el: '.swiper-pagination'
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev'
      },
    });
  }

  if (jQuery('.featured-product').length > 0) {
    new Swiper('.featured-product', {
      loop: true,
      slidesPerView: 4,
      autoplay: {
        delay: 3000
      },
      spaceBetween: 20,
      breakpoints: {
        320: {
          slidesPerView: 1
        },
        550: {
          slidesPerView: 2
        },
        768: {
          slidesPerView: 2
        },
        1199: {
          slidesPerView: 2
        },
        1400: {
          slidesPerView: 3
        }
      },
      pagination: {
        el: '.swiper-pagination'
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev'
      },
    });
  }
  if (jQuery('.testimonial-slider').length > 0) {
    new Swiper('.testimonial-slider', {
      loop: true,
      autoplay: {
        delay: 3000
      },
      slidesPerView: 5,
      spaceBetween: 0,
      breakpoints: {
        320: {
          slidesPerView: 1
        },
        550: {
          slidesPerView: 2
        },
        768: {
          slidesPerView: 2
        },
        1199: {
          slidesPerView: 3
        },
        1400: {
          slidesPerView: 3
        }
      },
      pagination: {
        el: '.swiper-pagination'
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev'
      },
    });
  }
  if (jQuery('.latest-blog').length > 0) {
    new Swiper('.latest-blog', {
      slidesPerView: 5,
      spaceBetween: 30,
      breakpoints: {
        320: {
          slidesPerView: 1
        },
        550: {
          slidesPerView: 2
        },
        768: {
          slidesPerView: 2
        },
        1199: {
          slidesPerView: 3
        },
        1400: {
          slidesPerView: 3
        }
      },
      pagination: {
        el: '.swiper-pagination'
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev'
      },
    });
  }

  const swiperImage = new Swiper(".mySwiper", {
    spaceBetween: 10,
    slidesPerView: 3,
    freeMode: true,
    watchSlidesProgress: false,
  });
  const swiperProduct = new Swiper(".mySwiper2", {
    spaceBetween: 10,
    thumbs: {
      swiper: swiperImage,
    },
});
})(jQuery);
