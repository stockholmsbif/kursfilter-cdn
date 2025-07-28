import { COURSE_API_URL } from './config.js';
import { CourseBrowserApp } from './components/CourseBrowserApp.js';

export function renderCourseBrowser({ React, ReactDOM }) {
  const e = React.createElement;
  const root = ReactDOM.createRoot(document.getElementById('course-browser'));
  root.render(e(CourseBrowserApp));
}
