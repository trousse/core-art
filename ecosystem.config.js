module.exports = {
  apps : [{
    script: 'app.js',
    watch: '.'
  }],

  deploy : {
    production : {
      user : 'ubuntu',
      host : '146.59.151.125',
      ref  : 'origin/master',
      repo : 'https://github.com/trousse/core-art.git',
      path : '/home/ubuntu/pm2Stuff',
      'pre-deploy-local': '',
      'post-deploy' : 'npm install && pm2 startOrRestart ecosystem.config.js --env development',
      'pre-setup': ''
    }
  }
};
