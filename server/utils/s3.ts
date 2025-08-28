import { S3Client } from '@aws-sdk/client-s3'

export function getS3Client() {
  const cfg = useRuntimeConfig().doSpaces
  
  // Validate required configuration
  if (!cfg.key || !cfg.secret || !cfg.bucket) {
    throw new Error('Missing required DigitalOcean Spaces configuration. Please set NUXT_DO_SPACES_KEY, NUXT_DO_SPACES_SECRET, and NUXT_DO_SPACES_BUCKET environment variables.')
  }
  
  return new S3Client({
    region: cfg.region,
    endpoint: cfg.endpoint,      // DigitalOcean Spaces endpoint
    forcePathStyle: false,       // use virtual-hosted-style
    credentials: { accessKeyId: cfg.key, secretAccessKey: cfg.secret }
  })
}
