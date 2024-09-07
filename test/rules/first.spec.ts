import fs from 'node:fs'

import { RuleTester as TSESLintRuleTester } from '@typescript-eslint/rule-tester'

import { test, parsers, testFilePath } from '../utils'

import rule from 'eslint-plugin-import-x/rules/first'

const ruleTester = new TSESLintRuleTester()

ruleTester.run('first', rule, {
  valid: [
    test({
      code: "import { x } from './foo'; import { y } from './bar';\
            export { x, y }",
    }),
    test({ code: "import { x } from 'foo'; import { y } from './bar'" }),
    test({ code: "import { x } from './foo'; import { y } from 'bar'" }),
    test({
      code: "import { x } from './foo'; import { y } from 'bar'",
      options: ['disable-absolute-first'],
    }),
    test({
      code: "'use directive';\
            import { x } from 'foo';",
    }),
    test({
      name: '...component.html (issue #2210)',
      code: fs.readFileSync(testFilePath('component.html'), 'utf8'),
      languageOptions: {
        parser: require('@angular-eslint/template-parser'),
      },
    }),
  ],
  invalid: [
    test({
      code: "import { x } from './foo';\
              export { x };\
              import { y } from './bar';",
      errors: 1,
      output:
        "import { x } from './foo';\
              import { y } from './bar';\
              export { x };",
    }),
    test({
      code: "import { x } from './foo';\
              export { x };\
              import { y } from './bar';\
              import { z } from './baz';",
      errors: 2,
      output:
        "import { x } from './foo';\
              import { y } from './bar';\
              import { z } from './baz';\
              export { x };",
    }),
    test({
      code: "import { x } from './foo'; import { y } from 'bar'",
      options: ['absolute-first'],
      errors: 1,
    }),
    test({
      code: "import { x } from 'foo';\
              'use directive';\
              import { y } from 'bar';",
      errors: 1,
      output:
        "import { x } from 'foo';\
              import { y } from 'bar';\
              'use directive';",
    }),
    test({
      code: "var a = 1;\
              import { y } from './bar';\
              if (true) { x() };\
              import { x } from './foo';\
              import { z } from './baz';",
      errors: 3,
      output: [
        "import { y } from './bar';\
              var a = 1;\
              if (true) { x() };\
              import { x } from './foo';\
              import { z } from './baz';",
        "import { y } from './bar';\
              import { x } from './foo';\
              var a = 1;\
              if (true) { x() };\
              import { z } from './baz';",
        "import { y } from './bar';\
              import { x } from './foo';\
              import { z } from './baz';\
              var a = 1;\
              if (true) { x() };",
      ],
    }),
    test({
      code: "if (true) { console.log(1) }import a from 'b'",
      errors: 1,
      output: "import a from 'b'\nif (true) { console.log(1) }",
    }),
  ],
})

describe('TypeScript', () => {
  const parserConfig = {
    settings: {
      'import-x/parsers': { [parsers.TS]: ['.ts'] },
    },
  }

  ruleTester.run('order', rule, {
    valid: [
      test({
        code: `
          import y = require('bar');
          import { x } from 'foo';
          import z = require('baz');
        `,
        ...parserConfig,
      }),
    ],
    invalid: [
      test({
        code: `
          import { x } from './foo';
          import y = require('bar');
        `,
        options: ['absolute-first'],
        ...parserConfig,
        errors: [
          {
            message: 'Absolute imports should come before relative imports.',
          },
        ],
      }),
    ],
  })
})
