import { COURSE_API_URL } from './config.js';
import { CourseCard } from './components/CourseCard.js';

export function renderCourseBrowser({ React, ReactDOM }) {
  const e = React.createElement;
  const root = ReactDOM.createRoot(document.getElementById('course-browser'));

  function CourseBrowserApp() {
    const [courses, setCourses] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [weekdayFilter, setWeekdayFilter] = React.useState([]);
    const [municipalityFilter, setMunicipalityFilter] = React.useState([]);
    const [ageGroupFilter, setAgeGroupFilter] = React.useState([]);

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

    const currentYear = new Date().getFullYear();

    // Dynamiska filter baserat på data
    const municipalities = Array.from(new Set(courses.map(c => c.municipality).filter(Boolean))).sort();

    const weekdays = Array.from(new Set(courses.map(c => c.weekday?.toLowerCase()).filter(Boolean)))
      .sort((a, b) => ['måndag','tisdag','onsdag','torsdag','fredag','lördag','söndag'].indexOf(a) - ['måndag','tisdag','onsdag','torsdag','fredag','lördag','söndag'].indexOf(b));

    const ageGroups = Array.from(new Set(
      courses.map(c => {
        const from = currentYear - c.birth_year_to;
        const to = currentYear - c.birth_year_from;
        return `${from}–${to} år`;
      })
    )).sort((a, b) => parseInt(a) - parseInt(b));

    let filtered = courses;
    if (weekdayFilter.length) {
      filtered = filtered.filter(course => weekdayFilter.includes(course.weekday.toLowerCase()));
    }
    if (municipalityFilter.length) {
      filtered = filtered.filter(course => municipalityFilter.includes(course.municipality));
    }
    if (ageGroupFilter.length) {
      filtered = filtered.filter(course => {
        const ageLabel = `${currentYear - course.birth_year_to}–${currentYear - course.birth_year_from} år`;
        return ageGroupFilter.includes(ageLabel);
      });
    }

    return e('div', null,
      e('h2', null, 'Filtrera kurser'),

      e(MultiSelectFilter, {
        title: 'Veckodag',
        options: weekdays,
        selected: weekdayFilter,
        onChange: setWeekdayFilter
      }),

      e(MultiSelectFilter, {
        title: 'Kommun',
        options: municipalities,
        selected: municipalityFilter,
        onChange: setMunicipalityFilter
      }),

      e(MultiSelectFilter, {
        title: 'Åldersgrupp',
        options: ageGroups,
        selected: ageGroupFilter,
        onChange: setAgeGroupFilter
      }),

      e('h2', null, 'Tillgängliga kurser'),
      filtered.map(course =>
        e(CourseCard, { key: course.course_id, course })
      )
    );
  }

  root.render(e(CourseBrowserApp));
}

function MultiSelectFilter({ title, options, selected, onChange }) {
  const e = React.createElement;
  const [open, setOpen] = React.useState(false);

  const toggle = (value) => {
    onChange(selected.includes(value)
      ? selected.filter(v => v !== value)
      : [...selected, value]);
  };

  const clearAll = () => onChange([]);

  return e('div', { className: 'multiselect-filter' },
    e('button', {
      className: 'multiselect-toggle',
      onClick: () => setOpen(!open)
    }, `${title} (${selected.length})`),

    open && e('div', { className: 'multiselect-options' },
      options.map(opt =>
        e('div', {
          key: opt,
          className: 'multiselect-option' + (selected.includes(opt) ? ' selected' : ''),
          onClick: () => toggle(opt),
        }, opt)
      ),
      e('button', {
        className: 'multiselect-clear',
        onClick: clearAll
      }, 'Rensa alla val')
    )
  );
}
