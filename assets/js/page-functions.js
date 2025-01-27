// Function to look for all the assets that will have parallax on the page

// Create an array to store the ID's of the ScrollTriggers
window.parallaxIds = []

const parallax = (e) => {
  const newParallaxItems = jQuery(e).find('.parallax')
  // Check if the element exists
  if (!newParallaxItems.length) return;
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
            scrub: 1,
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

// Animator function that calls all the animation functions
const animator = (e) => {
  fadeIn(e)
  parallax(e)
  levitate(e)
}
