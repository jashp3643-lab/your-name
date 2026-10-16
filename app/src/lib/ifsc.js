// Small fictional IFSC directory for the demo (no real banks or branches).
export const IFSC_DIRECTORY = [
  { ifsc: 'DEMO0000101', bank: 'DemoBank', branch: 'MG Road (West), Pune' },
  { ifsc: 'DEMO0000202', bank: 'DemoBank', branch: 'Fort, Mumbai' },
  { ifsc: 'NOVA0001001', bank: 'Nova Bank', branch: 'Indiranagar, Bengaluru' },
  { ifsc: 'NOVA0001045', bank: 'Nova Bank', branch: 'Connaught Place, New Delhi' },
  { ifsc: 'ARYA0002300', bank: 'Arya Co-operative Bank', branch: 'T Nagar, Chennai' },
  { ifsc: 'ARYA0002411', bank: 'Arya Co-operative Bank', branch: 'Banjara Hills, Hyderabad' },
];

export const OWN_BANK_IFSC = 'DEMO0000101';

export function lookupIfsc(code) {
  const c = String(code || '').trim().toUpperCase();
  return IFSC_DIRECTORY.find((e) => e.ifsc === c) || null;
}

export function searchIfsc(query) {
  const q = String(query || '').trim().toLowerCase();
  if (!q) return IFSC_DIRECTORY;
  return IFSC_DIRECTORY.filter(
    (e) =>
      e.ifsc.toLowerCase().includes(q) ||
      e.bank.toLowerCase().includes(q) ||
      e.branch.toLowerCase().includes(q)
  );
}
