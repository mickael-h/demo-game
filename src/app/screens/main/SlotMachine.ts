import { Container, Graphics, Text } from "pixi.js";
import type { MainScreen } from "./MainScreen";
import { Reel, ReelConfig } from "./Reel";

const SLOT_SYMBOLS = ["🍒", "🍊", "🍋", "🍇", "7️⃣", "💎"];
const REEL_COUNT = 3;
const SPIN_DURATION = 1;
const SYMBOL_SIZE = 80;
const REEL_SPACING = 20;
const VISIBLE_SYMBOLS = 3;

export class SlotMachine {
  private reels: Reel[] = [];
  private isSpinning = false;
  private screen!: MainScreen;
  private spinButton!: Graphics;
  private spinText!: Text;
  private container: Container;
  private totalHeight: number;

  constructor() {
    this.container = new Container();
    this.totalHeight = SYMBOL_SIZE * VISIBLE_SYMBOLS + REEL_SPACING * (VISIBLE_SYMBOLS - 1);
    this.initializeSpinButton();
  }

  private initializeSpinButton(): void {
    this.spinButton = new Graphics();
    this.spinButton.roundRect(0, 0, 200, 60, 10).fill(0x4CAF50);
    this.spinButton.interactive = true;
    this.spinButton.cursor = "pointer";

    this.spinText = new Text({
      text: "SPIN",
      style: {
        fontFamily: "Arial",
        fontSize: 24,
        fill: 0xFFFFFF,
      }
    });
    this.spinText.anchor.set(0.5);
    this.spinText.position.set(100, 30);
    this.spinButton.addChild(this.spinText);
  }

  public async show(screen: MainScreen): Promise<void> {
    this.screen = screen;
    this.screen.mainContainer.addChild(this.container);
    this.initializeReels();
    this.container.addChild(this.spinButton);
    this.positionSpinButton();
  }

  private initializeReels(): void {
    const totalWidth = REEL_COUNT * (SYMBOL_SIZE + REEL_SPACING) - REEL_SPACING;
    this.createBackground(totalWidth);
    this.createReels(totalWidth);
  }

  private createBackground(totalWidth: number): void {
    const background = new Graphics();
    background.roundRect(-20, -20, 
      totalWidth + 40,
      this.totalHeight + 40,
      10
    ).fill(0x2C3E50);
    this.container.addChild(background);
    background.position.set(-totalWidth / 2, -this.totalHeight / 2);
  }

  private createReels(totalWidth: number): void {
    const reelConfig: ReelConfig = {
      symbolSize: SYMBOL_SIZE,
      reelSpacing: REEL_SPACING,
      visibleSymbols: VISIBLE_SYMBOLS,
      symbols: SLOT_SYMBOLS
    };

    for (let i = 0; i < REEL_COUNT; i++) {
      const reel = new Reel(reelConfig);
      const x = i * (SYMBOL_SIZE + REEL_SPACING) - totalWidth / 2 + SYMBOL_SIZE / 2;
      reel.setPosition(x, 0);
      this.container.addChild(reel.getContainer());
      this.reels.push(reel);
    }
  }

  private positionSpinButton(): void {
    this.spinButton.position.set(
      -100,
      this.totalHeight / 2 + 20
    );
    this.spinButton.on("pointerdown", () => this.spin());
  }

  private async spin(): Promise<void> {
    if (this.isSpinning) return;
    this.isSpinning = true;
    this.spinButton.interactive = false;

    const spinPromises = this.reels.map((reel, index) => {
      const spinDuration = SPIN_DURATION + index * 0.2;
      return reel.spin(spinDuration);
    });

    await Promise.all(spinPromises);
    this.checkWin();
    this.isSpinning = false;
    this.spinButton.interactive = true;
  }

  private checkWin(): void {
    const middleSymbols = this.reels.map(reel => reel.getMiddleSymbol());
    const allSame = middleSymbols.every((symbol) => symbol === middleSymbols[0]);
    
    if (allSame) {
      // TODO: Implement win animation and reward
      console.log("Winner!");
    }
  }


  public testSymbolVisibility(): boolean {
    return this.reels.every(reel => reel.testSymbolVisibility());
  }

  public async testSymbolCycling(): Promise<boolean> {
    await this.spin();
    await this.spin();
    return this.testSymbolVisibility();
  }
}
