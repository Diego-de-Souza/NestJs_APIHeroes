module.exports = {
    apps : [{
      name: "api_heroesPlatform",
      script: "./dist/src/main.js",
      env: {
        NODE_ENV: "development",
      },
      env_production: {
        NODE_ENV: "production",
      }
    }, {
       name: 'worker',
       script: 'worker.js'
    }]
  }