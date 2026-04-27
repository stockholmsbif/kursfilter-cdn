// CourseCard.js (server-first, robust platsrad + säkrare länk)
export function CourseCard({ course, expanded, onToggle }) {
  const {
    course_id,
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

  // Bygg plats-text utan "undefined"
  const placeBits = [municipality, city].filter(Boolean).join(', ');
  const placeText =
    location_name && placeBits ? `${location_name} (${placeBits})`
    : location_name ? location_name
    : placeBits ? placeBits
    : null;

  // Pris som ren text om det finns (undvik "undefined kr")
  const priceText = (price !== undefined && price !== null && `${price}`.trim() !== '')
    ? `${price} kr`
    : null;

  return React.createElement('div', { className: 'course-card', 'data-id': course_id },
  React.createElement('div', { className: 'course-content' },
    is_popular && React.createElement('div', { className: 'popular' }, '🔥 Populär kurs'),
    React.createElement('h3', null, course_name),

    // Målgrupp
    React.createElement('p', null, `Målgrupp: Barn ${ageLabel}`),

    // Veckodag (om finns)
    weekday && React.createElement('p', null, `Veckodag: ${String(weekday).charAt(0).toUpperCase()}${String(weekday).slice(1)}`),

    // Plats
    placeText && React.createElement('p', null, `Plats: ${placeText}`),

    // Pris
    priceText && React.createElement('p', null, `Pris: ${priceText}`),

    // Arrangör
    org_name && React.createElement('p', null, `Arrangör: ${org_name}`),

    // Boka-länk
    booking_link && React.createElement('a', {
      href: booking_link,
      target: '_blank',
      rel: 'noopener noreferrer',
      className: 'booking-link'
    }, 'Boka här'),

    // Expandera beskrivning
    React.createElement('button', {
      onClick: onToggle,
      className: 'course-toggle',
      type: 'button'
    }, expanded ? 'Visa mindre' : 'Visa mer'),

    expanded && description && React.createElement('div', {
      className: 'course-description',
      dangerouslySetInnerHTML: { __html: description }
    })
  )
);

}
