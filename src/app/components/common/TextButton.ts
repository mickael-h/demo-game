import { Container, Graphics, Text } from "pixi.js";
import { engine } from "@app/getEngine";

export interface TextButtonConfig {
  text: string;
  width: number;
  height: number;
  radius: number;
  color: number;
  fontSize?: number;
  fontFamily?: string;
  textColor?: number;
}

export class TextButton extends Container {
  private button: Graphics;
  private text: Text;

  constructor(config: TextButtonConfig) {
    super();

    // Create button background
    this.button = new Graphics();
    this.button.roundRect(0, 0, config.width, config.height, config.radius)
      .fill(config.color);
    this.button.interactive = true;
    this.button.cursor = "pointer";
    this.addChild(this.button);

    // Create button text
    this.text = new Text({
      text: config.text,
      style: {
        fontFamily: config.fontFamily ?? "Arial",
        fontSize: config.fontSize ?? 24,
        fill: config.textColor ?? 0xFFFFFF,
      }
    });
    this.text.anchor.set(0.5);
    this.text.position.set(config.width / 2, config.height / 2);
    this.button.addChild(this.text);

    // Add hover and click handlers
    this.button.on("pointerover", this.handleHover.bind(this));
    this.button.on("pointerdown", this.handleClick.bind(this));
  }

  private handleHover() {
    engine().audio.sfx.play("main/sounds/sfx-hover.wav");
  }

  private handleClick() {
    engine().audio.sfx.play("main/sounds/sfx-press.wav");
  }

  public setPosition(x: number, y: number): void {
    this.position.set(x, y);
  }

  public setEnabled(enabled: boolean): void {
    this.button.interactive = enabled;
    this.button.alpha = enabled ? 1 : 0.5;
  }

  public onPress(callback: () => void): void {
    this.button.on("pointerdown", callback);
  }
} 
