import { storage } from "@engine/utils/storage";
import { engine } from "@app/getEngine";
import { STORAGE_KEYS } from "@app/types";

/**
 * Persistent user settings of volumes.
 */
class UserSettings {
  public init() {
    engine().audio.setMasterVolume(this.getMasterVolume());
    engine().audio.bgm.setVolume(this.getBgmVolume());
    engine().audio.sfx.setVolume(this.getSfxVolume());
  }

  /** Get overall sound volume */
  public getMasterVolume() {
    return storage.getNumber(STORAGE_KEYS.VOLUME.MASTER) ?? 0.5;
  }

  /** Set overall sound volume */
  public setMasterVolume(value: number) {
    engine().audio.setMasterVolume(value);
    storage.setNumber(STORAGE_KEYS.VOLUME.MASTER, value);
  }

  /** Get background music volume */
  public getBgmVolume() {
    return storage.getNumber(STORAGE_KEYS.VOLUME.BGM) ?? 1;
  }

  /** Set background music volume */
  public setBgmVolume(value: number) {
    engine().audio.bgm.setVolume(value);
    storage.setNumber(STORAGE_KEYS.VOLUME.BGM, value);
  }

  /** Get sound effects volume */
  public getSfxVolume() {
    return storage.getNumber(STORAGE_KEYS.VOLUME.SFX) ?? 1;
  }

  /** Set sound effects volume */
  public setSfxVolume(value: number) {
    engine().audio.sfx.setVolume(value);
    storage.setNumber(STORAGE_KEYS.VOLUME.SFX, value);
  }
}

/** Shared user settings instance */
export const userSettings = new UserSettings();
