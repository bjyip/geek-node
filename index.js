const fs = require('fs');
const koa = require('koa');
const mount = require('koa-mount');
const static = require('koa-static');
const rpcClient = require('./client');
const template = require('./template/index.js');
const graphqlHTTP = require('koa-graphql');

const app = new koa();

const detailTemplate = template(__dirname + '/template/index.html');

app.use(mount('/static', static(`${__dirname}/source/static/`)));

// 详情页
app.use(
  mount('/detail', async (ctx) => {
    if (!ctx.query.columnid) {
      ctx.status = 400;
      ctx.body = 'invalid columnid';
      return false;
    }
    const result = await new Promise((resolve, reject) => {
      rpcClient.write({
        columnid: ctx.query.columnid
      },
      function(err, data) {
        err ? reject(err) : resolve(data);
      })
    });
    ctx.status = 200;
    ctx.body = detailTemplate(result);
  })
)

// 播放页
app.use(
  mount('/play', async ctx => {
    ctx.status = 200;
    ctx.body = fs.readFileSync(`${__dirname}/source/index.htm`, 'utf-8');
  })
)
app.use(
  mount('/api', graphqlHTTP({
    schema: require('./schema.js')
  }))
)

// koa-graphql例子
app.use(mount('/graphql', graphqlHTTP({
  schema: require('./schema.js')
})));

// 服务端渲染例子
require('@babel/register')({
  presets: ['@babel/preset-react']
})
const ReactDOMServer = require('react-dom/server')
app.use(
  mount('/render', async ctx => {
    ctx.status = 200;
    ctx.body = ReactDOMServer.renderToString(
      require('./index.jsx')
    )
  })
)

app.listen(3000, () => {
  console.log('server listened: http://localhost:3000');
});