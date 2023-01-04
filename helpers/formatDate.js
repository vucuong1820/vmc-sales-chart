export default function formatDate(input) {
  if (!input) return;
  const startingDate = new Date(input);
  startingDate.setUTCHours(0);
  startingDate.setUTCMinutes(0);
  startingDate.setUTCSeconds(0);
  startingDate.setUTCMilliseconds(0);
  const endingDate = new Date(input);
  endingDate.setUTCHours(23);
  endingDate.setUTCMinutes(59);
  endingDate.setUTCSeconds(59);
  endingDate.setUTCMilliseconds(999);

  return {
    startingDate,
    endingDate,
  };
}
