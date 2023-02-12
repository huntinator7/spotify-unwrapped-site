export function numTo2Digit(n: number): string {
  return n.toLocaleString("en-US", {
    minimumIntegerDigits: 2,
    useGrouping: false,
  });
}

export function fromTimezone(day: string, time: string): string {
  const recTime = `2022-${day}T${time}:00.000Z`;
  const recTimeDate = new Date(recTime);
  return `${numTo2Digit(recTimeDate.getMonth() + 1)}-${numTo2Digit(
    recTimeDate.getDate()
  )} ${numTo2Digit(recTimeDate.getHours())}:${numTo2Digit(
    recTimeDate.getMinutes()
  )}`;
}

export const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export function getDaysInMonth(date: string) {
  return new Date(date).getDate();
}
