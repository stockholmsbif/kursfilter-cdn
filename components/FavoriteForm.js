export function FavoriteForm({ favorites, contactInfo, onChange }) {
  const e = React.createElement;

  return e('div', {
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
      onChange: (ev) => onChange({ ...contactInfo, name: ev.target.value }),
      style: { margin: '0.5rem 0', padding: '0.5rem', width: '100%' }
    }),

    e('input', {
      type: 'email',
      placeholder: 'Din e-postadress',
      value: contactInfo.email,
      onChange: (ev) => onChange({ ...contactInfo, email: ev.target.value }),
      style: { margin: '0.5rem 0', padding: '0.5rem', width: '100%' }
    }),

    e('input', {
      type: 'tel',
      placeholder: 'Telefonnummer (valfritt)',
      value: contactInfo.phone,
      onChange: (ev) => onChange({ ...contactInfo, phone: ev.target.value }),
      style: { margin: '0.5rem 0', padding: '0.5rem', width: '100%' }
    })
  );
}
