const { getDefaultConfig } = require('@expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Add support for importing from root using @/
config.resolver.extraNodeModules = {
  '@': path.resolve(__dirname),
};

module.exports = config;