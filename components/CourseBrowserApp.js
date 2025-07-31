//Github v1.0
import { COURSE_API_URL } from '../config.js';
import { CourseCard } from './CourseCard.js';
import { MultiSelectFilter } from './MultiSelectFilter.js';
import { FavoriteForm } from './FavoriteForm.js';

export function CourseBrowserApp() {
  const e = React.createElement;
  const [courses, setCourses] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [weekdayFilter, setWeekdayFilter] = React.useState([]);
  const [municipalityFilter, setMunicipalityFilter] = React.useState([]);
  const [ageGroupFilter, setAgeGroupFilter] = React.useState([]);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [favorites, setFavorites] = React.useState([]);
  const [contactInfo, setContactInfo] = React.useState({ name: '', email: '', phone: '', message: '' });

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

  const handleSubmit = () => {
    console.log('📨 Formulär skickat med:', {
      contactInfo,
      selectedCourses: courses.filter(c => favorites.includes(c.course_id))
    });
  };

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

  if (loading) return e('p', null, 'Laddar...');

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
      title: 'Aldersgrupp',
      options: ageGroups,
      selected: ageGroupFilter,
      onChange: setAgeGroupFilter
    }),

    favorites.length > 0 && e(FavoriteForm, {
      favorites: courses.filter(c => favorites.includes(c.course_id)),
      contactInfo,
      onChange: setContactInfo,
      onSubmit: handleSubmit
    }),

    e('h2', null, 'Tillgängliga kurser'),
    filtered.map(course =>
      e('div', { key: course.course_id, style: { position: 'relative' } }, [
        e('button', {
          onClick: () => toggleFavorite(course.course_id),
          style: {
            position: 'absolute',
            top: '0',
            right: '0',
            margin: '0.5rem',
            padding: '0.5rem 1rem',
            backgroundColor: favorites.includes(course.course_id) ? '#4CAF50' : '#f0f0f0',
            color: favorites.includes(course.course_id) ? 'white' : 'black',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }
        }, favorites.includes(course.course_id) ? 'Vald' : 'Välj'),
        e(CourseCard, { course })
      ])
    )
  );
}
