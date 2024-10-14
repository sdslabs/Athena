import { S3Client, PutObjectCommand,GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
import multer from 'multer';

dotenv.config();

const router = express.Router();

// Initialize the S3 client
const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

// Configure Multer to handle file uploads
const storage = multer.memoryStorage(); // Store files in memory
const upload = multer({ storage });

router.post('/upload-direct', upload.single('file'), async (req: Request, res: Response) => {
  const file = req.file;
  if (!file) {
    return res.status(400).json({ message: 'No file provided' });
  }

  // Create a unique key for the file
  const uniqueKey = `quiz-banners/${uuidv4()}-${file.originalname}`;

  // Create the PutObjectCommand to upload the file to S3
  const command = new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME!,
    Key: uniqueKey,
    Body: file.buffer, // File data from memory
    ContentType: file.mimetype, // File type
  });

  try {
    // Upload the file to S3
    await s3.send(command);

    // Generate a pre-signed URL for the uploaded file
    const getObjectCommand = new GetObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: uniqueKey,
    });
    const imageUrl = await getSignedUrl(s3, getObjectCommand, { expiresIn: 3600 }); // 1 hour expiration

    // Return the pre-signed URL to access the image
    res.status(200).json({ message: 'File uploaded successfully', imageUrl });
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({ message: 'Error uploading file' });
  }
});

export default router;
