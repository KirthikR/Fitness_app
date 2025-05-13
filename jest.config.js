module.exports = {
  preset: 'jest-expo',
  setupFilesAfterEnv: ['<rootDir>/setupTests.js'],
  testMatch: ['**/__tests__/**/*.test.js'], // Only .js files
  verbose: true,
  testTimeout: 10000,
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg|@shopify/react-native-skia)'
  ],
  collectCoverage: true,
  coverageReporters: ['text', 'lcov'],
  moduleNameMapper: {
    '\\.svg': '<rootDir>/__mocks__/svgMock.js',
    '^@/(.*)$': '<rootDir>/$1'
  }
};
