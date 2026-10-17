/** Illustrations with text drawn in them, one file per language (the *-en.svg files are translated copies). */
import type { Locale } from './index';
import ward from '../assets/img/ui-virtual-ward-tablet.svg';
import wardEn from '../assets/img/ui-virtual-ward-tablet-en.svg';
import ecg from '../assets/img/ui-ecg-report-tablet.svg';
import ecgEn from '../assets/img/ui-ecg-report-tablet-en.svg';
import phone from '../assets/img/ui-patient-app-phone.svg';
import phoneEn from '../assets/img/ui-patient-app-phone-en.svg';
import seal from '../assets/img/seal-mdr-ring.svg';
import sealEn from '../assets/img/seal-mdr-ring-en.svg';

const images = {
  ward: { cs: ward, en: wardEn },
  ecg: { cs: ecg, en: ecgEn },
  phone: { cs: phone, en: phoneEn },
  seal: { cs: seal, en: sealEn },
} satisfies Record<string, Record<Locale, ImageMetadata>>;

export const localizedImage = (name: keyof typeof images, locale: Locale): ImageMetadata => images[name][locale];
