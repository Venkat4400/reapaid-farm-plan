import { CropInfo, crops, soilTypeInfo, seasonInfo } from "@/data/cropData";

interface RecommendationInput {
  region: string;
  soilType: string;
  season: string;
  temperature: number;
  rainfall: number;
  humidity: number;
  landType: "dry" | "wet";
}

interface ScoredCrop extends CropInfo {
  score: number;
  matchReasons: string[];
}

export function getSmartCropRecommendations(input: RecommendationInput): ScoredCrop[] {
  const { region, soilType, season, temperature, rainfall, humidity, landType } = input;

  // Convert rainfall string to enum
  const rainfallLevel = rainfall < 500 ? "low" : rainfall < 1000 ? "medium" : "high";

  // Score each crop
  const scoredCrops: ScoredCrop[] = crops.map((crop) => {
    let score = 0;
    const matchReasons: string[] = [];

    // Season match (highest weight)
    if (crop.seasons.includes(season)) {
      score += 30;
      matchReasons.push(`Perfect for ${season} season`);
    }

    // Soil type match
    if (crop.soilTypes.includes(soilType)) {
      score += 25;
      matchReasons.push(`Grows well in ${soilType} soil`);
    } else if (crop.soilTypes.includes("Loamy")) {
      // Loamy crops can grow in most soils
      score += 10;
    }

    // Region match
    if (crop.regions.includes(region)) {
      score += 20;
      matchReasons.push(`Suitable for ${region}`);
    }

    // Temperature match
    if (temperature >= crop.minTemp && temperature <= crop.maxTemp) {
      score += 15;
      matchReasons.push(`Temperature ${temperature}°C is ideal`);
    } else if (temperature >= crop.minTemp - 5 && temperature <= crop.maxTemp + 5) {
      score += 8;
    }

    // Rainfall match
    if (crop.rainfall === rainfallLevel) {
      score += 10;
      matchReasons.push(`Rainfall matches crop needs`);
    } else if (
      (crop.rainfall === "medium" && (rainfallLevel === "low" || rainfallLevel === "high")) ||
      (rainfallLevel === "medium")
    ) {
      score += 5;
    }

    // Water requirement vs land type
    if (landType === "wet" && crop.waterRequirement === "high") {
      score += 10;
      matchReasons.push("Suitable for wet/irrigated land");
    } else if (landType === "dry" && crop.waterRequirement === "low") {
      score += 10;
      matchReasons.push("Good for dry land farming");
    }

    return {
      ...crop,
      score,
      matchReasons,
    };
  });

  // Sort by score and return top recommendations
  return scoredCrops
    .filter((crop) => crop.score >= 30) // Minimum threshold
    .sort((a, b) => b.score - a.score)
    .slice(0, 6);
}

export function getSoilRecommendation(soilType: string) {
  return soilTypeInfo[soilType as keyof typeof soilTypeInfo] || soilTypeInfo.Loamy;
}

export function getSeasonRecommendation(season: string) {
  return seasonInfo[season as keyof typeof seasonInfo] || seasonInfo.Kharif;
}
