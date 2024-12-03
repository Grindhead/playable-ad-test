import { config } from "../config";
import { networkPlugin } from "../networkPlugin";

export class MainScene extends Phaser.Scene {
  private currentImageIndex: number = 0;
  private images: Phaser.GameObjects.Sprite[] = [];
  private isDragging: boolean = false;
  private dragStartX: number = 0;

  private lowkeys: Phaser.GameObjects.Sprite;

  constructor() {
    super("MainScene");
  }

  create() {
    // Create array of image frames from atlas
    const imageFrames = [
      "Art_Quiet_real_influencer_girl_selfie_amateur_look_natural_ligh_1a2176f2-baf4-4d87-97f4-f934ecb76ac3.png",
      "Art_Quiet_real_influencer_girl_selfie_amateur_look_natural_ligh_1da69794-97c4-4388-a4d0-6c7921766c97.png",
      "Art_Quiet_real_influencer_girl_selfie_amateur_look_natural_ligh_9d3565cc-eaf6-4ae0-9ed4-db4fe6edc6a5.png",
      "Art_Quiet_real_influencer_girl_selfie_amateur_look_natural_ligh_96264e28-cb83-4dc7-a1b4-ab5dc2238aa3.png",
      "Art_Quiet_real_influencer_girl_selfie_amateur_look_natural_ligh_fb02a2bc-7366-4c01-a8f6-2098bc0b4dba.png",
    ];

    // Create and position all images
    imageFrames.forEach((frame, index) => {
      const image = this.add.sprite(0, 0, "atlas", frame);
      image.setOrigin(0.5, 0);

      // Scale image to fit width with gutters
      const scaleX = (config.width - config.xGutter) / image.width;
      image.setScale(scaleX);

      // Position image (initially off-screen to the right)
      image.x = config.width * (index - this.currentImageIndex);
      image.y = 100;

      this.images.push(image);
    });

    this.lowkeys = this.add.sprite(
      this.cameras.main.centerX,
      this.cameras.main.height - config.yGutter,
      "atlas",
      "lowkeys.png"
    );
    this.lowkeys.setOrigin(0.5, 1);
    const scaleX = (config.width - config.xGutter) / this.lowkeys.width;
    this.lowkeys.setScale(scaleX);

    // Setup input handling
    this.input.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
      this.isDragging = true;
      this.dragStartX = pointer.x;
    });

    this.input.on("pointermove", (pointer: Phaser.Input.Pointer) => {
      if (this.isDragging) {
        const dragDelta = pointer.x - this.dragStartX;
        this.updateImagesPosition(dragDelta);
      }
    });

    this.input.on("pointerup", (pointer: Phaser.Input.Pointer) => {
      if (!this.isDragging) return;

      const dragDelta = pointer.x - this.dragStartX;
      const threshold = config.width * 0.2; // 20% of screen width

      if (Math.abs(dragDelta) > threshold) {
        // Determine direction and update current index
        if (dragDelta > 0 && this.currentImageIndex > 0) {
          this.currentImageIndex--;
        } else if (
          dragDelta < 0 &&
          this.currentImageIndex < this.images.length - 1
        ) {
          this.currentImageIndex++;
        }
      }

      // Snap images to new positions
      this.snapImagesToPosition();
      this.isDragging = false;

      // Check if we should show end card after last image
      if (this.currentImageIndex === this.images.length - 1) {
        this.time.delayedCall(500, () => this.showEndCard());
      }
    });
  }

  private updateImagesPosition(dragDelta: number) {
    this.images.forEach((image, index) => {
      const baseX = config.width * (index - this.currentImageIndex);
      image.x = baseX + dragDelta;
    });
  }

  private snapImagesToPosition() {
    this.images.forEach((image, index) => {
      this.tweens.add({
        targets: image,
        x: config.width * (index - this.currentImageIndex),
        duration: 200,
        ease: "Power2",
      });
    });
  }

  showEndCard() {
    // Destroy all carousel images
    this.images.forEach((image) => image.destroy());
    this.images = [];

    const endCardSprite = this.add.sprite(
      this.cameras.main.centerX,
      0,
      "gameAtlas",
      "lowkeys.png"
    );

    endCardSprite.setOrigin(0.5, 1);
    const scaleX = (config.width - config.xGutter) / endCardSprite.width;
    endCardSprite.setScale(scaleX);
    endCardSprite.y = config.height - config.yGutter;

    endCardSprite.setInteractive();
    this.input.once("pointerdown", () => {
      networkPlugin.ctaPressed(
        "https://apps.apple.com/app/clean-manager/id123456789"
      );
    });
  }
}
