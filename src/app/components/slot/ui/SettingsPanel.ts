import { Container, Graphics } from "pixi.js";
import { LabeledCheckbox } from "../../common/LabeledCheckbox";

export class SettingsPanel extends Container {
  private panel: Graphics;
  private autowinCheckbox: LabeledCheckbox = null!;
  private autoloseCheckbox: LabeledCheckbox = null!;

  constructor() {
    super();

    // Create panel background
    this.panel = new Graphics();
    this.panel.rect(0, 0, 200, 400).fill(0x333333);
    this.addChild(this.panel);
    this.addOptions();
  }

  public resize(width: number, height: number): void {
    this.x = width - 220; // 20px margin from right edge
    this.y = 80; // Below the settings button
    this.panel.height = height - 160;
  }

  private addOptions(): void {
    const offset = 20; 
    // Create autowin checkbox
    this.autowinCheckbox = new LabeledCheckbox("Auto Win", offset, offset);
    this.addChild(this.autowinCheckbox);

    // Create autolose checkbox
    this.autoloseCheckbox = new LabeledCheckbox("Auto Lose", offset, offset + 40);
    this.addChild(this.autoloseCheckbox);

    // Add event listeners for checkboxes
    this.autowinCheckbox.onChange((state: number | boolean) => {
      console.log("Autowin:", state);
      if (state) {
        this.autoloseCheckbox.setChecked(false);
      }
    });

    this.autoloseCheckbox.onChange((state: number | boolean) => {
      console.log("Autolose:", state);
      if (state) {
        this.autowinCheckbox.setChecked(false);
      }
    });
  }

  /** Check if autowin is enabled */
  public isAutowinEnabled(): boolean {
    return this.autowinCheckbox.isChecked();
  }

  /** Check if autolose is enabled */
  public isAutoloseEnabled(): boolean {
    return this.autoloseCheckbox.isChecked();
  }
} 
