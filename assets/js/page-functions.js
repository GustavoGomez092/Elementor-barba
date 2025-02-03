
// Debounce utitlity function
const debounce = (func, delay) => {
  let debounceTimer
  return function () {
      const context = this
      const args = arguments
      clearTimeout(debounceTimer)
      debounceTimer
          = setTimeout(() => func.apply(context, args), delay)
  }
}

// Create an array to store the ID's of the ScrollTriggers
window.parallaxIds = []

// Create an array to store the resize observers
window.resizeObservers = []

// Function to remove all the resize observers
const removeResizeObservers = () => {
  window.resizeObservers.forEach((observer) => {
    observer.disconnect()
  })
}

// Function to look for all the assets that will have parallax on the page
const parallax = (e) => {
  const newParallaxItems = jQuery(e).find('.parallax')
  // Check if the element exists
  if (!newParallaxItems.length) return
  // Loop through all the elements with the class parallax
  newParallaxItems.each(function (index) {
    // Get Direction attribute
    let direction = jQuery(this).data('direction') || 'vertical'
    // Get the start and end attribute
    let posStart = jQuery(this).data('start') || 0
    let posEnd = jQuery(this).data('end') || 300

    // Create a custom ID for the ScrollTrigger
    let id = `parallax-${index}-${Date.now()}`

    // add the ID's to an array to remove them later
    window.parallaxIds.push(id)

    // Create a ScrollTrigger for the element and set the speed
    if (direction == 'vertical') {
      gsap.fromTo(
        jQuery(this),
        { y: `${posStart}px` },
        {
          y: `${posEnd}px`,
          ease: 'none',
          scrollTrigger: {
            trigger: this,
            id: id,
            start: 'top top',
            end: 'bottom top',
            scrub: 0.8,
            markers: false,
          },
        }
      )
    } else {
      gsap.fromTo(
        jQuery(this),
        { x: `${posStart}px` },
        {
          x: `${posEnd}px`,
          ease: 'none',
          scrollTrigger: {
            trigger: this,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
            markers: false,
          },
        }
      )
    }
  })
}

// Function to remove all the ScrollTriggers
const removeParallax = () => {
  window.parallaxIds.forEach((id) => {
    ScrollTrigger.getById(id).kill()
    window.parallaxIds.find((item, index) => {
      if (item === id) {
        window.parallaxIds.splice(index, 1)
      }
    })
  })
}

// Levitate animation

// Function to create a levitating effect on an item
const levitate = (e) => {
  const elements = jQuery(e).find('.levitate')
  if (!elements.length) return

  const randomX = random(1, 10)
  const randomY = random(1, 10)
  const randomTime = random(3, 5)
  const randomTime2 = random(5, 10)
  const randomAngle = random(-5, 5)

  const gsapEls = gsap.utils.toArray(elements)
  gsapEls.forEach((el) => {
    gsap.set(el, {
      x: randomX(-1),
      y: randomX(1),
      rotation: randomAngle(-1),
    })

    moveX(el, 1)
    moveY(el, -1)
    rotate(el, 1)
  })

  function rotate(target, direction) {
    gsap.to(target, randomTime2(), {
      rotation: randomAngle(direction),
      // delay: randomDelay(),
      ease: Sine.easeInOut,
      onComplete: rotate,
      onCompleteParams: [target, direction * -1],
    })
  }

  function moveX(target, direction) {
    gsap.to(target, randomTime(), {
      x: randomX(direction),
      ease: Sine.easeInOut,
      onComplete: moveX,
      onCompleteParams: [target, direction * -1],
    })
  }

  function moveY(target, direction) {
    gsap.to(target, randomTime(), {
      y: randomY(direction),
      ease: Sine.easeInOut,
      onComplete: moveY,
      onCompleteParams: [target, direction * -1],
    })
  }

  function random(min, max) {
    const delta = max - min
    return (direction = 1) => (min + delta * Math.random()) * direction
  }
}

// Function to add a fade-in effect to an element
const fadeIn = (e) => {
  elements = jQuery(e).find('.fade-in')
  if (!elements.length) return
  gsap.fromTo(
    elements,
    {
      opacity: 0,
    },
    {
      opacity: 1,
      duration: 1,
      ease: 'power3.inOut',
      stagger: 0.2,
      onStart: () => {
        ScrollTrigger.refresh()
      },
    }
  )
}

