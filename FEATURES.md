# New Features Documentation

This document describes the new features added to the RPG Maker MV/MZ Cheat UI Plugin.

## Table of Contents
1. [Enhanced Translation System](#enhanced-translation-system)
2. [Bookmark System](#bookmark-system)
3. [Item Lock System](#item-lock-system)
4. [Smart Scroll Position](#smart-scroll-position)
5. [Give All Button](#give-all-button)

---

## Enhanced Translation System

### Overview
The translation system now supports multiple translation providers and any-language-to-any-language translation.

### Supported Translation Providers

#### 1. Ollama (Any → Any)
- **Description**: Uses local Ollama AI models for translation
- **Setup**: Install Ollama from https://ollama.ai and run it locally
- **Default Port**: 11434
- **Advantages**: Free, private, works offline

#### 2. Google Translate (Any → Any)
- **Description**: Uses Google Translate API
- **Setup**: No setup required for basic usage
- **Advantages**: Fast, supports many languages
- **Note**: May have rate limits

#### 3. DeepL (Any → Any)
- **Description**: High-quality translation service
- **Setup**: Requires API key from https://www.deepl.com
- **Advantages**: High-quality translations
- **Note**: Requires paid API key

#### 4. ezTransWeb (JP → KR)
- **Description**: Japanese to Korean translation
- **Setup**: Install from https://github.com/HelloKS/ezTransWeb

#### 5. eztrans-server (JP → KR)
- **Description**: Japanese to Korean translation server
- **Setup**: Install from https://github.com/nanikit/eztrans-server

#### 6. Custom Endpoint
- Configure your own translation endpoint with custom URL patterns and request methods

### How to Use

1. Open the cheat window (Ctrl + C)
2. Navigate to "Translate" in the sidebar
3. Enable translation by toggling the "Enable" switch
4. Select your preferred translation provider from the list
5. Configure source and target languages:
   - **Source Language**: Select the language to translate from (or "Auto Detect")
   - **Target Language**: Select the language to translate to
6. Choose what to translate:
   - Variables
   - Switches
   - Maps
7. Adjust bulk translate chunk size if needed
8. The translation will be applied when you navigate to the respective panels

### Language Options
Supported languages include:
- English, Spanish, French, German, Italian
- Portuguese, Russian, Japanese, Korean
- Chinese (Simplified & Traditional)
- Arabic, Hindi, Dutch, Polish
- Turkish, Vietnamese, Thai, Indonesian

---

## Bookmark System

### Overview
Bookmark frequently used items, weapons, armors, and variables for quick access.

### How to Use

#### Bookmarking Items/Weapons/Armors
1. Navigate to the Items, Weapons, or Armors tab
2. Click the star icon (⭐) next to any item to bookmark it
3. The star will turn yellow when bookmarked
4. Click again to remove the bookmark

#### Bookmarking Variables
1. Navigate to the Variables tab
2. Click the star icon (⭐) next to any variable to bookmark it
3. The star will turn yellow when bookmarked
4. Click again to remove the bookmark

#### Viewing Only Bookmarked Items
1. In any of the above tabs, check the "Only Bookmarked" checkbox
2. The table will filter to show only bookmarked items
3. Uncheck to see all items again

### Benefits
- Quick access to frequently modified items/variables
- No need to search for the same items repeatedly
- Bookmarks persist across game sessions

---

## Item Lock System

### Overview
Lock item values to prevent them from changing, even when consumed or used in-game.

### How to Use

1. Navigate to Items, Weapons, or Armors tab
2. Set the desired amount for an item
3. Click the lock icon (🔒) next to the item
4. The lock icon will turn red, indicating the item is locked
5. The item value will be automatically restored if it changes in-game
6. Click the lock icon again to unlock

### Use Cases
- Keep unlimited healing potions
- Maintain weapon/armor quantities
- Prevent accidental item consumption
- Test game mechanics with fixed item counts

### How It Works
- Locked values are automatically restored every game frame
- Locks persist across cheat window closures
- Locks are saved to disk and persist across game restarts

---

## Smart Scroll Position

### Overview
The cheat window now remembers which item or variable you last modified and automatically scrolls to it when you reopen the panel.

### How It Works

1. Modify any item, weapon, armor, or variable
2. Close the cheat window (Ctrl + C)
3. Reopen the cheat window (Ctrl + C)
4. Navigate to the same tab
5. The table will automatically scroll to show the last item you modified

### Benefits
- No more scrolling to find the item you were working on
- Faster workflow when making multiple changes
- Especially useful for long item/variable lists

### Supported Panels
- Items
- Weapons
- Armors
- Variables

---

## Give All Button

### Overview
Quickly give yourself all items in the current category with a single click.

### How to Use

1. Navigate to Items, Weapons, or Armors tab
2. Click the green gift icon (🎁) button in the top-right corner
3. All items in the current category will be set to 99

### Features
- **Context-aware**: Only affects items in the current tab
  - In Items tab: Only gives all items
  - In Weapons tab: Only gives all weapons
  - In Armors tab: Only gives all armors
- **Non-destructive**: Won't reduce quantities you already have
- **Instant**: All items are added immediately

### Use Cases
- Starting a new playthrough with full inventory
- Testing game with all equipment available
- Quickly restocking after using items
- Exploring what items are available in the game

---

## Storage Files

All new features store their data in the following files under `www/cheat-settings/`:

- `bookmarks.json` - Stores bookmarked items, weapons, armors, and variables
- `item-locks.json` - Stores locked item values
- `scroll-positions.json` - Stores last modified items for scroll position restoration
- `translate.json` - Stores translation settings (enhanced with new providers and language settings)

These files are created automatically and persist across game sessions.

---

## Tips and Tricks

1. **Combine Features**: Use bookmarks + locks together to quickly access and maintain your favorite items
2. **Translation Testing**: Try different providers to see which works best for your language pair
3. **Bulk Operations**: Use "Give All" + locks to maintain a full inventory
4. **Workflow**: Bookmark items you frequently modify, lock critical items, and rely on smart scroll for quick access

---

## Troubleshooting

### Translation Not Working
- Check if the translation server is running (look for the status message)
- Verify the correct port and URL in the settings
- Try reducing the bulk translate chunk size
- Make sure source and target languages are properly configured

### Bookmarks Not Saving
- Check that the `www/cheat-settings` folder exists and is writable
- Verify you're in NW.js mode (bookmarks use file system storage)

### Item Lock Not Working
- Verify the item is properly locked (red lock icon)
- Check that SceneManager is running (locks work via game update loop)
- Try unlocking and locking again

### Scroll Position Not Restoring
- Make sure you're opening the same tab where you made modifications
- The feature only works for items you've actually modified
- Clear `scroll-positions.json` if you want to reset this feature

---

## Future Enhancements

Possible future improvements:
- Export/import bookmarks
- Lock variables (not just items)
- Custom lock values beyond 99
- Bookmark groups/categories
- More translation providers
- Translation cache for better performance
