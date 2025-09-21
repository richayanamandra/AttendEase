
import AWS from "aws-sdk";


const ACCESS_KEY = process.env.PARCEL_AWS_ACCESS_KEY_ID
const SECRET_KEY = process.env.PARCEL_AWS_SECRET_ACCESS_KEY
const REGION = process.env.PARCEL_AWS_REGION
const BUCKET = process.env.PARCEL_S3_BUCKET

// Configure AWS
AWS.config.update({
  accessKeyId: ACCESS_KEY,
  secretAccessKey: SECRET_KEY,
  region: REGION,
});

const s3 = new AWS.S3({
  apiVersion: "2006-03-01",
  params: { Bucket: BUCKET },
});

/**
 * Upload a file/blob to S3
 * @param {File|Blob} file
 * @param {string} key - key (filename) in bucket
 */
export async function uploadToS3(file, key) {
  const params = {
    Bucket: BUCKET,
    Key: key,
    Body: file,
    ContentType: file.type || "application/octet-stream",
  };
  return s3.upload(params).promise();
}

/**
 * Get status JSON from status/{baseName}.json (returns parsed JSON or null)
 * @param {string} baseName
 */
export async function checkStatus(baseName) {
  const key = `status/${baseName}.json`;
  try {
    const res = await s3.getObject({ Bucket: BUCKET, Key: key }).promise();
    // res.Body may be Buffer / Uint8Array / ArrayBuffer / Blob depending on runtime
    let bodyStr;
    if (res.Body instanceof ArrayBuffer) {
      bodyStr = new TextDecoder().decode(res.Body);
    } else if (res.Body instanceof Uint8Array) {
      bodyStr = new TextDecoder().decode(res.Body);
    } else if (typeof res.Body === "string") {
      bodyStr = res.Body;
    } else if (res.Body && typeof res.Body.text === "function") {
      // Blob-like
      bodyStr = await res.Body.text();
    } else {
      // Fallback
      bodyStr = res.Body.toString();
    }
    return JSON.parse(bodyStr);
  } catch (err) {
    // not found or other error -> return null
    return null;
  }
}

/**
 * Upload JSON metadata
 * @param {Object} obj
 * @param {string} key - filename: e.g. someName.json
 */
export async function uploadJson(obj, key) {
  const blob = new Blob([JSON.stringify(obj)], { type: "application/json" });
  return uploadToS3(blob, key);
}