// Glare card effect
const glareHover = (e) => {
  const glowCard = jQuery(e).find('.glow-card > div')

  if (!glowCard.length) return

  // add a child div with class glare recursively
  glowCard.each(function () {
    const that = jQuery(this)
    const imageCard = that.find('img')
    
    const glare = document.createElement('div')
    glare.classList.add('glare')
    this.appendChild(glare)
    
    let bounds
    let lastShadowOffsetX = 0
    let lastShadowOffsetY = 0
    let lastShadowBlur = 0

    function moveToMouse(el) {
      const mouseX = el.clientX
      const mouseY = el.clientY
      const leftX = mouseX - bounds.x
      const topY = mouseY - bounds.y
      const center = {
        x: leftX - bounds.width / 2,
        y: topY - bounds.height / 2,
      }

      // Calculate the blur radius of the shadow based on the distance
      // from the center of the card to the mouse pointer
      const distance = Math.sqrt(center.x ** 2 + center.y ** 2)

      const rotationX = center.y / 50
      const rotationY = -center.x / 50

      // Calculate shadow offset and blur based on rotation
      const shadowOffsetX = -rotationY * 5 // left/right
      const shadowOffsetY = rotationX * 5 // top/bottom
      const shadowBlur = 20 + distance / 120 // Blur
      //const shadowBlur = 22;

      // Store last shadow positions
      lastShadowOffsetX = shadowOffsetX
      lastShadowOffsetY = shadowOffsetY
      lastShadowBlur = shadowBlur

      gsap.to(that[0], {
        scale: 1.1,
        rotationX: rotationX,
        rotationY: rotationY,
        transformPerspective: 500,
        ease: 'power2.out',
        boxShadow: `${shadowOffsetX}px ${shadowOffsetY}px ${shadowBlur}px 6px rgba(72, 65, 56, .4)`,
      })

      gsap.to(that.find('.glare').get(), {
        autoAlpha: 1,
        backgroundImage: `
      radial-gradient(
        circle at
        ${center.x * 2 + bounds.width / 2}px
        ${
          center.y * 2 + bounds.height / 2
        }px, rgba(255, 255, 255, 0.33), rgba(0, 0, 0, 0.06)
      )
    `,
      })
    }

    imageCard.on('mouseenter', () => {
      bounds = that[0].getBoundingClientRect()
      document.addEventListener('mousemove', moveToMouse)
      gsap.to(that[0], {
        scale: 1.1,
        rotationX: 0,
        rotationY: 0,
        duration: 0.6,
      })
    })

    imageCard.on('mouseleave', () => {
      document.removeEventListener('mousemove', moveToMouse)

      // Animate the card back to its original state
      gsap.to(that[0], {
        scale: 1,
        rotationX: 0,
        rotationY: 0,
        duration: 0.6,
      })

      // Animate the shadow back to the center and fade out
      gsap.to(that[0], {
        boxShadow: `${lastShadowOffsetX}px ${lastShadowOffsetY}px ${lastShadowBlur}px 0 rgba(72, 65, 56, .4)`,
        duration: 0.3,
        ease: 'power3.out',
        onComplete: () => {
          gsap.to(that[0], {
            boxShadow: `0px 0px ${lastShadowBlur}px 0 rgba(0, 0, 0, .4)`,
            duration: 1.2,
          })
        },
      })

      // Fade out the glare background image
      gsap.to(that.find('.glare').get(), {
        autoAlpha: 0,
        duration: 0.6,
      })
    })
  })
}

