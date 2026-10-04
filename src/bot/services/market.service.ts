import { getRedis } from "../../services/redis.service.js";

export type Assest = {
  businessTime: string;
  code: string;
  labelEn: string;
  labelFa: string;
  name: string;
  quoteUnit: string;
  slug: string;
  value: number;
};

const CACHE_KEY = "market:assets";
const CACHE_TTL = 3600;

export async function getAssets() {
  const redis = await getRedis();

  const cached = await redis.get(CACHE_KEY);

  if (cached) {
    return JSON.parse(cached);
  }

  const response = await fetch(process.env.SERVIX_URL!, {
    headers: {
      "X-API-Key": process.env.SERVIX_KEY!,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch market data");
  }

  const data = await response.json();

  await redis.setEx(CACHE_KEY, CACHE_TTL, JSON.stringify(data));

  return data;
}
