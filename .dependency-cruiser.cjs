/** @type {import('dependency-cruiser').IConfiguration} */
module.exports = {
  forbidden: [
    {
      name: 'no-circular',
      severity: 'error',
      comment: 'This dependency is part of a circular relationship.',
      from: {},
      to: {
        circular: true
      }
    },
    {
      name: 'core-no-apps',
      severity: 'error',
      comment: 'Core packages should not depend on apps',
      from: {
        path: '^packages/core'
      },
      to: {
        path: '^apps/'
      }
    },
    {
      name: 'system-no-core',
      severity: 'error',
      comment: 'System package should not depend on core',
      from: {
        path: '^packages/system'
      },
      to: {
        path: '^packages/core'
      }
    },
    {
      name: 'hooks-no-core',
      severity: 'error',
      comment: 'Hooks package should not depend on core',
      from: {
        path: '^packages/hooks'
      },
      to: {
        path: '^packages/core'
      }
    },
    {
      name: 'tokens-no-deps',
      severity: 'error',
      comment: 'Tokens package should not depend on other packages',
      from: {
        path: '^packages/tokens'
      },
      to: {
        path: '^packages/(core|system|hooks|style-recipe|i18n|registry|cli)'
      }
    },
    {
      name: 'style-recipe-no-core',
      severity: 'error',
      comment: 'Style-recipe package should not depend on core',
      from: {
        path: '^packages/style-recipe'
      },
      to: {
        path: '^packages/core'
      }
    },
    {
      name: 'cli-no-core',
      severity: 'error',
      comment: 'CLI package should not depend on core components',
      from: {
        path: '^packages/cli'
      },
      to: {
        path: '^packages/core'
      }
    }
  ],
  options: {
    doNotFollow: {
      path: 'node_modules'
    },
    tsPreCompilationDeps: true,
    tsConfig: {
      fileName: 'tsconfig.base.json'
    },
    enhancedResolveOptions: {
      exportsFields: ['exports'],
      conditionNames: ['import', 'require', 'node', 'default']
    },
    reporterOptions: {
      dot: {
        collapsePattern: 'node_modules/[^/]+'
      },
      archi: {
        collapsePattern: '^packages/([^/]+)/src/[^/]+',
        theme: {
          graph: {
            splines: 'ortho'
          }
        }
      }
    }
  }
};
