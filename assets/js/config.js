// config.js
// Centrala konstanter för kursfilter-appen

// ✅ Endast courses.json ligger kvar på GitHub (det ska fortsätta peka dit)
export const COURSE_API_URL = 'https://stockholmsbif.github.io/kursfilter-cdn/courses.json';

// 🔹 Dessa API:er kommer eventuellt flyttas till din egen server senare.
// För nu kan du låta dem ligga kvar om du använder Apps Script.
//export const CONTACT_API_URL = 'https://script.google.com/macros/s/AKfycbyOr8JPI8HLXuW-ukjLFCXowV7GLRnWmZ_u7pPvZmnytnS2FG6zN7k2TgxMGWFhPtuGLg/exec';
//export const CONTACT_API_TOKEN = 'dinHemligaKod';

export const CONTACT_API_URL = '';
export const CONTACT_API_TOKEN = '';


// 🔸 För framtiden (om du vill köra all e-posthantering via WordPress REST API):
// export const CONTACT_ENDPOINT = '/wp-json/kursfilter/v1/contact';
