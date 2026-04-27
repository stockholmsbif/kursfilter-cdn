function doPost(e) {
  const payload = JSON.parse(e.postData.contents);

  if (payload.token !== 'dinHemligaKod') {
    return ContentService.createTextOutput("Ogiltig token").setMimeType(ContentService.MimeType.TEXT);
  }

  const contact = payload.contactInfo;
  const courses = payload.favorites;

  if (!contact.name || !contact.email || !courses || !courses.length) {
    return ContentService.createTextOutput("Ogiltigt anrop").setMimeType(ContentService.MimeType.TEXT);
  }

  const grouped = {};
  courses.forEach(course => {
    const orgEmail = course.org_email || "okänd@domän.se";
    if (!grouped[orgEmail]) grouped[orgEmail] = [];
    grouped[orgEmail].push(course);
  });

  Object.entries(grouped).forEach(([email, list]) => {
    const message = [
      `Hej! En person har visat intresse för ${list.length} av era kurser:`,
      '',
      ...list.map(c => `- ${c.course_name} (${c.location_name})`),
      '',
      `Kontaktuppgifter:`,
      `Namn: ${contact.name}`,
      `E-post: ${contact.email}`,
      contact.phone ? `Telefon: ${contact.phone}` : '',
      contact.message ? `Meddelande: ${contact.message}` : ''
    ].join('\n');

    MailApp.sendEmail({
      to: email,
      subject: 'Intresseanmälan från barngymnastik.nu',
      replyTo: contact.email,
      body: message
    });
  });

  return ContentService.createTextOutput("OK").setMimeType(ContentService.MimeType.TEXT);
}
