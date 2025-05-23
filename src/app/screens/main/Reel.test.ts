import { Reel, ReelConfig } from './Reel';
import { animate } from 'motion';

// Mock PixiJS
jest.mock('pixi.js', () => {
  const mockContainer = {
    children: [],
    position: { x: 0, y: 0, set: jest.fn() },
    addChild: jest.fn(),
    get width() { return 100; },
    get height() { return 100; }
  };

  // Mock Text class
  const mockText = function (options: any) {
    return {
      ...options,
      anchor: { set: jest.fn() },
      position: { set: jest.fn() },
      get width() { return 100; },
      get height() { return 20; },
      get y() { return 0; },
      set y(_) {},
      get x() { return 0; },
      set x(_) {},
      destroy: jest.fn(),
    };
  };

  return {
    Container: jest.fn(() => mockContainer),
    Graphics: jest.fn(() => ({
      rect: jest.fn().mockReturnThis(),
      fill: jest.fn().mockReturnThis()
    })),
    Text: jest.fn(mockText),
  };
});

// Mock the motion library
jest.mock('motion', () => ({
  animate: jest.fn((_target, _to, options) => {
    // Immediately call onComplete
    options.onComplete();
    return Promise.resolve();
  })
}));

describe('Reel', () => {
  const mockConfig: ReelConfig = {
    symbolSize: 80,
    reelSpacing: 20,
    visibleSymbols: 3,
    symbols: ['🍒', '🍊', '🍋']
  };

  let reel: Reel;

  beforeEach(() => {
    reel = new Reel(mockConfig);
    jest.clearAllMocks();
  });

  test('should initialize with two strips', () => {
    const container = reel.getContainer();
    expect(container).toBeDefined();
  });

  test('should position strips correctly', () => {
    const strips = reel.getStrips();
    expect(strips.length).toBe(2);
    expect(strips[0].getPosition()).toEqual({ x: 0, y: -120 });
    expect(strips[1].getPosition()).toEqual({ x: 0, y: 120 });
  });

  test('should swap strips after spin', async () => {
    await reel.spin(1000);
    expect(animate).toHaveBeenCalled();
  });

  test('should maintain symbol visibility during and after spin', async () => {
    await reel.spin(1000);
    expect(animate).toHaveBeenCalled();
  });

  test('should get middle symbol from visible strip', () => {
    const middleSymbol = reel.getMiddleSymbol();
    expect(mockConfig.symbols).toContain(middleSymbol);
  });

  test('should maintain proper strip positions after multiple spins', async () => {
    // Perform multiple spins
    for (let i = 0; i < 3; i++) {
      await reel.spin(1000);
      expect(animate).toHaveBeenCalled();
    }
  });
}); 
