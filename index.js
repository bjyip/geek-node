const koa = require('koa');
const mount = require('koa-mount');
const static = require('koa-static');
const fs = require('fs');
const vm = require('vm');
const app = new koa();

const user = {
  name: '<script />'
}
const templateMap = {
  templateA: '`<h2>${include("templateB")}</h2>`',
  templateB: '`<p>模板二</p>`'
}
const context = {
  include: function(name) {
    return templateMap[name]()
  },
  _: function(markup) {
    if (!markup) return '';
    return String(markup)
      .replace(/&/g, '&amp;')
      .replace(/ /g, '&nbsp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;')
      .replace(/\r{0,}\n/g, '<br/>')
  }
}
Object.keys(templateMap).forEach(key => {
  templateMap[key] = vm.runInNewContext(
    `(function() {
      return ${templateMap[key]}
    })`
    , context
  )
});
console.log(templateMap['templateA']());

app.use(
  static(__dirname + '/source/')
)

app.use(
  mount('/', async (ctx) => {
    ctx.body = fs.readFileSync(__dirname + '/source/index.html', 'utf-8');
  })
)

app.listen(4000);