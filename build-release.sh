#!/bin/bash

# RPG Maker MV/MZ Cheat UI Plugin - Release Package Builder
# This script creates release packages for both MV and MZ versions

set -e

VERSION="1.0.0-enhanced"
BUILD_DIR="build"
RELEASE_DIR="releases"

echo "Building RPG Maker MV/MZ Cheat UI Plugin Release Packages..."
echo "Version: $VERSION"
echo ""

# Clean previous builds
rm -rf "$BUILD_DIR"
rm -rf "$RELEASE_DIR"
mkdir -p "$BUILD_DIR"
mkdir -p "$RELEASE_DIR"

# ============================================
# Build RPG Maker MV Package
# ============================================
echo "Building RPG Maker MV package..."

MV_DIR="$BUILD_DIR/rpg-mv-cheat-$VERSION"
mkdir -p "$MV_DIR/www/js"
mkdir -p "$MV_DIR/www/cheat"
mkdir -p "$MV_DIR/www/cheat-settings"

# Copy main.js for MV
cp cheat-engine/www/_cheat_initialize/mv/js/main.js "$MV_DIR/www/js/"

# Copy entire cheat directory
cp -r cheat-engine/www/cheat/* "$MV_DIR/www/cheat/"

# Create version description
cat > "$MV_DIR/www/cheat-version-description.json" << EOF
{
  "version": "$VERSION",
  "game": "RPG Maker MV",
  "features": [
    "Enhanced Translation System (Ollama, Google, DeepL)",
    "Bookmark System for Items and Variables",
    "Item Lock System",
    "Smart Scroll Position",
    "Give All Button per Category"
  ]
}
EOF

# Copy documentation
cp README.md "$MV_DIR/"
cp FEATURES.md "$MV_DIR/"
cp TESTING.md "$MV_DIR/"
cp CHANGELOG.md "$MV_DIR/"
cp LICENSE "$MV_DIR/"

# Create README for MV
cat > "$MV_DIR/INSTALL.md" << EOF
# Installation Instructions for RPG Maker MV

## Step 1: Backup
Backup your game's \`www/js/main.js\` file before proceeding.

## Step 2: Copy Files
1. Copy the \`www\` folder from this package to your game directory
2. The \`www/js/main.js\` file will be overwritten
3. The \`www/cheat\` folder will be created
4. The \`www/cheat-settings\` folder will be created (for storing settings)

## Step 3: Launch Game
1. Run your game
2. Press \`Ctrl + C\` to open the cheat window
3. Enjoy the enhanced cheat features!

## File Structure After Installation
\`\`\`
{game_directory}/
├── www/
│   ├── js/
│   │   └── main.js (overwritten)
│   ├── cheat/
│   │   ├── components/
│   │   ├── init/
│   │   ├── js/
│   │   ├── libs/
│   │   ├── panels/
│   │   ├── settings/
│   │   └── ...
│   ├── cheat-settings/ (created at runtime)
│   └── cheat-version-description.json
\`\`\`

## Features
- Enhanced translation with multiple providers
- Bookmark frequently used items and variables
- Lock item values to prevent changes
- Smart scroll to last modified item
- Give all items per category

See FEATURES.md for detailed documentation.
EOF

# Create zip for MV
cd "$BUILD_DIR"
zip -r "../$RELEASE_DIR/rpg-mv-cheat-$VERSION.zip" "rpg-mv-cheat-$VERSION"
cd ..

echo "✓ RPG Maker MV package created: $RELEASE_DIR/rpg-mv-cheat-$VERSION.zip"
echo ""

# ============================================
# Build RPG Maker MZ Package
# ============================================
echo "Building RPG Maker MZ package..."

MZ_DIR="$BUILD_DIR/rpg-mz-cheat-$VERSION"
mkdir -p "$MZ_DIR/js"
mkdir -p "$MZ_DIR/cheat"
mkdir -p "$MZ_DIR/cheat-settings"

# Copy main.js for MZ
cp cheat-engine/www/_cheat_initialize/mz/js/main.js "$MZ_DIR/js/"

# Copy entire cheat directory
cp -r cheat-engine/www/cheat/* "$MZ_DIR/cheat/"

# Create version description
cat > "$MZ_DIR/cheat-version-description.json" << EOF
{
  "version": "$VERSION",
  "game": "RPG Maker MZ",
  "features": [
    "Enhanced Translation System (Ollama, Google, DeepL)",
    "Bookmark System for Items and Variables",
    "Item Lock System",
    "Smart Scroll Position",
    "Give All Button per Category"
  ]
}
EOF

# Copy documentation
cp README.md "$MZ_DIR/"
cp FEATURES.md "$MZ_DIR/"
cp TESTING.md "$MZ_DIR/"
cp CHANGELOG.md "$MZ_DIR/"
cp LICENSE "$MZ_DIR/"

# Create README for MZ
cat > "$MZ_DIR/INSTALL.md" << EOF
# Installation Instructions for RPG Maker MZ

## Step 1: Backup
Backup your game's \`js/main.js\` file before proceeding.

## Step 2: Copy Files
1. Copy all folders from this package to your game directory
2. The \`js/main.js\` file will be overwritten
3. The \`cheat\` folder will be created
4. The \`cheat-settings\` folder will be created (for storing settings)

## Step 3: Launch Game
1. Run your game
2. Press \`Ctrl + C\` to open the cheat window
3. Enjoy the enhanced cheat features!

## File Structure After Installation
\`\`\`
{game_directory}/
├── js/
│   └── main.js (overwritten)
├── cheat/
│   ├── components/
│   ├── init/
│   ├── js/
│   ├── libs/
│   ├── panels/
│   ├── settings/
│   └── ...
├── cheat-settings/ (created at runtime)
└── cheat-version-description.json
\`\`\`

## Features
- Enhanced translation with multiple providers
- Bookmark frequently used items and variables
- Lock item values to prevent changes
- Smart scroll to last modified item
- Give all items per category

See FEATURES.md for detailed documentation.
EOF

# Create zip for MZ
cd "$BUILD_DIR"
zip -r "../$RELEASE_DIR/rpg-mz-cheat-$VERSION.zip" "rpg-mz-cheat-$VERSION"
cd ..

echo "✓ RPG Maker MZ package created: $RELEASE_DIR/rpg-mz-cheat-$VERSION.zip"
echo ""

# ============================================
# Create Release Summary
# ============================================
cat > "$RELEASE_DIR/RELEASE_NOTES.md" << EOF
# Release Notes - Version $VERSION

## New Features

### 1. Enhanced Translation System
- Ollama provider (local AI translation)
- Google Translate provider
- DeepL provider (requires API key)
- Configurable source and target languages
- Support for 20+ languages

### 2. Bookmark System
- Bookmark items, weapons, armors, and variables
- "Only Bookmarked" filter
- Persistent bookmarks

### 3. Item Lock System
- Lock item values to prevent changes
- Auto-restore locked values in-game
- Perfect for unlimited items

### 4. Smart Scroll Position
- Remembers last modified item
- Auto-scrolls when reopening panel
- No more searching for items

### 5. Give All Feature
- Category-specific "Give All" button
- One-click to get all items/weapons/armors
- Context-aware per tab

## Downloads

- **rpg-mv-cheat-$VERSION.zip** - For RPG Maker MV games
- **rpg-mz-cheat-$VERSION.zip** - For RPG Maker MZ games

## Installation

Extract the appropriate zip file and follow the INSTALL.md instructions included in the package.

## Documentation

- README.md - General information
- FEATURES.md - Detailed feature documentation
- TESTING.md - Testing guide
- CHANGELOG.md - Complete change log
- INSTALL.md - Installation instructions

## Requirements

- RPG Maker MV or MZ game
- NW.js version 0.26.4 or higher
- For translation features: appropriate translation server running

## Support

For issues and questions, please visit the GitHub repository.
EOF

echo "✓ Release notes created: $RELEASE_DIR/RELEASE_NOTES.md"
echo ""

# ============================================
# Summary
# ============================================
echo "=========================================="
echo "Build Complete!"
echo "=========================================="
echo ""
echo "Release packages created in: $RELEASE_DIR/"
ls -lh "$RELEASE_DIR/"
echo ""
echo "Package sizes:"
du -h "$RELEASE_DIR"/*.zip
echo ""
echo "Ready for release!"
