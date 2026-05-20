module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/test/setup.ts'],
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.(test|spec).(ts|tsx)'],
  transform: {
    '^.+\\.(ts|tsx)$': [
      'ts-jest',
      {
        tsconfig: '<rootDir>/tsconfig.spec.json',
        diagnostics: false,
      },
    ],
  },
  moduleNameMapper: {
    // Asset mocks must come before path aliases so aliased asset imports are also mocked
    '\\.svg(\\?react)?$': '<rootDir>/src/test/fileMock.ts',
    '\\.(png|jpg|jpeg|gif|webp)$': '<rootDir>/src/test/fileMock.ts',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    // Vite-only api module: provide a simple mock for Jest
    '^@shared/config/api$': '<rootDir>/src/test/mocks/api.ts',
    '^@shared/config$': '<rootDir>/src/test/mocks/config.ts',
    '^@app/(.*)$': '<rootDir>/src/app/$1',
    '^@pages/(.*)$': '<rootDir>/src/pages/$1',
    '^@widgets/(.*)$': '<rootDir>/src/widgets/$1',
    '^@features/(.*)$': '<rootDir>/src/features/$1',
    '^@entities/(.*)$': '<rootDir>/src/entities/$1',
    '^@shared/(.*)$': '<rootDir>/src/shared/$1',
  },
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/index.ts',
    '!src/**/__tests__/**',
    '!src/test/**',
    '!src/main.tsx',
    '!src/vite-env.d.ts',
  ],
  coverageThreshold: {
    global: {
      branches: 30,
      functions: 30,
      lines: 30,
      statements: 30,
    },
  },
}
