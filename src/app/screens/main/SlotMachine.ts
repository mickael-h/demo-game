import { Container, Graphics, Text } from "pixi.js";
import type { MainScreen } from "./MainScreen";
import { Reel, ReelConfig } from "./Reel";
import { logger } from "../../utils/logger";
import { BetPanel } from "./BetPanel";
import { InfoPanel } from "./InfoPanel";

const SLOT_SYMBOLS = ["🍒", "🍊", "🍋", "🍇", "7️⃣", "💎"];

// Define win values for each symbol (multiplier of bet)
const SYMBOL_VALUES: Record<string, number> = {
  "🍒": 2,    // Cherry - lowest value
  "🍊": 3,    // Orange
  "🍋": 4,    // Lemon
  "🍇": 5,    // Grapes
  "7️⃣": 10,   // Seven - high value
  "💎": 20,   // Diamond - highest value
};

const REEL_COUNT = 3;
const SPIN_DURATION = 1;
const SYMBOL_SIZE = 80;
const REEL_SPACING = 20;
const VISIBLE_SYMBOLS = 3;
const SPIN_BUTTON_VERTICAL_MARGIN = 0; // Vertical margin between machine and spin button
const SPIN_BUTTON_WIDTH = 200;
const SPIN_BUTTON_HEIGHT = 60;
const SPIN_BUTTON_RADIUS = 10;

export class SlotMachine {
  private reels: Reel[] = [];
  private isSpinning = false;
  private screen!: MainScreen;
  private spinButton!: Graphics;
  private spinText!: Text;
  private container: Container;
  private totalHeight: number;
  private betPanel: BetPanel;
  private infoPanel: InfoPanel;

  constructor() {
    this.container = new Container();
    this.totalHeight = SYMBOL_SIZE * VISIBLE_SYMBOLS + REEL_SPACING * (VISIBLE_SYMBOLS - 1);
    this.infoPanel = new InfoPanel();
    this.betPanel = new BetPanel(this.infoPanel);
    this.initializeSpinButton();
  }

  public async show(screen: MainScreen): Promise<void> {
    this.screen = screen;
    this.screen.mainContainer.addChild(this.container);
    this.screen.mainContainer.addChild(this.infoPanel);
    this.initializeReels();
    this.container.addChild(this.spinButton);
    this.container.addChild(this.betPanel.getContainer());
    this.positionSpinButton();
    this.positionBetPanel();
    this.infoPanel.resize(screen.width, screen.height);
    this.resize(screen.width, screen.height);
  }

  public resize(width: number, height: number): void {
    const totalWidth = REEL_COUNT * (SYMBOL_SIZE + REEL_SPACING) - REEL_SPACING;
    this.container.position.set(
      width / 2,
      height / 2
    );
  }

  private positionBetPanel(): void {
    const totalWidth = REEL_COUNT * (SYMBOL_SIZE + REEL_SPACING) - REEL_SPACING;
    // Align with the middle of the machine's screen
    const yPosition = -this.totalHeight / 2 + (this.totalHeight - this.betPanel.getTotalHeight()) / 2;
    this.betPanel.setPosition(totalWidth / 2 + 20, yPosition);
  }

  private initializeSpinButton(): void {
    this.spinButton = new Graphics();
    this.spinButton.roundRect(0, 0, SPIN_BUTTON_WIDTH, SPIN_BUTTON_HEIGHT, SPIN_BUTTON_RADIUS).fill(0x4CAF50);
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
    this.spinText.position.set(SPIN_BUTTON_WIDTH / 2, SPIN_BUTTON_HEIGHT / 2);
    this.spinButton.addChild(this.spinText);
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
      -SPIN_BUTTON_WIDTH / 2,  // Center the button
      this.totalHeight / 2 + SPIN_BUTTON_VERTICAL_MARGIN + SPIN_BUTTON_HEIGHT / 2
    );
    this.spinButton.on("pointerdown", () => this.spin());
  }

  private async spin(): Promise<void> {
    if (this.isSpinning) return;
    this.isSpinning = true;
    this.spinButton.interactive = false;

    // Check if autowin is enabled in settings
    if (this.screen.settingsPanel?.isAutowinEnabled()) {
      this.autowin();
    } else if (this.screen.settingsPanel?.isAutoloseEnabled()) {
      this.autolose();
    }

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
      const winSymbol = middleSymbols[0];
      const winMultiplier = SYMBOL_VALUES[winSymbol];
      const winAmount = winMultiplier * this.betPanel.getCurrentBet();

      logger.info("🎉 Winner!", { 
        symbol: winSymbol,
        allSymbols: middleSymbols,
        winAmount: winAmount,
        multiplier: winMultiplier,
        bet: this.betPanel.getCurrentBet()
      });

      this.infoPanel.updateResult(middleSymbols, winAmount);
    } else {
      this.infoPanel.updateResult(middleSymbols, null);
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

  public getReels(): Reel[] {
    return this.reels;
  }

  /** Set up an autowin by making all reels land on the same symbol */
  private autowin(): void {
    // Get a random symbol from the first reel's config
    const symbols = this.reels[0].getConfig().symbols;
    const targetSymbol = symbols[Math.floor(Math.random() * symbols.length)];
    
    // Set this symbol as the middle symbol for the next spin of all reels
    this.reels.forEach(reel => {
      reel.setNextSpinMiddleSymbol(targetSymbol);
    });
  }

  /** Set up an autolose by making all reels land on different symbols */
  private autolose(): void {
    const symbols = this.reels[0].getConfig().symbols;
    const usedSymbols = new Set<string>();

    // For each reel, pick a random symbol that hasn't been used yet
    this.reels.forEach(reel => {
      let availableSymbols = symbols.filter(s => !usedSymbols.has(s));
      const randomSymbol = availableSymbols[Math.floor(Math.random() * availableSymbols.length)];
      usedSymbols.add(randomSymbol);
      reel.setNextSpinMiddleSymbol(randomSymbol);
    });
  }
}
