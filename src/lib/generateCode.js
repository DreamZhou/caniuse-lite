const generate = require('@babel/generator').default
const t = require('@babel/types')

function generateCode(programStatements) {
  let { code } = generate(t.program(programStatements), { minified: true })

  return `${code}\n`
}

export default generateCode
