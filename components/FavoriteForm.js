//FavoriteForm.js Github v1.7
import { CONTACT_API_TOKEN } from '../config.js';

export function FavoriteForm({ favorites, contactInfo, onChange, onSubmit }) {
  const e = React.createElement;
  const [submitted, setSubmitted] = React.useState(false);
  const isValid = contactInfo.name.trim() && contactInfo.email.trim();
  const maxLength = 300;

  const handleClick = () => {
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
        setSubmitted(true);
        onSubmit();
        setTimeout(() => setSubmitted(false), 4000);
      })
      .catch(err => {
        console.error('❌ Fel vid inskick:', err);
        alert('Något gick fel. Försök igen senare.');
      });
  };

  return e('div', { className: 'favorite-form-wrapper' }, [
    e('h3', null, 'Fyll i dina uppgifter här och välj sedan kurser du vill skicka intresseanmälningar till.'),

    e('input', {
      type: 'text',
      name: 'name',
      autoComplete: 'name',
      placeholder: 'Ditt namn',
      value: contactInfo.name,
      onChange: (ev) => onChange({ ...contactInfo, name: ev.target.value }),
      className: 'form-input'
    }),

    e('input', {
      type: 'email',
      name: 'email',
      autoComplete: 'email',
      placeholder: 'Din e-postadress',
      value: contactInfo.email,
      onChange: (ev) => onChange({ ...contactInfo, email: ev.target.value }),
      className: 'form-input'
    }),

    e('input', {
      type: 'tel',
      name: 'phone',
      autoComplete: 'tel',
      placeholder: 'Telefonnummer (valfritt)',
      value: contactInfo.phone,
      onChange: (ev) => onChange({ ...contactInfo, phone: ev.target.value }),
      className: 'form-input'
    }),

    e('textarea', {
      placeholder: 'Meddelande till arrangörer (valfritt)',
      maxLength,
      value: contactInfo.message || '',
      onChange: (ev) => onChange({ ...contactInfo, message: ev.target.value }),
      rows: 4,
      className: 'form-textarea'
    }),

    e('div', { className: 'form-length-info' }, `${(contactInfo.message || '').length} / ${maxLength}`),

    e('div', { className: 'form-selected-summary' },
      favorites.length > 0
        ? [
            e('div', { className: 'form-selected-count' }, `${favorites.length} kurs${favorites.length > 1 ? 'er' : ''} valda:`),
            e('ul', { className: 'form-selected-courses' }, favorites.map((f, i) => e('li', { key: i }, f.course_name)))
          ]
        : e('div', { className: 'form-selected-courses-empty' }, 'Inga kurser valda ännu.')
    ),

    e('button', {
      disabled: !isValid || favorites.length === 0,
      onClick: handleClick,
      className: `${isValid && favorites.length > 0 ? 'form-button-ready' : 'form-button-disabled'} ${submitted ? 'form-button-submitted' : ''}`
    }, submitted ? 'Skickat!' : 'Skicka intresse'),

    submitted && e('div', { className: 'form-confirmation' }, '✅ Ditt intresse har skickats till valda kursarrangörer.')
  ]);
}
