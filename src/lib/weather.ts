// 伺服器端天氣資料取得：Open-Meteo 天氣 API + 30 分鐘記憶體快取
export const WEATHER_API_URL =
  'https://api.open-meteo.com/v1/forecast?latitude=25.041313&longitude=121.076243&current=temperature_2m,apparent_temperature,relative_humidity_2m,precipitation,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=Asia%2FTaipei&forecast_days=5';

export interface WeatherData {
  current: {
    time: string;
    temperature_2m: number;
    apparent_temperature: number;
    relative_humidity_2m: number;
    precipitation: number;
    weather_code: number;
    wind_speed_10m: number;
  };
  daily: {
    time: string[];
    weather_code: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_probability_max: (number | null)[];
  };
}

const CACHE_TTL_MS = 30 * 60 * 1000;
let cache: { data: WeatherData; at: number } | null = null;

export async function getWeather(): Promise<WeatherData | null> {
  if (cache && Date.now() - cache.at < CACHE_TTL_MS) return cache.data;
  try {
    const res = await fetch(WEATHER_API_URL, { signal: AbortSignal.timeout(8000) });
    if (!res.ok) return cache?.data ?? null;
    const data = (await res.json()) as WeatherData;
    cache = { data, at: Date.now() };
    return data;
  } catch {
    return cache?.data ?? null;
  }
}

// WMO 天氣代碼 → 中文描述
const WEATHER_TEXT: Record<number, string> = {
  0: '晴朗',
  1: '大致晴朗',
  2: '局部多雲',
  3: '陰天',
  45: '霧',
  48: '凝霜霧',
  51: '輕毛毛雨',
  53: '毛毛雨',
  55: '濃毛毛雨',
  56: '凍毛毛雨',
  57: '強凍毛毛雨',
  61: '小雨',
  63: '中雨',
  65: '大雨',
  66: '凍雨',
  67: '強凍雨',
  71: '小雪',
  73: '中雪',
  75: '大雪',
  77: '雪粒',
  80: '小陣雨',
  81: '陣雨',
  82: '強陣雨',
  85: '小陣雪',
  86: '陣雪',
  95: '雷雨',
  96: '雷雨伴冰雹',
  99: '強雷雨伴冰雹',
};

export function describeWeatherCode(code: number): string {
  return WEATHER_TEXT[code] ?? '天氣資訊更新中';
}

export function umbrellaAdvice(current: WeatherData['current'] | undefined, todayProb: number): string {
  if (!current) return '出發前再確認一次降雨預報。';
  if (current.precipitation > 0) return '目前正在降雨，建議攜帶雨具並注意步道濕滑。';
  if (todayProb >= 50) return `今日降雨機率約 ${todayProb}%，出門建議帶傘。`;
  if (todayProb >= 30) return `今日降雨機率約 ${todayProb}%，可帶輕便雨具備用。`;
  return '今日降雨機率低，暫不需要帶傘。';
}
