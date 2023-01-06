import axios from 'axios';

export default async function migrateTimestampService(dates, themeId) {
  await axios.get(`/api/migrate`);
}
