/** Section anchors in the main navigation on the home page; labels live in src/i18n under `nav`. */
export const navIds = ['reseni', 'jak', 'zarizeni', 'kontakt'] as const;

/** Preadico s.r.o., as listed on preadico.cz and in the Commercial Register. */
export const company = {
  name: 'Preadico s.r.o.',
  shortName: 'Preadico',
  web: 'https://www.preadico.cz',
  webLabel: 'www.preadico.cz',
  email: 'info@preadico.cz',
  phone: 'tel:+420602159119',
  phoneLabel: '+420 602 159 119',
  address: {
    street: 'Drážďanská 858/83b',
    district: 'Krásné Březno',
    postalCode: '400 07',
    city: 'Ústí nad Labem',
    country: 'CZ',
  },
  ico: '49825828',
  vatId: 'CZ49825828',
};
