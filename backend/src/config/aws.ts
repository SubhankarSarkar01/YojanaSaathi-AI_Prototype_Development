import AWS from 'aws-sdk'

// Configure AWS SDK
AWS.config.update({
  region: process.env.AWS_REGION || 'us-east-1',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
})

export const s3 = new AWS.S3()
export const sns = new AWS.SNS()
export const ses = new AWS.SES()

export const S3_BUCKET = process.env.S3_BUCKET || 'yojanasaathi-documents'

export const uploadToS3 = async (
  file: Buffer,
  key: string,
  contentType: string
): Promise<string> => {
  const params = {
    Bucket: S3_BUCKET,
    Key: key,
    Body: file,
    ContentType: contentType,
    ACL: 'private',
  }

  const result = await s3.upload(params).promise()
  return result.Location
}

export const getSignedUrl = (key: string, expiresIn: number = 3600): string => {
  return s3.getSignedUrl('getObject', {
    Bucket: S3_BUCKET,
    Key: key,
    Expires: expiresIn,
  })
}

export const deleteFromS3 = async (key: string): Promise<void> => {
  await s3.deleteObject({
    Bucket: S3_BUCKET,
    Key: key,
  }).promise()
}
