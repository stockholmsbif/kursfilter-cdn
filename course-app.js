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
    const [searchQuery, setSearchQuery] = React.useState('');
    const [favorites, setFavorites] = React.useState([]);
    const [contactInfo, setContactInfo] = React.useState({ name: '', email: '', phone: '' });

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

    const toggleFavorite = (courseId) => {
      setFavorites(prev =>
        prev.includes(courseId)
          ? prev.filter(id => id !== courseId)
          : [...prev, courseId]
      );
    };

    const handleInputChange = (field) => (ev) => {
      setContactInfo({ ...contactInfo, [field]: ev.target.value });
    };

    if (loading) return e('p', null, 'Laddar...');

    const currentYear = new Date().getFullYear();

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
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(course =>
        (course.course_name || '').toLowerCase().includes(q) ||
        (course.description || '').toLowerCase().includes(q) ||
        (course.location_name || '').toLowerCase().includes(q) ||
        (course.org_name || '').toLowerCase().includes(q)
      );
    }

    return e('div', null,
      e('h2', null, 'Filtrera kurser'),

      e('input', {
        type: 'text',
        placeholder: 'Sök t.ex. bamsegympa, hall eller arrangör',
        value: searchQuery,
        onChange: (ev) => setSearchQuery(ev.target.value),
        style: {
          padding: '0.5rem',
          fontSize: '1rem',
          marginBottom: '1rem',
          width: '100%',
          maxWidth: '500px',
          border: '1px solid #ccc',
          borderRadius: '8px'
        }
      }),

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

      favorites.length > 0 && e('div', {
        style: {
          marginTop: '2rem',
          padding: '1rem',
          background: '#f5f5f5',
          borderRadius: '8px',
          maxWidth: '600px'
        }
      },
        e('h3', null, `Du har valt ${favorites.length} kurs${favorites.length > 1 ? 'er' : ''}`),
        e('input', {
          type: 'text',
          placeholder: 'Ditt namn',
          value: contactInfo.name,
          onChange: handleInputChange('name'),
          style: { margin: '0.5rem 0', padding: '0.5rem', width: '100%' }
        }),
        e('input', {
          type: 'email',
          placeholder: 'Din e-postadress',
          value: contactInfo.email,
          onChange: handleInputChange('email'),
          style: { margin: '0.5rem 0', padding: '0.5rem', width: '100%' }
        }),
        e('input', {
          type: 'tel',
          placeholder: 'Telefonnummer (valfritt)',
          value: contactInfo.phone,
          onChange: handleInputChange('phone'),
          style: { margin: '0.5rem 0', padding: '0.5rem', width: '100%' }
        })
      ),

      e('h2', null, 'Tillgängliga kurser'),
      filtered.map(course =>
        e('div', { style: { position: 'relative' } },
          e('span', {
            onClick: () => toggleFavorite(course.course_id),
            style: {
              position: 'absolute',
              top: '0',
              right: '0',
              cursor: 'pointer',
              fontSize: '1.5rem',
              color: favorites.includes(course.course_id) ? '#d40000' : '#ccc',
              padding: '0.5rem'
            },
            title: favorites.includes(course.course_id) ? 'Ta bort favorit' : 'Markera som favorit'
          }, favorites.includes(course.course_id) ? '❤' : '♡'),
          e(CourseCard, { key: course.course_id, course })
        )
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
          style: { backgroundColor: '#fff', color: '#333' }
        }, opt)
      ),
      e('button', {
        className: 'multiselect-clear',
        onClick: clearAll
      }, 'Rensa alla val')
    )
  );
}
