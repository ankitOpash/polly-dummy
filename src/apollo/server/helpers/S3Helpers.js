import { S3 } from "@aws-sdk/client-s3";

let _S3Helpers = function () {

  this.getS3Object = () => {

    var aws = require('aws-sdk');

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

  }

  this.getS3Client = () => {
    const s3Client = new S3({
      signatureVersion: "v4",
      region: process.env.APP_BUCKET_REGION,
      credentials: {
        accessKeyId: process.env.AWS_CONFIG_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_CONFIG_SECRET_ACCESS_KEY,
      },
    });

    return s3Client;
  }

  this.removeFilesFromS3 = (s3, options) => {
    return new Promise((resolve, reject) => {
      s3.deleteObjects(options, (error, data) => {
        if (!error && data) {
          console.log("files removed");
          resolve(data);
        } else {
          console.log("removeFilesFromS3 error", error);
          reject(error)
        }
      });
    })
  }

  this.uploadFileToS3 = (s3, options) => {
    return new Promise((resolve, reject) => {
      s3.upload(options, (error, data) => {
        if (!error && data) {
          console.log("files uploaded");
          resolve(data);
        } else {
          console.log("uploadFileToS3 error", error);
          reject(error)
        }
      });
    })
  }

  this.removeFileFromS3 = (s3, options) => {
    return new Promise((resolve, reject) => {
      s3.deleteObject(options, (error, data) => {
        if (!error && data) {
          console.log("file removed");
          resolve(data);
        } else {
          console.log("removeFileFromS3 error", error);
          reject(error)
        }

      });
    })
  }
}

export const S3Helpers = new _S3Helpers()