import { defineConfig } from "vite";
import { createHtmlPlugin } from "vite-plugin-html";
import { viteSingleFile } from "vite-plugin-singlefile";
import zipPack from "vite-plugin-zip-pack";
import { htmlInjectionPlugin } from "vite-plugin-html-injection";
import { config } from "./src/config.js";

const addNetworkInjection = () => {
  switch (config.adNetworkType) {
    case "google":
      return {
        name: "Google Ads",
        type: "raw", // raw | js | css
        path: "./src/injections/google.html",
        injectTo: "head" // head | body | head-prepend | body-prepend
      };
    case "tiktok":
      return {
        name: "TikTok",
        type: "raw",
        path: "./src/injections/tiktok.html",
        injectTo: "head"
      };
    case "ironsource":
      return {
        name: "IronSource",
        type: "raw",
        path: "./src/injections/ironsource.html",
        injectTo: "head"
      
      }; 
    case "mraid":
      return {
        name: "Mraid",
        type: "raw",
        path: "./src/injections/mraid.html",
        injectTo: "head"
      };
    case "unityads":
      return {
        name: "Unity Ads",
        type: "raw",
        path: "./src/injections/mraid.html",
        injectTo: "head"
      };
    case "adcolony":
      return {
        name: "Ad Colony",
        type: "raw",
        path: "./src/injections/mraid.html",
        injectTo: "head"
    };
    case "applovin":
      return {
        name: "Ad Colony",
        type: "raw",
        path: "./src/injections/mraid.html",
        injectTo: "head"
    };
    case "kayzen":
      return {
        name: "Kayzen",
        type: "raw",
        path: "./src/injections/mraid.html",
        injectTo: "head"
    };
  }
};


export default defineConfig({
  plugins: [
    viteSingleFile(),
    createHtmlPlugin({
      minify: true,
      removeComments: true,
      entry: "src/main.js",
    }),
    zipPack({
      filter: (fileName, filePath, isDir) => {
        return fileName === "index.html";
      },
    }),
    {
      ...htmlInjectionPlugin({
          injections: [
            addNetworkInjection(),
          ],
      }), 
      apply: "build"
      }
  ],
  build: {
    minify: "terser",
    terserOptions: {
      format: {
        comments: false,
      },
    },
    cssCodeSplit: false,
    assetsInlineLimit: 10,
  },
  server: {
    port: 8080,
  },
});
