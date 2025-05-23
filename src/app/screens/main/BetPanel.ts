import { Container, Graphics, Text } from "pixi.js";
import { InfoPanel } from "./InfoPanel";

const BET_AMOUNTS = [1, 5, 20];

// Bet button configuration
const BET_BUTTON = {
  SIZE: 40,
  SPACING: 10,
  COLORS: {
    SELECTED: 0x4CAF50,
    UNSELECTED: 0x2C3E50
  },
  TEXT: {
    FONT_FAMILY: "Arial",
    FONT_SIZE: 16,
    COLOR: 0xFFFFFF
  }
};

export class BetPanel {
  private container: Container;
  private betButtons: Graphics[] = [];
  private currentBet: number = 1;
  private infoPanel: InfoPanel;

  constructor(infoPanel: InfoPanel) {
    this.container = new Container();
    this.infoPanel = infoPanel;
    this.initializeBetButtons();
  }

  private initializeBetButtons(): void {
    BET_AMOUNTS.forEach((amount, index) => {
      const button = this.createBetButton(amount, index);
      this.betButtons.push(button);
      this.container.addChild(button);
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
    const fillColor = isSelected ? BET_BUTTON.COLORS.SELECTED : BET_BUTTON.COLORS.UNSELECTED;
    
    button.roundRect(10, yPosition, BET_BUTTON.SIZE, BET_BUTTON.SIZE, 5)
      .fill(fillColor);
  }

  private addBetButtonText(button: Graphics, amount: number, yPosition: number): void {
    const text = new Text({
      text: amount.toString(),
      style: {
        fontFamily: BET_BUTTON.TEXT.FONT_FAMILY,
        fontSize: BET_BUTTON.TEXT.FONT_SIZE,
        fill: BET_BUTTON.TEXT.COLOR,
      }
    });
    
    text.anchor.set(0.5);
    text.position.set(
      BET_BUTTON.SIZE / 2 + BET_BUTTON.SPACING,
      BET_BUTTON.SIZE / 2 + yPosition
    );
    
    button.addChild(text);
  }

  private makeBetButtonInteractive(button: Graphics, amount: number): void {
    button.interactive = true;
    button.cursor = "pointer";
    button.on("pointerdown", () => this.setBet(amount));
  }

  private setBet(amount: number): void {
    this.currentBet = amount;
    this.updateBetButtonColors();
    this.infoPanel.updateBet(amount);
  }

  private updateBetButtonColors(): void {
    this.betButtons.forEach((button, index) => {
      button.clear();
      const yPosition = (BET_BUTTON.SIZE + BET_BUTTON.SPACING) * index;
      this.drawBetButton(button, BET_AMOUNTS[index], yPosition);
    });
  }

  public getContainer(): Container {
    return this.container;
  }

  public getCurrentBet(): number {
    return this.currentBet;
  }

  public setPosition(x: number, y: number): void {
    this.container.position.set(x, y);
  }

  public getTotalHeight(): number {
    return BET_AMOUNTS.length * (BET_BUTTON.SIZE + BET_BUTTON.SPACING);
  }
} 
