// This function helps add and remove js and css files during a page transition
const elementExistsInArray = ( element, array ) =>
	array.some( ( el ) => el.isEqualNode( element ) );

// Re-execute all inline scripts
function executeInlineScripts(container) {
  const elementorElements = [
    'script#elementor-js',
    'script#elementor-pro-js',
    'script#elementor-frontend-js',
    'script#elementor-frontend-js-before',
    'script#elementor-frontend-js-after',
    'script#elementor-frontend-js-before-legacy',
    'script#elementor-frontend-js-after-legacy',
    'script#elementor-frontend-js-before-vendors',
    'script#elementor-frontend-js-after-vendors',
    'script#elementor-frontend-js-before-legacy',
    'script#elementor-frontend-js-after-legacy',
    'script#imagesloaded-js',
    'script#swiper-js',
    'script#elementor-gallery-js',
  ]
  let scripts = container.body.querySelectorAll(elementorElements.join(','));
  scripts.forEach((script) => {
    let newScript = document.createElement("script");
    if (script.src) {
      newScript.src = script.src;
      newScript.async = true;
    } else {
      newScript.textContent = script.textContent;
    }

    document.body.appendChild(newScript);
    script.remove(); // Remove old script to avoid duplication
  });
}

barba.hooks.beforeEnter(({ current, next }) => {
  // Set <body> classes for the 'next' page
  if (current.container) {
    // // only run during a page transition - not initial load
    let nextHtml = next.html
    let response = nextHtml.replace(
      /(<\/?)body( .+?)?>/gi,
      '$1notbody$2>',
      nextHtml
    )

    let bodyClasses = jQuery(response).filter('notbody').attr('class')
    jQuery('body').attr('class', bodyClasses)

    if (bodyClasses.includes('elementor-page')) {

      // get the next elements
      const nextElement = new DOMParser().parseFromString(
        next.html,
        'text/html'
      );

      const newHeadElements = [ ...nextElement.head.children ];
      const currentHeadElements = [ ...document.head.children ];


      // Add new elements that are not in the current head
      newHeadElements.forEach( ( newEl ) => {
        if ( ! elementExistsInArray( newEl, currentHeadElements ) ) {
          document.head.appendChild( newEl.cloneNode( true ) );
        }
      } );

      // Remove old elements that are not in the new head
      currentHeadElements.forEach( ( currentEl ) => {
        if ( ! elementExistsInArray( currentEl, newHeadElements ) ) {
          document.head.removeChild( currentEl );
        }
      } );

      // Re-execute Elementor inline scripts
      executeInlineScripts(nextElement);
    }
  }

  // ALLOW ELEMENTOR VIDEOS TO AUTOPLAY AFTER TRANSITION
  let elementorVideos = document.querySelectorAll('.elementor-video')
  if (typeof elementorVideos != 'undefined' && elementorVideos != null) {
    elementorVideos.forEach((video) => {
      video.play()
    })
  }
  
  // Reinitialize Elementor and menu widget
  if (current.container) {
    elementorFrontend.init()
    jQuery('[data-widget_type="nav-menu.default"], [data-widget_type="gallery.default"]').each(function() {
      elementorFrontend.elementsHandler.runReadyTrigger( jQuery( this ) );
    });
    // Check if the function lazyloadRunObserver is defined
    if (typeof lazyloadRunObserver !== 'undefined') {
      lazyloadRunObserver()
    }
  }
})


barba.hooks.beforeLeave(() => {
  // Remove all the ScrollTriggers
  removeParallax()

  // Remove all ResizeObservers
  removeResizeObservers()
})

barba.hooks.after((data) => {
  // Reevaluate all inline JavaScript with no ID attribute
  let js = data.next.container.querySelectorAll('script:not([id])');
  if(js != null){
          js.forEach((item) => {
            eval(item?.innerHTML);
          });
  }
});

function enterAnimation(e) {
  return new Promise(async (resolve) => {
    jQuery('a').each(function () {
      // make links not clickable if already on the same url taking into consideration relative and absolute paths
      // This whole thing needs to be revised and optimized, I'm sure this code is really brittle
      // get the sub page from url
      const subPage = window.location.pathname.split('/')[1]
      const websiteURL = window.backend_data.site_info.site_url

      // check if the link is an absolute path
      if (jQuery(this).attr('href').includes(websiteURL) &&  jQuery(this).attr('href').split('/').length <= 5) {
        // check if the link is the same as the current page
        if (subPage && jQuery(this).attr('href').includes(subPage)) {
          jQuery(this).addClass('elementor-item-active')
          jQuery(this).addClass('current-menu-item')
          jQuery(this).addClass('current_page_item')
          jQuery(this).click(function (event) {
            event.preventDefault()
          })
        }
      } else {
        // check if the link is the same as the current page
        if (subPage && jQuery(this).attr('href').split('/')[1]?.includes(subPage) && jQuery(this).attr('href').split('/').length <= 5) {
          jQuery(this).addClass('elementor-item-active')
          jQuery(this).addClass('current-menu-item')
          jQuery(this).addClass('current_page_item')
          jQuery(this).click(function (event) {
            event.preventDefault()
          })
        }
      }
    })
    // slide menu down
    gsap.to('#site-header', {
      duration: 0.5,
      y: '0',
      ease: 'power3.inOut',
    })

    // fade in content
    await gsap.fromTo(
      e,
      {
        display: 'none',
      },
      {
        display: 'block',
        onStart: () => {
          animator(e)
        },
        onComplete: () => {
          gsap
            .fromTo(
              e,
              {
                opacity: 0,
              },
              {
                opacity: 1,
                duration: 1,
                ease: 'power3.inOut',
                onStart: () => {
                  ScrollTrigger.refresh()
                },
              }
            )
            .then(() => {
              resolve()
            })
        },
      }
    )
  })
}

function leaveAnimation(e) {
  function remove_all_active_menu_items() {
    jQuery('li').each(function () {
      jQuery(this).removeClass('elementor-item-active')
      jQuery(this).removeClass('current-menu-item')
      jQuery(this).removeClass('current_page_item')
    })
    jQuery('li > a').each(function () {
      jQuery(this).removeClass('elementor-item-active')
      jQuery(this).removeClass('current-menu-item')
      jQuery(this).removeClass('current_page_item')
    })
  }

  return new Promise(async (resolve) => {
    remove_all_active_menu_items()
    // slide menu up
    gsap.to('#site-header', {
      duration: 0.5,
      y: '-100%',
      ease: 'power3.inOut',
    })
    await gsap
      .fromTo(
        e,
        {
          opacity: 1,
          display: 'block',
        },
        {
          opacity: 0,
          display: 'none',
          duration: 1,
          ease: 'power3.inOut',
        }
      )
      .then(() => {
        resolve()
      })
  })
}

barba.init({
  debug: false, // turn this to "true" to debug
  timeout: 5000,
  transitions: [
    {
      sync: false,
      once: async ({ next }) => {
        gsap.set('#site-header', {
          y: '-100%',
          ease: 'power3.inOut',
        })
        await loaderAnimation()
        return enterAnimation(next.container)
      },
      leave: ({ current }) => {
        // Leave animation
        return leaveAnimation(current.container)
      },
      enter: ({ next }) => {
        // Enter animation
        return enterAnimation(next.container)
      },
    },
  ],
})
