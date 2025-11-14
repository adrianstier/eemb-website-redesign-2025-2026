import { defineConfig } from 'cypress'

export default defineConfig({
  // E2E Testing Configuration
  e2e: {
    baseUrl: 'http://localhost:3000',
    specPattern: 'cypress/e2e/**/*.{js,jsx,ts,tsx}',
    supportFile: 'cypress/support/e2e.ts',

    setupNodeEvents(on, config) {
      // implement node event listeners here
      on('task', {
        log(message) {
          console.log(message)
          return null
        },
        table(message) {
          console.table(message)
          return null
        }
      })

      // Load environment-specific config
      const environmentName = config.env.environmentName || 'development'
      const environmentFilename = `cypress/config/${environmentName}.json`

      console.log('Loading config for environment:', environmentName)

      return config
    },

    // Viewport settings
    viewportWidth: 1280,
    viewportHeight: 720,

    // Video and screenshot settings
    video: true,
    screenshotOnRunFailure: true,
    videosFolder: 'cypress/videos',
    screenshotsFolder: 'cypress/screenshots',

    // Timeouts
    defaultCommandTimeout: 10000,
    requestTimeout: 10000,
    responseTimeout: 10000,

    // Retry configuration
    retries: {
      runMode: 2,
      openMode: 0,
    },

    // Test isolation
    testIsolation: true,

    // Environment variables
    env: {
      apiUrl: 'http://localhost:1337',
      coverage: false,
    },
  },

  // Component Testing Configuration
  component: {
    devServer: {
      framework: 'next',
      bundler: 'webpack',
    },
    specPattern: 'src/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'cypress/support/component.ts',
  },

  // Project settings
  projectId: 'eemb-website',

  // Browser configuration
  chromeWebSecurity: false,

  // File watching
  watchForFileChanges: true,

  // Number of tests to keep in memory
  numTestsKeptInMemory: 50,

  // Reporter configuration
  reporter: 'cypress-multi-reporters',
  reporterOptions: {
    configFile: 'cypress/reporter-config.json',
  },
})