/* ============================================
   Personal Page JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {
    initPlacesSection();
    initLeafletMap();
    initBooksSection();
    initMusicPlayer();
    initBikeSection();
    if (document.getElementById('bikeGallery')) initBikeGallery();
});

function initPlacesSection() {
    const mapContainer = document.getElementById('placesMapContainer');
    const imagesWrapper = document.getElementById('placesImagesWrapper');
    const imagesContainer = document.getElementById('placesImagesScroll') || document.querySelector('.places-images-container');
    const imageItems = document.querySelectorAll('.place-image-item');
    const placesSection = document.querySelector('.section-places');
    const navLeftBtn = document.getElementById('placesNavLeft');
    const navRightBtn = document.getElementById('placesNavRight');
    
    if (!mapContainer || !imagesWrapper || !imagesContainer || !placesSection) return;

    let isMapLocked = true;
    let lastScrollTop = 0;
    let lastScrollLeft = 0;
    let ticking = false;
    let isDesktop = window.innerWidth >= 1025;

    // Intersection Observer for image fade-in animations
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.2,
        rootMargin: '0px 0px -100px 0px'
    });

    // Observe all image items
    imageItems.forEach(item => {
        imageObserver.observe(item);
    });

    // Intersection Observer for last image to detect when it finishes scrolling
    // This provides a backup detection method in addition to scroll events
    const lastImageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const lastImage = entry.target;
            const lastImageRect = lastImage.getBoundingClientRect();
            const containerRect = imagesContainer.getBoundingClientRect();
            
            if (isDesktop) {
                // Desktop: Check horizontal scrolling
                if (lastImageRect.right <= containerRect.right + 5) {
                    // Last image has finished scrolling
                    if (isMapLocked) {
                        unlockMap();
                    }
                } else if (lastImageRect.right > containerRect.right) {
                    // Last image is still visible, keep map locked
                    if (!isMapLocked) {
                        lockMap();
                    }
                }
            } else {
                // Mobile: Check vertical scrolling
                if (lastImageRect.bottom <= containerRect.bottom + 5) {
                    // Last image has finished scrolling
                    if (isMapLocked) {
                        unlockMap();
                    }
                } else if (lastImageRect.bottom > containerRect.bottom) {
                    // Last image is still visible, keep map locked
                    if (!isMapLocked) {
                        lockMap();
                    }
                }
            }
        });
    }, {
        root: imagesContainer,
        threshold: [0, 0.1, 0.5, 1.0],
        rootMargin: '0px'
    });

    // Observe the last image
    if (imageItems.length > 0) {
        const lastImage = imageItems[imageItems.length - 1];
        lastImageObserver.observe(lastImage);
    }

    // Update navigation button states
    function updateNavButtons() {
        if (!isDesktop || !navLeftBtn || !navRightBtn) return;
        
        const scrollLeft = imagesContainer.scrollLeft;
        const scrollWidth = imagesContainer.scrollWidth;
        const containerWidth = imagesContainer.clientWidth;
        
        // Check if at start
        const isAtStart = scrollLeft <= 10;
        // Check if at end
        const isAtEnd = scrollLeft + containerWidth >= scrollWidth - 10;
        
        navLeftBtn.disabled = isAtStart;
        navRightBtn.disabled = isAtEnd;
    }

    // Scroll handler for sticky map and unlock logic
    function handleScroll() {
        if (ticking) return;
        
        ticking = true;
        requestAnimationFrame(() => {
            if (isDesktop) {
                // Desktop: Horizontal scrolling
                const scrollLeft = imagesContainer.scrollLeft;
                const scrollWidth = imagesContainer.scrollWidth;
                const containerWidth = imagesContainer.clientWidth;
                
                // Calculate if we've reached the right end
                const scrollRight = scrollLeft + containerWidth;
                const isAtEnd = scrollRight >= scrollWidth - 10;
                
                // Update navigation buttons
                updateNavButtons();
                
                // Check if last image has scrolled past
                const lastImage = imageItems[imageItems.length - 1];
                if (lastImage) {
                    const lastImageRect = lastImage.getBoundingClientRect();
                    const containerRect = imagesContainer.getBoundingClientRect();
                    
                    // Check if last image has completely scrolled past (horizontally)
                    const lastImageRight = lastImageRect.right;
                    const containerRight = containerRect.right;
                    const lastImageFinished = lastImageRight <= containerRight + 5;
                    
                    // If we've scrolled to the end OR last image has finished scrolling
                    if (isAtEnd || lastImageFinished) {
                        if (isMapLocked) {
                            unlockMap();
                        }
                    } else {
                        // Keep map locked while images are still scrolling
                        if (!isMapLocked && scrollLeft > 0) {
                            lockMap();
                        }
                    }
                }
                
                lastScrollLeft = scrollLeft;
            } else {
                // Mobile: Vertical scrolling (original logic)
                const scrollTop = imagesContainer.scrollTop;
                const scrollHeight = imagesContainer.scrollHeight;
                const containerHeight = imagesContainer.clientHeight;
                
                // Calculate if we've reached the bottom of the images container
                const scrollBottom = scrollTop + containerHeight;
                const isAtBottom = scrollBottom >= scrollHeight - 10;
                
                // Check if last image has scrolled past
                const lastImage = imageItems[imageItems.length - 1];
                if (lastImage) {
                    const lastImageRect = lastImage.getBoundingClientRect();
                    const containerRect = imagesContainer.getBoundingClientRect();
                    
                    const lastImageBottom = lastImageRect.bottom;
                    const containerBottom = containerRect.bottom;
                    const lastImageFinished = lastImageBottom <= containerBottom + 5;
                    
                    // If we've scrolled to the bottom OR last image has finished scrolling
                    if (isAtBottom || lastImageFinished) {
                        if (isMapLocked) {
                            unlockMap();
                        }
                    } else {
                        // Keep map locked while images are still scrolling
                        if (!isMapLocked && scrollTop > 0) {
                            lockMap();
                        }
                    }
                }

                // Parallax effect for images (mobile only)
                imageItems.forEach((item, index) => {
                    const rect = item.getBoundingClientRect();
                    const containerRect = imagesContainer.getBoundingClientRect();
                    
                    if (rect.top < containerRect.bottom && rect.bottom > containerRect.top) {
                        const itemProgress = (containerRect.bottom - rect.top) / (rect.height + containerRect.height);
                        const parallaxOffset = (itemProgress - 0.5) * 30;
                        item.style.transform = `translateY(${parallaxOffset}px)`;
                    } else {
                        item.style.transform = '';
                    }
                });

                lastScrollTop = scrollTop;
            }
            
            ticking = false;
        });
    }

    function lockMap() {
        if (!isMapLocked) {
            isMapLocked = true;
            mapContainer.classList.remove('unlocked');
        }
    }

    function unlockMap() {
        if (isMapLocked) {
            isMapLocked = false;
            mapContainer.classList.add('unlocked');
        }
    }

    // Navigation button handlers (Desktop only)
    if (isDesktop && navLeftBtn && navRightBtn) {
        navLeftBtn.addEventListener('click', () => {
            const scrollAmount = imagesContainer.clientWidth;
            imagesContainer.scrollBy({
                left: -scrollAmount,
                behavior: 'smooth'
            });
        });
        
        navRightBtn.addEventListener('click', () => {
            const scrollAmount = imagesContainer.clientWidth;
            imagesContainer.scrollBy({
                left: scrollAmount,
                behavior: 'smooth'
            });
        });
        
        // Initial button state
        updateNavButtons();
    }

    // Listen to scroll events on images container
    imagesContainer.addEventListener('scroll', handleScroll, { passive: true });
    
    // Also add wheel event listener for better desktop support
    imagesContainer.addEventListener('wheel', handleScroll, { passive: true });
    
    // Also listen to window scroll to handle page scrolling after unlock
    let windowScrollTicking = false;
    function handleWindowScroll() {
        if (windowScrollTicking) return;
        
        windowScrollTicking = true;
        requestAnimationFrame(() => {
            // If map is unlocked, it will naturally scroll with the page
            // Check if we need to re-lock if user scrolls back up
            if (!isMapLocked) {
                const scrollTop = imagesContainer.scrollTop;
                const scrollHeight = imagesContainer.scrollHeight;
                const containerHeight = imagesContainer.clientHeight;
                const isAtBottom = scrollTop + containerHeight >= scrollHeight - 10;
                
                // If not at bottom and map is unlocked, check if we should re-lock
                if (!isAtBottom && scrollTop < scrollHeight - containerHeight - 100) {
                    // User scrolled back up, re-lock the map
                    lockMap();
                }
            }
            windowScrollTicking = false;
        });
    }
    
    window.addEventListener('scroll', handleWindowScroll, { passive: true });
    
    // Initial check after a short delay to ensure DOM is ready
    setTimeout(() => {
        handleScroll();
    }, 100);

    // Smooth scroll behavior enhancement
    let scrollTimeout;
    imagesContainer.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            // Smooth scroll ended - do final check
            handleScroll();
        }, 150);
    }, { passive: true });
    
    // Also handle resize events to recalculate on window resize
    window.addEventListener('resize', () => {
        // Update desktop detection
        const wasDesktop = isDesktop;
        isDesktop = window.innerWidth >= 1025;
        
        // If switching between desktop/mobile, update observers and buttons
        if (wasDesktop !== isDesktop) {
            // Reinitialize observers if needed
            if (imageItems.length > 0) {
                const lastImage = imageItems[imageItems.length - 1];
                lastImageObserver.observe(lastImage);
            }
            
            // Update button visibility
            if (navLeftBtn && navRightBtn) {
                if (isDesktop) {
                    updateNavButtons();
                } else {
                    navLeftBtn.disabled = false;
                    navRightBtn.disabled = false;
                }
            }
        }
        
        setTimeout(handleScroll, 100);
    }, { passive: true });
}

// Function to load neighboring countries that share borders with India
function loadNeighboringCountries(map) {
    // Countries that share borders with India: Pakistan, China, Nepal, Bhutan, Bangladesh, Myanmar, Afghanistan
    // Using Natural Earth Data for country boundaries (more reliable)
    
    // Style for country boundaries - single color for all borders
    const countryStyle = {
        fillColor: 'transparent',
        fillOpacity: 0,
        color: 'rgba(255, 255, 255, 0.6)', // Single white color for all country borders
        weight: 2, // Consistent line weight
        opacity: 0.8,
        dashArray: '0' // Solid lines - single style for all
    };

    // Load world countries GeoJSON and filter for neighboring countries
    fetch('https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to load world boundaries');
            }
            return response.json();
        })
        .then(worldData => {
            // ISO codes for neighboring countries
            const neighborCodes = ['PAK', 'CHN', 'NPL', 'BTN', 'BGD', 'MMR', 'AFG'];
            const neighborNames = ['Pakistan', 'China', 'Nepal', 'Bhutan', 'Bangladesh', 'Myanmar', 'Afghanistan', 'Burma']; // Burma is alternative name for Myanmar

            // Filter and add neighboring countries
            worldData.features.forEach(feature => {
                const props = feature.properties || {};
                const iso = props.ISO_A3 || props.iso_a3 || props.ISO_A3_EH || props.ISO3;
                const name = props.NAME || props.NAME_EN || props.name || props.NAME_LONG || props.ADMIN;
                
                // Normalize name for comparison
                const normalizedName = name ? name.toLowerCase() : '';
                
                // Check if it's a neighboring country
                const isNeighbor = neighborCodes.includes(iso) || 
                    neighborNames.some(n => normalizedName.includes(n.toLowerCase()));
                
                if (isNeighbor) {
                    L.geoJSON(feature, {
                        style: countryStyle,
                        onEachFeature: function(feature, layer) {
                            // No interactions, just visual boundaries
                        }
                    }).addTo(map);
                }
            });
        })
        .catch(error => {
            console.log('Using fallback method for country boundaries');
            // Fallback: Use a boundary overlay tile with slightly higher opacity
            const countryBoundaryLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '',
                opacity: 0.18, // Slightly higher opacity to show country boundaries
                maxZoom: 19
            });
            countryBoundaryLayer.addTo(map);
        });
}

function initLeafletMap() {
    const mapElement = document.getElementById('indiaMap');
    if (!mapElement) return;

    // Wait a bit for the element to be fully rendered
    setTimeout(() => {
        // Initialize map with bounds that include full India including Kashmir and POK
        // Extended bounds: North ~38°N (includes POK), South ~6°N, East ~97°E, West ~72°E (includes POK)
        const indiaBounds = [
            [6.0, 72.0],  // Southwest corner (Kanyakumari, extended west for POK)
            [38.0, 97.0]  // Northeast corner (extended north for POK, Arunachal Pradesh)
        ];

        const map = L.map('indiaMap', {
            center: [24.0, 82.0], // Adjusted center to better show full India including POK
            zoom: 5,
            zoomControl: true, // Enable zoom controls
            scrollWheelZoom: true, // Enable scroll zoom
            doubleClickZoom: true, // Enable double-click zoom
            boxZoom: true, // Enable box zoom
            keyboard: true, // Enable keyboard navigation
            dragging: true, // Enable map dragging/panning
            touchZoom: true, // Enable touch zoom for mobile
            attributionControl: false, // Hide attribution
            maxBounds: indiaBounds, // Constrain map to extended bounds including POK
            maxBoundsViscosity: 1.0 // Prevent panning outside bounds
        });

        // Use a completely blank/dark base layer - no features, just background
        const baseLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png', {
            attribution: '',
            subdomains: 'abcd',
            maxZoom: 19,
            opacity: 0.4 // Increased opacity for better visibility
        }).addTo(map);

        // Load India state boundaries from a reliable GeoJSON source
        // Using a public dataset for India administrative boundaries
        // Note: This may not include POK boundaries, but map bounds are extended to show the full region
        fetch('https://raw.githubusercontent.com/geohacker/india/master/state/india_telengana.geojson')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                // State boundaries are ignored - only country borders are shown
                // Add neighboring countries that share borders with India (this will show India's borders too)
                loadNeighboringCountries(map);
                
                // Also add India's country outline to show complete border including coastlines
                // Using world GeoJSON to get India's country-level border
                fetch('https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson')
                    .then(response => response.json())
                    .then(worldData => {
                        const indiaFeature = worldData.features.find(feature => {
                            const props = feature.properties || {};
                            const iso = props.ISO_A3 || props.iso_a3 || props.ISO_A3_EH || props.ISO3;
                            const name = props.NAME || props.NAME_EN || props.name || props.NAME_LONG || props.ADMIN;
                            return iso === 'IND' || (name && name.toLowerCase().includes('india'));
                        });

                        if (indiaFeature) {
                            const countryStyle = {
                                fillColor: 'transparent',
                                fillOpacity: 0,
                                color: 'rgba(255, 255, 255, 0.6)', // Same white color for all borders
                                weight: 2,
                                opacity: 0.8,
                                dashArray: '0' // Solid lines
                            };

                            L.geoJSON(indiaFeature, {
                                style: countryStyle,
                                onEachFeature: function(feature, layer) {
                                    // No interactions, just visual border
                                }
                            }).addTo(map);
                        }
                    })
                    .catch(err => console.log('Could not load India outline'));

                // Fit map to India bounds including Kashmir and POK
                // Use extended bounds to ensure full Kashmir region (including POK) is visible
                const extendedBounds = [
                    [6.0, 72.0],   // Southwest (extended west for POK)
                    [38.5, 97.5]   // Northeast (extended north for POK)
                ];
                map.fitBounds(extendedBounds, { 
                    padding: [30, 30], // Add padding to ensure full visibility
                    maxZoom: 6 // Limit max zoom to keep full view
                });
            })
            .catch(error => {
                console.log('Map loaded - adding country boundaries');
                // Add neighboring countries in fallback case as well
                loadNeighboringCountries(map);
                
                // Set bounds for fallback as well - including POK
                const extendedBounds = [
                    [6.0, 72.0],   // Southwest (extended west for POK)
                    [38.5, 97.5]   // Northeast (extended north for POK)
                ];
                map.fitBounds(extendedBounds, { 
                    padding: [30, 30],
                    maxZoom: 6
                });
            });

        // City coordinates (latitude, longitude) – Places I've Visited
        const cities = [
            { name: 'Kashmir', coords: [34.0837, 74.7973], description: 'Paradise on earth, lakes and mountains', color: '#FB7209' },
            { name: 'Jammu', coords: [32.7266, 74.8570], description: 'Temples and the gateway to the Himalayas', color: '#FB7209' },
            { name: 'Uttarakhand', coords: [30.3165, 78.0322], description: 'Hills, pilgrimage, and natural beauty', color: '#FB7209' },
            { name: 'Amritsar', coords: [31.6340, 74.8723], description: 'Golden Temple and Sikh heritage', color: '#FB7209' },
            { name: 'Rishikesh', coords: [30.0869, 78.2676], description: 'Yoga capital and Ganga by the hills', color: '#FB7209' },
            { name: 'Varanasi', coords: [25.3176, 82.9739], description: 'Spiritual capital and ancient city', color: '#FB7209' },
            { name: 'Jaipur', coords: [26.9124, 75.7873], description: 'Pink City, forts and palaces', color: '#FB7209' },
            { name: 'Jodhpur', coords: [26.2389, 73.0243], description: 'Blue City and Mehrangarh Fort', color: '#FB7209' },
            { name: 'Jaisalmer', coords: [26.9117, 70.9129], description: 'Golden City and Thar Desert', color: '#FB7209' },
            { name: 'Udaipur', coords: [24.5854, 73.7125], description: 'City of Lakes and royal romance', color: '#FB7209' },
            { name: 'Ujjain', coords: [23.1765, 75.7885], description: 'Sacred city of Mahakal', color: '#FB7209' },
            { name: 'Somnath', coords: [20.8892, 70.4025], description: 'First Jyotirlinga by the Arabian Sea', color: '#FB7209' },
            { name: 'Dwarka', coords: [22.2394, 68.9678], description: 'Krishna\'s kingdom by the western coast', color: '#FB7209' },
            { name: 'Tirupati Balaji', coords: [13.6288, 79.4192], description: 'Venkateswara Temple and Tirumala hills', color: '#FB7209' },
            { name: 'Nashik', coords: [19.9975, 73.7898], description: 'Wine country and Kumbh city', color: '#FB7209' },
            { name: 'Pune', coords: [18.5204, 73.8567], description: 'Culture, history and education hub', color: '#FB7209' },
            { name: 'Ahmedabad', coords: [23.0225, 72.5714], description: 'Heritage, Sabarmati and vibrant streets', color: '#FB7209' },
            { name: 'Mount Abu', coords: [24.5925, 72.7083], description: 'Only hill station of Rajasthan', color: '#FB7209' },
            { name: 'Omkareshwar', coords: [22.2456, 76.1517], description: 'Jyotirlinga on the Narmada island', color: '#FB7209' },
            { name: 'Vaishno Devi', coords: [33.0294, 74.9489], description: 'Sacred cave shrine in the Trikuta hills', color: '#FB7209' },
            { name: 'Pushkar', coords: [26.4902, 74.5508], description: 'Holy lake, brahma temple and camel fair', color: '#FB7209' },
            { name: 'Chittorgarh', coords: [24.8811, 74.6287], description: 'Chittor Fort and tales of valor', color: '#FB7209' },
            { name: 'Diu', coords: [20.7144, 70.9824], description: 'Beaches, fort and Portuguese charm', color: '#FB7209' },
            { name: 'Chennai', coords: [13.0827, 80.2707], description: 'Coastal charm and tradition', color: '#FB7209' }
        ];

        // Create custom icon for markers with color support
        const createCustomIcon = (cityName, color = '#FB7209') => {
            // Convert hex to RGB for box-shadow
            const hexToRgb = (hex) => {
                const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
                return result ? {
                    r: parseInt(result[1], 16),
                    g: parseInt(result[2], 16),
                    b: parseInt(result[3], 16)
                } : null;
            };
            
            const rgb = hexToRgb(color);
            const rgbaColor = rgb ? `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.8)` : 'rgba(251, 114, 9, 0.8)';
            const rgbaColorLight = rgb ? `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.4)` : 'rgba(251, 114, 9, 0.4)';
            
            return L.divIcon({
                className: 'custom-marker',
                html: `<div style="
                    width: 10px !important;
                    height: 10px !important;
                    background: ${color} !important;
                    border-radius: 50% !important;
                    border: 1.5px solid rgba(255, 255, 255, 0.5) !important;
                    box-shadow: 0 0 6px ${rgbaColor}, 0 0 12px ${rgbaColorLight} !important;
                    position: absolute;
                    top: 0;
                    left: 0;
                    z-index: 1001 !important;
                    pointer-events: auto;
                    display: block !important;
                    visibility: visible !important;
                    opacity: 1 !important;
                "></div>`,
                iconSize: [10, 10],
                iconAnchor: [5, 5],
                popupAnchor: [0, -5]
            });
        };

        // Add markers for each city - add after a short delay to ensure map is ready
        setTimeout(() => {
            cities.forEach((city, index) => {
                const marker = L.marker(city.coords, {
                    icon: createCustomIcon(city.name, city.color),
                    zIndexOffset: 1000 + index, // Ensure markers are on top with unique z-index
                    riseOnHover: true
                });
                
                marker.addTo(map);
                
                // Force marker to be visible
                marker.setZIndexOffset(1000 + index);
                
                // Ensure the marker element is visible
                setTimeout(() => {
                    const markerElement = marker.getElement();
                    if (markerElement) {
                        markerElement.style.zIndex = (1000 + index).toString();
                        markerElement.style.position = 'absolute';
                        const innerDiv = markerElement.querySelector('div');
                        if (innerDiv) {
                            innerDiv.style.display = 'block';
                            innerDiv.style.visibility = 'visible';
                            innerDiv.style.opacity = '1';
                        }
                    }
                }, 100);

                // Add popup with city name (use city's color for title)
                marker.bindPopup(`
                    <div style="font-family: 'Open Sans', sans-serif;">
                        <strong style="color: ${city.color}; font-size: 1.1em;">${city.name}</strong>
                        <p style="margin: 5px 0 0 0; color: rgba(255, 255, 255, 0.7); font-size: 0.9em;">${city.description}</p>
                    </div>
                `);

                // Add hover effect
                marker.on('mouseover', function() {
                    this.openPopup();
                });
            });
        }, 500);

        // Fit map to show all markers
        const group = new L.featureGroup(cities.map(city => L.marker(city.coords)));
        map.fitBounds(group.getBounds().pad(0.2));

        // Store map instance for potential future use
        window.placesMap = map;
    }, 100);
}

/* Solar system init: run on DOM ready so animation starts sooner (no need to wait for full window load) */
function initSolarSystem() {
    if (typeof $ === 'undefined') return;
    var body = $("body"),
        universe = $("#universe"),
        solarsys = $("#solar-system");
    if (!universe.length || !solarsys.length) return;

    var init = function() {
      body.removeClass('view-2D opening').addClass("view-3D").delay(2000).queue(function() {
        $(this).removeClass('hide-UI').addClass("set-speed");
        $(this).dequeue();
      });
    };

    var setView = function(view) { universe.removeClass().addClass(view); };

    $("#toggle-data").click(function(e) {
      body.toggleClass("data-open data-close");
      e.preventDefault();
    });

    $("#toggle-controls").click(function(e) {
      body.toggleClass("controls-open controls-close");
      e.preventDefault();
    });

    $("#data a").click(function(e) {
      var ref = $(this).attr("class");
      solarsys.removeClass().addClass(ref);
      $(this).parent().find('a').removeClass('active');
      $(this).addClass('active');
      e.preventDefault();
    });

    $(".set-view").click(function() { body.toggleClass("view-3D view-2D"); });
    $(".set-zoom").click(function() { body.toggleClass("zoom-large zoom-close"); });
    $(".set-speed").click(function() { setView("scale-stretched set-speed"); });
    $(".set-size").click(function() { setView("scale-s set-size"); });
    $(".set-distance").click(function() { setView("scale-d set-distance"); });

    init();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSolarSystem);
} else {
    initSolarSystem();
}

