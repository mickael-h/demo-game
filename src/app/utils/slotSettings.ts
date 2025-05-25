import { storage } from "@engine/utils/storage";

// Keys for saved items in storage
const KEY_MANY_SPINS = "slot-many-spins";
const KEY_THREE_OF_A_KIND_WEIGHT = "slot-three-of-a-kind-weight";
const KEY_TWO_OF_A_KIND_WEIGHT = "slot-two-of-a-kind-weight";
const KEY_NO_WIN_WEIGHT = "slot-no-win-weight";
const KEY_AUTOWIN = "slot-autowin";
const KEY_AUTOLOSE = "slot-autolose";

/**
 * Persistent slot machine settings.
 */
class SlotSettings {
  /** Get many spins amount */
  public getManySpinsAmount() {
    return storage.getNumber(KEY_MANY_SPINS) ?? 10000;
  }

  /** Set many spins amount */
  public setManySpinsAmount(value: number) {
    storage.setNumber(KEY_MANY_SPINS, value);
  }

  /** Get three of a kind weight */
  public getThreeOfAKindWeight() {
    return storage.getNumber(KEY_THREE_OF_A_KIND_WEIGHT) ?? 100;
  }

  /** Set three of a kind weight */
  public setThreeOfAKindWeight(value: number) {
    storage.setNumber(KEY_THREE_OF_A_KIND_WEIGHT, value);
  }

  /** Get two of a kind weight */
  public getTwoOfAKindWeight() {
    return storage.getNumber(KEY_TWO_OF_A_KIND_WEIGHT) ?? 100;
  }

  /** Set two of a kind weight */
  public setTwoOfAKindWeight(value: number) {
    storage.setNumber(KEY_TWO_OF_A_KIND_WEIGHT, value);
  }

  /** Get no win weight */
  public getNoWinWeight() {
    return storage.getNumber(KEY_NO_WIN_WEIGHT) ?? 100;
  }

  /** Set no win weight */
  public setNoWinWeight(value: number) {
    storage.setNumber(KEY_NO_WIN_WEIGHT, value);
  }

  /** Get autowin setting */
  public getAutowin() {
    return storage.getBool(KEY_AUTOWIN) ?? false;
  }

  /** Set autowin setting */
  public setAutowin(value: boolean) {
    storage.setBool(KEY_AUTOWIN, value);
  }

  /** Get autolose setting */
  public getAutolose() {
    return storage.getBool(KEY_AUTOLOSE) ?? false;
  }

  /** Set autolose setting */
  public setAutolose(value: boolean) {
    storage.setBool(KEY_AUTOLOSE, value);
  }
}

/** Shared slot settings instance */
export const slotSettings = new SlotSettings(); 
