# Icon Generation Instructions

Since we can't generate PNG files directly, here are options to create the required icon files:

## Option 1: Use Online Tool (Easiest)

1. Go to https://realfavicongenerator.net/
2. Upload the `favicon.svg` file
3. Configure settings:
   - iOS: 180x180
   - Android Chrome: 192x192 and 512x512
   - Windows: 32x32 and 16x16
4. Download the generated files
5. Place them in the `public/` directory:
   - `favicon-16x16.png`
   - `favicon-32x32.png`
   - `apple-touch-icon.png`
   - `icon-192.png`
   - `icon-512.png`

## Option 2: Use ImageMagick (Command Line)

If you have ImageMagick installed:

```bash
# Convert SVG to PNG at different sizes
convert -background none -resize 16x16 public/favicon.svg public/favicon-16x16.png
convert -background none -resize 32x32 public/favicon.svg public/favicon-32x32.png
convert -background none -resize 180x180 public/favicon.svg public/apple-touch-icon.png
convert -background none -resize 192x192 public/favicon.svg public/icon-192.png
convert -background none -resize 512x512 public/favicon.svg public/icon-512.png
```

## Option 3: Use Figma/Design Tool

1. Open `favicon.svg` in Figma or similar tool
2. Export at the required sizes
3. Save to `public/` directory

## Note

The SVG favicon will work for modern browsers, but PNG files are needed for:
- Older browsers
- iOS home screen icons
- Android PWA icons
- Windows taskbar icons

