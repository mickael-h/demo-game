# Demo Slot Game

A simple slot machine game built with PixiJS v8, created as an experiment to explore the capabilities of the PixiJS game engine.
Production is deployed to: https://demo-game-olive.vercel.app/

## Features

- Basic slot machine gameplay with multiple reels
- Simple UI with essential controls
- Basic sound effects
- Symbol weight customization for testing probabilities
- Win multipliers and payout system

## Tech Stack

- **Game Engine**: [PixiJS v8](https://pixijs.com/)
- **UI Components**: [@pixi/ui](https://github.com/pixijs/ui)
- **Sound System**: [@pixi/sound](https://github.com/pixijs/sound)
- **Animation**: [Motion](https://motion.dev/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Testing**: [Jest](https://jestjs.io/)
- **Language**: TypeScript

## Getting Started

### Prerequisites

- Node.js (v20 or higher)
- npm (v9 or higher)

### Installation

1. Clone the repository:
   ```bash
   git clone [repository-url]
   cd demo-game
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:8080`

### Building for Production

```bash
npm run build
```

The build output will be in the `dist` directory.

## Project Structure

```
src/
├── app/
│   ├── components/     # Game components (reels, buttons, panels)
│   ├── screens/        # Game screens
│   ├── services/       # Game logic and services
│   ├── types/         # TypeScript type definitions
│   └── utils/         # Utility functions
├── assets/            # Game assets (images, sounds)
└── tests/             # Test files
```

## Game Components

### Slot Machine
The main game component that manages the reels and game state.

### Reels
Individual reels with basic spinning animations.

### Bet Panel
Controls for adjusting bet amounts.

### Settings Panel
Basic game settings:
- Sound volume controls
- Symbol weight adjustments

## Development

### Available Scripts

- `npm start` - Start the development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm test` - Run tests
- `npm run dev` - Start development server with hot reload

### Testing

The project uses Jest for testing. Run tests with:

```bash
npm test
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
