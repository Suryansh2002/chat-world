import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getRndInteger(min:number, max:number) {
  return Math.floor(Math.random() * (max - min + 1) ) + min;
}

/**
 * Calculates the distance in kilometers between two geographical points.
 */
export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
    const R = 6371;
    const toRadians = (deg: number) => deg * (Math.PI / 180);

    const dLat = toRadians(lat2 - lat1); 
    const dLon = toRadians(lon2 - lon1); 
    const lat1Rad = toRadians(lat1);
    const lat2Rad = toRadians(lat2);

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1Rad) * Math.cos(lat2Rad) * 
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); 
    const distance = R * c;

    return distance;
}