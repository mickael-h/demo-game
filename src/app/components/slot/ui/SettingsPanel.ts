import { Container, Graphics, Text } from "pixi.js";
import { LabeledCheckbox } from "../../common/LabeledCheckbox";
import { TextInput } from "../../common/TextInput";

const PANEL_CONFIG = {
  WIDTH: 300,
  PADDING: 20,
  COLORS: {
    BACKGROUND: 0x333333,
    TEXT: 0xFFFFFF,
    INPUT_BACKGROUND: 0x444444,
    INPUT_TEXT: 0xFFFFFF
  },
  TEXT: {
    FONT_FAMILY: "Arial",
    FONT_SIZE: 16,
    LINE_HEIGHT: 24,
    STYLE: {
      fontFamily: "Arial",
      fontSize: 16,
      fill: 0xFFFFFF
    }
  },
  INPUT: {
    WIDTH: 100,
    HEIGHT: 30,
    COLORS: {
      background: 0x444444,
      text: 0xFFFFFF,
      border: 0xFFFFFF
    },
    TEXT_STYLE: {
      fontFamily: "Arial",
      fontSize: 16
    }
  }
};

const SLOT_SYMBOLS = ["🍒", "🍊", "🍋", "🍇", "7️⃣", "💎"];

export interface OutcomeWeights {
  threeOfAKind: number;
  twoOfAKind: number;
  noWin: number;
}

export class SettingsPanel extends Container {
  private panel!: Graphics;
  private autowinCheckbox!: LabeledCheckbox;
  private autoloseCheckbox!: LabeledCheckbox;
  private manySpinsLabel!: Text;
  private manySpinsInput!: TextInput;
  private threeOfAKindLabel!: Text;
  private threeOfAKindInput!: TextInput;
  private threeOfAKindProbLabel!: Text;
  private twoOfAKindLabel!: Text;
  private twoOfAKindInput!: TextInput;
  private twoOfAKindProbLabel!: Text;
  private noWinLabel!: Text;
  private noWinInput!: TextInput;
  private noWinProbLabel!: Text;

  constructor() {
    super();
    this.initialize();
  }

  private calculateProbabilities(weights: OutcomeWeights): OutcomeWeights {
    const wTrip = 1 * weights.threeOfAKind;
    const wPair = 3 * (SLOT_SYMBOLS.length - 1) * weights.twoOfAKind;
    const wBust = (SLOT_SYMBOLS.length - 1) * (SLOT_SYMBOLS.length - 2) * weights.noWin;
    const total = wTrip + wPair + wBust;

    return {
      threeOfAKind: wTrip / total,
      twoOfAKind: wPair / total,
      noWin: wBust / total
    };
  }

  private updateProbabilityLabels(): void {
    const weights = this.getOutcomeWeights();
    const probs = this.calculateProbabilities(weights);

    this.threeOfAKindProbLabel.text = `(${(probs.threeOfAKind * 100).toFixed(1)}% chance)`;
    this.twoOfAKindProbLabel.text = `(${(probs.twoOfAKind * 100).toFixed(1)}% chance)`;
    this.noWinProbLabel.text = `(${(probs.noWin * 100).toFixed(1)}% chance)`;
  }

