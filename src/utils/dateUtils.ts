import { formatDuration, intervalToDuration } from "date-fns";

const formatShort = {
  xSeconds: "{{count}}s",
  xMinutes: "{{count}}min",
  xHours: "{{count}}h"
};

export const prettyDuration = (seconds: number) => formatDuration(intervalToDuration({ start: 0, end: Math.round(seconds * 1000 / 60000) * 60000 }),
  {
    locale: {
      // Let's just hope the token is one of these options
      formatDistance: (token: "xSeconds" | "xMinutes" | "xHours", count: number) => {
        if(!(token in formatShort)){
          return "";
        }
        
        return formatShort[token].replace("{{count}}", String(count));
      }
    }
  }) || "None";
