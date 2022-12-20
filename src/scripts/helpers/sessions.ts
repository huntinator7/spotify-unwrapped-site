import type { Session } from "@/types";

export function createSessionsDisplay(sessions: Session[]): Session[] {
  return sessions.map((session) => ({
    ...session,
    start_time: new Date(session.start_time).toLocaleString(),
    end_time: new Date(session.end_time).toLocaleString(),
    durationReadable: durationToDisplay(session.duration_ms / 1000),
  }));
}

function durationToDisplay(d_s: number): string {
  const h = Math.floor(d_s / 3600);
  const m = Math.floor((d_s % 3600) / 60);
  const s = Math.floor(d_s % 60);
  return `${h ? `${h}h ` : ""}${number2Digit(m)}m ${number2Digit(s)}s`;
}

function number2Digit(n: number): string {
  return n.toLocaleString("en-US", {
    minimumIntegerDigits: 2,
    useGrouping: false,
  });
}
