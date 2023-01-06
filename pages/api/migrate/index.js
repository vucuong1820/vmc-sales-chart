import migrateTimestamp from '@helpers/migrateTimestamp';

export default async function handler(req, res) {
  await migrateTimestamp();
  res.json();
}
