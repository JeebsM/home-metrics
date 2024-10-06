export function getValue<T, K extends keyof T>(data: T, key: K) {
  return data[key];
}

export interface Record {
  id: string;
  insert_timestamp: EpochTimeStamp;
  record_date: string;
  meter: string;
  temperature?: number;
  residents: number;
  wash: number;
  dish: number;
  shower: number;
  houseworking: boolean;
  gaz_heat: boolean;
  wood_heat: boolean;
  wood_bag: number;
  day_kwh?: number;
  night_kwh?: number;
  liters?: number;
  cubic_meter?: number;
}

let today: Date = new Date();

const emptyRecord: Record = {
  id: today.toISOString().split("T")[0].replace(/\-/gi, ""),
  insert_timestamp: Date.now(),
  record_date: today.toISOString().split("T")[0],
  meter: "record",
  temperature: undefined,
  residents: 3,
  wash: 0,
  dish: 0,
  shower: 0,
  houseworking: true,
  gaz_heat: false,
  wood_heat: false,
  wood_bag: 0,
  day_kwh: undefined,
  night_kwh: undefined,
  liters: undefined,
  cubic_meter: undefined,
};

export function getDefaultRecord(): Record {
  return emptyRecord;
}
