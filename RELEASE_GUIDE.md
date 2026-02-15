# How to Create GitHub Release

This guide explains how to upload the release packages to GitHub releases tab.

## Files to Upload

Two release packages have been created:

1. **rpg-mv-cheat-1.0.0-enhanced.zip** (428 KB)
   - For RPG Maker MV games
   - Contains www/js/main.js and www/cheat/ folder structure

2. **rpg-mz-cheat-1.0.0-enhanced.zip** (428 KB)  
   - For RPG Maker MZ games
   - Contains js/main.js and cheat/ folder structure

## Steps to Create Release

### Option 1: Using GitHub Web Interface

1. **Navigate to Releases**
   - Go to your repository on GitHub
   - Click on "Releases" (right sidebar or top menu)
   - Click "Draft a new release" button

2. **Create New Tag**
   - Tag version: `v1.0.0-enhanced`
   - Target: Select your branch `copilot/add-translation-and-bookmark-features`
   - Release title: `v1.0.0-enhanced - Enhanced Features Update`

3. **Write Release Description**
   Copy and paste from `RELEASE_NOTES.md` or use this template:

```markdown
# v1.0.0-enhanced - Enhanced Features Update

## 🎉 New Features

### 1. Enhanced Translation System
- Ollama provider for local AI translation (any language → any language)
- Google Translate provider (free, no API key needed)
- DeepL provider (high-quality, requires API key)
- Configurable source and target languages
- Support for 20+ languages

### 2. Bookmark System
- Bookmark frequently used items, weapons, armors, and variables
- "Only Bookmarked" filter for quick access
- Persistent bookmarks across sessions

### 3. Item Lock System
- Lock item values to prevent them from changing
- Auto-restore locked values even when items are consumed in-game
- Perfect for unlimited healing potions

### 4. Smart Scroll Position
- Automatically remembers last modified item/variable
- Returns to the same position when reopening cheat panel
- No more scrolling to find what you were working on

### 5. Give All Feature
- Category-specific "Give All" button
- Give all items/weapons/armors in one click
- Context-aware per tab

## 📦 Downloads

Choose the appropriate version for your game:

- **rpg-mv-cheat-1.0.0-enhanced.zip** - For RPG Maker MV games
- **rpg-mz-cheat-1.0.0-enhanced.zip** - For RPG Maker MZ games

## 🔧 Requirements

- RPG Maker MV or MZ game
- NW.js version 0.26.4 or higher (recommended: 0.85.0+)
- For translation features: appropriate translation server running

## 📚 Documentation

Each package includes:
- README.md - General information
- FEATURES.md - Detailed feature documentation
- TESTING.md - Testing guide
- CHANGELOG.md - Complete change log
- INSTALL.md - Installation instructions

## 🚀 Installation

1. Download the appropriate zip file for your game version
2. Extract the zip file
3. Follow the INSTALL.md instructions included in the package
4. Backup your original main.js before copying files

## ⚠️ Important Notes

- **Always backup your game files before installation**
- The main.js file will be overwritten
- Settings are saved in `cheat-settings/` folder
- All features are optional and can be enabled/disabled

## 🐛 Known Issues

None at this time. Please report any issues on GitHub.

## 📝 Full Documentation

For complete documentation, see:
- [FEATURES.md](../FEATURES.md) - Detailed feature guide
- [TESTING.md](../TESTING.md) - Testing instructions
- [CHANGELOG.md](../CHANGELOG.md) - Change log

## 💬 Support

For questions and support, please open an issue on GitHub.
```

4. **Attach Binary Files**
   - Click "Attach binaries by dropping them here or selecting them"
   - Upload both zip files:
     - rpg-mv-cheat-1.0.0-enhanced.zip
     - rpg-mz-cheat-1.0.0-enhanced.zip

5. **Set as Latest Release**
   - Check "Set as the latest release" checkbox
   - This will make it the featured release

6. **Publish Release**
   - Click "Publish release" button
   - The release will be publicly available

### Option 2: Using GitHub CLI (gh)

If you have GitHub CLI installed:

```bash
# Create release
gh release create v1.0.0-enhanced \
  --title "v1.0.0-enhanced - Enhanced Features Update" \
  --notes-file RELEASE_NOTES.md \
  rpg-mv-cheat-1.0.0-enhanced.zip \
  rpg-mz-cheat-1.0.0-enhanced.zip
```

### Option 3: Using Git Command Line

```bash
# Create and push tag
git tag -a v1.0.0-enhanced -m "Enhanced Features Update"
git push origin v1.0.0-enhanced

# Then upload files manually through GitHub web interface
```

## After Publishing

1. **Verify Downloads**
   - Test download links work
   - Verify file sizes are correct
   - Check that documentation is accessible

2. **Update README**
   - Add badge showing latest release
   - Update installation instructions to point to releases
   - Add download links in main README

3. **Announce**
   - Create announcement issue/discussion
   - Update project description
   - Share on relevant communities (if applicable)

## Release Badge

Add this badge to your README.md:

```markdown
[![Latest Release](https://img.shields.io/github/v/release/DNNYF/RPG-Maker-MV-MZ-Cheat-UI-Plugin)](https://github.com/DNNYF/RPG-Maker-MV-MZ-Cheat-UI-Plugin/releases/latest)
```

## Download Links

After publishing, users can download using these URLs:

- Latest MV: `https://github.com/DNNYF/RPG-Maker-MV-MZ-Cheat-UI-Plugin/releases/download/v1.0.0-enhanced/rpg-mv-cheat-1.0.0-enhanced.zip`
- Latest MZ: `https://github.com/DNNYF/RPG-Maker-MV-MZ-Cheat-UI-Plugin/releases/download/v1.0.0-enhanced/rpg-mz-cheat-1.0.0-enhanced.zip`

## Future Releases

To create future releases:

1. Update version in `build-release.sh` (VERSION variable)
2. Run `./build-release.sh` to rebuild packages
3. Update CHANGELOG.md with new changes
4. Follow the same release process with new version number

## Checklist

Before publishing release:

- [ ] Both zip files created successfully
- [ ] Version numbers are correct
- [ ] Documentation is up to date
- [ ] CHANGELOG.md is updated
- [ ] RELEASE_NOTES.md is ready
- [ ] main.js files are correct for MV and MZ
- [ ] All new features are included
- [ ] Build script is tested
- [ ] Installation guides are accurate
- [ ] File sizes are reasonable (~425 KB each)

## Troubleshooting

**Issue:** File size too large for GitHub
- **Solution:** Files are ~425 KB, well under GitHub's 2 GB limit

**Issue:** Upload fails
- **Solution:** Try using GitHub CLI or compress files differently

**Issue:** Release not showing as latest
- **Solution:** Make sure "Set as latest release" is checked

**Issue:** Download links broken
- **Solution:** Verify tag name matches in URLs

---

## Summary

Your release packages are ready! Just:

1. Go to GitHub Releases
2. Click "Draft a new release"
3. Tag: `v1.0.0-enhanced`
4. Upload both zip files
5. Copy release notes
6. Publish!

The packages include all new features and complete documentation. Users can download and install immediately.
