export function FavoriteForm({ favorites, contactInfo, onChange, onSubmit }) {
  const e = React.createElement;

  const isValid = contactInfo.name.trim() && contactInfo.email.trim();
  const maxLength = 300;

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
    }),

    e('textarea', {
      placeholder: 'Meddelande till arrangörer (valfritt)',
      maxLength,
      value: contactInfo.message || '',
      onChange: (ev) => onChange({ ...contactInfo, message: ev.target.value }),
      rows: 4,
      style: { margin: '0.5rem 0', padding: '0.5rem', width: '100%', resize: 'vertical' }
    }),

    e('div', {
      style: { fontSize: '0.85rem', textAlign: 'right', color: '#666' }
    }, `${(contactInfo.message || '').length} / ${maxLength}`),

    e('button', {
      disabled: !isValid,
      onClick: () => isValid && onSubmit && onSubmit(),
      style: {
        marginTop: '1rem',
        padding: '0.5rem 1rem',
        backgroundColor: isValid ? '#4A90E2' : '#ccc',
        color: '#fff',
        border: 'none',
        borderRadius: '6px',
        fontSize: '1rem',
        cursor: isValid ? 'pointer' : 'not-allowed'
      }
    }, 'Skicka intresse')
  );
}
