module.exports = {
  servers: {
    one: {
      // TODO: set host address, username, and authentication method
      host: '192.168.1.100',
      username: 'matt',
      // password: 'matt'
      // pem: '~/.ssh/id_rsa'
      // or neither for authenticate from ssh-agent
    }
  },

  app: {
    // TODO: change app name and path
    name: 'matt-b2b-staging',
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
      ROOT_URL: 'http://b2b.ladidadi.xyz',
      MONGO_URL: 'mongodb://mongodb/meteor',
      MONGO_OPLOG_URL: 'mongodb://mongodb/local',
    },

    docker: {
      // change to 'abernix/meteord:base' if your app is using Meteor 1.4 - 1.5
      image: 'abernix/meteord:node-8.4.0-base',
    },

    // Show progress bar while uploading bundle to server
    // You might need to disable it on CI servers
    enableUploadProgressBar: true
  },

  mongo: {
    version: '3.4.1',
    servers: {
      one: {}
    }
  },

  // (Optional)
  // Use the proxy to setup ssl or to route requests to the correct
  // app when there are several apps

   proxy: {
     domains: 'b2b.ladidadi.xyz',

     ssl: {
       // Enable Let's Encrypt
       letsEncryptEmail: 'mrslwiseman@gmail.com'
     }
   }
};
