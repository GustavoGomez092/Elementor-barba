<?php
/**
 * The site's entry point.
 *
 * Loads the relevant template part,
 * the loop is executed (when needed) by the relevant template part.
 *
 * @package HelloElementor
 */

if (!defined('ABSPATH')) {
	exit; // Exit if accessed directly.
}

get_header();

$is_elementor_theme_exist = function_exists('elementor_theme_do_location');

// Generate a slug for any scenario (archive, single, 404, etc).
$slug = '';

if (is_archive()) {
	$slug = 'archive';
} elseif (is_search()) {
	$slug = 'search';
} elseif (is_404()) {
	$slug = '404';
} elseif (is_singular()) {
	$post = get_post();
	$slug = $post->post_name;
}

?>
<div data-barba="container" data-barba-namespace="<?php echo $slug; ?>" id="site-main-wrapper">
  <?php
	if (is_singular()) {
		if (!$is_elementor_theme_exist || !elementor_theme_do_location('single')) {
			get_template_part('template-parts/single');
		}
	} elseif (is_archive() || is_home()) {
		if (!$is_elementor_theme_exist || !elementor_theme_do_location('archive')) {
			get_template_part('template-parts/archive');
		}
	} elseif (is_search()) {
		if (!$is_elementor_theme_exist || !elementor_theme_do_location('archive')) {
			get_template_part('template-parts/search');
		}
	} else {
		if (!$is_elementor_theme_exist || !elementor_theme_do_location('single')) {
			get_template_part('template-parts/404');
		}
	}

	get_footer();
	?>
</div>