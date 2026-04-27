// assets/js/course-app.js
import { CourseBrowserApp } from './components/CourseBrowserApp.js';

export function renderCourseBrowser({ React, ReactDOM, config }) {
  const e = React.createElement;
  const rootEl = document.getElementById('course-browser');
  if (!rootEl) return;

  const root = ReactDOM.createRoot(rootEl);

  // Ta config från anropet eller från PHP-templaten
  const cfg = config || (window.__COURSE_BROWSER_PROPS || {});

  root.render(e(CourseBrowserApp, { config: cfg }));
}
