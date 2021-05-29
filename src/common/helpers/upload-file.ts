import { catchError } from './catch-error';
import * as AWS from 'aws-sdk';

// const s3 = new AWS.S3({
//   accessKeyId: process.env.ACCESS_KEY_ID,
//   secretAccessKey: process.env.SECRET_ACCESS_KEY,
//   region: 'us-east-2',
// });
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_ID,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  region: 'ap-southeast-1',
});

export async function uploadFilesBase64(
  files: Array<string>,
): Promise<{ urls: string[] }> {
  try {
    const urls = [] as string[];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const header = file.split(',')[0];
      const body = file.split(',').pop();
      const mimetype = header.split(';')[0].split(':').pop();
      const imageType = mimetype.split('/').pop();
      const imageName = new Date().getTime();
      const urlKey = `facility/${imageName}.${imageType}`;

      const params = {
        Body: Buffer.from(body, 'base64'),
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: urlKey,
        ACL: 'public-read',
        ContentType: mimetype,
        ContentEncoding: 'base64',
      };
      const data = await s3.upload(params).promise();
      urls.push(data.Location);
    }
    return { urls };
  } catch (error) {
    console.log(error);
    catchError(error);
  }
}

export async function uploadFileBase64(file: string): Promise<string> {
  try {
    const header = file.split(',')[0];
    const body = file.split(',').pop();
    const mimetype = header.split(';')[0].split(':').pop();
    const imageType = mimetype.split('/').pop();
    const imageName = new Date().getTime();
    const urlKey = `${process.env.AWS_S3_FOLDER}/${imageName}.${imageType}`;

    const params = {
      Body: Buffer.from(body, 'base64'),
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: urlKey,
      ACL: 'public-read',
      ContentType: mimetype,
      ContentEncoding: 'base64',
    };
    const data = await s3.upload(params).promise();
    console.log(data.Location);
    return data.Location;
  } catch (error) {
    console.log(error);
    catchError(error);
  }
}
