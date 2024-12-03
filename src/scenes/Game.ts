import { config } from "../config";

export class MainScene extends Phaser.Scene {
  private currentImageIndex: number = 0;
  private images: Phaser.GameObjects.Container[] = [];
  private isDragging: boolean = false;
  private dragStartX: number = 0;

  private lowkeys: Phaser.GameObjects.Sprite;

  private phoneOverlay: Phaser.GameObjects.Sprite;

  private acceptButton: Phaser.GameObjects.Sprite;
  private closeButton: Phaser.GameObjects.Sprite;

  constructor() {
    super("MainScene");
  }

  create() {
    // Create array of image frames from atlas
    const imageFrames = ["image-1.png", "image-2.png", "image-3.png"];

    // Create and position all images
    imageFrames.forEach((frame, index) => {
      const container = this.add.container(0, 0);
      const image = this.make.sprite({ x: 0, y: 0, key: "atlas", frame });
      image.setOrigin(0.5, 0);
      container.add(image);

      const scaleX = (config.width - config.xGutter) / image.width;
      image.setScale(scaleX);

      // Store the width in the container for easy access
      container.setData("width", image.displayWidth);

      container.x =
        this.cameras.main.centerX +
        (index - this.currentImageIndex) * image.displayWidth;
      container.y = 40;

      this.images.push(container);
    });

    this.lowkeys = this.add.sprite(
      this.cameras.main.centerX,
      this.cameras.main.height - config.yGutter - 40,
      "atlas",
      "lowkeys.png"
    );
    this.lowkeys.setOrigin(0.5, 1);
    const scaleX = (config.width - config.xGutter - 80) / this.lowkeys.width;
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

    this.applyMask();
    this.createButtons();
  }

  private createButtons() {
    const spacing = 100;
    const scale = 0.25;
    const yPos = 480;
    this.acceptButton = this.add.sprite(
      this.cameras.main.centerX - spacing,
      yPos,
      "atlas",
      "close.png"
    );

    this.closeButton = this.add.sprite(
      this.cameras.main.centerX + spacing,
      yPos,
      "atlas",
      "heart.png"
    );

    this.acceptButton.setScale(scale);
    this.closeButton.setScale(scale);
  }

  private applyMask() {
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

    this.lowkeys.setMask(mask);
  }

  private updateImagesPosition(dragDelta: number) {
    this.images.forEach((container, index) => {
      const width = container.getData("width");
      const baseX =
        this.cameras.main.centerX + (index - this.currentImageIndex) * width;
      container.x = baseX + dragDelta;
    });
  }

  private snapImagesToPosition() {
    this.images.forEach((container, index) => {
      const width = container.getData("width");
      this.tweens.add({
        targets: container,
        x: this.cameras.main.centerX + (index - this.currentImageIndex) * width,
        duration: 200,
        ease: "Power2",
      });
    });
  }

  showEndCard() {
    // Destroy all carousel images
    this.input.off("pointerup");

    this.images.forEach((image) => image.destroy());
    this.images = [];
    this.currentImageIndex = 0;
    this.scene.start("EndCard");
  }
}
