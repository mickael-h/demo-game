import { describe, expect, test } from '@jest/globals';
import { SlotMachine } from "./SlotMachine";
import { MainScreen } from "./MainScreen";

// Create a test implementation of MainScreen
class TestMainScreen extends MainScreen {
  constructor() {
    super();
    // Override any necessary methods or properties for testing
  }
}

describe('SlotMachine', () => {
  test('should show all symbols initially', async () => {
    const testScreen = new TestMainScreen();
    const slotMachine = new SlotMachine();
    
    await slotMachine.show(testScreen);
    expect(slotMachine.testSymbolVisibility()).toBe(true);
  });

  test('should maintain symbol visibility after two spins', async () => {
    const testScreen = new TestMainScreen();
    const slotMachine = new SlotMachine();
    
    await slotMachine.show(testScreen);
    const cyclingResult = await slotMachine.testSymbolCycling();
    expect(cyclingResult).toBe(true);
  });
}); 
