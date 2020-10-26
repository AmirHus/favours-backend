import aws from 'aws-sdk';
import fs from 'fs';
import { AWS_CONFIG } from '../config';

// config security set up to access api
aws.config.update({
  region: AWS_CONFIG.REGION,
  accessKeyId: AWS_CONFIG.ACCESS_KEY_ID,
  secretAccessKey: AWS_CONFIG.SECRET_KEY,
});

// specify the api version
const s3 = new aws.S3({
  apiVersion: AWS_CONFIG.API_VERSION,
});

// upload a file on the s3 bucket
export async function uploadFile(
  filePath: string,
  fileType: string,
  key: string
) {
  const stream = fs.createReadStream(filePath);

  await s3
    .upload({
      Bucket: AWS_CONFIG.BUCKET_NAME,
      Body: stream,
      Key: key,
      ContentType: fileType,
    })
    .promise();
}

// get a file by key from s3 bucket
export async function getFile(key: string) {
  return await s3
    .getObject({ Bucket: AWS_CONFIG.BUCKET_NAME, Key: key })
    .promise();
}