/* ============================================
   Books Section Animation Logic
   ============================================ */

function initBooksSection() {
    const bookSections = document.querySelectorAll('.book-section');
    const booksSection = document.querySelector('.section-books');
    
    if (!booksSection || bookSections.length === 0) return;

    // Intersection Observer for book sections fade-in animation
    const bookObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        root: null,
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
    });

    // Observe all book sections
    bookSections.forEach(section => {
        bookObserver.observe(section);
    });
}

/* ============================================
   The Bike I Ride Section Parallax Logic
   ============================================ */

function initBikeSection() {
    const bikeSection = document.querySelector('.section-bike');
    const column1 = document.querySelector('.bike-column-1');
    const column2 = document.querySelector('.bike-column-2');
    const column3 = document.querySelector('.bike-column-3');
    const column4 = document.querySelector('.bike-column-4');
    const gifLayer = document.querySelector('.bike-gif-layer');
    
    if (!bikeSection || !column1 || !column2 || !column3 || !column4) return;
    
    const columns = [column1, column2, column3, column4];
    
    let ticking = false;
    let isDesktop = window.innerWidth >= 1025;
    
    // Parallax scroll handler
    function handleBikeScroll() {
        if (ticking) return;
        
        ticking = true;
        requestAnimationFrame(() => {
            // Get section position relative to viewport
            const sectionRect = bikeSection.getBoundingClientRect();
            const sectionTop = sectionRect.top;
            const sectionHeight = sectionRect.height;
            const viewportHeight = window.innerHeight;
            
            // Calculate scroll progress through the section
            let scrollProgress = 0;
            
            if (sectionTop < viewportHeight && sectionTop + sectionHeight > 0) {
                // Section is in viewport
                const totalScrollable = sectionHeight + viewportHeight;
                scrollProgress = (viewportHeight - sectionTop) / totalScrollable;
                scrollProgress = Math.max(0, Math.min(1, scrollProgress));
            } else if (sectionTop + sectionHeight <= 0) {
                // Section has scrolled past
                scrollProgress = 1;
            }
            
            if (!isDesktop) {
                // Mobile/Tablet: Disable parallax motion
                columns.forEach(col => {
                    if (col) col.style.transform = '';
                });
                if (gifLayer) {
                    // Very subtle background movement on mobile
                    const bgOffset = scrollProgress * 20;
                    gifLayer.style.transform = `translateY(${bgOffset}px)`;
                }
                ticking = false;
                return;
            }
            
            // Desktop: Enhanced parallax effect with different speeds for each column
            // Column 1: Fast downward (positive)
            // Column 2: Medium downward (positive, slower)
            // Column 3: Medium upward (negative)
            // Column 4: Fast upward (negative, faster)
            const parallaxSpeeds = [180, 120, -120, -180]; // Different speeds for each column
            
            // Background moves slower (opposite direction, slower speed)
            if (gifLayer) {
                const bgOffset = -scrollProgress * 30; // Much slower than content
                gifLayer.style.transform = `translateY(${bgOffset}px) scale(1.05)`;
            }
            
            // Apply transforms to each column with different speeds
            columns.forEach((col, index) => {
                if (col) {
                    const offset = scrollProgress * parallaxSpeeds[index];
                    col.style.transform = `translateY(${offset}px)`;
                }
            });
            
            ticking = false;
        });
    }
    
    // Initial call
    handleBikeScroll();
    
    // Listen to scroll events
    window.addEventListener('scroll', handleBikeScroll, { passive: true });
    
    // Handle resize to update desktop detection
    window.addEventListener('resize', () => {
        const wasDesktop = isDesktop;
        isDesktop = window.innerWidth >= 1025;
        
        if (wasDesktop !== isDesktop) {
            // Reset transforms when switching between desktop/mobile
            if (!isDesktop) {
                columns.forEach(col => {
                    if (col) col.style.transform = '';
                });
                if (gifLayer) {
                    gifLayer.style.transform = '';
                }
            } else {
                handleBikeScroll();
            }
        }
    }, { passive: true });
}

