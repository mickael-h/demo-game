import { Container, Graphics, Text } from "pixi.js";
import { GameService } from "../../../services/GameService";

const PANEL_CONFIG = {
  WIDTH: 350,
  PADDING: 20,
  COLORS: {
    BACKGROUND: 0x333333,
    TEXT: 0xFFFFFF
  },
  TEXT: {
    FONT_FAMILY: "Arial",
    FONT_SIZE: 16,
    LINE_HEIGHT: 24
  }
};

export class InfoPanel extends Container {
  private panel: Graphics;
  private resultText: Text;

  constructor() {
    super();

    // Create panel background
    this.panel = new Graphics();
    this.panel.rect(0, 0, PANEL_CONFIG.WIDTH, 400).fill(PANEL_CONFIG.COLORS.BACKGROUND);
    this.addChild(this.panel);

    // Create result text
    this.resultText = new Text({
      text: "Last Spin: -",
      style: {
        fontFamily: PANEL_CONFIG.TEXT.FONT_FAMILY,
        fontSize: PANEL_CONFIG.TEXT.FONT_SIZE,
        fill: PANEL_CONFIG.COLORS.TEXT,
      }
    });
    this.resultText.position.set(PANEL_CONFIG.PADDING, PANEL_CONFIG.PADDING);
    this.addChild(this.resultText);

    // Subscribe to GameService events
    GameService.addEventListener(GameService.SPIN_RESULT_EVENT, ((event: CustomEvent) => {
      const result = event.detail;
      this.updateResult(result.symbols, result.winAmount, result.betAmount);
    }) as EventListener);
  }

  public resize(_width: number, height: number): void {
    this.x = 20; // 20px margin from left edge
    this.y = 80; // Below the settings button
    this.panel.height = height - 160;
  }

  public updateResult(symbols: string[], winAmount: number, betAmount: number): void {
    const result = winAmount 
      ? `Last Spin: ${symbols.join(" ")} - Bet ${betAmount} - Won ${winAmount}!`
      : `Last Spin: ${symbols.join(" ")} - Bet ${betAmount} - No Win`;
    this.resultText.text = result;
  }
} 
