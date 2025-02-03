// This function helps add and remove js and css files during a page transition
const elementExistsInArray = ( element, array ) =>
	array.some( ( el ) => el.isEqualNode( element ) );

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

    }
  }

  // ALLOW ELEMENTOR VIDEOS TO AUTOPLAY AFTER TRANSITION
  let elementorVideos = document.querySelectorAll('.elementor-video')
  if (typeof elementorVideos != 'undefined' && elementorVideos != null) {
    elementorVideos.forEach((video) => {
      video.play()
    })
  }

  if (current.container) {
    elementorFrontend.init()
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
              eval(item.innerHTML);
          });
  }
});

function enterAnimation(e) {
  function removeDuplicateLottie() {
    const lottieContainers = jQuery(e).find('.elementor-widget-container > div.e-lottie__container > div.e-lottie__animation')

    // if any container has more than 1 svg remove the rest
    lottieContainers.each(function (){
      const svgs = jQuery(this).find('svg')
      if (svgs.length > 1) {
        svgs.each(function (index){
          if (index > 0) {
            jQuery(this).remove()
          }
        })
      }
    })
  }

  function remove_all_active_menu_items() {
    jQuery('#site-header a').each(function () {
      jQuery(this).removeClass('elementor-item-active')
    })
  }
  return new Promise(async (resolve) => {
    jQuery('a').each(function () {
      // make links not clickable if already on the same url taking into consideration relative and absolute paths
      // get the sub page from url
      const subPage = window.location.pathname.split('/').pop()
      const websiteURL = window.backend_data.site_info.site_url

      // check if the link is an absolute path
      if (jQuery(this).attr('href').includes(websiteURL)) {
        // check if the link is the same as the current page
        if (subPage && jQuery(this).attr('href').includes(subPage)) {
          jQuery(this).click(function (event) {
            event.preventDefault()
            remove_all_active_menu_items()
            jQuery(this).addClass('elementor-item-active')
          })
        }
      } else {
        // check if the link is the same as the current page
        if (subPage && jQuery(this).attr('href').includes(subPage)) {
          jQuery(this).click(function (event) {
            event.preventDefault()
            remove_all_active_menu_items()
            jQuery(this).addClass('elementor-item-active')
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
                  removeDuplicateLottie()
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
  return new Promise(async (resolve) => {
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
          onStart: () => {
            lenis.scrollTo('top')
          },
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
        lenis.scrollTo('top')
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
