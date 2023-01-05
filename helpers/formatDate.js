export default function formatDate(input) {
  if (!input) return;
  const startingDate = new Date(input);
  startingDate.setHours(0);
  startingDate.setMinutes(0);
  startingDate.setSeconds(0);
  startingDate.setMilliseconds(0);
  const endingDate = new Date(input);
  endingDate.setHours(23);
  endingDate.setMinutes(59);
  endingDate.setSeconds(59);
  endingDate.setMilliseconds(999);

  return {
    startingDate,
    endingDate,
  };
}
