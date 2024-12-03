# Phaser Unified Playable Ads Template

This is a sample Phaser 3 project that includes our Unified Playable Ads Network Plugin. This plugin allows you to easily integrate and test your playable ads across multiple ad networks.

If you look in `main.js` and `config.js` you'll see the way the plugin has been included. This isn't a standard Phaser plugin, so you can just import it like a regular ESM module and hook into it directly from your Phaser code.

`config.js` contains the configuration for the plugin. You can set the ad network type and store links here. The type of the ad network can be any one of the following:

- 'google'
- 'meta'
- 'mintegral'
- 'tiktok'
- 'ironsource'
- 'vungle'
- 'unityads'
- 'applovin'
- 'adcolony'
- 'kayzen'

Inside your Phaser Scenes, import the networkPlugin:

```js
import { networkPlugin } from "../networkPlugin.js";
```

Then you can use the plugin to call the ad network API:

```js
networkPlugin.ctaPressed();
```

For Unity Ads, Applovin, Ad Colony and Kayzen we need to specify store links to our call:

```js
import { config } from "../config.js";

networkPlugin.ctaPressed(config.googlePlayStoreLink, config.appleStoreLink);
```

The rest of this document details how to use the template:

## Available Commands

| Command         | Description                                    |
| --------------- | ---------------------------------------------- |
| `npm install`   | Install project dependencies                   |
| `npm run dev`   | Launch a development web server                |
| `npm run build` | Create a production build in the `dist` folder |

## Template Project Structure

We have provided a default project structure to get you started. This is as follows:

- `index.html` - A basic HTML page to contain the game.
- `src` - Contains the game source code.
- `src/main.js` - The main entry point. This contains the game configuration and starts the game.
- `src/scenes/` - The Phaser Scenes are in this folder.
- `src/lib/` - Contains ad network API libraries.
- `public/assets` - Contains the static assets used by the game.

## Testing on Ad Networks

- Facebook: Facebook Playable Ad tester is not working in case you try with it. You should upload your playable directly to [Facebook Ads Manager](https://adsmanager.facebook.com/adsmanager/) to test.
- Unity Ads:
  - [Android](https://play.google.com/store/apps/details?id=com.unity3d.auicreativetestapp)
  - [iOS](https://apps.apple.com/sk/app/ad-testing/id1463016906)
- [AppLovin](https://p.applov.in/playablePreview?create=1&qr=1)
- [Mintegral](https://www.mindworks-creative.com/review/)
- IronSource: Testing tool is deprecated. You can only test it directly on [IronSource dashboard](https://developers.is.com/ironsource-mobile/general/html-upload/)
- Google: Testing tool is not available. You can only test it directly on [Google Ads Manager](https://ads.google.com/).
- [TikTok](https://ads.tiktok.com/help/article/playable-ads?lang=en#anchor-20)
- [Vungle](https://vungle.com/creative-verifier/)
- [Ad Colony](https://console.fyber.com/)
- Kayzen: They don't have testing tool. You need to test through their dashboard.

## Handling Assets

Vite supports loading assets via JavaScript module `import` statements.

This template provides support for both embedding assets and also loading them from a static folder. To embed an asset, you can import it at the top of the JavaScript file you are using it in:

```js
import logoImg from "./assets/logo.png";
```

To load static files such as audio files, videos, etc place them into the `public/assets` folder. Then you can use this path in the Loader calls within Phaser:

```js
preload();
{
  //  This is an example of an imported bundled image.
  //  Remember to import it at the top of this file
  this.load.image("logo", logoImg);

  //  This is an example of loading a static image
  //  from the public/assets folder:
  this.load.image("background", "assets/bg.png");
}
```

When you issue the `npm run build` command, all static assets are automatically copied to the `dist/assets` folder.

## Deploying to Production

After you run the `npm run build` command, your code will be built into a single bundle and saved to the `dist` folder, along with any other assets your project imported, or stored in the public assets folder.

In order to deploy your playable ad, you will need to upload _all_ of the contents of the `dist` or `dist-zip` folder to ad network.

## Customizing the Template

### Vite

If you want to customize your build, such as adding plugin (i.e. for loading CSS or fonts), you can modify the `vite.config.js` file for cross-project changes, or you can modify and/or create new configuration files and target them in specific npm tasks inside of `package.json`. Please see the [Vite documentation](https://vitejs.dev/) for more information.

## Join the Phaser Community!

We love to see what developers like you create with Phaser! It really motivates us to keep improving. So please join our community and show-off your work 😄

**Visit:** The [Phaser website](https://phaser.io) and follow on [Phaser Twitter](https://twitter.com/phaser_)<br />
**Play:** Some of the amazing games [#madewithphaser](https://twitter.com/search?q=%23madewithphaser&src=typed_query&f=live)<br />
**Learn:** [API Docs](https://newdocs.phaser.io), [Support Forum](https://phaser.discourse.group/) and [StackOverflow](https://stackoverflow.com/questions/tagged/phaser-framework)<br />
**Discord:** Join us on [Discord](https://discord.gg/phaser)<br />
**Code:** 2000+ [Examples](https://labs.phaser.io)<br />
**Read:** The [Phaser World](https://phaser.io/community/newsletter) Newsletter<br />

Created by [Phaser Studio](mailto:support@phaser.io). Powered by coffee, anime, pixels and love.

The Phaser logo and characters are &copy; 2011 - 2024 Phaser Studio Inc.

All rights reserved.
