export type HolidayType = "nacional" | "regional" | "irrenunciable";

export type HolidayCategory = "religioso" | "civico" | "laboral" | "bancario";

export interface Holiday {
  id: string;
  date: string;
  name: string;
  type: HolidayType;
  category: HolidayCategory;
  regions?: string[];
  irrenunciable: boolean;
}
