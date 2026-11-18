// MEjority icon lab · tab-today: Today tab. Our own drawing; the reference only names the idea.
export default {
  id: "tab-today", order: 1, kind: "tab",
  title: "Today tab", meaning: "The start page: what today holds.",
  area: "today",
  ref: "refs/tab-today.png", refNote: "Solid house with a door and chimney, tab bar",
  variants: [
    { key: "A", name: "Plump",
      svg: `<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M6.8 22.6 24 8.4l17.2 14.2" stroke-width="5.6"/><path d="M24 17.4 35.4 26.8V37a4 4 0 0 1-4 4H16.6a4 4 0 0 1-4-4V26.8z" fill="currentColor" stroke-width="2"/></svg>`,
      note: "A solid little house under a thick roof that floats a hair above it." },
    { key: "B", name: "Cut-out",
      svg: `<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path fill="currentColor" stroke="none" fill-rule="evenodd" d="M21.4 8.9a4 4 0 0 1 5.2 0L39.6 20a4 4 0 0 1 1.4 3v14a5 5 0 0 1-5 5H12a5 5 0 0 1-5-5V23a4 4 0 0 1 1.4-3zM19.8 42v-8.3a4.2 4.2 0 0 1 8.4 0V42z"/></svg>`,
      note: "One solid house shape, the arched door cut out of it." },
    { key: "C", name: "Two weights",
      svg: `<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M9 22.4 24 9.8l15 12.6V36a4.6 4.6 0 0 1-4.6 4.6H13.6A4.6 4.6 0 0 1 9 36z" stroke-width="4.2" fill="currentColor" fill-opacity=".18"/><path d="M20 40.4v-7.2a4 4 0 0 1 8 0v7.2" stroke-width="2.8"/></svg>`,
      note: "Heavy outline with a soft tint, the door in a lighter stroke (today's Cozy glyph, refined)." },
    { key: "D", name: "Line",
      svg: `<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><g stroke-width="3.6"><path d="M6.5 22.8 24 8.6l17.5 14.2"/><path d="M11.8 19.8v16.8a4.2 4.2 0 0 0 4.2 4.2h16a4.2 4.2 0 0 0 4.2-4.2V19.8"/><path d="M20.2 40.6v-6.2a3.8 3.8 0 0 1 7.6 0v6.2"/></g></svg>`,
      note: "Roof, walls and door as three strokes of one weight." },
    { key: "E", name: "Sun",
      svg: `<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><circle cx="24" cy="24" r="8.8" fill="currentColor" stroke="none"/><path d="M24 5.2v3.8M24 39v3.8M5.2 24H9M39 24h3.8M10.7 10.7l2.7 2.7M34.6 34.6l2.7 2.7M10.7 37.3l2.7-2.7M34.6 13.4l2.7-2.7" stroke-width="4.4"/></svg>`,
      note: "Another motif: today as the day itself, a plump sun." },
  ]
};
