<?php
/**
 * Plugin Name: Kursfilter
 * Description: Hämtar kurser från ett JSON-API och visar dem som lista.
 * Version: 0.3
 * Author: Barngymnastik.nu
 */

if (!defined('KURSFILTER_PATH')) define('KURSFILTER_PATH', plugin_dir_path(__FILE__));
if (!defined('KURSFILTER_URL'))  define('KURSFILTER_URL',  plugins_url('', __FILE__));

/**
 * Shortcode: [course_browser], [course_browser municipality="Stockholm" lock="1"], [course_browser city="Kungsholmen" lock="1"]
 * OBS: Om både city och municipality anges, prioriteras city.
 */
add_shortcode('course_browser', function ($atts) {
    $atts = shortcode_atts([
        'municipality' => '',
        'city'         => '',
        'lock'         => '0',
    ], $atts, 'course_browser');

    $municipality = esc_attr($atts['municipality']);
    $city         = esc_attr($atts['city']);
    $lock         = (esc_attr($atts['lock']) === '1') ? '1' : '0';

    if ($city && $municipality) $municipality = ''; // city prioriteras

    $props = [
        'municipality' => $municipality,
        'city'         => $city,
        'lock'         => $lock,
    ];

    ob_start();
    include KURSFILTER_PATH . 'templates/shortcode-courses.php';
    return ob_get_clean();
});

/** Enqueue CSS (JS laddas i templaten via ESM-import från REST-rutten) */
add_action('wp_enqueue_scripts', function () {
    if (!is_singular()) return;

    $css_path = KURSFILTER_PATH . 'assets/css/course-app.css';
    $css_url  = KURSFILTER_URL . '/assets/css/course-app.css';
    wp_enqueue_style(
        'kursfilter-style',
        $css_url,
        [],
        file_exists($css_path) ? filemtime($css_path) : null
    );
});

/**
 * REST-rutt: servera .js-filer från pluginets assets/js/ för att kringgå 403 i wp-content/plugins.
 * Exempel-URL: /wp-json/kursfilter/v1/js/course-app.js?v=TIMESTAMP
 */
// Servera .js från assets/js/ OCH dess undermappar (t.ex. components/*.js)
add_action('rest_api_init', function () {
    register_rest_route('kursfilter/v1', '/js/(?P<path>.+)', [
        'methods'  => 'GET',
        'permission_callback' => '__return_true',
        'callback' => function ($req) {
            $rel = $req['path'];

            // Tillåt bara säkra tecken och paths (a-z 0-9 _ - . /)
            if (!preg_match('#^[A-Za-z0-9_\-\/\.]+$#', $rel)) {
                return new WP_Error('bad_path', 'Invalid path', ['status' => 400]);
            }
            // Förhindra katalogtraversering
            if (strpos($rel, '..') !== false) {
                return new WP_Error('bad_path', 'Invalid path', ['status' => 400]);
            }
            // Måste vara .js-fil
            if (!preg_match('/\.js$/', $rel)) {
                return new WP_Error('bad_ext', 'Only .js files allowed', ['status' => 400]);
            }

            $path = KURSFILTER_PATH . 'assets/js/' . $rel;

            if (!file_exists($path) || !is_file($path)) {
                return new WP_Error('not_found', 'File not found', ['status' => 404]);
            }

            // Caching och headers
            $etag = md5_file($path);
            header('Content-Type: application/javascript; charset=UTF-8');
            header('Cache-Control: public, max-age=31536000, immutable');
            header('ETag: "'.$etag.'"');

            if (isset($_SERVER['HTTP_IF_NONE_MATCH']) && trim($_SERVER['HTTP_IF_NONE_MATCH']) === '"'.$etag.'"') {
                status_header(304);
                exit;
            }

            readfile($path);
            exit;
        }
    ]);
});

