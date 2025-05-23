interface SpinResult {
  symbols: string[];
  winAmount: number;
  isWin: boolean;
}

const SLOT_SYMBOLS = ["🍒", "🍊", "🍋", "🍇", "7️⃣", "💎"];

export class GameService {
  private static readonly API_URL = 'http://localhost:3000';

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
    return {
      ...result,
      symbols: result.symbols.map((index: number) => SLOT_SYMBOLS[index])
    };
  }
} 
