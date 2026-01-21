module.exports = {
  apps: [
    {
      name: 'api-heroes',
      script: 'dist/main.js',  // arquivo de entrada do NestJS compilado
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '500M',
      env: {
        NODE_ENV:'production',
        PORT:3000,
        DB_HOST:'heroesplatform-db.cyv40ia4ov9n.us-east-1.rds.amazonaws.com',
        DB_PORT:5432,
        DB_USERNAME:'postgres',
        DB_NAME:'heroesplatform',
        DB_SSL:true,
        AWS_REGION:'us-east-1',
        AWS_S3_BUCKET:'heroesplatform-images-730183856049',
        CLOUDFRONT_URL:'https://dlh5iebwq8aw1.cloudfront.net',
        FRONTEND_URL:'https://heroesplatform.com.br',
        ENABLE_SWAGGER:false
      },
      env_development: {
        NODE_ENV: 'development',
        PORT: 3000,
        FRONTEND_URL: 'http://localhost:4200',
        DATABASE_URL: 'postgres://usuario:senha@localhost:5432/banco',
        DATABASE_NAME: 'heroesplatform_dev',
      },
    },
  ],
};