function initBikeGallery() {
    const gallery = document.getElementById('bikeGallery');
    const lightbox = document.getElementById('bikeLightbox');
    const lightboxImg = document.getElementById('bikeLightboxImg');
    const lightboxClose = document.getElementById('bikeLightboxClose');
    const lightboxBackdrop = lightbox && lightbox.querySelector('.bike-lightbox-backdrop');

    if (!gallery || !lightbox || !lightboxImg) return;

    gallery.querySelectorAll('.bike-gallery-img').forEach(function(img) {
        if (img.complete) {
            img.classList.add('loaded');
        } else {
            img.addEventListener('load', function() {
                img.classList.add('loaded');
            });
        }
    });

    function openLightbox(src, alt) {
        lightboxImg.src = src;
        lightboxImg.alt = alt || '';
        lightbox.setAttribute('aria-hidden', 'false');
        lightbox.classList.add('is-open');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.classList.remove('is-open');
        lightbox.setAttribute('aria-hidden', 'true');
        lightboxImg.removeAttribute('src');
        document.body.style.overflow = '';
    }

    gallery.querySelectorAll('.bike-gallery-item').forEach(function(item) {
        const img = item.querySelector('.bike-gallery-img');
        if (!img || !img.src) return;
        item.addEventListener('click', function() {
            openLightbox(img.src, img.alt);
        });
    });

    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    if (lightboxBackdrop) lightboxBackdrop.addEventListener('click', closeLightbox);

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && lightbox.classList.contains('is-open')) closeLightbox();
    });
}

