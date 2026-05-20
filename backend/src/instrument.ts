import * as Sentry from '@sentry/nestjs'

Sentry.init({
  dsn: 'https://83517eeb27eea1e71bb0d332fdc4cc5d@o4511404905857024.ingest.de.sentry.io/4511404969951312',
  sendDefaultPii: true,
  tracesSampleRate: 1.0,
})
