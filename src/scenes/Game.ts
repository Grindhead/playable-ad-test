import { config } from "../config";

export class MainScene extends Phaser.Scene {
  private currentImageIndex: number = 0;
  private images: Phaser.GameObjects.Sprite[] = [];
  private isDragging: boolean = false;
  private dragStartX: number = 0;

  private lowkeys: Phaser.GameObjects.Sprite;

  private phoneOverlay: Phaser.GameObjects.Sprite;

  constructor() {
    super("MainScene");
  }

  create() {
    // Create array of image frames from atlas
    const imageFrames = ["image-1.png", "image-2.png", "image-3.png"];

    // Create and position all images
    imageFrames.forEach((frame, index) => {
      const image = this.add.sprite(0, 0, "atlas", frame);
      image.setOrigin(0.5, 0);

      // Scale image to fit width with gutters
      const scaleX = (config.width - config.xGutter) / image.width;
      image.setScale(scaleX);

      // Position image relative to center of screen
      image.x =
        this.cameras.main.centerX +
        (index - this.currentImageIndex) * image.displayWidth;
      image.y = 40;

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
      if (this.currentImageIndex >= 2) {
        this.time.delayedCall(500, () => this.showEndCard());
      }
    });

    this.phoneOverlay = this.add.sprite(
      this.cameras.main.centerX,
      this.cameras.main.centerY,
      "atlas",
      "phonemockup.png"
    );

    // Create a custom mask shape if needed
    const maskShape = this.make.graphics();
    maskShape.fillStyle(0xffffff, 0.5);
    maskShape.fillRoundedRect(
      0, // adjust these values
      this.phoneOverlay.y - this.phoneOverlay.height / 2, // to match your phone overlay
      this.phoneOverlay.width - config.xGutter, // width
      this.phoneOverlay.height, // height
      55 // corner radius
    );

    // Create a geometry mask from the shape
    const mask = maskShape.createGeometryMask();

    // Apply the mask to all images
    this.images.forEach((image) => {
      image.setMask(mask);
    });
  }

  private updateImagesPosition(dragDelta: number) {
    this.images.forEach((image, index) => {
      const baseX =
        this.cameras.main.centerX +
        (index - this.currentImageIndex) * image.displayWidth;
      image.x = baseX + dragDelta;
    });
  }

  private snapImagesToPosition() {
    this.images.forEach((image, index) => {
      this.tweens.add({
        targets: image,
        x:
          this.cameras.main.centerX +
          (index - this.currentImageIndex) * image.displayWidth,
        duration: 200,
        ease: "Power2",
      });
    });
  }

  showEndCard() {
    // Destroy all carousel images
    this.images.forEach((image) => image.destroy());
    this.images = [];

    this.scene.start("EndCard");
  }
}