  private initialize(): void {
    // Create panel background
    this.panel = new Graphics();
    this.panel.rect(0, 0, PANEL_CONFIG.WIDTH, 400).fill(PANEL_CONFIG.COLORS.BACKGROUND);
    this.addChild(this.panel);

    // Create checkboxes
    this.autowinCheckbox = new LabeledCheckbox("Auto Win", PANEL_CONFIG.PADDING, PANEL_CONFIG.PADDING);
    this.autoloseCheckbox = new LabeledCheckbox("Auto Lose", PANEL_CONFIG.PADDING, PANEL_CONFIG.PADDING + PANEL_CONFIG.TEXT.LINE_HEIGHT * 2);

    // Create many spins input
    this.manySpinsLabel = new Text({
      text: "Many Spins Amount:",
      style: PANEL_CONFIG.TEXT.STYLE
    });
    this.manySpinsLabel.position.set(PANEL_CONFIG.PADDING, PANEL_CONFIG.PADDING + PANEL_CONFIG.TEXT.LINE_HEIGHT * 4);

    // Create many spins input
    this.manySpinsInput = new TextInput({
      width: PANEL_CONFIG.INPUT.WIDTH,
      height: PANEL_CONFIG.INPUT.HEIGHT,
      initialValue: 10000,
      min: 1,
      max: 10000000,
      colors: PANEL_CONFIG.INPUT.COLORS,
      textStyle: PANEL_CONFIG.INPUT.TEXT_STYLE
    });
    this.manySpinsInput.position.set(PANEL_CONFIG.PADDING, PANEL_CONFIG.PADDING + PANEL_CONFIG.TEXT.LINE_HEIGHT * 5);

    // Create outcome weights section
    const weightsY = PANEL_CONFIG.PADDING + PANEL_CONFIG.TEXT.LINE_HEIGHT * 7;
    const labelSpacing = PANEL_CONFIG.TEXT.LINE_HEIGHT * 1.5; // Add 50% more spacing between labels

    // Three of a Kind
    this.threeOfAKindLabel = new Text({
      text: "Three of a Kind Weight (% of default):",
      style: PANEL_CONFIG.TEXT.STYLE
    });
    this.threeOfAKindLabel.position.set(PANEL_CONFIG.PADDING, weightsY);

    this.threeOfAKindInput = new TextInput({
      width: PANEL_CONFIG.INPUT.WIDTH,
      height: PANEL_CONFIG.INPUT.HEIGHT,
      initialValue: 100,
      min: 0,
      max: 100,
      colors: PANEL_CONFIG.INPUT.COLORS,
      textStyle: PANEL_CONFIG.INPUT.TEXT_STYLE
    });
    this.threeOfAKindInput.position.set(PANEL_CONFIG.PADDING, weightsY + PANEL_CONFIG.TEXT.LINE_HEIGHT);

    this.threeOfAKindProbLabel = new Text({
      text: "",
      style: PANEL_CONFIG.TEXT.STYLE
    });
    this.threeOfAKindProbLabel.position.set(PANEL_CONFIG.PADDING + 110, weightsY + PANEL_CONFIG.TEXT.LINE_HEIGHT + 5);

    // Two of a Kind
    this.twoOfAKindLabel = new Text({
      text: "Two of a Kind Weight (% of default):",
      style: PANEL_CONFIG.TEXT.STYLE
    });
    this.twoOfAKindLabel.position.set(PANEL_CONFIG.PADDING, weightsY + labelSpacing * 2);

    this.twoOfAKindInput = new TextInput({
      width: PANEL_CONFIG.INPUT.WIDTH,
      height: PANEL_CONFIG.INPUT.HEIGHT,
      initialValue: 100,
      min: 0,
      max: 100,
      colors: PANEL_CONFIG.INPUT.COLORS,
      textStyle: PANEL_CONFIG.INPUT.TEXT_STYLE
    });
    this.twoOfAKindInput.position.set(PANEL_CONFIG.PADDING, weightsY + labelSpacing * 2 + PANEL_CONFIG.TEXT.LINE_HEIGHT);

    this.twoOfAKindProbLabel = new Text({
      text: "",
      style: PANEL_CONFIG.TEXT.STYLE
    });
    this.twoOfAKindProbLabel.position.set(PANEL_CONFIG.PADDING + 110, weightsY + labelSpacing * 2 + PANEL_CONFIG.TEXT.LINE_HEIGHT + 5);

    // No Win
    this.noWinLabel = new Text({
      text: "No Win Weight (% of default):",
      style: PANEL_CONFIG.TEXT.STYLE
    });
    this.noWinLabel.position.set(PANEL_CONFIG.PADDING, weightsY + labelSpacing * 4);

    this.noWinInput = new TextInput({
      width: PANEL_CONFIG.INPUT.WIDTH,
      height: PANEL_CONFIG.INPUT.HEIGHT,
      initialValue: 100,
      min: 0,
      max: 100,
      colors: PANEL_CONFIG.INPUT.COLORS,
      textStyle: PANEL_CONFIG.INPUT.TEXT_STYLE
    });
    this.noWinInput.position.set(PANEL_CONFIG.PADDING, weightsY + labelSpacing * 4 + PANEL_CONFIG.TEXT.LINE_HEIGHT);

    this.noWinProbLabel = new Text({
      text: "",
      style: PANEL_CONFIG.TEXT.STYLE
    });
    this.noWinProbLabel.position.set(PANEL_CONFIG.PADDING + 110, weightsY + labelSpacing * 4 + PANEL_CONFIG.TEXT.LINE_HEIGHT + 5);

    // Add all elements to panel
    this.addChild(this.autowinCheckbox);
    this.addChild(this.autoloseCheckbox);
    this.addChild(this.manySpinsLabel);
    this.addChild(this.manySpinsInput);
    this.addChild(this.threeOfAKindLabel);
    this.addChild(this.threeOfAKindInput);
    this.addChild(this.threeOfAKindProbLabel);
    this.addChild(this.twoOfAKindLabel);
    this.addChild(this.twoOfAKindInput);
    this.addChild(this.twoOfAKindProbLabel);
    this.addChild(this.noWinLabel);
    this.addChild(this.noWinInput);
    this.addChild(this.noWinProbLabel);

    // Set up input change handlers
    this.threeOfAKindInput.onChange(() => this.updateProbabilityLabels());
    this.twoOfAKindInput.onChange(() => this.updateProbabilityLabels());
    this.noWinInput.onChange(() => this.updateProbabilityLabels());

    // Initialize probability labels
    this.updateProbabilityLabels();
  }

  public resize(_width: number, height: number): void {
    this.x = _width - PANEL_CONFIG.WIDTH - 20; // 20px margin from right edge
    this.y = 80; // Below the settings button
    this.panel.height = height - 160;
  }

  public isAutowinEnabled(): boolean {
    return this.autowinCheckbox.isChecked();
  }

  public isAutoloseEnabled(): boolean {
    return this.autoloseCheckbox.isChecked();
  }

  public getManySpinsAmount(): number {
    return Number(this.manySpinsInput.getValue());
  }

  public getOutcomeWeights(): OutcomeWeights {
    return {
      threeOfAKind: Number(this.threeOfAKindInput.getValue()) / 100,
      twoOfAKind: Number(this.twoOfAKindInput.getValue()) / 100,
      noWin: Number(this.noWinInput.getValue()) / 100
    };
  }
} 
