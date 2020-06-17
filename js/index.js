const animations = {
    // cache dom
    vars: {
        Swiper: require('swiper'),
        $header: $('header'),
        $sliderArrow: $('.slide-container-arrow'),
    },

    // bind events
    init() {
        var swiper = new Swiper('.swiper-container', {
            slidesPerView: 6,
            spaceBetween: 20,
            scrollContainer: true,
            freeMode: true,

            scrollbar: {
                el: '.swiper-scrollbar',
                draggable: true,
                hide: true,
                snapOnRelease: false,
            },
            navigation: {
                nextEl: '.swiper-button-next-unique',
                prevEl: '.swiper-button-prev-unique',
                disabledClass: 'disabled',
            },
            mousewheel: {
                invert: false,
            },

            breakpoints: {
                0: {
                    slidesPerView: 2,
                    spaceBetween: 20,
                },
                640: {
                    slidesPerView: 3,
                    spaceBetween: 20,
                },
                768: {
                    slidesPerView: 6,
                    spaceBetween: 10,
                },
                1500: {
                    slidesPerView: 7,
                    spaceBetween: 50,
                },
            },
        });
        this.getHeaderHieght();
        this.scrollEvents();
        this.mobileSlideDownLinks();
    },

    getHeaderHieght() {
        const headerHeight = this.vars.$header.height();

        // use height of header to calculate next sections padding top
        this.vars.$sliderArrow.css('paddingTop', headerHeight);
    },

    scrollEvents() {
        let lastScrollTop = 0;

        $(window).scroll(function (event) {
            let scrollTop = $(this).scrollTop();
            // scroll down
            if (scrollTop > lastScrollTop) {
                $('.row-2, .logo, .sale-banner').addClass('small');
            } else if (scrollTop == 0) {
                // scroll up reset
                $('.row-2, .logo, .sale-banner').removeClass('small');
            }

            lastScrollTop = scrollTop;
        });
    },

    mobileSlideDownLinks() {
        $('.footer-links h4').click(function () {
            // open menu
            if (!$(this).hasClass('open')) {
                $(this)
                    .siblings('.link-container')
                    .slideDown(function () {
                        $(this).siblings('h4').toggleClass('open');
                    });
            } else {
                // close menu
                $(this)
                    .siblings('.link-container')
                    .slideUp(function () {
                        $(this).siblings('h4').toggleClass('open');
                    });
            }
        });
    },
};

$(document).ready(() => animations.init());
