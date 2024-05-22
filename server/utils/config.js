const contentful = require('contentful')

const client = contentful.createClient({
    space: 'dok0aavhmpf9',
    environment: 'master', // defaults to 'master' if not set
    accessToken: '7x7KWshGZF85DJgEorTt9m3zzgVx3axku9sSylmBXUE'
  });

  module.exports = {client};