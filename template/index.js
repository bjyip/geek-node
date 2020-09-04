const fs = require('fs');
const vm = require('vm');

const templateCache = {};

const templateContext = vm.createContext({
    include: function (name, data) {
        const template = templateCache[name] || createTemplate(name)
        return template(data);
    }
});

function createTemplate(templatePath) {

    templateCache[templatePath] = vm.runInContext(
        // 理论上用node.js的vm模块也是可以用的，但是效率会低很多。一般的模板引擎都会使用with。
        `(function (data) {
            with (data) {
                return \`${fs.readFileSync(templatePath, 'utf-8')}\`
            }
        })`,
        templateContext
    );

    return templateCache[templatePath]
}

module.exports = createTemplate