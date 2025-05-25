import { Container, Graphics, Text } from "pixi.js";

const BET_AMOUNTS = [100, 50, 25, 10, 5, 1];

// Bet button configuration
const BET_BUTTON = {
  SIZE: 40,
  SPACING: 10,
  COLORS: {
    DEFAULT: 0x4CAF50,
    SELECTED: 0x2196F3,
    TEXT: 0xFFFFFF
  },
  TEXT: {
    FONT_FAMILY: "Arial",
    FONT_SIZE: 16
  }
};

export class BetPanel extends Container {
  private betButtons: Graphics[] = [];
  private currentBet: number = BET_AMOUNTS[0];

  constructor() {
    super();
    this.initialize();
  }

  private initialize(): void {
    BET_AMOUNTS.forEach((amount, index) => {
      const button = this.createBetButton(amount, index);
      this.betButtons.push(button);
      this.addChild(button);
    });
  }

  private createBetButton(amount: number, index: number): Graphics {
    const button = new Graphics();
    const yPosition = (BET_BUTTON.SIZE + BET_BUTTON.SPACING) * index;
    
    this.drawBetButton(button, amount, yPosition);
    this.addBetButtonText(button, amount, yPosition);
    this.makeBetButtonInteractive(button, amount);

    return button;
  }

  private drawBetButton(button: Graphics, amount: number, yPosition: number): void {
    const isSelected = amount === this.currentBet;
    button.clear();
    button.roundRect(0, yPosition, BET_BUTTON.SIZE, BET_BUTTON.SIZE, 5)
      .fill(isSelected ? BET_BUTTON.COLORS.SELECTED : BET_BUTTON.COLORS.DEFAULT);
  }

  private addBetButtonText(button: Graphics, amount: number, yPosition: number): void {
    const text = new Text({
      text: amount.toString(),
      style: {
        fontFamily: BET_BUTTON.TEXT.FONT_FAMILY,
        fontSize: BET_BUTTON.TEXT.FONT_SIZE,
        fill: BET_BUTTON.COLORS.TEXT,
      }
    });
    text.anchor.set(0.5);
    text.position.set(BET_BUTTON.SIZE / 2, yPosition + BET_BUTTON.SIZE / 2);
    button.addChild(text);
  }

  private makeBetButtonInteractive(button: Graphics, amount: number): void {
    button.eventMode = 'static';
    button.cursor = 'pointer';
    button.on('pointerdown', () => {
      this.currentBet = amount;
      this.updateBetButtonColors();
    });
  }

  private updateBetButtonColors(): void {
    this.betButtons.forEach((button, index) => {
      button.clear();
      const yPosition = (BET_BUTTON.SIZE + BET_BUTTON.SPACING) * index;
      this.drawBetButton(button, BET_AMOUNTS[index], yPosition);
    });
  }

  public getCurrentBet(): number {
    return this.currentBet;
  }

  public getTotalHeight(): number {
    return BET_AMOUNTS.length * (BET_BUTTON.SIZE + BET_BUTTON.SPACING) - BET_BUTTON.SPACING;
  }

  public setPosition(x: number, y: number): void {
    this.position.set(x, y);
  }
} 
