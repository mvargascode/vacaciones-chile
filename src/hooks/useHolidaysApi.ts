import { useState, useEffect } from "react";
import type { Holiday } from "../types/holiday.types";
import { fetchHolidaysFromApi } from "../services/holidayApiService";
import { getHolidaysForRegion } from "../services/holidayService";

// Cache en memoria para no repetir llamadas durante la sesión
const cache = new Map<string, Holiday[]>();

interface UseHolidaysApiResult {
  holidays: Holiday[];
  loading: boolean;
  fromApi: boolean; // true = datos frescos de la API, false = fallback
}

export function useHolidaysApi(
  year: number,
  region: string,
): UseHolidaysApiResult {
  const cacheKey = `${year}`;
  const [allHolidays, setAllHolidays] = useState<Holiday[]>(
    () => cache.get(cacheKey) ?? [],
  );
  const [loading, setLoading] = useState(!cache.has(cacheKey));
  const [fromApi, setFromApi] = useState(false);

  useEffect(() => {
    if (cache.has(cacheKey)) {
      setAllHolidays(cache.get(cacheKey)!);
      setLoading(false);
      return;
    }

    setLoading(true);
    fetchHolidaysFromApi(year).then((data) => {
      cache.set(cacheKey, data);
      setAllHolidays(data);
      setFromApi(true);
      setLoading(false);
    });
  }, [year, cacheKey]);

  // Filtramos por región igual que antes
  const holidays = allHolidays.filter(
    (h) => h.type !== "regional" || (h.regions?.includes(region) ?? false),
  );

  return { holidays, loading, fromApi };
}
