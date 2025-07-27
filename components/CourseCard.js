export function CourseCard({ course }) {
  const {
    course_name,
    birth_year_from,
    birth_year_to,
    city,
    municipality,
    location_name,
    description,
    price,
    booking_link,
    is_popular,
    weekday,
    org_name
  } = course;

  const currentYear = new Date().getFullYear();
  const ageFrom = currentYear - birth_year_to;
  const ageTo = currentYear - birth_year_from;
  const ageLabel = `${ageFrom}–${ageTo} år`;

  return React.createElement('div', {
    className: 'course-card',
    style: {
      border: '1px solid #ccc',
      borderRadius: '12px',
      padding: '16px',
      marginBottom: '16px',
      background: '#fff',
      boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
    }
  }, [
    is_popular && React.createElement('div', {
      style: { color: 'red', fontWeight: 'bold' }
    }, '🔥 Populär kurs'),

    React.createElement('h3', null, course_name),
    React.createElement('p', null, `${ageLabel} – ${weekday} – ${city}`),
    location_name && React.createElement('p', null, `Plats: ${location_name} (${municipality})`),
    React.createElement('p', null, description),
    React.createElement('p', null, `Pris: ${price} kr`),
    React.createElement('p', null, `Arrangör: ${org_name}`),
    booking_link && React.createElement('a', {
      href: booking_link,
      target: '_blank',
      style: {
        display: 'inline-block',
        marginTop: '8px',
        padding: '8px 12px',
        backgroundColor: '#007BFF',
        color: 'white',
        textDecoration: 'none',
        borderRadius: '8px'
      }
    }, 'Boka här')
  ]);
}
