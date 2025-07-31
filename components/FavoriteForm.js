import { CONTACT_API_TOKEN } from '../config.js';

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

    const formUrl = 'https://docs.google.com/forms/d/e/1FAIpQLSdMt7Hp0M-aJ2qxijAu90Anr37LrG7_2sEEcEJByQaIMB1Rdg/formResponse';
    const formData = new FormData();

    const compactCourses = favorites.map(({ course_id }) => course_id);

    const emailCourses = favorites.map(({ course_name, location_name, org_name, org_email, org_phone }) => ({
      course_name,
      location_name,
      org_name,
      org_email,
      org_phone
    }));

    formData.append('entry.1262126199', contactInfo.name);
    formData.append('entry.1510975441', contactInfo.email);
    formData.append('entry.1217617098', contactInfo.message || '');
    formData.append('entry.38982473', JSON.stringify(emailCourses));
    formData.append('entry.1944554327', JSON.stringify(compactCourses));

    fetch(formUrl, {
      method: 'POST',
      mode: 'no-cors',
      body: formData
    })
      .then(() => {
        console.log('✅ Formulär inskickat');
        alert('Ditt intresse har skickats och sparats!');
        onSubmit();
      })
      .catch(err => {
        console.error('❌ Fel vid inskick:', err);
        alert('Något gick fel. Försök igen senare.');
      });
  };

  return e('div', { className: 'favorite-form' },
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
      className: isValid ? 'select-button selected' : 'select-button not-selected'
    }, 'Skicka intresse')
  );
} 
