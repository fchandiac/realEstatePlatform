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
    }
  ]
};