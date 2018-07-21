module.exports = {
  servers: {
    one: {
      // TODO: set host address, username, and authentication method
      host: 'staging.back2bikes.com.au',
      username: 'mikkel',
      // pem: './path/to/pem'
      // or neither for authenticate from ssh-agent
    }
  },

  app: {
    // TODO: change app name and path
    name: 'b2b-staging',
    path: '../../meteor-app',

    servers: {
      one: {},
    },

    buildOptions: {
      serverOnly: true,
    },

    env: {
      // TODO: Change to your app's url
      // If you are using ssl, it needs to start with https://
      ROOT_URL: 'https://staging.back2bikes.com.au',
      MONGO_URL: 'mongodb://b2bstaging:Back2bikes.24@galaga.3.mongolayer.com:10255,galaga.2.mongolayer.com:10252/b2bstaging?replicaSet=set-59f2adf872bf0afb560000a4',
      MONGO_OPLOG_URL: 'mongodb://oplogger:Oplogger.24@galaga.3.mongolayer.com:10255,galaga.2.mongolayer.com:10252/local?authSource=b2bstaging&replicaSet=set-59f2adf872bf0afb560000a4',
      //MONGO_URL: 'mongodb://192.168.1.106:27017/b2b-staging',
      //MONGO_OPLOG_URL: 'mongodb://192.168.1.106:27017/local'
    },

    docker: {
      // change to 'abernix/meteord:base' if your app is using Meteor 1.4 - 1.5
      image: 'abernix/meteord:node-8.4.0-base',
    },

    // Show progress bar while uploading bundle to server
    // You might need to disable it on CI servers
    enableUploadProgressBar: true
  },

  // mongo: {
  //   version: '3.4.1',
  //   servers: {
  //     one: {}
  //   }
  // },

  // (Optional)
  // Use the proxy to setup ssl or to route requests to the correct
  // app when there are several apps

  proxy: {
    domains: 'staging.back2bikes.com.au',

    ssl: {
      // Enable Let's Encrypt
      letsEncryptEmail: 'mikkel@almsford.org'
    }
  }
};
