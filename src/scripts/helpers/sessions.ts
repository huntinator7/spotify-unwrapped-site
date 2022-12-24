import type { Session, SessionDisplay } from "@/types";

export function createSessionsDisplay(sessions: Session[]): SessionDisplay[] {
  console.log("createSessionsDisplay", sessions);
  return sessions.map((session) => {
    const today = new Date();
    const tomorrowStart = new Date(today.setDate(today.getDate() + 1)).setHours(
      0,
      0,
      0,
      0
    );
    const top =
      (tomorrowStart - new Date(session.end_time).valueOf()) /
        (1000 * 24 * 10) +
      "px";

    return {
      ...session,
      start_time: new Date(session.start_time).toLocaleString(),
      end_time: new Date(session.end_time).toLocaleString(),
      durationReadable: durationToDisplay(session.duration_ms / 1000),
      line: {
        top,
        height: session.duration_ms / (1000 * 24 * 10) + "px",
      },
    };
  });
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
