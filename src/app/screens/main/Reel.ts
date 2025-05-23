import { Container, Graphics } from "pixi.js";
import { animate } from "motion";
import { SymbolStrip, SymbolStripConfig } from "./SymbolStrip";

export interface ReelConfig extends SymbolStripConfig {}

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
      bottom: this.totalHeight / 2
    };
    this.initialize();
  }

  private calculateTotalHeight(): number {
    return this.config.symbolSize * this.config.visibleSymbols + 
           this.config.reelSpacing * (this.config.visibleSymbols - 1);
  }

  private initialize(): void {
    // Create the mask for this reel
    const mask = new Graphics();
    mask.rect(
      -this.config.symbolSize / 2,
      -this.totalHeight / 2,
      this.config.symbolSize,
      this.totalHeight
    ).fill(0xFFFFFF);
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
    this.strips[0].setPosition(0, -this.totalHeight/2 + this.config.symbolSize/2 + value);
    this.strips[1].setPosition(0, this.totalHeight/2 + this.config.symbolSize/2 + value);
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

  public async spin(duration: number): Promise<void> {
    if (this.isSpinning) return;
    this.isSpinning = true;

    return new Promise<void>((resolve) => {
      const startY = this.stripsY;
      const spinDistance = this.totalHeight;

      const target = { y: startY };
      
      animate(
        target,
        { y: startY - spinDistance },
        {
          duration,
          onUpdate: () => {
            this.stripsY = target.y;
          },
          onComplete: () => {
            requestAnimationFrame(() => {
              this.swapStrips();
              this.stripsY = startY;
              this.isSpinning = false;
              this.updateStrips();
              resolve();
            });
          },
        }
      );
    });
  }

  private updateStrips(): void {
    // Find which strip is now out of view
    const outOfViewStrip = this.strips.find(strip => !strip.isVisible(this.visibleArea));
    if (outOfViewStrip) {
      // Randomize its symbols
      outOfViewStrip.randomizeSymbols();
    }
  }

  public getMiddleSymbol(): string {
    // Get the middle symbol from the strip that's currently in view
    const visibleStrip = this.strips.find(strip => strip.isVisible(this.visibleArea));
    return visibleStrip ? visibleStrip.getMiddleSymbol() : this.strips[0].getMiddleSymbol();
  }

  public testSymbolVisibility(): boolean {
    return this.strips.every(strip => strip.isVisible(this.visibleArea));
  }

  public getStrips(): SymbolStrip[] {
    return this.strips;
  }
} 
