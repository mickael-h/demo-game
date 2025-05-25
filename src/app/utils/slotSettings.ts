import { storage } from "@engine/utils/storage";
import { STORAGE_KEYS } from "@app/types";

/**
 * Persistent slot machine settings.
 */
class SlotSettings {
  /** Get many spins amount */
  public getManySpinsAmount() {
    return storage.getNumber(STORAGE_KEYS.SLOT.MANY_SPINS) ?? 10000;
  }

  /** Set many spins amount */
  public setManySpinsAmount(value: number) {
    storage.setNumber(STORAGE_KEYS.SLOT.MANY_SPINS, value);
  }

  /** Get three of a kind weight */
  public getThreeOfAKindWeight() {
    return storage.getNumber(STORAGE_KEYS.SLOT.THREE_OF_A_KIND_WEIGHT) ?? 100;
  }

  /** Set three of a kind weight */
  public setThreeOfAKindWeight(value: number) {
    storage.setNumber(STORAGE_KEYS.SLOT.THREE_OF_A_KIND_WEIGHT, value);
  }

  /** Get two of a kind weight */
  public getTwoOfAKindWeight() {
    return storage.getNumber(STORAGE_KEYS.SLOT.TWO_OF_A_KIND_WEIGHT) ?? 100;
  }

  /** Set two of a kind weight */
  public setTwoOfAKindWeight(value: number) {
    storage.setNumber(STORAGE_KEYS.SLOT.TWO_OF_A_KIND_WEIGHT, value);
  }

  /** Get no win weight */
  public getNoWinWeight() {
    return storage.getNumber(STORAGE_KEYS.SLOT.NO_WIN_WEIGHT) ?? 100;
  }

  /** Set no win weight */
  public setNoWinWeight(value: number) {
    storage.setNumber(STORAGE_KEYS.SLOT.NO_WIN_WEIGHT, value);
  }

  /** Get autowin setting */
  public getAutowin() {
    return storage.getBool(STORAGE_KEYS.SLOT.AUTOWIN) ?? false;
  }

  /** Set autowin setting */
  public setAutowin(value: boolean) {
    storage.setBool(STORAGE_KEYS.SLOT.AUTOWIN, value);
  }

  /** Get autolose setting */
  public getAutolose() {
    return storage.getBool(STORAGE_KEYS.SLOT.AUTOLOSE) ?? false;
  }

  /** Set autolose setting */
  public setAutolose(value: boolean) {
    storage.setBool(STORAGE_KEYS.SLOT.AUTOLOSE, value);
  }

  /** Get symbol weight */
  public getSymbolWeight(symbolIndex: number) {
    return storage.getNumber(`${STORAGE_KEYS.SLOT.SYMBOL_WEIGHT_PREFIX}${symbolIndex}`) ?? 100;
  }

  /** Set symbol weight */
  public setSymbolWeight(symbolIndex: number, value: number) {
    storage.setNumber(`${STORAGE_KEYS.SLOT.SYMBOL_WEIGHT_PREFIX}${symbolIndex}`, value);
  }

  /** Get all symbol weights */
  public getSymbolWeights() {
    const weights: { [key: number]: number } = {};
    for (let i = 0; i < 6; i++) { // Assuming 6 symbols
      weights[i] = this.getSymbolWeight(i);
    }
    return weights;
  }
}

/** Shared slot settings instance */
export const slotSettings = new SlotSettings(); 
