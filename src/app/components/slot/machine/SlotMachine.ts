import { Container, Graphics, Text } from "pixi.js";
import type { MainScreen } from "../../../screens/main/MainScreen";
import { Reel, ReelConfig } from "./Reel";
import { logger } from "../../../utils/logger";
import { BetPanel } from "../ui/BetPanel";
import { GameService } from "../../../services/GameService";

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

  constructor() {
    this.container = new Container();
    this.totalHeight = SYMBOL_SIZE * VISIBLE_SYMBOLS + REEL_SPACING * (VISIBLE_SYMBOLS - 1);
    this.betPanel = new BetPanel();
    this.initializeSpinButton();
  }

  public async show(screen: MainScreen): Promise<void> {
    this.screen = screen;
    this.screen.mainContainer.addChild(this.container);
    this.initializeReels();
    this.container.addChild(this.spinButton);
    this.container.addChild(this.betPanel.getContainer());
    this.positionSpinButton();
    this.positionBetPanel();
    this.resize(screen.width, screen.height);
  }

  public resize(width: number, height: number): void {
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
      symbols: ["🍒", "🍊", "🍋", "🍇", "7️⃣", "💎"] // Using symbols directly since GameService no longer provides them
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

    try {
      const result = await GameService.spin(
        this.betPanel.getCurrentBet(),
        this.screen.settingsPanel?.isAutowinEnabled() ?? false,
        this.screen.settingsPanel?.isAutoloseEnabled() ?? false
      );

      await this.animateSpin(result.symbols);
    } catch (error) {
      logger.error("Failed to spin:", error);
    } finally {
      this.isSpinning = false;
      this.spinButton.interactive = true;
    }
  }

  private async animateSpin(symbols: string[]): Promise<void> {
    const REEL_DELAY = 0.5; // Delay between each reel stopping
    
    // Start all reels spinning simultaneously
    const spinPromises = this.reels.map((reel, index) => {
      const spinDuration = SPIN_DURATION + (index * REEL_DELAY);
      return reel.spin(spinDuration, symbols[index]);
    });

    // Wait for all reels to finish
    await Promise.all(spinPromises);
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
}
