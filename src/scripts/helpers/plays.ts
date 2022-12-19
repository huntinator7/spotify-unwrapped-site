import type { Play } from "@/types";

export function createPlaysDisplay(plays: Play[]) {
  const playsTemp: (Play | string)[] = [];
  for (const [i, play] of plays.entries()) {
    const date = new Date(play.played_at);
    if (
      !plays[i - 1] ||
      new Date(plays[i - 1].played_at).getDay() !== date.getDay()
    ) {
      playsTemp.push(`${date.getMonth() + 1}/${date.getDate()}`);
    }
    playsTemp.push(play);
  }
  return playsTemp;
}
