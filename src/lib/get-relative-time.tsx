import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);
dayjs.extend(duration);
export function getRelativeTime(time: string | Date | null | undefined) {
  if (typeof time === "string" || time instanceof Date) {
    return dayjs().to(time);
  }
  return null;
}

function formatDuration(seconds: number) {
  if (seconds == 0) return "0 sec";

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  let result = "";
  if (hours > 0) {
    result += `${hours} hrs `;
  }
  if (minutes > 0) {
    result += `${minutes} mins `;
  }
  if (remainingSeconds > 0) {
    result += `${remainingSeconds.toFixed(1)} sec${remainingSeconds !== 1 ? 's' : ''}`;
  }
  return result.trim();
}

export function getDuration(durationInSecs: number) {
  return `${formatDuration(durationInSecs)}`;
}
