// When in elementor editor, avoid running the intro
const body = document.querySelector('body')
if (body.classList.contains('elementor-editor-active')) {
  window.sessionStorage.setItem('loaderAnimationPlayed', true)
}
// This function helps add and remove js and css files during a page transition
function loadjscssfile(filename, filetype) {
  if (filetype == 'js') {
    //if filename is a external JavaScript file
    const existingScript = document.querySelector('script[src="${filename}"]')
    if (existingScript) {
      existingScript.remove()
    }
    var fileref = document.createElement('script')
    fileref.setAttribute('type', 'text/javascript')
    fileref.setAttribute('src', filename)
  } else if (filetype == 'css') {
    //if filename is an external CSS file
    const existingCSS = document.querySelector(`link[href='${filename}']`)
    if (existingCSS) {
      existingCSS.remove()
    }
    var fileref = document.createElement('link')
    fileref.setAttribute('rel', 'stylesheet')
    fileref.setAttribute('type', 'text/css')
    fileref.setAttribute('href', filename)
  }
  if (typeof fileref != 'undefined') {
    document.getElementsByTagName('head')[0].appendChild(fileref)
  }
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
      // Remove all stylesheets on current DOM
      const stylesheets = Array.from(
        document.querySelectorAll('link[rel="stylesheet"]')
      ).map((link) => link.href) // Get the href attribute of each <link> tag

      stylesheets.forEach((url) => {
        if (url.includes('main')) return
        if (url.includes('style')) return
        if (url.includes('theme')) return
        if (url.includes('widget-nav-menu')) return
        // if (url.includes("header-footer")) return;
        // if (url.includes("frontend")) return;
        document.querySelector(`link[href='${url}']`).remove()
      })

      // Add all stylesheets from the next page
      const stylesheetsNext = Array.from(
        jQuery(response).filter("link[rel='stylesheet']")
      ).map((link) => link.href) // Get the href attribute of each <link> tag

      stylesheetsNext.forEach((url) => {
        if (url.includes('main')) return
        if (url.includes('style')) return
        if (url.includes('theme')) return
        if (url.includes('widget-nav-menu')) return
        // if (url.includes("header-footer")) return;
        // if (url.includes("frontend")) return;
        loadjscssfile(url, 'css')
      })

      jQuery('.elementor-element').each(function () {
        elementorFrontend.elementsHandler.runReadyTrigger(jQuery(this))
      })
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
            removeParallax()
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
