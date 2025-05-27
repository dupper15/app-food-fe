const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);
// Add additional resolver for React Native
config.resolver.sourceExts = [...config.resolver.sourceExts, "mjs"];
config.resolver.extraNodeModules = {
  ...config.resolver.extraNodeModules,
  "react-native": require.resolve("react-native"),
};
config.resolver.unstable_enablePackageExports = false;
config.resolver.unstable_enableSymlinks = false;

// Add support for Hermes
config.transformer.unstable_allowRequireContext = true;

module.exports = withNativeWind(config, { input: "./app/global.css" });
