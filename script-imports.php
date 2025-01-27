<?php

if (!defined('ABSPATH')) {
  exit; // Exit if accessed directly.
}

/**
 * Enqueue Lottie.js script.
 */

function lottie_js()
{

  wp_register_script('lottie_js_script', get_template_directory_uri() . '/assets/js/lottie.js', array(), '1.0', true);

  wp_enqueue_script('lottie_js_script');
}

add_action('wp_enqueue_scripts', 'lottie_js');

/**
 * Enqueue Barba script.
 *
 * @return void
 */
function barba_js()
{

  wp_register_script('barba_js_script', get_template_directory_uri() . '/assets/js/barba.js', array(), '1.0', true);

  wp_enqueue_script('barba_js_script');
}

add_action('wp_enqueue_scripts', 'barba_js');


/**
 * Enqueue Lottie.js Intro animation.
 */

function lottie_intro()
{

  wp_register_script('lottie_intro_script', get_template_directory_uri() . '/assets/js/preloader.js', array('lottie_js_script'), '1.0', true);

  wp_enqueue_script('lottie_intro_script');
}

add_action('wp_enqueue_scripts', 'lottie_intro');

/**
 * Enqueue GSAP script.
 *
 * @return void
 */
function gsap_js()
{

  wp_register_script('gsap_js_script', get_template_directory_uri() . '/assets/js/gsap.js', array(), '1.0', true);

  wp_enqueue_script('gsap_js_script');
}

add_action('wp_enqueue_scripts', 'gsap_js');

/**
 * Enqueue ScrollTrigger script.
 *
 * @return void
 */
function scrollTrigger_js()
{

  wp_register_script('scrollTrigger_js_script', get_template_directory_uri() . '/assets/js/scrollTrigger.js', array('gsap_js_script'), '1.0', true);

  wp_enqueue_script('scrollTrigger_js_script');
}

add_action('wp_enqueue_scripts', 'scrollTrigger_js');

/**
 * Enqueue Lenisjs library.
 *
 * @return void
 */

function lenis_lib_js()
{

  wp_register_script('lenis_lib_js_script', get_template_directory_uri() . '/assets/js/lenis-lib.js', array('barba_js_script', 'gsap_js_script'), '1.0', true);

  wp_enqueue_script('lenis_lib_js_script');
}

add_action('wp_enqueue_scripts', 'lenis_lib_js');

/**
 * Enqueue Lenisjs script.
 */

function lenis_js()
{

  wp_register_script('lenis_js_script', get_template_directory_uri() . '/assets/js/lenis-init.js', array('lenis_lib_js_script'), '1.0', true);

  wp_enqueue_script('lenis_js_script');
}

add_action('wp_enqueue_scripts', 'lenis_js');

/**
 * Enqueue main.css
 */
function main_css()
{
  wp_enqueue_style('main_css', get_template_directory_uri() . '/assets/css/main.css', array(), '1.0', 'all');
}
add_action('wp_enqueue_scripts', 'main_css');

/**
 * Enqueue ScrollTo script.
 *
 * @return void
 */
function scrollTo_js()
{

  wp_register_script('scrollTo_js_script', get_template_directory_uri() . '/assets/js/scrollTo.js', array('scrollTrigger_js_script'), '1.0', true);

  wp_enqueue_script('scrollTo_js_script');
}

add_action('wp_enqueue_scripts', 'scrollTo_js');

/**
 * Enqueue Page JS functionality.
 *
 * @return void
 */

function page_js()
{

  wp_register_script('page_js_script', get_template_directory_uri() . '/assets/js/page-functions.js', array('gsap_js_script', 'scrollTrigger_js_script'), '1.0', true);

  wp_enqueue_script('page_js_script');
}

add_action('wp_enqueue_scripts', 'page_js');

/**
 * Enqueue Page Transition script.
 *
 * @return void
 */

function page_transition_js()
{

  wp_register_script('page_transition_js_script', get_template_directory_uri() . '/assets/js/page-transitions.js', array('jquery', 'lenis_js_script', 'barba_js_script', 'lottie_intro_script', 'page_js_script'), '1.0', true);

  wp_enqueue_script('page_transition_js_script');
}

add_action('wp_enqueue_scripts', 'page_transition_js');