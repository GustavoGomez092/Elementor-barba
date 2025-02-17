<?php

if (!defined('ABSPATH')) {
  exit; // Exit if accessed directly.
}

class ThemeScripts
{

  function __construct()
  {
    add_action('elementor/frontend/after_register_scripts', array($this, 'register_theme_scripts'));
  }

  /**
   * Enqueue SplitType script.
   */

  public function splitType_js()
  {

    wp_register_script('splitType_js_script', get_template_directory_uri() . '/assets/js/splitType.js', array(), '1.0', true);

    wp_enqueue_script('splitType_js_script');
  }

  /**
   * Enqueue Lottie.js script.
   */

  public function lottie_js()
  {

    wp_register_script('lottie_js_script', get_template_directory_uri() . '/assets/js/lottie.js', array(), '1.0', true);

    wp_enqueue_script('lottie_js_script');
  }

  /**
   * Enqueue Barba script.
   *
   * @return void
   */
  public function barba_js()
  {

    wp_register_script('barba_js_script', get_template_directory_uri() . '/assets/js/barba.js', array(), '1.0', true);

    wp_enqueue_script('barba_js_script');
  }

  /**
   * Enqueue Lottie.js Intro animation.
   */

  public function lottie_intro()
  {

    wp_register_script('lottie_intro_script', get_template_directory_uri() . '/assets/js/preloader.js', array('lottie_js_script'), '1.0', true);

    wp_enqueue_script('lottie_intro_script');
  }

  /**
   * Enqueue GSAP script.
   *
   * @return void
   */
  public function gsap_js()
  {

    wp_register_script('gsap_js_script', get_template_directory_uri() . '/assets/js/gsap.js', array(), '1.0', true);

    wp_enqueue_script('gsap_js_script');
  }

  /**
   * Enqueue ScrollTrigger script.
   *
   * @return void
   */
  public function scrollTrigger_js()
  {

    wp_register_script('scrollTrigger_js_script', get_template_directory_uri() . '/assets/js/scrollTrigger.js', array('gsap_js_script'), '1.0', true);

    wp_enqueue_script('scrollTrigger_js_script');
  }

  /**
   * Enqueue Lenisjs library.
   *
   * @return void
   */

  public function lenis_lib_js()
  {

    wp_register_script('lenis_lib_js_script', get_template_directory_uri() . '/assets/js/lenis-lib.js', array('barba_js_script', 'gsap_js_script'), '1.0', true);

    wp_enqueue_script('lenis_lib_js_script');
  }

  /**
   * Enqueue Lenisjs script.
   */

  public function lenis_js()
  {

    wp_register_script('lenis_js_script', get_template_directory_uri() . '/assets/js/lenis-init.js', array('lenis_lib_js_script'), '1.0', true);

    wp_enqueue_script('lenis_js_script');
  }

  /**
   * Enqueue main.css
   */
  public function main_css()
  {
    wp_enqueue_style('main_css', get_template_directory_uri() . '/assets/css/main.css', array(), '1.0', 'all');
  }

  /**
   * Enqueue ScrollTo script.
   *
   * @return void
   */
  public function scrollTo_js()
  {

    wp_register_script('scrollTo_js_script', get_template_directory_uri() . '/assets/js/scrollTo.js', array('scrollTrigger_js_script'), '1.0', true);

    wp_enqueue_script('scrollTo_js_script');
  }

  /**
   * Enqueue Page JS functionality.
   *
   * @return void
   */

  public function page_js()
  {

    wp_register_script('page_js_script', get_template_directory_uri() . '/assets/js/page-functions.js', array('gsap_js_script', 'scrollTrigger_js_script'), '1.0', true);

    wp_enqueue_script('page_js_script');
  }

  /**
   * Enqueue Page Transition script.
   *
   * @return void
   */

  public function page_transition_js()
  {

    wp_register_script('page_transition_js_script', get_template_directory_uri() . '/assets/js/page-transitions.js', array('jquery', 'lenis_js_script', 'barba_js_script', 'lottie_intro_script', 'page_js_script'), '1.0', true);

    wp_enqueue_script('page_transition_js_script');
  }


  public function register_theme_scripts()
  {

    add_action('wp_enqueue_scripts', array($this, 'splitType_js'));
    add_action('wp_enqueue_scripts', array($this, 'lottie_js'));
    add_action('wp_enqueue_scripts', array($this, 'barba_js'));
    add_action('wp_enqueue_scripts', array($this, 'lottie_intro'));
    add_action('wp_enqueue_scripts', array($this, 'gsap_js'));
    add_action('wp_enqueue_scripts', array($this, 'scrollTrigger_js'));
    add_action('wp_enqueue_scripts', array($this, 'lenis_lib_js'));
    add_action('wp_enqueue_scripts', array($this, 'lenis_js'));
    add_action('wp_enqueue_scripts', array($this, 'main_css'));
    add_action('wp_enqueue_scripts', array($this, 'scrollTo_js'));
    add_action('wp_enqueue_scripts', array($this, 'page_js'));
    add_action('wp_enqueue_scripts', array($this, 'page_transition_js'));

  }

}

new ThemeScripts();