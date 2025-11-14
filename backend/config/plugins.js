module.exports = ({ env }) => ({
  // Upload configuration - using local provider for now
  // Cloudinary can be enabled later with proper credentials

  // Email configuration - using default for now
  // SendGrid can be enabled later with API key

  // GraphQL API
  graphql: {
    enabled: true,
    config: {
      endpoint: '/graphql',
      shadowCRUD: true,
      playgroundAlways: false,
      depthLimit: 7,
      amountLimit: 100,
      apolloServer: {
        tracing: false,
      },
    },
  },

  // API Documentation
  documentation: {
    enabled: true,
    config: {
      openapi: '3.0.0',
      info: {
        version: '1.0.0',
        title: 'EEMB UCSB API Documentation',
        description: 'API documentation for the EEMB department website',
        contact: {
          name: 'EEMB IT Support',
          email: 'eemb-it@ucsb.edu',
        },
        license: {
          name: 'MIT',
          url: 'https://opensource.org/licenses/MIT',
        },
      },
      'x-strapi-config': {
        mutateDocumentation: (generatedDocumentationDraft) => {
          // Custom documentation modifications if needed
          return generatedDocumentationDraft;
        },
      },
    },
  },

  // Sentry for error tracking
  sentry: {
    enabled: env('NODE_ENV') === 'production',
    config: {
      dsn: env('SENTRY_DSN'),
      environment: env('NODE_ENV'),
      sendMetadata: true,
    },
  },
});