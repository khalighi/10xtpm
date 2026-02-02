# 10X TPM

Personal website for Hasti Amini - Technical Program Manager & AI Enthusiast.

## Live Site

Visit the live site at: `https://[your-username].github.io/10xtpm/`

## Features

- **Home Page** - Personal introduction with featured YouTube videos
- **AI Tools** - Curated collection of 10 AI tools for TPMs
- **Projects** - Showcase of interesting projects and case studies

## Setup for GitHub Pages

1. Push this repository to GitHub
2. Go to your repository **Settings**
3. Navigate to **Pages** (in the sidebar under "Code and automation")
4. Under "Source", select **Deploy from a branch**
5. Select the **main** branch and **/ (root)** folder
6. Click **Save**
7. Wait a few minutes for the site to deploy
8. Your site will be available at `https://[your-username].github.io/[repository-name]/`

## Customization

### Adding Your YouTube Videos

Replace the placeholder `VIDEO_ID_X` in the iframe `src` attributes with your actual YouTube video IDs:

```html
<iframe src="https://www.youtube.com/embed/YOUR_VIDEO_ID" ...></iframe>
```

To get a YouTube video ID:
1. Go to your YouTube video
2. The ID is the part after `v=` in the URL
3. Example: `https://www.youtube.com/watch?v=dQw4w9WgXcQ` → ID is `dQw4w9WgXcQ`

### Adding Your Profile Photo

Replace the avatar placeholder in `index.html` with an actual image:

```html
<div class="avatar-container">
    <img src="your-photo.jpg" alt="Hasti Amini" class="avatar-image">
    <div class="floating-badge">✨ 10X</div>
</div>
```

Add this CSS to `styles.css`:

```css
.avatar-image {
    width: 280px;
    height: 280px;
    border-radius: 50%;
    object-fit: cover;
    box-shadow: var(--shadow-xl), 0 0 60px rgba(99, 102, 241, 0.3);
}
```

### Updating Links

- Update the LinkedIn link in `index.html` and `projects.html`
- Add any additional social media links as needed

## File Structure

```
/
├── index.html          # Home page
├── tools.html          # AI Tools page
├── projects.html       # Projects page
├── styles.css          # All styles
├── _config.yml         # GitHub Pages config
└── README.md           # This file
```

## Technologies Used

- Pure HTML5 & CSS3
- Google Fonts (Inter, Playfair Display)
- Responsive design
- No JavaScript dependencies

## License

Feel free to use and customize this template for your own personal website.
