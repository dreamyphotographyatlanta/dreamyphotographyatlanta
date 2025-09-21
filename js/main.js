/*  ---------------------------------------------------
    Template Name: Phozogy
    Description:  Phozogy photography HTML Template
    Author: Colorlib
    Author URI: https://colorlib.com
    Version: 1.0
    Created: Colorlib
---------------------------------------------------------  */

'use strict';

(function ($) {

    /*------------------
        Preloader
    --------------------*/
    $(window).on('load', function () {
        $(".loader").fadeOut();
        $("#preloder").delay(200).fadeOut("slow");
    });

    /*------------------
        Background Set
    --------------------*/
    var applySetBackground = function ($scope) {
        var $targets;

        if ($scope && $scope.length) {
            $targets = $scope.filter('.set-bg').add($scope.find('.set-bg'));
        } else {
            $targets = $('.set-bg');
        }

        $targets.each(function () {
            var $this = $(this);
            var bg = $this.attr('data-setbg');

            if (bg) {
                $this.css('background-image', 'url(' + bg + ')');
            }
        });
    };

    applySetBackground();

    // Search model
    $('.search-switch').on('click', function () {
        $('.search-model').fadeIn(400);
    });

    $('.search-close-switch').on('click', function () {
        $('.search-model').fadeOut(400, function () {
            $('#search-input').val('');
        });
    });

    // Isotope Filter
    $(".filter-controls li").on('click', function () {
        var filterData = $(this).attr("data-filter");

        $(".portfolio-filter, .gallery-filter").isotope({
            filter: filterData,
        });

        $(".filter-controls li").removeClass('active');
        $(this).addClass('active');
    });

    $(".portfolio-filter, .gallery-filter").isotope({
        itemSelector: '.pf-item, .gf-item',
        percentPosition: true,
        masonry: {
            columnWidth: '.pf-item, .gf-item',
            horizontalOrder: true,
        }
    });

    // Masonry
    $('.portfolio-details-pic').masonry({
        itemSelector: '.pdp-item',
        columnWidth: '.pdp-item'
    });

    /*------------------
        Navigation
    --------------------*/
    $(".mobile-menu").slicknav({
        prependTo: '#mobile-menu-wrap',
        allowParentLinks: true
    });

    /*------------------
        Carousel Slider
    --------------------*/
    var hero_s = $(".hs-slider");
    hero_s.owlCarousel({
        loop: true,
        margin: 0,
        nav: true,
        items: 1,
        dots: false,
        animateOut: 'fadeOut',
        animateIn: 'fadeIn',
        navText: ['<span class="arrow_carrot-left"></span>', '<span class="arrow_carrot-right"></span>'],
        smartSpeed: 1200,
        autoHeight: false,
        autoplay: true
    });

    /*------------------
        Team Slider
    --------------------*/
    $(".categories-slider").owlCarousel({
        loop: true,
        margin: 20,
        items: 3,
        dots: false,
        nav: true,
        navText: ['<span class="arrow_carrot-left"></span>', '<span class="arrow_carrot-right"></span>'],
        stagePadding: 120,
        smartSpeed: 1200,
        autoHeight: false,
        autoplay: true,
        responsive: {
            0: {
                items: 1,
                stagePadding: 0
            },
            768: {
                items: 2,
                stagePadding: 0
            },
            992: {
                items: 2
            },
            1200: {
                items: 3
            }
        }
    });

    /*------------------
        Image Popup
    --------------------*/
    $('.image-popup').magnificPopup({
        type: 'image'
    });

    /*------------------
        Video Popup
    --------------------*/
    $('.video-popup').magnificPopup({
        type: 'iframe'
    });

    // Dynamic portfolio loader for index page
    var $dynamicPortfolio = $('.js-dynamic-portfolio');
    if ($dynamicPortfolio.length) {
        if (!window.fetch) {
            return;
        }

        var manifestUrl = 'img/media-manifest.json';
        var videosUrl = 'img/videos.txt';

        var capitalize = function (str) {
            if (!str) {
                return '';
            }
            return str.charAt(0).toUpperCase() + str.slice(1);
        };

        var formatTitleFromPath = function (path) {
            if (!path) {
                return '';
            }
            var filename = path.split('/').pop() || '';
            filename = filename.replace(/\.[^/.]+$/, '');
            filename = filename.replace(/[-_]+/g, ' ');
            var title = filename.replace(/\b\w/g, function (char) {
                return char.toUpperCase();
            });

            return title;
        };

        var buildImageItem = function (src, category) {
            var $item = $('<div>', {
                'class': 'pf-item set-bg ' + category,
                'data-setbg': src
            });
            $item.attr('data-category', category);

            var $icon = $('<a>', {
                'class': 'pf-icon image-popup',
                'href': src
            }).append('<span class="icon_plus"></span>');

            var label = capitalize(category);
            var title = formatTitleFromPath(src);

            var $text = $('<div>', { 'class': 'pf-text' })
                .append($('<h4>').text(title))
                .append($('<span>').text(label));

            $item.append($icon).append($text);
            return $item;
        };

        var extractYoutubeId = function (url) {
            if (!url) {
                return '';
            }
            var match = url.match(/[?&]v=([^&#]+)/);
            if (match && match[1]) {
                return match[1];
            }
            match = url.match(/youtu\.be\/([^?&#]+)/);
            if (match && match[1]) {
                return match[1];
            }
            return '';
        };

        var buildVideoItem = function (url) {
            var videoId = extractYoutubeId(url);
            if (!videoId) {
                return null;
            }

            var thumbnail = 'https://img.youtube.com/vi/' + videoId + '/hqdefault.jpg';
            var $item = $('<div>', {
                'class': 'pf-item set-bg videos',
                'data-setbg': thumbnail
            }).attr('data-video-id', videoId);

            var $icon = $('<a>', {
                'class': 'pf-icon video-popup',
                'href': url
            }).append('<span class="icon_triangle-right"></span>');

            var $text = $('<div>', { 'class': 'pf-text' })
                .append($('<h4>').text('Portrait Video'))
                .append($('<span>').text('Videos'));

            $item.append($icon).append($text);
            return $item;
        };

        Promise.all([
            fetch(manifestUrl).then(function (response) {
                if (!response.ok) {
                    throw new Error('Media manifest not found');
                }
                return response.json();
            }).catch(function () {
                return {};
            }),
            fetch(videosUrl).then(function (response) {
                if (!response.ok) {
                    return '';
                }
                return response.text();
            }).catch(function () {
                return '';
            })
        ]).then(function (results) {
            var manifest = results[0] || {};
            var videoText = results[1] || '';
            var elements = [];

            Object.keys(manifest).forEach(function (category) {
                var files = manifest[category] || [];
                files.forEach(function (src) {
                    var $element = buildImageItem(src, category);
                    elements.push($element);
                });
            });

            if (videoText) {
                videoText.split(',')
                    .map(function (item) {
                        return item.trim();
                    })
                    .filter(function (item) {
                        return item.length;
                    })
                    .forEach(function (videoUrl) {
                        var $videoItem = buildVideoItem(videoUrl);
                        if ($videoItem) {
                            elements.push($videoItem);
                        }
                    });
            }

            if (!elements.length) {
                return;
            }

            var $items = $(elements);
            $dynamicPortfolio.append($items);
            applySetBackground($items);

            if ($dynamicPortfolio.data('isotope')) {
                $dynamicPortfolio.isotope('appended', $items);
                $dynamicPortfolio.isotope('layout');
            } else {
                $dynamicPortfolio.isotope({
                    itemSelector: '.pf-item',
                    percentPosition: true,
                    masonry: {
                        columnWidth: '.pf-item',
                        horizontalOrder: true
                    }
                });
            }

            $('.image-popup').magnificPopup({
                type: 'image'
            });
            $('.video-popup').magnificPopup({
                type: 'iframe'
            });
        });
    }

})(jQuery);


