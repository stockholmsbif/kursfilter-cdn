// CourseBrowserApp.js (server-first, lock-stöd för city/municipality)
import { COURSE_API_URL } from '../config.js';
import { CourseCard } from './CourseCard.js';
import { MultiSelectFilter } from './MultiSelectFilter.js';
import { FavoriteForm } from './FavoriteForm.js';

export function CourseBrowserApp({ config }) {
  const e = React.createElement;

  // 1) Läs config (prop eller global). City prioriteras om båda satts.
  const cfg = config || (window.__COURSE_BROWSER_PROPS || {});
  const isLocked = !!cfg.lock;
  const lockedCity = (isLocked && cfg.city) ? String(cfg.city).trim() : null;
  const lockedMunicipality =
    (!lockedCity && isLocked && cfg.municipality) ? String(cfg.municipality).trim() : null;

  // 2) State
  const [courses, setCourses] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [weekdayFilter, setWeekdayFilter] = React.useState([]); // kvar för framtiden
  const [municipalityFilter, setMunicipalityFilter] = React.useState(
    lockedMunicipality ? [lockedMunicipality] : []
  );
  const [cityFilter, setCityFilter] = React.useState(
    lockedCity ? [lockedCity] : []
  );
  const [ageGroupFilter, setAgeGroupFilter] = React.useState([]);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [favorites, setFavorites] = React.useState([]);
  const [contactInfo, setContactInfo] = React.useState({ name: '', email: '', phone: '', message: '' });
  const [expandedCourse, setExpandedCourse] = React.useState(null);

  // 3) Datahämtning
  React.useEffect(() => {
    fetch(COURSE_API_URL)
      .then(res => res.json())
      .then(data => {
        setCourses(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Fel vid hämtning:', err);
        setLoading(false);
      });
  }, []);

  // 4) Hjälpare
  const toggleFavorite = (courseId) => {
    setFavorites(prev => prev.includes(courseId)
      ? prev.filter(id => id !== courseId)
      : [...prev, courseId]
    );
  };

  const toggleExpanded = (courseId) => {
    setExpandedCourse(prev => (prev === courseId ? null : courseId));
  };

  const handleSubmit = (action) => {
    if (action?.remove) {
      setFavorites(prev => prev.filter(id => id !== action.remove));
      return;
    }
    console.log('Formulär skickat med:', {
      contactInfo,
      selectedCourses: courses.filter(c => favorites.includes(c.course_id))
    });
  };

  const currentYear = new Date().getFullYear();

  // 5) Dynamiska listor
  const municipalities = Array.from(new Set(courses.map(c => c.municipality).filter(Boolean))).sort();
  const cities = Array.from(new Set(courses.map(c => c.city).filter(Boolean))).sort();

  const allAges = new Set();
  courses.forEach(c => {
    const from = currentYear - c.birth_year_to;
    const to = currentYear - c.birth_year_from;
    for (let age = from; age <= to; age++) allAges.add(age);
  });
  const ageGroups = Array.from(allAges).sort((a, b) => a - b);

  // 6) Filtrering
  let filtered = courses;
  if (municipalityFilter.length) {
    filtered = filtered.filter(course => municipalityFilter.includes(course.municipality));
  }
  if (cityFilter.length) {
    filtered = filtered.filter(course => cityFilter.includes(course.city));
  }
  if (ageGroupFilter.length) {
    filtered = filtered.filter(course => {
      const from = currentYear - course.birth_year_to;
      const to = currentYear - course.birth_year_from;
      return ageGroupFilter.some(age => age >= from && age <= to);
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

  // 7) Visa/Dölj filterkontroller (city-lås döljer båda; municipality-lås döljer bara municipality)
  const showMunicipalityFilter = !(lockedCity || lockedMunicipality);
  const showCityFilter = !lockedCity;

  return e(React.Fragment, null,
    e(FavoriteForm, {
      favorites: courses.filter(c => favorites.includes(c.course_id)),
      contactInfo,
      onChange: setContactInfo,
      onSubmit: handleSubmit
    }),

    e('h2', null, 'Filtrera kurser'),

    e('input', {
      type: 'text',
      placeholder: 'Sök t.ex. bamsegympa, hall eller arrangör',
      value: searchQuery,
      onChange: (ev) => setSearchQuery(ev.target.value),
      className: 'search-input'
    }),

    showMunicipalityFilter && e(MultiSelectFilter, {
      title: 'Kommun',
      options: municipalities,
      selected: municipalityFilter,
      onChange: setMunicipalityFilter
    }),

    showCityFilter && e(MultiSelectFilter, {
      title: 'Ort',
      options: cities,
      selected: cityFilter,
      onChange: setCityFilter
    }),

    e(MultiSelectFilter, {
      title: 'Barnets ålder',
      options: ageGroups,
      selected: ageGroupFilter,
      onChange: setAgeGroupFilter
    }),

    e('h2', null, 'Tillgängliga kurser'),

    // lista med kurser (vi tog redan bort arrayen + la key i tidigare fix)
    ...filtered.map((course, i) =>
      e('div', { key: course.course_id ?? i, className: 'course-wrapper' },
        e('button', {
          onClick: () => toggleFavorite(course.course_id),
          className: favorites.includes(course.course_id)
            ? 'select-button selected'
            : 'select-button not-selected'
        }, favorites.includes(course.course_id) ? 'Vald' : 'Välj'),
        e(CourseCard, {
          course,
          expanded: expandedCourse === course.course_id,
          onToggle: () => toggleExpanded(course.course_id)
        })
      )
    )
  );

}
