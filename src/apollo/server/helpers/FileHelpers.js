import { PutObjectCommand, GetObjectCommand, DeleteObjectCommand, ListObjectsCommand, CopyObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { S3Helpers } from './S3Helpers';

var aws = require('aws-sdk');


const s3Client = S3Helpers.getS3Client()

export const getS3Object = () => {

    aws.config.update({
      accessKeyId: process.env.AWS_CONFIG_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_CONFIG_SECRET_ACCESS_KEY,
      region: process.env.AWS_S3_REGION
    });

    const options = {
      signatureVersion: 'v4',
      ACL: 'public-read',
      params: {
        Bucket: process.env.APP_BUCKET
      }
    };

    return new aws.S3(options);

};

export const S3fileUpload = async (bucketParams) => {
  try {
    return await s3Client.send(new PutObjectCommand(bucketParams));
  } catch (err) {
    console.log("Error", err);
  }
};

// Generates the URL.
export const createURL = async (bucketParams) => {
  try {
    return await getSignedUrl(s3Client, new PutObjectCommand(bucketParams), { expiresIn: 15 * 60 }); // Adjustable expiration.
  } catch (err) {
    console.log("Error", err);
  }
};

// Duplicate the URL.
export const copyFile = async (bucketParams) => {
  try {
    return await s3Client.send(new CopyObjectCommand(bucketParams));
  } catch (err) {
    console.log("Error", err);
  }
};

// Generates the URL.
export const getFileURL = async (bucketParams) => {
  try {
    return await getSignedUrl(s3Client, new GetObjectCommand(bucketParams), { expiresIn: 15 * 60 }); // Adjustable expiration.
  } catch (err) {
    console.log("Error", err);
  }
};

// Returns a list of objects in your specified path.
export const deleteFile = async (bucketParams) => {
  try {
    return await s3Client.send(new DeleteObjectCommand(bucketParams));
  } catch (err) {
    console.log("Error", err);
  }
};

export const getAllFile = async () => {
  try {
    const bucketParams = { Bucket: process.env.BUCKET_NAME };
    
return await s3Client.send(new ListObjectsCommand(bucketParams));
  } catch (err) {
    console.log("Error", err);
  }
};