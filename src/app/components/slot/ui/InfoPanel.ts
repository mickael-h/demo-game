import { Container, Graphics, Text } from "pixi.js";
import { EventDispatcher } from "../../../utils/EventDispatcher";
import type { SpinResult, ManySpinsResult } from "../../../services/GameService";

const PANEL_CONFIG = {
  WIDTH: 380,
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
  private manySpinsText: Text;

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

    // Create many spins result text
    this.manySpinsText = new Text({
      text: "Many Spins Results: -",
      style: {
        fontFamily: PANEL_CONFIG.TEXT.FONT_FAMILY,
        fontSize: PANEL_CONFIG.TEXT.FONT_SIZE,
        fill: PANEL_CONFIG.COLORS.TEXT,
      }
    });
    this.manySpinsText.position.set(PANEL_CONFIG.PADDING, PANEL_CONFIG.PADDING + PANEL_CONFIG.TEXT.LINE_HEIGHT * 3);
    this.addChild(this.manySpinsText);

    // Subscribe to GameService events
    EventDispatcher.addEventListener("spinResult", (result: SpinResult) => {
      this.updateResult(result.symbols, result.win, result.winType);
    });

    EventDispatcher.addEventListener("manySpinsResult", (result: ManySpinsResult) => {
      this.updateManySpinsResult(result);
    });
  }

  public resize(_width: number, height: number): void {
    this.x = 20; // 20px margin from left edge
    this.y = 80; // Below the settings button
    this.panel.height = height - 160;
  }

  public updateResult(symbols: string[], win: number, winType: string): void {
    const result = win 
      ? `Last Spin: ${symbols.join(" ")} - Won ${win} (${winType.replace(/_/g, " ").toLowerCase()})!`
      : `Last Spin: ${symbols.join(" ")} - No Win`;
    this.resultText.text = result;
  }

  private updateManySpinsResult(result: ManySpinsResult): void {
    const initialBet = Math.floor(result.totalBetAmount / result.totalSpins);
    const text = [
      "Many Spins Results:",
      `Total Spins: ${result.totalSpins.toLocaleString()}`,
      `Total Win: ${result.totalWinAmount.toLocaleString()}`,
      `Total Bet: ${result.totalBetAmount.toLocaleString()}`,
      `Win Rate: ${result.winRate.toFixed(1)}%`,
      `Return to Player: ${result.returnToPlayer.toFixed(1)}%`,
      `Expectation: ${result.expectation.toFixed(1)}`,
      `Initial Bet: ${initialBet.toLocaleString()}`
    ].join("\n");
    this.manySpinsText.text = text;
  }
} 
