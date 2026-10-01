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

export async function getAssets() {
  const response = await fetch(process.env.servixUrl!, {
    headers: {
      "X-API-Key": process.env.servixKey!,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch market data");
  }

  return response.json();
}
