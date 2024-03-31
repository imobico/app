/** @type {import('next').NextConfig} */

const { withTamagui } = require("@tamagui/next-plugin");
const { join } = require("path");
const million = require("million/compiler");
const pattycake = require("pattycake");
const withPWA = require("@ducanh2912/next-pwa").default({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  sw: "service-worker.js",
  swcMinify: true,
});

const boolVals = {
  true: true,
  false: false,
};

const disableExtraction =
  boolVals[process.env.DISABLE_EXTRACTION] ??
  process.env.NODE_ENV === "development";

const enableMillionJS =
  boolVals[process.env.ENABLE_MILLION_JS] ??
  process.env.NODE_ENV === "production";

// Temporarily disabled, produces chatty logs
const enablePattyCake =
  boolVals[process.env.ENABLE_PATTY_CAKE] ??
  process.env.NODE_ENV === "production";

const plugins = [
  withPWA,
  withTamagui({
    config: "./tamagui.config.ts",
    components: ["tamagui", "@imoblr/ui"],
    importsWhitelist: ["constants.js", "colors.js"],
    outputCSS:
      process.env.NODE_ENV === "production" ? "./public/tamagui.css" : null,
    logTimings: true,
    disableExtraction,
    shouldExtract: (path) => {
      if (path.includes(join("packages", "app"))) {
        return true;
      }
    },
  }),
];

module.exports = function () {
  /** @type {import('next').NextConfig} */
  let config = {
    // Uncomment if you want to use Cloudflare's Paid Image Resizing w/ Next/Image
    // images: {
    //   loader: 'custom',
    //   loaderFile: './cfImageLoader.js',
    // },
    // Using Solito image loader without Cloudflare's Paid Image Resizing
    images: {},
    typescript: {
      ignoreBuildErrors: true,
    },
    modularizeImports: {
      "@tamagui/lucide-icons": {
        transform: "@tamagui/lucide-icons/dist/esm/icons/{{kebabCase member}}",
        skipDefaultConversion: true,
      },
    },
    transpilePackages: [
      "solito",
      "react-native-web",
      "expo-linking",
      "expo-constants",
      "expo-modules-core",
      "react-native-safe-area-context",
      "react-native-reanimated",
      "react-native-gesture-handler",
    ],
  };

  for (const plugin of plugins) {
    config = {
      ...config,
      ...plugin(config),
    };
  }

  const millionConfig = {
    auto: true,
    mute: true,
  };

  if (enableMillionJS) {
    config = million.next(config, millionConfig);
  }

  if (enablePattyCake) {
    config = pattycake.next(config);
  }

  return config;
};
