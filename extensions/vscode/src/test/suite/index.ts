import * as path from 'path'
import Mocha from 'mocha'
import { glob } from 'glob'

export function run(): Promise<void> {
  // Create the mocha test
  const mocha = new Mocha({
    ui: 'tdd',
    color: true
  })

  const testsRoot = path.resolve(__dirname, '..')

  return new Promise((c, e) => {
    glob('**/**.test.js', { cwd: testsRoot }).then((specs) => {
      // Add files to the test suite
      specs.forEach((spec) => {
        mocha.addFile(path.resolve(testsRoot, spec))
      })

      try {
        // Run the mocha test
        mocha.run((failures) => {
          if (failures > 0) {
            e(new Error(`${failures} tests failed.`))
          } else {
            c()
          }
        })
      } catch (err) {
        console.error(err)
        e(err)
      }
    })
  })
}
