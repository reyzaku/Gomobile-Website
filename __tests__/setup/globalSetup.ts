export default async function globalSetup() {
  process.env.MONGODB_URI = 'mongodb+srv://gomobile_admin:gomobile2024@cluster0.rnqq5ty.mongodb.net/?appName=Cluster0';
  process.env.MONGODB_DB = 'gomobile_test';
  process.env.ADMIN_SECRET = 'test-secret-key';
}
