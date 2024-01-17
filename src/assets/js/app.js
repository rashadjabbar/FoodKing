setTimeout(() => {
    /*
 * Template: Foodsto - Grocery & Food Store Bootstrap 5 Theme
 * Author: iqonic.design
 * Design and Developed by: iqonic.design
 * NOTE: This file contains the initialize scripts.
 */

    /*----------------------------------------------
    Index Of Script
    ------------------------------------------------
    
    :: Magnific Popup
    :: Swiper
    :: Smooth Scrollbar
    :: Top to Bottom
    :: Minus-plus
    :: NoUiSlider
    :: LoaderInit
    
    ------------------------------------------------
    Index Of Script
    ----------------------------------------------*/
    (function (jQuery) {
        "use strict";

        const header = document.querySelector('#iq-menu-container')
        if (header !== null) {
            const headerActiveItem = header.querySelectorAll('.current-menu-item')
            Array.from(headerActiveItem, (elem) => {
                if (elem.closest('.sub-menu') !== null) {
                    const childMenu = elem.closest('.current-menu-item').parentElement.parentElement
                    const sections = header.querySelectorAll('.active');
                    for (let i = 0; i < sections.length; i++) {
                        sections[i].classList.remove('active');
                    }
                    childMenu.classList.add('active')
                }
            })
        }
        /*---------------------------------------------------------------------
                      Swiper
        -----------------------------------------------------------------------*/

        function headerHeight() {
            let height = document.querySelector(".header1").offsetHeight;
            document.querySelector('.iq-height').style.height = height + 'px';
        }

        let navbar = document.querySelector(".header1"),
            yOffset = 0,
            triggerPoint = 80;
        headerHeight();

        window.addEventListener('resize', headerHeight);
        window.addEventListener('scroll', function () {

            yOffset = document.documentElement.scrollTop;

            if (yOffset >= triggerPoint) {
                navbar.classList.add("menu-sticky", "animated", "slideInDown");
            } else {
                navbar.classList.remove("menu-sticky", "animated", "slideInDown");
            }

        });

        if (document.querySelector('header').classList.contains('has-sticky')) {
            window.addEventListener('scroll', function () {

                var height = document.querySelector('.navbar').outerHeight;
                if (document.documentElement.scrollTop > height) {
                    document.querySelector('.has-sticky .logo').classList.add('logo-display');
                } else if (document.documentElement.scrollTop <= height) {
                    document.querySelector('.has-sticky .logo').classList.remove('logo-display');
                }
            });
        }

        /*---------------------------------------------------------------------
                      Top to Bottom
        -----------------------------------------------------------------------*/
        const backToTop = document.querySelector('#back-to-top')

        backToTop.classList.add('animate__animated', 'animate__fadeOut')

        window.addEventListener('scroll', (e) => {
            if (document.documentElement.scrollTop > 250) {
                backToTop.classList.remove('animate__fadeOut')
                backToTop.classList.add('animate__fadeIn')

            } else {
                backToTop.classList.remove('animate__fadeIn')
                backToTop.classList.add('animate__fadeOut')
            }
        })

        // scroll body to 0px on click
        document.querySelector('#top').addEventListener('click', (e) => {
            e.preventDefault()
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        })

        /*---------------------------------------------------------------------
                      Minus-plus
        -----------------------------------------------------------------------*/

        const plusBtns = document.querySelectorAll('.plus')

        const minusBtns = document.querySelectorAll('.minus')

        // const updateQtyBtn = (elem, value) => {
        //     const oldValue = elem.closest('[data-qty="btn"]').querySelector('[data-qty="input"]').value
        //     const newValue = Number(oldValue) + Number(value)
        //     if (newValue >= 1) {
        //         elem.closest('[data-qty="btn"]').querySelector('[data-qty="input"]').value = newValue
        //     }
        // }

        // Array.from(plusBtns, (elem) => {
        //     elem.addEventListener('click', (e) => {
        //         updateQtyBtn(elem, 1)
        //     })
        // })

        // Array.from(minusBtns, (elem) => {
        //     elem.addEventListener('click', (e) => {
        //         updateQtyBtn(elem, -1)
        //     })
        // })


        /*---------------------------------------------------------------------
                      LoaderInit
        -----------------------------------------------------------------------*/

        const loaderInit = () => {
            const loader = document.querySelector('.loader')
            loader.classList.add('animate__animated', 'animate__fadeOut')
            setTimeout(() => {
                loader.classList.add('d-none')
            }, 100)
        }
        /*----------------------------------------------------------------------
                      Sweetalerts
        ----------------------------------------------------------------------*/
        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
                confirmButton: 'btn btn-primary ms-3 text-white fw-bold h6',
                cancelButton: 'btn btn-secondary text-white fw-bold h6'
            },
            buttonsStyling: false
        })
        const alertButton = document.querySelectorAll('[data-alert="sweetalert-product"]')
        Array.from(alertButton, (btn) => {
            btn.addEventListener('click', () => {
                swalWithBootstrapButtons.fire({
                    title: 'Added to cart!',
                    text: "Side Dish",
                    icon: 'success',
                    showCancelButton: true,
                    confirmButtonText: 'Continue shopping',
                    cancelButtonText: 'Checkout',
                    reverseButtons: true
                }).then((result) => {
                    if (result.isConfirmed) {
                        btn.querySelector('.btn').innerHTML = 'View Cart <i aria-hidden="true" class="fas fa-long-arrow-alt-right ms-2"></i>'
                        return true
                    } else if (
                        /* Read more about handling dismissals below */
                        result.dismiss === Swal.DismissReason.cancel
                    ) {
                        window.location.replace('./checkout.html')
                    }
                })
            })
        })

        /*-------------------------------
            sweet alert for heart
            -----------------------*/

        const alertButton1 = document.querySelectorAll('[data-alert="sweetalert-heart"]')
        Array.from(alertButton1, (btn) => {
            btn.addEventListener('click', () => {
                swalWithBootstrapButtons.fire({
                    title: 'Added to Wishlist!',
                    text: "Loved",
                    icon: 'success',
                    showCancelButton: false,
                    confirmButtonText: 'Ok',
                    reverseButtons: true
                }).then((result) => {
                    if (result.isConfirmed) {
                        window.location.replace('./wishlist.html')
                    }
                })
            })
        })


        /*---------------------------------------------------------------------
                      DOMContentLoaded
        -----------------------------------------------------------------------*/
        document.addEventListener('DOMContentLoaded', (event) => {
            loaderInit()
        });


        /*---------------------------------------------------------
                            Custom Scripts
        ----------------------------------------------------------*/
        const btn = document.querySelector('#update-cart')
        if (btn !== null) {
            btn.addEventListener('click', (e) => {
                const products = document.querySelectorAll('.product')
                Array.from(products, (row) => {
                    const price = row.querySelector('.price').innerText
                    const qty = row.querySelector('.qty').value
                    let subTotal = Number(price) * Number(qty)
                    row.querySelector('.sub-total').innerText = subTotal
                })
            })
        }
        if (jQuery(window).width() < 1200) {
            jQuery('#top-menu .menu-item').on('click', function (e) {
                e.preventDefault();
                jQuery(this).next('.sub-menu').slideToggle();
            });
        }
    })(jQuery);

}, 1000);

const myMediaQuery = window.matchMedia('(max-width: 641x)')
function widthChangeCallback(myMediaQuery) {
    if (myMediaQuery.matches) {
        const navLinks = document.querySelectorAll('.nav-item-mobile')
        const menuToggle = document.getElementById('navbarSupportedContent')
        const bsCollapse = bootstrap.Collapse.getOrCreateInstance(menuToggle, { toggle: false })
        navLinks.forEach((l) => {
            l.addEventListener('click', () => { bsCollapse.toggle() })
        })
    } else {
        
    }
}
myMediaQuery.addEventListener('change', widthChangeCallback);

widthChangeCallback(myMediaQuery);
