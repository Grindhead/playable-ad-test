import Phaser from "phaser";
import { Preloader } from "./scenes/Preloader";
import { MainScene } from "./scenes/Game";
import { EndCard } from "./scenes/EndCard";

import { config } from "./config.js";
import { networkPlugin, mraidAdNetworks } from "./networkPlugin.js";

//  Find out more information about the Game Config at:
//  https://newdocs.phaser.io/docs/3.80.0/Phaser.Types.Core.GameConfig
const gameConfig = {
  type: Phaser.AUTO,
  parent: "game-container",
  backgroundColor: "#028af8",
  scale: {
    mode: Phaser.Scale.FIT,
    width: config.width,
    height: config.height,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: [Preloader, MainScene, EndCard],
};

function initializePhaserGame() {
  return new Phaser.Game(gameConfig);
}

function setupGameInitialization(adNetworkType) {
  if (mraidAdNetworks.has(adNetworkType)) {
    networkPlugin.initMraid(initializePhaserGame);
  } else {
    // vungle, google ads, facebook, ironsource, tiktok, mintegral
    return initializePhaserGame();
  }
}

setupGameInitialization(config.adNetworkType);
