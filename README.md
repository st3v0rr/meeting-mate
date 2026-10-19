# Meeting Mate 🤝

A SvelteKit application for managing meeting participants with countdown timer and theme support.

## Features ✨

- **Participant Management** - Add, remove, and shuffle meeting participants
- **Countdown Timer** - Customizable timer with pause/reset functionality
- **Theme System** - Multiple themes (Default, Adorsys, TribeClub)
- **URL Parameters** - Share meetings with custom participant lists
- **Responsive Design** - Works on desktop and mobile

## Tech Stack 🛠️

- **Framework:** SvelteKit 2.x
- **Runtime:** Svelte 5 with Runes
- **Build Tool:** Vite 7
- **Language:** TypeScript 5
- **Styling:** CSS Variables
- **Deployment:** Static site generation

## Getting Started 🚀

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Usage 📖

### Basic Usage
1. Open the app
2. Add participants in Settings
3. Start the countdown timer
4. Shuffle participants if needed

The dice icon opens the wheel with the shared participant list and attendance status.
Adding, deleting, or selecting participants in the wheel also updates the meeting list.
Without a participant URL parameter or manually added members, the wheel starts empty.

### URL Parameters
- `?tc` - Use TribeClub theme
- `?ad` - Use Adorsys theme  
- `?members=John,Jane,Bob` - Pre-populate participant list

### Example
```
https://your-domain.com/?tc&members=Alice,Bob,Charlie
```

## Themes 🎨

The app supports multiple themes using CSS variables:

- **Default** - Green tones
- **Adorsys** - Blue tones
- **TribeClub** - Red tones

Themes persist in localStorage and can be changed in Settings.

## Development 👨‍💻

```bash
# Type checking
npm run check

# Run tests
npm run test

# Linting
npm run lint

# Format code
npm run format
```

## License 📄

MIT

---

Built with ❤️ using SvelteKit
