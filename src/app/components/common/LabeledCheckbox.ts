import { Container, Graphics, Text } from "pixi.js";
import { CheckBox } from "@pixi/ui";

export class LabeledCheckbox extends Container {
  private checkbox: CheckBox;
  private _label: Text;

  constructor(text: string, x: number, y: number) {
    super();

    // Create checkbox graphics
    const uncheckedBg = new Graphics()
      .rect(0, 0, 20, 20)
      .fill({ color: 0x666666 })
      .stroke({ width: 2, color: 0xffffff });

    const checkedBg = new Graphics()
      .rect(0, 0, 20, 20)
      .fill({ color: 0x4caf50 })
      .stroke({ width: 2, color: 0xffffff });

    // Create checkbox
    this.checkbox = new CheckBox({
      checked: false,
      style: {
        unchecked: uncheckedBg,
        checked: checkedBg,
      },
    });
    this.checkbox.x = 0;
    this.checkbox.y = 0;
    this.addChild(this.checkbox);

    // Create label
    this._label = new Text({
      text: text,
      style: {
        fontFamily: "Arial",
        fontSize: 16,
        fill: 0xffffff,
      },
    });
    this._label.x = 30;
    this._label.y = 0;
    this.addChild(this._label);

    // Position the entire component
    this.x = x;
    this.y = y;
  }

  public isChecked(): boolean {
    return this.checkbox.checked;
  }

  public setChecked(checked: boolean): void {
    this.checkbox.checked = checked;
  }

  public onChange(callback: (state: number | boolean) => void): void {
    this.checkbox.onChange.connect(callback);
  }
}
