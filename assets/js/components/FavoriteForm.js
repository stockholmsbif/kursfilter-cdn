// FavoriteForm.js (server-first)
// Skickar intresse till egen endpoint om satt, annars fallback till Google Forms.
import { CONTACT_API_URL, CONTACT_API_TOKEN } from '../config.js';

export function FavoriteForm({ favorites, contactInfo, onChange, onSubmit }) {
    const e = React.createElement;
    const [submitted, setSubmitted] = React.useState(false);
    const [submitting, setSubmitting] = React.useState(false);

    const maxLength = 300;
    const isValidEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v).trim());
    const isValid = String(contactInfo.name || '').trim() && isValidEmail(contactInfo.email || '');

    const handleClick = async () => {
      if (!isValid || !onSubmit || submitting || favorites.length === 0) return;

      setSubmitting(true);

      // Packa data
      const compactCourses = favorites.map(({ course_id }) => course_id);
      const emailCourses = favorites.map(({ course_name, location_name, org_name, org_email, org_phone }) => ({
        course_name,
        location_name,
        org_name,
        org_email,
        org_phone
      }));

      try {
        if (CONTACT_API_URL) {
          // ✅ Primärt: egen endpoint (Apps Script / WP REST)
          const resp = await fetch(CONTACT_API_URL, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              ...(CONTACT_API_TOKEN ? { 'X-Api-Token': CONTACT_API_TOKEN } : {})
            },
            body: JSON.stringify({
              name: contactInfo.name,
              email: contactInfo.email,
              phone: contactInfo.phone || '',
              message: contactInfo.message || '',
              course_ids: compactCourses,
              courses: emailCourses
            })
          });

          if (!resp.ok) {
            throw new Error(`Server svarade ${resp.status}`);
          }
        } else {
          // 🔁 Fallback: Google Forms (no-cors)
          const formUrl = 'https://docs.google.com/forms/d/e/1FAIpQLSdMt7Hp0M-aJ2qxijAu90Anr37LrG7_2sEEcEJByQaIMB1Rdg/formResponse';
          const formData = new FormData();
          formData.append('entry.1262126199', contactInfo.name);
          formData.append('entry.1510975441', contactInfo.email);
          formData.append('entry.1217617098', contactInfo.message || '');
          formData.append('entry.38982473', JSON.stringify(emailCourses));
          formData.append('entry.1944554327', JSON.stringify(compactCourses));

          await fetch(formUrl, { method: 'POST', mode: 'no-cors', body: formData });
        }

        setSubmitted(true);
        onSubmit && onSubmit();
        setTimeout(() => setSubmitted(false), 4000);
      } catch (err) {
        console.error('❌ Fel vid inskick:', err);
        alert('Något gick fel vid inskick. Kontrollera uppgifterna och försök igen.');
      } finally {
        setSubmitting(false);
      }
    };

    const handleRemove = (courseId) => {
      onSubmit && onSubmit({ remove: courseId });
    };

  return e('div', { className: 'favorite-form-wrapper' },
    // ── Rubrik ───────────────────────────────────────────────
    e('h3', null, 'Fyll i dina uppgifter här och välj sedan kurser du vill skicka intresseanmälningar till.'),

    // ── Fält ────────────────────────────────────────────────
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

    // ── Valda kurser (lista) ─────────────────────────────────
    e('div', { className: 'form-selected-summary' },
      favorites.length > 0
        ? e(React.Fragment, null,
            e('div', { className: 'form-selected-count' },
              `${favorites.length} kurs${favorites.length === 1 ? '' : 'er'} vald${favorites.length === 1 ? '' : 'a'}`
            ),
            e('ul', { className: 'form-selected-courses' },
              favorites.map((f, idx) =>
                e('li', { key: (f && f.course_id) ? f.course_id : idx },
                  e('button', {
                    type: 'button',
                    className: 'form-remove-button',
                    title: 'Ta bort',
                    onClick: () => handleRemove(f.course_id)
                  }, '🗑️'),
                  f.course_name
                )
              )
            )
          )
        : e('div', { className: 'form-selected-courses-empty' }, 'Inga kurser valda ännu.')
    ),

    // ── Skicka-knapp + kvittens ──────────────────────────────
    e('button', {
      disabled: !isValid || favorites.length === 0 || submitting,
      onClick: handleClick,
      className: `${(isValid && favorites.length > 0 && !submitting) ? 'form-button-ready' : 'form-button-disabled'} ${submitted ? 'form-button-submitted' : ''}`
    }, submitted ? 'Skickat!' : (submitting ? 'Skickar…' : 'Skicka intresse')),

    submitted && e('div', { className: 'form-confirmation' }, '✅ Ditt intresse har skickats till valda kursarrangörer.')
  );

}
