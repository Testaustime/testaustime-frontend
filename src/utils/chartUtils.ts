import { lerp } from "./mathUtils";

export const calculateTickValues = (maxDurationSeconds: number) => {

  // Split an hour into 10 minute chunks
  if (maxDurationSeconds === 0) {
    return Array(7).fill(0).map((_, idx) => idx * 600);
  }

  // If maxDurationSeconds is less than 1 hour, split into 10 minute chunks
  if (maxDurationSeconds <= 3600) {
    return Array(Math.ceil(maxDurationSeconds / 600) + 1).fill(0).map((_, idx) => idx * 600);
  }

  // If maxDurationSeconds is less than 3 hours, split into 30 minute chunks
  if (maxDurationSeconds <= 10800) {
    return Array(Math.ceil(maxDurationSeconds / 1800) + 1).fill(0).map((_, idx) => idx * 1800);
  }

  // If maxDurationSeconds is less than 6 hours, split into 1 hour chunks
  if (maxDurationSeconds <= 21600) {
    return Array(Math.ceil(maxDurationSeconds / 3600) + 1).fill(0).map((_, idx) => idx * 3600);
  }

  // If maxDurationSeconds is less than 12 hours, split into 2 hour chunks
  if (maxDurationSeconds <= 43200) {
    return Array(Math.ceil(maxDurationSeconds / 7200) + 1).fill(0).map((_, idx) => idx * 7200);
  }

  // If maxDurationSeconds is less than 24 hours, split into 4 hour chunks
  if (maxDurationSeconds <= 86400) {
    return Array(Math.ceil(maxDurationSeconds / 14400) + 1).fill(0).map((_, idx) => idx * 14400);
  }

  // If maxDurationSeconds is less than 50 hours, split into 8 hour chunks
  if (maxDurationSeconds <= 180000) {
    return Array(Math.ceil(maxDurationSeconds / 28800) + 1).fill(0).map((_, idx) => idx * 28800);
  }

  // If maxDurationSeconds is less than 100 hours, split into 15 hour chunks
  if (maxDurationSeconds <= 360000) {
    return Array(Math.ceil(maxDurationSeconds / 54000) + 1).fill(0).map((_, idx) => idx * 54000);
  }

  // If maxDurationSeconds is less than 200 hours, split into 30 hour chunks
  if (maxDurationSeconds <= 720000) {
    return Array(Math.ceil(maxDurationSeconds / 108000) + 1).fill(0).map((_, idx) => idx * 108000);
  }

  // If maxDurationSeconds is less than 400 hours, split into 50 hour chunks
  if (maxDurationSeconds <= 1440000) {
    return Array(Math.ceil(maxDurationSeconds / 180000) + 1).fill(0).map((_, idx) => idx * 180000);
  }

  // If maxDurationSeconds is less than 800 hours, split into 100 hour chunks
  if (maxDurationSeconds <= 2880000) {
    return Array(Math.ceil(maxDurationSeconds / 360000) + 1).fill(0).map((_, idx) => idx * 360000);
  }

  // If maxDurationSeconds is less than 1600 hours, split into 200 hour chunks
  if (maxDurationSeconds <= 5760000) {
    return Array(Math.ceil(maxDurationSeconds / 720000) + 1).fill(0).map((_, idx) => idx * 720000);
  }

  // Linearly interpolate values from 0 to maxDurationSeconds with 7 stops
  return Array(7).fill(0).map((_, idx) => lerp(0, maxDurationSeconds, idx / 6));
};