interface SpinResult {
  symbols: string[];
  winAmount: number;
  isWin: boolean;
  betAmount: number;
}

const SLOT_SYMBOLS = ["🍒", "🍊", "🍋", "🍇", "7️⃣", "💎"];

export class GameService {
  private static readonly API_URL = 'http://localhost:3000';
  private static eventTarget = new EventTarget();
  public static readonly SPIN_RESULT_EVENT = 'spinResult';

  public static addEventListener(event: string, callback: EventListener): void {
    this.eventTarget.addEventListener(event, callback);
  }

  public static removeEventListener(event: string, callback: EventListener): void {
    this.eventTarget.removeEventListener(event, callback);
  }

  private static dispatchEvent(event: string, detail: any): void {
    this.eventTarget.dispatchEvent(new CustomEvent(event, { detail }));
  }

  public static async spin(bet: number, autowin: boolean, autolose: boolean): Promise<SpinResult> {
    const response = await fetch(`${this.API_URL}/api/bet/place`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ amount: bet, autowin, autolose })
    });

    if (!response.ok) {
      throw new Error('Failed to get spin results');
    }

    const result = await response.json();
    const spinResult = {
      ...result,
      symbols: result.symbols.map((index: number) => SLOT_SYMBOLS[index]),
      betAmount: bet
    };
    
    this.dispatchEvent(this.SPIN_RESULT_EVENT, spinResult);
    return spinResult;
  }
} 
