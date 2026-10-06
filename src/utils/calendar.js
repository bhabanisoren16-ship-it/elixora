// Calendar export helper for Google Calendar and Apple / Outlook .ics
export const EVENT_DETAILS = {
  title: "ELIXORA 2.0 - The Official College Freshers' Night",
  description: "Step into the Nexus of Euphoria! Dress Code: Cyber Glam & Ethereal Neon. Bring your VIP Holographic Pass & College ID.",
  location: "Grand Aurora Ballroom & Open Air Arena, Tech Campus",
  startDate: "20261024T183000",
  endDate: "20261024T235900",
  humanDate: "Saturday, October 24, 2026",
  humanTime: "6:30 PM onwards",
  ticketPrice: 399,
  seniorTicketPrice: 600,
  upiId: "elixora2026@okhdfcbank",
  organizer: "Student Council & Cultural Directorate"
};

export function getGoogleCalendarUrl(customDetails = null) {
  const details = { ...EVENT_DETAILS, ...(customDetails || {}) };
  const base = "https://calendar.google.com/calendar/render?action=TEMPLATE";
  const params = new URLSearchParams({
    text: details.title || EVENT_DETAILS.title,
    dates: `${details.startDate || EVENT_DETAILS.startDate}/${details.endDate || EVENT_DETAILS.endDate}`,
    details: `${details.description || EVENT_DETAILS.description}\n\nVenue: ${details.location || EVENT_DETAILS.location}`,
    location: details.location || EVENT_DETAILS.location,
    add: details.upiId || "elixora2026@okhdfcbank"
  });
  return `${base}&${params.toString()}`;
}

export function downloadIcsFile(customDetails = null) {
  const details = { ...EVENT_DETAILS, ...(customDetails || {}) };
  const icsData = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//ELIXORA Freshers//Event Pass//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `SUMMARY:${details.title || EVENT_DETAILS.title}`,
    `DESCRIPTION:${details.description || EVENT_DETAILS.description}`,
    `LOCATION:${details.location || EVENT_DETAILS.location}`,
    `DTSTART:${details.startDate || EVENT_DETAILS.startDate}`,
    `DTEND:${details.endDate || EVENT_DETAILS.endDate}`,
    "STATUS:CONFIRMED",
    "END:VEVENT",
    "END:VCALENDAR"
  ].join("\r\n");

  const blob = new Blob([icsData], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", "ELIXORA-2.0.ics");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
