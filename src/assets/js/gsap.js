(function(jQuery) {
  "use strict";
  document.addEventListener('DOMContentLoaded', (event) => {
    if(typeof gsap !== typeof undefined) {
      if (typeof ScrollTrigger !== typeof undefined) {
        gsap.registerPlugin(ScrollTrigger);
      }
      const gsapAnimate = {
        onStart : (elem) => {
          const option = {
            opacity: 0,
            scale: 1,
            position: {
              x: 0,
              y:0,
            },
            ease: "",
            duration: 1,
            delay: .4,
            rotate: 0
          }

          option.position.x = gsapAnimate.validValue(elem.dataset.iqPositionX, 0)

          option.position.y = gsapAnimate.validValue(elem.dataset.iqPositionY, 0)

          option.rotate = gsapAnimate.validValue(elem.dataset.iqRotate, 0)

          option.scale = gsapAnimate.validValue(elem.dataset.iqScale, 1)

          option.opacity = gsapAnimate.validValue(elem.dataset.iqOpacity, 0)

          option.delay = gsapAnimate.validValue(elem.dataset.iqDelay, .4)

          option.duration = gsapAnimate.validValue(elem.dataset.iqDuration, 1.5)

          option.ease = gsapAnimate.validValue(elem.dataset.iqEase, '')

          const setOption = {opacity: option.opacity, scale: option.scale, x: option.position.x, y: option.position.y, ease: option.ease, rotate: option.rotate, duration: option.duration, delay: option.delay}

          if (typeof ScrollTrigger !== typeof undefined) {
            if (elem.dataset.iqTrigger == 'scroll') {
              const scrub = elem.dataset.iqScrollScrub === 'true' ? true : false

              setOption.scrollTrigger = {
                trigger: elem,
                start: () => "top 90%",
                // end: () => "bottom 10%",
                scrub: scrub,
                markers: false
              }
            }
          }

          gsap.from(elem, setOption)

        },
        validValue: (attr, defaultVal) => {
          if (attr !== undefined && attr !== null) {
            return attr
          }
          return defaultVal
        }
      }

      const gsapElem = document.querySelectorAll('[data-iq-gsap="onStart"]')

      Array.from(gsapElem, (elem) => {
        gsapAnimate.onStart(elem)
      })
      // Home Page 1 banner
      if(jQuery('#home-1').length) {
        let home1 = gsap.timeline({defaults:{opacity: 0, duration: .8}, repeatDelay: .1, delay: 1});
        home1.from('#banner-title', {y: 50})
        home1.from('#banner-description', {y: 50})
        home1.from('#banner-action', { y: 50 })
        home1.from('#banner-image-bg', { scale: .9 })
        home1.from('#banner-image', { scale: .9 })
        gsap.from('.slider-2', {opacity: 0, x: 100, rotate: 90, duration: 2, delay: 1.5})
        gsap.from('.slider-3', { opacity: 0, y: -100, duration: 2, delay: 2 })
        gsap.from('.slider-4', { opacity: 0, x: 100, y: 130, duration: 2, delay: 2.5 })
        gsap.from('.slider-5', { opacity: 0, scale: .9, rotate: 10, duration: 2, delay: 3 })
        gsap.from('.slider-text', { opacity: 0, x: -50, duration: 2, delay: 3 })
        gsap.from('.slider-6', { opacity: 0, x: -50, rotate: -30, duration: 2, delay: 4 })

        // Mouse Move Animation
        document.addEventListener('mousemove', (e) => {
          let xPos = (e.clientX * .010)
          let yPos = (e.clientY * .010)
          // Change Elem For Movement
          gsap.to('#banner-slider-image', {x: xPos, y: yPos, duration: .5})
        })

      }

      // Home Page 2 banner
      if(jQuery('#home-2').length) {
        gsap.from('#banner-title', {opacity: 0, y: 50, duration: 1.5, delay: .8, ease: "power1.out"})
        gsap.from('#banner-description', {opacity: 0, y: 50, duration: 1.5, delay: 1.3, ease: "power1.out"})
        gsap.from('#banner-action', { opacity: 0, y: 50, duration: 1.5, delay: 2, ease: "power1.out" })
        gsap.from('#banner-image', { opacity:0, x: 100, scale: 1.1, duration: 2, delay: 1.8 })
        gsap.from('.slider-1', {opacity: 0, scale: .8, duration: 1, delay: 2.5})
        gsap.from('.slider-2', { opacity: 0, scale: .8, duration: 1, delay: 2.6 })
        gsap.from('.slider-3', { opacity: 0, scale: .8, duration: 1, delay: 2.7 })
        gsap.from('.slider-4', { opacity: 0, scale: .8, duration: 1, delay: 2.8 })
        gsap.from('.slider-5', {opacity: 0, scale: .8, duration: 1, delay: 2.9})
        // Mouse Move Animation
        document.addEventListener('mousemove', (e) => {
          let xPos = (e.clientX * .008)
          let yPos = (e.clientY * .008)
          // Change Elem For Movement
          gsap.to('#banner-slider2-image', {x: xPos, y: yPos,duration: .5})
        })
      }

      // Home Page 3 banner
      if(jQuery('#home-3').length) {
        gsap.from('#banner-title', {opacity: 0, y: 50, duration: 1, delay: 1, ease: "power1.out"})
        gsap.from('#banner-description', {opacity: 0, y: 50, duration: .8, delay: 1.3, ease: "power1.out"})
        gsap.from('#banner-action', {opacity: 0, y: 50, duration: 1, delay: .8, ease: "power1.out"})
        gsap.from('#banner-image', { opacity: 0, scale: .8, duration: 1, delay: 2 })

        gsap.from('.slider-1', {opacity: 0, scale: .8, duration: 1, delay: 1.5})
        gsap.from('.slider-2', { opacity: 0, scale: .8, duration: 1, delay: 1.6 })

        // Mouse Move Animation
        document.addEventListener('mousemove', (e) => {
          let xPos = (e.clientX * .008)
          let yPos = (e.clientY * .008)
          // Change Elem For Movement
          gsap.to('#banner-slider3-image', {x: xPos, y: yPos,duration: .5})
        })
      }

      const animatedButton = document.querySelectorAll('.animation-btn')
      Array.from(animatedButton, (elem) => {
        elem.innerHTML = elem.textContent.replace(/\S/g, "<span class='anim d-inline-block'>$&</span>") + '<i aria-hidden="true" class="fas fa-long-arrow-alt-right ms-2"></i>'
          const t1 = gsap.timeline()
          t1.to(elem.querySelectorAll('.anim'), {y: -4, stagger: {each: .1, repeat: 1, yoyo: true}, duration: .4})
          t1.pause();
          elem.addEventListener('mouseenter',(e) => {
          if (!elem.classList.contains('animate-state')) {
            elem.classList.add('animate-state')
            t1.restart()
            t1.eventCallback("onComplete", function() {
              elem.classList.remove('animate-state')
            });
          }
        })
      })
    }
  })
})(jQuery);
