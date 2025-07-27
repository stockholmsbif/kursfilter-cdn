import { COURSE_API_URL } from './config.js';

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
          console.log('Kurser hämtade:', data); // 👈 lägg till
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
      e('ul', null,
        courses.map(course =>
          e('li', { key: course.course_id },
            `${course.course_name} (${course.birth_year_from}–${course.birth_year_to}) – ${course.city}`
          )
        )
      )
    );
  }

  root.render(e(CourseBrowserApp));
}
