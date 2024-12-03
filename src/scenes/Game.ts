import { networkPlugin } from "../networkPlugin";

export class MainScene extends Phaser.Scene {
  private swipeCount: number = 0;

  constructor() {
    super("MainScene");
  }

  preload() {
    this.load.atlas("gameAtlas", "@assets/atlas.png", "@assets/atlas.json");
  }

  create() {
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
