// MEjority icon lab · tab-protocols: Protocols tab. Our own drawing; the reference only names the idea.
export default {
  id: "tab-protocols", order: 3, kind: "tab",
  title: "Protocols tab", meaning: "What you take and when: substances, doses, plans.",
  area: "protocols",
  ref: "refs/tab-protocols.png", refNote: "Capsule beside a half tablet, tab bar",
  variants: [
    { key: "A", name: "Plump",
      svg: `<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><g transform="rotate(-45 24 24)" fill="currentColor" stroke="none"><path d="M22.4 14H13a10 10 0 0 0 0 20h9.4z"/><path d="M25.6 14H35a10 10 0 0 1 0 20h-9.4z"/></g></svg>`,
      note: "One fat capsule on the rising diagonal, its two halves parted by a slit." },
    { key: "B", name: "Cut-out",
      svg: `<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><g transform="rotate(-45 24 24)"><path fill="currentColor" stroke="none" fill-rule="evenodd" d="M13 14h22a10 10 0 0 1 0 20H13a10 10 0 0 1 0-20zM27.8 18.4a1.2 1.2 0 0 0-1.2 1.2v8.8a1.2 1.2 0 0 0 1.2 1.2H35a5.6 5.6 0 0 0 0-11.2z"/></g></svg>`,
      note: "Solid capsule, one half hollowed out: filled and empty half." },
    { key: "C", name: "Two weights",
      svg: `<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><g transform="rotate(-45 24 24)"><path d="M24 15H14a9 9 0 0 0 0 18h10z" fill="currentColor" fill-opacity=".24" stroke="none"/><rect x="5" y="15" width="38" height="18" rx="9" stroke-width="4.2"/><path d="M24 16v16" stroke-width="2.8"/></g></svg>`,
      note: "Heavy outline, lighter seam, one half softly tinted (today's Cozy glyph, refined)." },
    { key: "D", name: "Line",
      svg: `<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><g transform="rotate(-45 24 24)" stroke-width="3.6"><rect x="5.5" y="15.5" width="37" height="17" rx="8.5"/><path d="M24 15.5v17"/></g></svg>`,
      note: "Capsule outline and seam, one stroke weight." },
    { key: "E", name: "Bottle",
      svg: `<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><rect x="13.5" y="5" width="21" height="9.5" rx="3.4" fill="currentColor" stroke="none"/><path fill="currentColor" stroke="none" fill-rule="evenodd" d="M15.5 17.5h17a5.5 5.5 0 0 1 5.5 5.5v14.5a5.5 5.5 0 0 1-5.5 5.5h-17a5.5 5.5 0 0 1-5.5-5.5V23a5.5 5.5 0 0 1 5.5-5.5zM18.2 26.8a3.2 3.2 0 0 0 0 6.4h11.6a3.2 3.2 0 0 0 0-6.4z"/></svg>`,
      note: "Another motif: the supply rather than the single dose, a small bottle with its label." },
  ]
};