/* ============================================
   MUSIC I LISTEN — Spotify-style player
   ============================================
   Add your songs below. Each needs: title, artist, cover (image URL), src (audio URL).
   */

const MUSIC_SONGS = [
    { title: 'Chaand Taare', artist: 'Yes Boss — Abhijeet & Alka Yagnik', cover: 'Image/chaandtaare.jpg', src: '', spotifyUrl: 'https://youtu.be/N3QzaUwml5w?si=1BikGPmVP6xtEEYm', duration: 312 }
];

function initMusicPlayer() {
    const audio = document.getElementById('musicAudio');
    const albumCover = document.getElementById('musicAlbumCover');
    const songTitle = document.getElementById('musicSongTitle');
    const artistEl = document.getElementById('musicArtist');
    const progress = document.getElementById('musicProgress');
    const timeCurrent = document.getElementById('musicTimeCurrent');
    const timeTotal = document.getElementById('musicTimeTotal');
    const btnPlay = document.getElementById('musicBtnPlay');
    const btnPrev = document.getElementById('musicBtnPrev');
    const btnNext = document.getElementById('musicBtnNext');

    if (!audio || !albumCover || !progress || !btnPlay) return;

    const songs = MUSIC_SONGS.filter(s => s.src || s.spotifyUrl);
    let currentIndex = 0;
    let isPlaying = false;

    function formatTime(seconds) {
        if (!isFinite(seconds) || isNaN(seconds)) return '0:00';
        const m = Math.floor(seconds / 60);
        const s = Math.floor(seconds % 60);
        return m + ':' + (s < 10 ? '0' : '') + s;
    }

    function applyFadeOut(elements, callback) {
        elements.forEach(el => el && el.classList.add('fade-switch'));
        const t = setTimeout(() => {
            callback();
            elements.forEach(el => el && el.classList.remove('fade-switch'));
        }, 350);
        return t;
    }

    function loadSong(index) {
        if (!songs.length) return;
        currentIndex = ((index % songs.length) + songs.length) % songs.length;
        const song = songs[currentIndex];

        applyFadeOut([albumCover, songTitle, artistEl], () => {
            albumCover.src = song.cover;
            albumCover.alt = song.title + ' — ' + song.artist;
            songTitle.textContent = song.title;
            artistEl.textContent = song.artist;
        });

        if (song.src) {
            audio.src = song.src;
            audio.load();
        } else {
            audio.removeAttribute('src');
        }
        progress.value = 0;
        progress.style.setProperty('--progress', '0%');
        timeCurrent.textContent = '0:00';
        timeTotal.textContent = song.duration ? formatTime(song.duration) : (song.spotifyUrl ? '—' : '0:00');

        if (isPlaying && song.src) audio.play().catch(() => {});
    }

    function updateProgressUI() {
        const ct = audio.currentTime;
        const dur = audio.duration;
        if (!isFinite(dur) || dur <= 0) return;
        const pct = (ct / dur) * 100;
        progress.value = pct;
        progress.style.setProperty('--progress', pct + '%');
        timeCurrent.textContent = formatTime(ct);
        timeTotal.textContent = formatTime(dur);
    }

    function togglePlay() {
        if (!songs.length) return;
        const song = songs[currentIndex];
        if (song.spotifyUrl) {
            window.open(song.spotifyUrl, '_blank', 'noopener,noreferrer');
            return;
        }
        isPlaying = !isPlaying;
        btnPlay.classList.toggle('playing', isPlaying);
        if (isPlaying) audio.play().catch(() => { isPlaying = false; btnPlay.classList.remove('playing'); });
        else audio.pause();
    }

    function goNext() {
        if (!songs.length) return;
        loadSong(currentIndex + 1);
        if (isPlaying) audio.play().catch(() => {});
    }

    function goPrev() {
        if (!songs.length) return;
        if (audio.currentTime > 2) {
            audio.currentTime = 0;
            updateProgressUI();
            return;
        }
        loadSong(currentIndex - 1);
        if (isPlaying) audio.play().catch(() => {});
    }

    // Initial load
    if (songs.length) {
        loadSong(0);
    } else {
        songTitle.textContent = '—';
        artistEl.textContent = '—';
        timeTotal.textContent = '0:00';
    }

    audio.addEventListener('timeupdate', updateProgressUI);
    audio.addEventListener('loadedmetadata', () => { timeTotal.textContent = formatTime(audio.duration); });
    audio.addEventListener('ended', goNext);

    progress.addEventListener('input', function() {
        const pct = parseFloat(this.value);
        if (audio.duration) {
            audio.currentTime = (pct / 100) * audio.duration;
            progress.style.setProperty('--progress', pct + '%');
            timeCurrent.textContent = formatTime(audio.currentTime);
        }
    });

    btnPlay.addEventListener('click', togglePlay);
    btnPrev.addEventListener('click', goPrev);
    btnNext.addEventListener('click', goNext);
}
