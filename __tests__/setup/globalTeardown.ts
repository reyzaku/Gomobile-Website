import { MongoClient } from 'mongodb';

export default async function globalTeardown() {
  const client = new MongoClient(process.env.MONGODB_URI!);
  await client.connect();
  await client.db(process.env.MONGODB_DB).dropDatabase();
  await client.close();
}
