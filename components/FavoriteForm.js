import { CONTACT_API_URL, CONTACT_API_TOKEN } from '../config.js';

export function FavoriteForm({ favorites, contactInfo, onChange, onSubmit }) {
  const e = React.createElement;

  const isValid = contactInfo.name.trim() && contactInfo.email.trim();
  const maxLength = 300;

  const handleClick = () => {
    console.log('🔍 Klick på SKICKA INTRESSE!');

    if (!isValid || !onSubmit) {
      console.warn('Validering misslyckades eller onSubmit saknas');
      return;
    }

    const payload = {
      contactInfo,
      favorites,
      token: CONTACT_API_TOKEN
    };

    console.log('📦 Skickar payload:', payload);

    fetch(CONTACT_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(res => res.text())
      .then(resText => {
        console.log('✅ Svar från servern:', resText);
        alert('Ditt intresse har skickats till arrangörerna!');
        onSubmit();
      })
      .catch(err => {
        console.error('❌ Fel vid skick:', err);
        alert('Något gick fel. Försök igen senare.');
      });
  };

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
      onClick: handleClick,
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
