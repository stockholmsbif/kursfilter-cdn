//Github v1.0
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

  return React.createElement('div', { className: 'course-card' }, [
    // React.createElement('div', { className: 'course-checkbox' }, [
    //   React.createElement('input', {
    //     type: 'checkbox',
    //     id: `select-${course.course_id}`
    //   }),
    // ]),
    React.createElement('div', { className: 'course-content' }, [
      is_popular && React.createElement('div', { className: 'popular' }, '🔥 Populär kurs'),
      React.createElement('h3', null, course_name),
      React.createElement('p', null, `Målgrupp: Barn ${ageLabel}`),
      location_name && React.createElement('p', null, `Plats: ${location_name} (${municipality}, ${city})`),
      React.createElement('p', null, description),
      React.createElement('p', null, `Pris: ${price} kr`),
      React.createElement('p', null, `Arrangör: ${org_name}`),
      booking_link && React.createElement('a', {
        href: booking_link,
        target: '_blank',
        className: 'booking-link'
      }, 'Boka här')
    ])
  ]);
}
