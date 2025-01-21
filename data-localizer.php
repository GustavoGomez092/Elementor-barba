<?php

if (!defined('ABSPATH')) {
  exit; // Exit if accessed directly.
}
class data_localizer
{

  public function __construct()
  {
    add_action('wp_enqueue_scripts', array($this, 'frontend_data'));
  }

  public function frontend_data()
  {
    // define the name of the file to be inserted
    $name = 'backend_data';

    // add the data you want to pass from PHP to JS
    // Data will be inserted in the window object with the name defined above

    // Get ACF options
    $plugin_options = array();

    // Get custom data example
    $custom_data = array(
      'site_info' => array(
        'site_url' => get_site_url(),
      )
    );

    $normalized_array = array_merge($plugin_options, $custom_data);

    wp_register_script($name, '');
    wp_enqueue_script($name);
    wp_add_inline_script($name, 'window.' . $name . ' = ' . wp_json_encode($normalized_array), 'after');

  }
}

new data_localizer();