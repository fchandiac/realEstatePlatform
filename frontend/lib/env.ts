const rawBackendApiUrl =
  process.env.AUTH_API_URL ??
  process.env.NEXT_PUBLIC_AUTH_API_URL ??
  'http://localhost:3000';

const normalizedBackendApiUrl = rawBackendApiUrl.replace(/\/$/, '');

export const env = {
  backendApiUrl: normalizedBackendApiUrl,
};

if (!normalizedBackendApiUrl) {
  throw new Error(
    'AUTH_API_URL environment variable is required to contact the backend API.',
  );
}
