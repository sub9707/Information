module.exports = {
  apps: [
    {
      name: 'modohana-server',
      script: './server/index.js',
      instances: 1,
      exec_mode: 'fork',
      watch: false,
      env: {
        NODE_ENV: 'development',
        PORT: 5000,
        CLIENT_URL: 'http://localhost:4000'
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 5000,
        CLIENT_URL: 'http://subdevpi.mywire.org:4000'
      },
      error_file: './logs/server-error.log',
      out_file: './logs/server-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      autorestart: true,
      max_restarts: 10,
      min_uptime: '10s',
      max_memory_restart: '500M'
    },
    {
      name: 'modohana-client',
      script: 'npx',
      args: 'serve -s client/dist -l 4000 --no-port-switching',
      instances: 1,
      exec_mode: 'fork',
      watch: false,
      env_production: {
        NODE_ENV: 'production'
      },
      error_file: './logs/client-error.log',
      out_file: './logs/client-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      autorestart: true,
      max_restarts: 10,
      min_uptime: '10s',
      max_memory_restart: '300M'
    }
  ]
};