import { networkPlugin } from "../networkPlugin";

export class MainScene extends Phaser.Scene {
  private swipeCount: number = 0;

  private lowkeys: Phaser.GameObjects.Sprite;

  constructor() {
    super("MainScene");
  }

  preload() {}

  create() {
    this.lowkeys = this.add.sprite(
      this.cameras.main.centerX,
      this.cameras.main.centerY,
      "atlas",
      "lowkeys.png"
    );

    this.input.on("pointerdown", (pointer) => {
      const startX = pointer.x;

      this.input.once("pointerup", (endPointer) => {
        const endX = endPointer.x;
        const direction = endX > startX ? "right" : "left";
        this.handleSwipe(direction);
      });
    });
  }

  handleSwipe(direction: string) {
    console.log(`Swiped ${direction}`);
    this.swipeCount++;
    if (this.swipeCount >= 3) {
      this.showEndCard();
    }
  }

  showEndCard() {
    this.lowkeys.destroy(true);

    this.add
      .sprite(
        this.cameras.main.centerX,
        this.cameras.main.centerY,
        "gameAtlas",
        "lowkeys.png"
      )
      .setInteractive();
    this.input.once("pointerdown", () => {
      networkPlugin.ctaPressed(
        "https://apps.apple.com/app/clean-manager/id123456789"
      );
    });
  }
}