// Function to add splitType effect on text
const splitAnimate = (e) => {
  const splitText = jQuery(e).find('.split-text')
  if (!splitText.length) return

  splitText.each(function () {
    // if the element has class split-text-words then animate the text into words
    if (jQuery(this).hasClass('split-text-words')) {

      // get the text element with class elementor-heading-title inside the element
      const text = jQuery(this).find('.elementor-heading-title')

      // create a scrollTrigger ID and add it to the  parallaxIds array
      let id = `split-text-${Date.now()}`
      window.parallaxIds.push(id)

      // Split the text into words
      const splitted = new SplitType(text)

      // Observe width changes to re-split the text
      const resizeObserver = new ResizeObserver(debounce(() => {

        // Split the text again
        splitted.split()

        // Release the previous scroll trigger
        ScrollTrigger.getById(id).kill()

        // Add overflow hidden to the line container
        text.find('.line').css('overflow', 'hidden')

        // animate words with GSAP and scrollTrigger
        animation(splitted)

        // Refresh the scrollTrigger
        ScrollTrigger.refresh()
      }, 300))

      // Add the resize observer to the array
      window.resizeObservers.push(resizeObserver)

      // Observe the body for resize
      resizeObserver.observe(document.body)

      // Add overflow hidden to the line container
      text.find('.line').css('overflow', 'hidden')

      // animate words with GSAP and scrollTrigger
      const animation = (splitted) => {
        gsap.fromTo(
          splitted.words,
          {
            y: '100%',
          },
          {
            y: '0%',
            duration: 1,
            ease: 'power3.inOut',
            id,
            stagger: 0.1,
            scrollTrigger: {
              trigger: this,
              scrub: true,
              start: 'top-=200% center',
              end: 'bottom+=200% center',
            },
          }
        )
      }

      animation(splitted)

    } else if (jQuery(this).hasClass('split-text-lines')) {
      // if the element has class split-text-lines then animate the text into lines
      const text = jQuery(this).find('.elementor-heading-title')

      // create a scrollTrigger ID and add it to the  parallaxIds array
      let id = `split-text-${Date.now()}`
      window.parallaxIds.push(id)

      // Split the text into lines
      const splitted = new SplitType(text)

      // Observe width changes to re-split the text
      const resizeObserver = new ResizeObserver(debounce(() => {

        // Split the text again
        splitted.split()

        // Release the previous scroll trigger
        ScrollTrigger.getById(id).kill()

        // Add overflow hidden to the line container
        text.css('overflow', 'hidden')

        // animate words with GSAP and scrollTrigger
        animation(splitted)

        // Refresh the scrollTrigger
        ScrollTrigger.refresh()
      }, 300))

      // Add the resize observer to the array
      window.resizeObservers.push(resizeObserver)

      // Observe the body for resize
      resizeObserver.observe(document.body)

      // Add overflow hidden to the line container
      text.css('overflow', 'hidden')

      // animate words with GSAP and scrollTrigger
      const animation = (splitted) => {
        gsap.fromTo(
          splitted.words,
          {
            y: '100%',
          },
          {
            y: '0%',
            duration: 1,
            ease: 'power3.inOut',
            id,
            stagger: 0.1,
            scrollTrigger: {
              trigger: this,
              scrub: true,
              start: 'top-=200% center',
              end: 'bottom+=200% center',
            },
          }
        )
      }

      animation(splitted)
    } 
    else {
      // if not then animate the text into characters
      const text = jQuery(this).find('.elementor-heading-title')

      // create a scrollTrigger ID and add it to the  parallaxIds array
      let id = `split-text-${Date.now()}`
      window.parallaxIds.push(id)

      // Split the text into characters
      const splitted = new SplitType(text)

            // Observe width changes to re-split the text
            const resizeObserver = new ResizeObserver(debounce(() => {

              // Split the text again
              splitted.split()
      
              // Release the previous scroll trigger
              ScrollTrigger.getById(id).kill()
      
              // Add overflow hidden to the line container
              text.find('.line').css('overflow', 'hidden')
      
              // animate words with GSAP and scrollTrigger
              animation(splitted)
      
              // Refresh the scrollTrigger
              ScrollTrigger.refresh()
            }, 300))
      
            // Add the resize observer to the array
            window.resizeObservers.push(resizeObserver)
      
            // Observe the body for resize
            resizeObserver.observe(document.body)
      
            // Add overflow hidden to the line container
            text.find('.line').css('overflow', 'hidden')
      
            // animate words with GSAP and scrollTrigger
            const animation = (splitted) => {
              gsap.fromTo(
                splitted.words,
                {
                  y: '100%',
                },
                {
                  y: '0%',
                  duration: 1,
                  ease: 'power3.inOut',
                  id,
                  stagger: 0.1,
                  scrollTrigger: {
                    trigger: this,
                    scrub: true,
                    start: 'top-=200% center',
                    end: 'bottom+=200% center',
                  },
                }
              )
            }
      
            animation(splitted)
    }
  })
}

// Animator function that calls all the animation functions
const animator = (e) => {
  splitAnimate(e)
  fadeIn(e)
  parallax(e)
  levitate(e)
  glareHover(e)
}
