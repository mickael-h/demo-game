import { Container, Graphics } from "pixi.js";
import { animate } from "motion";
import { SymbolStrip } from "./SymbolStrip";
import { ReelConfig } from "@app/types";

export class Reel {
  private container: Container;
  private reel: Container;
  private strips: SymbolStrip[] = [];
  private isSpinning = false;
  private config: ReelConfig;
  private totalHeight: number;
  private visibleArea: { top: number; bottom: number };
  private _innerY: number = 0;

  constructor(config: ReelConfig) {
    this.config = config;
    this.container = new Container();
    this.reel = new Container();
    this.totalHeight = this.calculateTotalHeight();
    this.visibleArea = {
      top: -this.totalHeight / 2,
      bottom: this.totalHeight / 2,
    };
    this.initialize();
  }

  private calculateTotalHeight(): number {
    return (
      this.config.symbolSize * this.config.visibleSymbols +
      this.config.reelSpacing * (this.config.visibleSymbols - 1)
    );
  }

  private initialize(): void {
    // Create the mask for this reel
    const mask = new Graphics();
    mask
      .rect(
        -this.config.symbolSize / 2,
        -this.totalHeight / 2,
        this.config.symbolSize,
        this.totalHeight
      )
      .fill(0xffffff);
    this.container.addChild(mask);
    this.container.mask = mask;

    // Create two strips of symbols
    this.createStrips();

    // Add the reel to the container
    this.container.addChild(this.reel);
  }

  private createStrips(): void {
    // Create first strip at the top
    const strip1 = new SymbolStrip(this.config);
    this.reel.addChild(strip1.getContainer());
    this.strips.push(strip1);

    // Create second strip below the first one
    const strip2 = new SymbolStrip(this.config);
    this.reel.addChild(strip2.getContainer());
    this.strips.push(strip2);

    this.stripsY = 0;
  }

  private swapStrips(): void {
    const temp = this.strips[0];
    this.strips[0] = this.strips[1];
    this.strips[1] = temp;
  }

  public set stripsY(value: number) {
    this._innerY = value;
    // Update strip positions based on innerY
    this.strips[0].setPosition(0, -this.totalHeight / 2 + this.config.symbolSize / 2 + value);
    this.strips[1].setPosition(0, this.totalHeight / 2 + this.config.symbolSize / 2 + value);
  }

  public get stripsY(): number {
    return this._innerY;
  }

  public getContainer(): Container {
    return this.container;
  }

  public setPosition(x: number, y: number): void {
    this.container.position.set(x, y);
  }

  private async animateStripSection(
    startY: number,
    spinDistance: number,
    swapInterval: number
  ): Promise<void> {
    const target = { y: startY };
    await new Promise<void>((resolve) => {
      animate(
        target,
        { y: startY - spinDistance },
        {
          duration: swapInterval,
          ease: "linear",
          onUpdate: () => {
            this.stripsY = target.y;
          },
          onComplete: () => {
            this.swapStrips();
            this.stripsY = startY;
            resolve();
          },
        }
      );
    });
  }

  private calculateNumSwaps(
    duration: number,
    swapInterval: number,
    hasTargetSymbol: boolean
  ): number {
    let numSwaps = Math.floor(duration / swapInterval);

    if (hasTargetSymbol && numSwaps % 2 === 1) {
      numSwaps++;
    }

    return numSwaps;
  }

  private resetSpinState(startY: number): void {
    this.swapStrips();
    this.stripsY = startY;
    this.isSpinning = false;
    this.updateStrips();
  }

  public async spin(duration: number, targetSymbol?: string): Promise<void> {
    if (this.isSpinning) return;
    this.isSpinning = true;

    if (targetSymbol) {
      this.setNextSpinMiddleSymbol(targetSymbol);
    }

    const startY = this.stripsY;
    const spinDistance = this.totalHeight;
    const swapInterval = 0.2;
    const numSwaps = this.calculateNumSwaps(duration, swapInterval, !!targetSymbol);

    for (let i = 0; i < numSwaps; i++) {
      await this.animateStripSection(startY, spinDistance, swapInterval);
    }

    this.resetSpinState(startY);
  }

  private updateStrips(): void {
    // Find which strip is now out of view
    const outOfViewStrip = this.strips.find((strip) => !strip.isVisible(this.visibleArea));
    if (outOfViewStrip) {
      // Randomize its symbols
      outOfViewStrip.randomizeSymbols();
    }
  }

  public getMiddleSymbol(): string {
    // Get the middle symbol from the strip that's currently in view
    const visibleStrip = this.strips.find((strip) => strip.isVisible(this.visibleArea));
    return visibleStrip ? visibleStrip.getMiddleSymbol() : this.strips[0].getMiddleSymbol();
  }

  public testSymbolVisibility(): boolean {
    return this.strips.every((strip) => strip.isVisible(this.visibleArea));
  }

  public getStrips(): SymbolStrip[] {
    return this.strips;
  }

  /** Get the reel's configuration */
  public getConfig(): ReelConfig {
    return this.config;
  }

  /** Set the middle symbol of the next spin (strip2) */
  public setNextSpinMiddleSymbol(symbol: string): void {
    const middleIndex = Math.floor(this.config.visibleSymbols / 2);
    this.strips[1].setSymbolAt(middleIndex, symbol);
  }
}
