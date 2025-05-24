import { Container, Text } from "pixi.js";

export interface SymbolStripConfig {
  symbolSize: number;
  reelSpacing: number;
  visibleSymbols: number;
  symbols: string[];
}

export class SymbolStrip {
  private container: Container;
  private symbols: Text[] = [];
  private config: SymbolStripConfig;
  private totalHeight: number;

  constructor(config: SymbolStripConfig) {
    this.config = config;
    this.container = new Container();
    this.totalHeight = this.calculateTotalHeight();
    this.initialize();
  }

  private calculateTotalHeight(): number {
    return this.config.symbolSize * this.config.visibleSymbols + 
           this.config.reelSpacing * (this.config.visibleSymbols - 1);
  }

  private initialize(): void {
    this.createSymbols();
  }

  private createSymbols(): void {
    for (let i = 0; i < this.config.visibleSymbols; i++) {
      const symbol = this.createSymbol();
      symbol.anchor.set(0.5);
      const yPos = i * (this.config.symbolSize + this.config.reelSpacing);
      symbol.position.set(0, yPos);
      this.container.addChild(symbol);
      this.symbols.push(symbol);
    }
  }

  private createSymbol(): Text {
    return new Text({
      text: this.getRandomSymbol(),
      style: {
        fontFamily: "Arial",
        fontSize: 40,
        fill: 0xFFFFFF,
      }
    });
  }

  private getRandomSymbol(): string {
    return this.config.symbols[Math.floor(Math.random() * this.config.symbols.length)];
  }

  public getContainer(): Container {
    return this.container;
  }

  public setPosition(x: number, y: number): void {
    this.container.position.set(x, y);
  }

  public getTotalHeight(): number {
    return this.totalHeight;
  }

  public randomizeSymbols(): void {
    this.symbols.forEach(symbol => {
      symbol.text = this.getRandomSymbol();
    });
  }

  public getMiddleSymbol(): string {
    const middleIndex = Math.floor(this.config.visibleSymbols / 2);
    return this.symbols[middleIndex].text;
  }

  public isVisible(visibleArea: { top: number; bottom: number }): boolean {
    const stripTop = this.container.position.y;
    const stripBottom = stripTop + this.totalHeight;
    
    return !(stripBottom < visibleArea.top || stripTop > visibleArea.bottom);
  }

  public getPosition(): { x: number; y: number } {
    return { x: this.container.x, y: this.container.y };
  }

  /** Set a specific symbol at the given index */
  public setSymbolAt(index: number, symbol: string): void {
    if (index >= 0 && index < this.symbols.length) {
      this.symbols[index].text = symbol;
    }
  }
} 
