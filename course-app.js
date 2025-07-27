import { COURSE_API_URL } from './config.js';
import { CourseCard } from './components/CourseCard.js';

export function renderCourseBrowser({ React, ReactDOM }) {
  const e = React.createElement;
  const root = ReactDOM.createRoot(document.getElementById('course-browser'));

  function CourseBrowserApp() {
    const [courses, setCourses] = React.useState([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
      fetch(COURSE_API_URL)
        .then(res => res.json())
        .then(data => {
          console.log('Kurser hämtade:', data);
          setCourses(data);
          setLoading(false);
        })
        .catch(err => {
          console.error('Fel vid hämtning:', err);
          setLoading(false);
        });
    }, []);

    if (loading) return e('p', null, 'Laddar...');

    return e('div', null,
      e('h2', null, 'Tillgängliga kurser'),
      courses.map(course =>
        e(CourseCard, { key: course.course_id, course })
      )
    );
  }

  root.render(e(CourseBrowserApp));
}
