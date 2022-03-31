export const calculateTickValues = (maxDurationSeconds: number) => {
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

  throw new Error(`maxDurationSeconds (=${maxDurationSeconds}) exceeded the amount of seconds in 24 hours (=86400).`);
};