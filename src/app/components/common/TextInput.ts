import { Container, Graphics, Text } from "pixi.js";

export interface TextInputConfig {
  width?: number;
  height?: number;
  initialValue?: string | number;
  placeholder?: string;
  min?: number;
  max?: number;
  colors?: {
    background?: number;
    text?: number;
    border?: number;
  };
  textStyle?: {
    fontFamily?: string;
    fontSize?: number;
  };
}

export class TextInput extends Container {
  private background: Graphics;
  private text: Text;
  private value: string | number;
  private config: Omit<Required<TextInputConfig>, 'min' | 'max'> & { min?: number; max?: number };
  private onChangeCallback?: () => void;

  constructor(config: TextInputConfig = {}) {
    super();

    this.config = {
      width: config.width ?? 100,
      height: config.height ?? 30,
      initialValue: config.initialValue ?? '',
      placeholder: config.placeholder ?? '',
      min: config.min,
      max: config.max,
      colors: {
        background: config.colors?.background ?? 0x444444,
        text: config.colors?.text ?? 0xFFFFFF,
        border: config.colors?.border ?? 0xFFFFFF,
      },
      textStyle: {
        fontFamily: config.textStyle?.fontFamily ?? 'Arial',
        fontSize: config.textStyle?.fontSize ?? 16,
      },
    };

    this.value = this.config.initialValue;

    // Create background
    this.background = new Graphics();
    this.background
      .roundRect(0, 0, this.config.width, this.config.height, 5)
      .fill(this.config.colors.background)
      .stroke({ width: 1, color: this.config.colors.border });
    this.addChild(this.background);

    // Create text
    this.text = new Text({
      text: this.value.toString(),
      style: {
        fontFamily: this.config.textStyle.fontFamily,
        fontSize: this.config.textStyle.fontSize,
        fill: this.config.colors.text,
      }
    });
    this.text.position.set(5, (this.config.height - this.text.height) / 2);
    this.addChild(this.text);

    // Make interactive
    this.eventMode = 'static';
    this.cursor = 'text';

    // Add click handler
    this.on('pointerdown', this.handleClick);
  }

  private handleClick = () => {
    const promptText = this.config.min !== undefined && this.config.max !== undefined
      ? `Enter value (${this.config.min}-${this.config.max}):`
      : 'Enter value:';

    const newValue = prompt(promptText, this.value.toString());
    if (newValue !== null) {
      if (this.config.min !== undefined && this.config.max !== undefined) {
        const numValue = parseInt(newValue);
        if (!isNaN(numValue)) {
          this.setValue(Math.min(Math.max(numValue, this.config.min), this.config.max));
        }
      } else {
        this.setValue(newValue);
      }
    }
  };

  public setValue(value: string | number): void {
    this.value = value;
    this.text.text = value.toString();
    this.onChangeCallback?.();
  }

  public getValue(): string | number {
    if (this.config.min !== undefined && this.config.max !== undefined) {
      return Number(this.value);
    }
    return this.value;
  }

  public setEnabled(enabled: boolean): void {
    this.eventMode = enabled ? 'static' : 'none';
    this.cursor = enabled ? 'text' : 'default';
    this.alpha = enabled ? 1 : 0.5;
  }

  public onChange(callback: () => void): void {
    this.onChangeCallback = callback;
  }
} 
