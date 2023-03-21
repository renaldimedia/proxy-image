// Require the framework and instantiate it
const fastify = require('fastify')({ logger: true });
const axios = require('axios').default;
const {formatImage, getMetaData} = require('./lib/libimage');

fastify.get('/', async (request, reply) => {
  return { hello: 'world' }
})

fastify.get('/pximage/towebp/:url', async function(request, reply) {
    const {url} = request.params;
    const response = await axios.get(url,  { responseType: 'arraybuffer' })
    const buffer = Buffer.from(response.data, "utf-8")
    const metadata = getMetaData(buffer);
    if(!metadata){
        throw Error("Mungkin file ini bukan gambar!");
    }
    const result = await formatImage(buffer, 'webp');
    reply.headers({'Access-Control-Allow-Headers': 'Content-Type, Authorization,Cache-Control'});
    reply.headers({'Content-Type': 'image/webp'});
    reply.headers({'Cache-Control': '36000000'});
    // console.log()
    reply.send(result)
});

fastify.route({
  method: 'GET',
  url: '/pximage',
  schema: {
    // request needs to have a querystring with a `name` parameter
    querystring: {
      type: 'object',
      properties: {
          url: { type: 'string'},
          to: {type: 'string'},
          csetting: {type: 'string'}
      },
      required: ['url'],
    },
    params: {

    }
  },
  // this function is executed for every request before the handler is executed
  preHandler: async (request, reply) => {
    // E.g. check authentication
    console.log(request.headers.host)
    const allowed = ['halorumah.id', 'localhost:3000']
    if(request.headers.host.includes(allowed)){
        throw Error("Endpoint tidak ditemukan");
        
    }
  },
  handler: async (request, reply) => {
    const response = await axios.get(request.query.url,  { responseType: 'arraybuffer' })
    const buffer = Buffer.from(response.data, "utf-8")
    const metadata = getMetaData(buffer);
    if(!metadata){
        throw Error("Mungkin file ini bukan gambar!");
    }
    const result = await formatImage(buffer, 'webp');
    reply.headers({'Access-Control-Allow-Headers': 'Content-Type, Authorization,Cache-Control'});
    reply.headers({'Content-Type': 'image/webp'});
    reply.headers({'Cache-Control': '36000000'});
    // console.log()
    reply.send(result)
  }
})

// Run the server!
const start = async () => {
  try {
    await fastify.listen({ port: 3000 })
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}
start()