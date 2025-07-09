import admin from 'firebase-admin';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

try {
  const serviceAccount = require('/etc/secrets/serviceAccountKey.json');

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
  console.log("Firebase Admin SDK initialized successfully.");
} catch (error) {
  console.error("Firebase Admin SDK initialization error:", error);
}

export default admin;  