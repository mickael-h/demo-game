import { EventDispatcher } from "../utils/EventDispatcher";
import { SLOT_SYMBOLS, SpinResult, ManySpinsResult, BetOptions, BetRequest } from "@app/types";

export class GameService {
  private static readonly API_BASE_URL = "http://localhost:3000";

  public static async spin(bet: number, options: BetOptions = {}): Promise<SpinResult> {
    const request: BetRequest = {
      amount: bet,
      autowin: options.autowin,
      autolose: options.autolose,
      outcomeWeights: options.outcomeWeights,
      symbolWeights: options.symbolWeights,
    };

    const response = await fetch(`${this.API_BASE_URL}/api/bet/place`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`Failed to place bet: ${response.statusText}`);
    }

    const result = await response.json();
    const spinResult: SpinResult = {
      symbols: result.symbols.map((index: number) => SLOT_SYMBOLS[index]),
      win: result.winAmount,
      winType: result.winType,
    };
    EventDispatcher.dispatch("spinResult", spinResult);
    return spinResult;
  }

  public static async manySpins(
    spins: number,
    bet: number,
    options: BetOptions = {}
  ): Promise<ManySpinsResult> {
    const request: BetRequest = {
      amount: bet,
      autowin: options.autowin,
      autolose: options.autolose,
      outcomeWeights: options.outcomeWeights,
      symbolWeights: options.symbolWeights,
    };

    const response = await fetch(`${this.API_BASE_URL}/api/bet/many-spins`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        spins,
        ...request,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to perform many spins: ${response.statusText}`);
    }

    const result = await response.json();
    EventDispatcher.dispatch("manySpinsResult", result);
    return result;
  }
}
