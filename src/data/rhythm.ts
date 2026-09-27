/**
 * Sample readings for the "Every 15 minutes" strip: one patient, 07:00–12:45.
 * Replace with real data from the API once it is available.
 */
export type VitalState = 'ok' | 'watch' | 'alert';

export interface Reading {
  time: string;
  t: number;
  kt: string;
  spo2: number;
  st: number;
  ktState: VitalState;
}

const T = [36.4, 36.5, 36.5, 36.6, 36.5, 36.6, 36.6, 36.7, 36.6, 36.6, 36.5, 36.6, 36.6, 36.7, 36.6, 36.6, 36.5, 36.6, 36.6, 36.5, 36.6, 36.5, 36.5, 36.5];
const KT = ['122/80', '124/81', '121/79', '123/80', '120/78', '122/79', '125/82', '123/80', '121/79', '120/78', '122/80', '124/81', '121/78', '119/77', '120/78', '118/77', '116/76', '113/75', '110/73', '107/72', '104/70', '101/69', '97/67', '89/65'];
const SPO2 = [97, 97, 98, 97, 96, 97, 97, 98, 97, 97, 96, 97, 97, 98, 97, 97, 97, 96, 97, 97, 97, 96, 97, 97];
const ST = [71, 72, 70, 73, 72, 74, 71, 72, 73, 72, 70, 71, 73, 72, 74, 73, 72, 71, 73, 72, 71, 73, 72, 72];

export const readings: Reading[] = T.map((t, i) => {
  const h = 7 + Math.floor(i / 4);
  const m = (i % 4) * 15;
  return {
    time: `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`,
    t,
    kt: KT[i],
    spo2: SPO2[i],
    st: ST[i],
    ktState: i === 23 ? 'alert' : i === 22 ? 'watch' : 'ok',
  };
});
