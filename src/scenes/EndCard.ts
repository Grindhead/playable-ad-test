import { Scene } from "phaser";
import { config } from "../config";
import { networkPlugin } from "../networkPlugin";

export class EndCard extends Scene {
  constructor() {
    super("EndCard");
  }

  create() {
    const endCardSprite = this.add.sprite(
      this.cameras.main.centerX,
      0,
      "atlas",
      "logo.png"
    );

    endCardSprite.setOrigin(0.5, 1);
    const scaleX = config.width / 3 / endCardSprite.width;
    endCardSprite.setScale(scaleX);
    endCardSprite.y = 200;

    this.tweens.add({
      targets: endCardSprite,
      scale: endCardSprite.scale * 1.2,
      duration: 1000,
      ease: "Power2",
      yoyo: true,
      repeat: -1,
    });

    endCardSprite.setInteractive();
    this.input.once("pointerdown", () => {
      networkPlugin.ctaPressed(
        "https://apps.apple.com/app/clean-manager/id123456789"
      );
    });
  }
}
