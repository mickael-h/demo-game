import { describe, expect, test } from '@jest/globals';
import { SlotMachine } from "../../app/components/slot/machine/SlotMachine";
import { MainScreen } from "../../app/screens/main/MainScreen";

// Mock logger
jest.mock('@utils/logger', () => ({
  logger: {
    error: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn()
  }
}));

// Mock PixiJS
jest.mock('pixi.js', () => {
  const mockContainer = {
    children: [],
    position: { x: 0, y: 0, set: jest.fn() },
    addChild: jest.fn(),
    get width() { return 100; },
    get height() { return 100; }
  };

  const mockPosition = { x: 0, y: 0, set: jest.fn() };

  return {
    Container: jest.fn(() => mockContainer),
    Graphics: jest.fn(() => ({
      rect: jest.fn().mockReturnThis(),
      fill: jest.fn().mockReturnThis(),
      roundRect: jest.fn().mockReturnThis(),
      stroke: jest.fn().mockReturnThis(),
      interactive: true,
      cursor: "pointer",
      on: jest.fn(),
      addChild: jest.fn(),
      position: { ...mockPosition }
    })),
    Text: jest.fn(() => ({
      anchor: { set: jest.fn() },
      position: { set: jest.fn() },
      get width() { return 100; },
      get height() { return 20; }
    }))
  };
});

// Mock MainScreen
jest.mock('../../app/screens/main/MainScreen', () => ({
  MainScreen: jest.fn().mockImplementation(() => ({
    mainContainer: {
      addChild: jest.fn()
    },
    width: 800,
    height: 600
  }))
}));

// Mock Reel
jest.mock('../../app/components/slot/machine/Reel', () => ({
  Reel: jest.fn().mockImplementation(() => ({
    getContainer: jest.fn().mockReturnValue({}),
    setPosition: jest.fn(),
    spin: jest.fn().mockResolvedValue(undefined),
    getMiddleSymbol: jest.fn().mockReturnValue('🍒'),
    testSymbolVisibility: jest.fn().mockReturnValue(true),
    getConfig: jest.fn().mockReturnValue({
      symbols: ['🍒', '🍊', '🍋', '🍇', '7️⃣', '💎']
    }),
    setNextSpinMiddleSymbol: jest.fn()
  }))
}));

// Mock InfoPanel
jest.mock('../../app/components/slot/ui/InfoPanel', () => ({
  InfoPanel: jest.fn().mockImplementation(() => ({
    resize: jest.fn(),
    updateResult: jest.fn()
  }))
}));

// Mock BetPanel
jest.mock('../../app/components/slot/ui/BetPanel', () => ({
  BetPanel: jest.fn().mockImplementation(() => ({
    getContainer: jest.fn().mockReturnValue({}),
    getCurrentBet: jest.fn().mockReturnValue(1),
    setPosition: jest.fn(),
    getTotalHeight: jest.fn().mockReturnValue(100)
  }))
}));

// Mock TextButton
jest.mock('../../app/components/common/TextButton', () => ({
  TextButton: jest.fn().mockImplementation(() => ({
    onPress: jest.fn(),
    setPosition: jest.fn(),
    addChild: jest.fn(),
    setEnabled: jest.fn(),
    position: { set: jest.fn() },
    // Add any other methods/properties used in SlotMachine
  }))
}));

describe('SlotMachine', () => {
  let slotMachine: SlotMachine;
  let mockScreen: MainScreen;

  beforeEach(() => {
    slotMachine = new SlotMachine();
    mockScreen = new MainScreen();
  });

  test('should show all symbols initially', async () => {
    await slotMachine.show(mockScreen);
    expect(slotMachine.testSymbolVisibility()).toBe(true);
  });

  test('should maintain symbol visibility after two spins', async () => {
    await slotMachine.show(mockScreen);
    const cyclingResult = await slotMachine.testSymbolCycling();
    expect(cyclingResult).toBe(true);
  });

  test('should initialize with three reels', async () => {
    await slotMachine.show(mockScreen);
    expect(slotMachine.getReels()).toHaveLength(3);
  });
}); 
