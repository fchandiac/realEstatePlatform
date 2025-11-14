module.exports = {
  apps: [
    {
      name: 'realestate-backend',
      cwd: '/root/apps/realEstatePlatform/backend',
      script: 'dist/main.js',
      instances: 1,
      exec_mode: 'fork',
      watch: false,
      ignore_watch: ['node_modules', 'dist'],
      error_file: 'logs/pm2-error.log',
      out_file: 'logs/pm2-out.log',
      log_file: 'logs/pm2-combined.log',
      time: true,
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      }
    },
    {
      name: 'realestate-frontend',
      cwd: '/root/apps/realEstatePlatform/frontend',
      script: '.next/standalone/server.js',
      instances: 1,
      exec_mode: 'fork',
      watch: false,
      ignore_watch: ['node_modules', '.next'],
      error_file: 'logs/pm2-error.log',
      out_file: 'logs/pm2-out.log',
      log_file: 'logs/pm2-combined.log',
      time: true,
      env: {
        NODE_ENV: 'production',
        PORT: 3001,
        NEXTAUTH_URL: 'http://72.61.6.232:3001',
        NEXTAUTH_SECRET: 'lAqj9cn1gMYTOK1bScLdHbKoMCDxVX_t30KzYc-zfgs',
        AUTH_API_URL: 'http://72.61.6.232:3000',
        BACKEND_API_URL: 'http://72.61.6.232:3000',
        NEXT_PUBLIC_AUTH_API_URL: 'http://72.61.6.232:3000',
        NEXT_PUBLIC_UPLOAD_BASE_URL: 'http://72.61.6.232:3000'
      }
    }
  ]
};
