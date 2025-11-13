module.exports = {
  apps: [
    {
      name: 'realestate-backend',
      script: '/root/realEstatePlatform/backend/dist/main.js',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      }
    },
    {
      name: 'realestate-frontend',
      script: '/root/realEstatePlatform/frontend/.next/standalone/server.js',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 3001,
        NEXTAUTH_URL: 'http://72.61.6.232:3001',
        NEXTAUTH_SECRET: 'lAqj9cn1gMYTOK1bScLdHbKoMCDxVX_t30KzYc-zfgs',
        AUTH_API_URL: 'http://72.61.6.232:3000',
        BACKEND_API_URL: 'http://72.61.6.232:3000',
        NEXT_PUBLIC_UPLOAD_BASE_URL: 'http://72.61.6.232:3000/public'
      }
    }
  ]
};
