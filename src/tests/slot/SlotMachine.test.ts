import { describe, expect, test } from '@jest/globals';
import { SlotMachine } from "../../app/components/slot/machine/SlotMachine";
import { MainScreen } from "../../app/screens/main/MainScreen";
import { GameService } from "@app/services/GameService";
import { logger } from "@utils/logger";
import { SpinResult, ManySpinsResult } from "@app/types";

// Mock GameService
jest.mock('@app/services/GameService', () => {
  const mockSpin = jest.fn();
  const mockManySpins = jest.fn();
  
  return {
    GameService: {
      spin: mockSpin,
      manySpins: mockManySpins
    }
  };
});

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
    height: 600,
    settingsPanel: {
      isAutowinEnabled: jest.fn().mockReturnValue(false),
      isAutoloseEnabled: jest.fn().mockReturnValue(false),
      getOutcomeWeights: jest.fn().mockReturnValue({ threeOfAKind: 1, twoOfAKind: 1, noWin: 1 }),
      getSymbolWeights: jest.fn().mockReturnValue({ 0: 1, 1: 1, 2: 1, 3: 1, 4: 1, 5: 1 }),
      getSettings: jest.fn().mockReturnValue({
        autowin: false,
        autolose: false,
        outcomeWeights: { threeOfAKind: 1, twoOfAKind: 1, noWin: 1 },
        symbolWeights: { 0: 1, 1: 1, 2: 1, 3: 1, 4: 1, 5: 1 }
      }),
      getManySpinsAmount: jest.fn().mockReturnValue(1000)
    }
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
    position: { set: jest.fn() }
  }))
}));

describe('SlotMachine', () => {
  let slotMachine: SlotMachine;
  let mockScreen: MainScreen;

  beforeEach(() => {
    jest.clearAllMocks();
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

  test('should handle single spin correctly', async () => {
    await slotMachine.show(mockScreen);
    const mockResult: SpinResult = {
      symbols: ['🍒', '🍊', '🍋'],
      win: 10,
      winType: 'THREE_OF_A_KIND'
    };
    (GameService.spin as jest.Mock).mockResolvedValueOnce(mockResult);

    await slotMachine['spin']();

    expect(GameService.spin).toHaveBeenCalledWith(
      1, // default bet from BetPanel mock
      expect.objectContaining({
        autowin: false,
        autolose: false,
        outcomeWeights: expect.any(Object),
        symbolWeights: expect.any(Object)
      })
    );
  });

  test('should handle many spins correctly', async () => {
    await slotMachine.show(mockScreen);
    const mockResult: ManySpinsResult = {
      totalSpins: 1000,
      totalWinAmount: 5000,
      totalBetAmount: 1000,
      expectation: 5,
      winRate: 50,
      returnToPlayer: 500
    };
    (GameService.manySpins as jest.Mock).mockResolvedValueOnce(mockResult);

    await slotMachine['manySpins']();

    expect(GameService.manySpins).toHaveBeenCalledWith(
      1000, // from settings panel mock
      1, // default bet from BetPanel mock
      expect.objectContaining({
        autowin: false,
        autolose: false,
        outcomeWeights: expect.any(Object),
        symbolWeights: expect.any(Object)
      })
    );
  });

  test('should handle spin errors gracefully', async () => {
    await slotMachine.show(mockScreen);
    const error = new Error('API Error');
    (GameService.spin as jest.Mock).mockRejectedValueOnce(error);

    await slotMachine['spin']();

    expect(logger.error).toHaveBeenCalledWith('Failed to spin:', error);
  });

  test('should handle many spins errors gracefully', async () => {
    await slotMachine.show(mockScreen);
    const error = new Error('API Error');
    (GameService.manySpins as jest.Mock).mockRejectedValueOnce(error);

    await slotMachine['manySpins']();

    expect(logger.error).toHaveBeenCalledWith('Failed to perform many spins:', error);
  });

  test('should disable buttons during spin', async () => {
    await slotMachine.show(mockScreen);
    const spinButton = slotMachine['spinButton'];
    const manySpinButton = slotMachine['manySpinButton'];

    const spinPromise = slotMachine['spin']();
    expect(spinButton.setEnabled).toHaveBeenCalledWith(false);
    expect(manySpinButton.setEnabled).toHaveBeenCalledWith(false);

    await spinPromise;
    expect(spinButton.setEnabled).toHaveBeenCalledWith(true);
    expect(manySpinButton.setEnabled).toHaveBeenCalledWith(true);
  });

  test('should prevent multiple simultaneous spins', async () => {
    await slotMachine.show(mockScreen);
    const spinPromise = slotMachine['spin']();
    await slotMachine['spin'](); // Try to spin again while first spin is in progress

    expect(GameService.spin).toHaveBeenCalledTimes(1);
    await spinPromise;
  });

  test('should use settings panel values for spins', async () => {
    await slotMachine.show(mockScreen);
    (mockScreen.settingsPanel.getSettings as jest.Mock).mockReturnValueOnce({
      autowin: true,
      autolose: false,
      outcomeWeights: { threeOfAKind: 2, twoOfAKind: 1, noWin: 0.5 },
      symbolWeights: { 0: 2, 1: 1, 2: 1, 3: 1, 4: 1, 5: 1 }
    });

    await slotMachine['spin']();

    expect(GameService.spin).toHaveBeenCalledWith(
      1,
      expect.objectContaining({
        autowin: true,
        autolose: false,
        outcomeWeights: { threeOfAKind: 2, twoOfAKind: 1, noWin: 0.5 },
        symbolWeights: { 0: 2, 1: 1, 2: 1, 3: 1, 4: 1, 5: 1 }
      })
    );
  });
}); 
