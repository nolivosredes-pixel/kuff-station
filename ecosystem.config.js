module.exports = {
  apps: [
    {
      name: 'kuff-next',
      script: 'node_modules/next/dist/bin/next',
      args: 'start',
      cwd: '/workspaces/kuff-station',
      instances: 1,
      exec_mode: 'fork',
      watch: false,
      max_memory_restart: '500M',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      error_file: './logs/next-error.log',
      out_file: './logs/next-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true
    },
    {
      name: 'rtmp-server',
      script: 'server/rtmp-server.js',
      cwd: '/workspaces/kuff-station',
      instances: 1,
      exec_mode: 'fork',
      watch: false,
      max_memory_restart: '500M',
      env: {
        NODE_ENV: 'production'
      },
      error_file: './logs/rtmp-error.log',
      out_file: './logs/rtmp-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true
    }
  ]
};
