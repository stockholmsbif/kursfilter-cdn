<?php
// Säkerställ att $props finns
$props = isset($props) && is_array($props)
  ? $props
  : ['municipality' => '', 'city' => '', 'lock' => '0'];

// För cache-busting av modulen hämtar vi mtime från filsystemet (pluginmappen)
$plugin_js_file = KURSFILTER_PATH . 'assets/js/course-app.js';
$ver = file_exists($plugin_js_file) ? filemtime($plugin_js_file) : 0;
?>

<div id="course-browser"
     data-default-municipality="<?php echo esc_attr($props['municipality']); ?>"
     data-default-city="<?php echo esc_attr($props['city']); ?>"
     data-lock="<?php echo esc_attr($props['lock']); ?>">
  <p>Laddar kurser...</p>
</div>

<!-- React UMD från CDN (går bra att behålla) -->
<script src="https://unpkg.com/react@18/umd/react.development.js"></script>
<script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>

<!-- Gör konfigurationen tillgänglig globalt -->
<script>
  window.__COURSE_BROWSER_PROPS = {
    municipality: "<?php echo esc_js($props['municipality']); ?>",
    city: "<?php echo esc_js($props['city']); ?>",
    lock: "<?php echo esc_js($props['lock']); ?>" === "1"
  };
</script>

<!-- Importera vår modul via REST-URL (kringgår 403) och initiera appen -->
<script type="module">
  import { renderCourseBrowser } from "<?php echo esc_url( rest_url('kursfilter/v1/js/course-app.js') . ($ver ? '?v='.$ver : '') ); ?>";

  renderCourseBrowser({
    React: globalThis.React,
    ReactDOM: globalThis.ReactDOM,
    config: window.__COURSE_BROWSER_PROPS
  });
</script>
