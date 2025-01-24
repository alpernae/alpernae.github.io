# Retro Terminal Blog

A retro-styled blog that simulates a terminal interface with a CRT effect. Features a unique aesthetic combining classic terminal visuals with modern web functionality.

## Features

- 🖥️ Terminal-style interface with CRT scan line effects
- 🎵 Built-in retro music player with YouTube integration
- 📁 Category-based post organization
- 📝 Markdown support for blog posts
- 🐱 Interactive ASCII art elements
- 💻 Responsive design for all screen sizes

## Project Structure

```plaintext
.
├── assets/
│   ├── css/
│   │   └── styles.css      # Main stylesheet with retro terminal styling
│   └── js/
│       ├── music.js        # RetroMusicPlayer implementation
│       └── scripts.js      # Core blog functionality
├── posts/
│   ├── posts.json         # Blog post metadata
│   ├── first-post.md      # Sample blog post
│   └── second-post.md     # Sample blog post
└── index.html            # Main entry point
```

## Technologies Used

- HTML5
- CSS3 (with retro styling and animations)
- JavaScript (vanilla)
- Marked.js for Markdown parsing
- YouTube IFrame API for music player

## Features Details

### Blog System

- Category-based post organization
- Markdown support for content
- Frontmatter for post metadata
- Dynamic post loading

### Music Player

- YouTube-based retro music player
- Classic 80s playlist included
- Volume controls and progress bar
- Visual audio spectrum simulation

### Terminal Effects

- Simulated CRT scan lines
- Terminal-style windows and controls
- Blinking cursor effects
- Command-line inspired navigation

## Setup

1. Clone the repository
2. No build process required - pure HTML/CSS/JS
3. Serve the files using any web server
4. Access through browser at your local server address

## Adding New Posts

1. Create a new `.md` file in the `posts` directory
2. Add post metadata in frontmatter format:

```markdown
---
title: Your Post Title
category: YOUR_CATEGORY
date: YYYY-MM-DD
---
```

3.Add the post information to `posts/posts.json`

## License

MIT License

## Author

[alpernae](https://twitter.com/alpernae)

Made with 💻 and nostalgia
