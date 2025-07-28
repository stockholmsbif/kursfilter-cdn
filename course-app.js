import { COURSE_API_URL } from './config.js';
import { CourseCard } from './components/CourseCard.js';

export function renderCourseBrowser({ React, ReactDOM }) {
  const e = React.createElement;
  const root = ReactDOM.createRoot(document.getElementById('course-browser'));

  function CourseBrowserApp() {
  const [courses, setCourses] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [weekdayFilter, setWeekdayFilter] = React.useState(null);

  const weekdays = ['måndag', 'tisdag', 'onsdag', 'torsdag', 'fredag', 'lördag', 'söndag'];

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

  const filtered = weekdayFilter
    ? courses.filter(course => course.weekday.toLowerCase() === weekdayFilter)
    : courses;

  return e('div', null,
    e('h2', null, 'Filtrera kurser'),

    e('div', { className: 'weekday-filter' },
      e('label', null, 'Veckodag: '),
      e('select', {
        value: weekdayFilter || '',
        onChange: (ev) => {
          const value = ev.target.value;
          setWeekdayFilter(value === '' ? null : value);
        }
      },
        [e('option', { key: '', value: '' }, 'Alla dagar')]
          .concat(weekdays.map(day =>
            e('option', { key: day, value: day }, day.charAt(0).toUpperCase() + day.slice(1))
          ))
      )
    ),

    e('h2', null, 'Tillgängliga kurser'),
    filtered.map(course =>
      e(CourseCard, { key: course.course_id, course })
    )
  );
}


  root.render(e(CourseBrowserApp));
}

