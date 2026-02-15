# Changelog

All notable changes to the RPG Maker MV/MZ Cheat UI Plugin will be documented in this file.

## [Unreleased] - 2024

### Added

#### 🌟 Bookmark System
- Add bookmark functionality for items, weapons, armors, and variables
- Bookmark icon (⭐) in all relevant tables
- "Only Bookmarked" filter checkbox to show only bookmarked entries
- Bookmarks persist across sessions via `bookmarks.json`
- Yellow star indicator for bookmarked items
- Support for add/remove bookmarks with single click

#### 🔒 Item Lock System  
- Add item value locking to prevent consumption
- Lock icon (🔒) in item/weapon/armor tables
- Locked items maintain their value even when consumed in-game
- Red lock indicator for locked items
- Auto-restore functionality via game update loop hook
- Lock values persist across sessions via `item-locks.json`
- Performance optimization: skip checks when no items are locked
- Safety check to prevent duplicate hook installation

#### 📍 Smart Scroll Position
- Automatically remember last modified item/variable
- Auto-scroll to last modified entry when reopening panel
- Separate tracking for items, weapons, armors, and variables
- Scroll positions persist via `scroll-positions.json`
- Reduces time spent searching for recently modified entries

#### 🎁 Give All Feature
- Add "Give All" button to item/weapon/armor panels
- Context-aware: only affects current category
- Green gift icon (🎁) button in top-right corner
- Sets all items in category to 99
- Non-destructive: won't reduce quantities below current value

#### 🌐 Enhanced Translation System
- Add support for multiple translation providers:
  - **Ollama**: Local AI translation (any language to any language)
  - **Google Translate**: Free web translation (any language to any language)
  - **DeepL**: High-quality translation (requires API key)
  - Existing: ezTransWeb and eztrans-server (JP → KR)
- Add source language selection (with auto-detect option)
- Add target language selection
- Support for 20+ languages including:
  - English, Spanish, French, German, Italian
  - Portuguese, Russian, Japanese, Korean  
  - Chinese (Simplified & Traditional)
  - Arabic, Hindi, Dutch, Polish
  - Turkish, Vietnamese, Thai, Indonesian
- Dynamic language parameter injection into translation URLs
- Custom endpoint support with language configuration
- Different response format handling per provider
- Configurable chunk sizes per provider

### Changed

#### Translation System
- Updated `TranslateHelper.js` with new providers and language handling
- Enhanced `TranslateSettingsPanel.js` with language selection UI
- Improved translation request building with language parameters
- Better error handling for different API response formats

#### Item Management
- Enhanced `ItemTableTab.js` with bookmark, lock, and scroll features
- Added bookmark and lock columns to all item tables
- Added "Only Bookmarked" filter option
- Improved table header structure

#### Variable Management  
- Enhanced `VariableSettingPanel.js` with bookmark and scroll features
- Added bookmark column to variable table
- Added "Only Bookmarked" filter
- Improved variable modification tracking

#### UI Improvements
- Added icon-based buttons for bookmarks (⭐) and locks (🔒)
- Added "Give All" button with gift icon (🎁)
- Changed checkbox layout from 2 columns to 3 columns in item tables
- Added yellow color for bookmarked items
- Added red color for locked items
- Improved visual feedback for all interactive elements

### Technical Changes

#### New Files Created
- `cheat-engine/www/cheat/js/BookmarkHelper.js` - Bookmark management
- `cheat-engine/www/cheat/js/ItemLockHelper.js` - Item locking system
- `cheat-engine/www/cheat/js/ScrollPositionHelper.js` - Scroll position tracking
- `FEATURES.md` - Comprehensive feature documentation
- `TESTING.md` - Testing guide for all features

#### New Storage Files
- `www/cheat-settings/bookmarks.json` - Bookmark storage
- `www/cheat-settings/item-locks.json` - Item lock storage
- `www/cheat-settings/scroll-positions.json` - Scroll position storage
- Enhanced `www/cheat-settings/translate.json` - Translation settings with language support

#### Modified Files
- `cheat-engine/www/cheat/js/TranslateHelper.js` - Translation provider system
- `cheat-engine/www/cheat/panels/ItemTableTab.js` - Item table component
- `cheat-engine/www/cheat/panels/ItemSettingPanel.js` - Item panel with item-type prop
- `cheat-engine/www/cheat/panels/WeaponSettingPanel.js` - Weapon panel with item-type prop
- `cheat-engine/www/cheat/panels/ArmorSettingPanel.js` - Armor panel with item-type prop
- `cheat-engine/www/cheat/panels/VariableSettingPanel.js` - Variable panel with bookmarks
- `cheat-engine/www/cheat/panels/TranslateSettingsPanel.js` - Translation settings UI
- `README.md` - Updated feature list

### Performance Improvements
- Item lock system only runs when items are actually locked
- Prevented duplicate hook installation in SceneManager
- Optimized bookmark filtering
- Efficient storage using JSON files
- Minimal impact on game performance

### Backward Compatibility
- All new features are optional and don't affect existing functionality
- Existing translation settings are preserved
- New storage files created only when features are used
- Backward compatible with existing `translate.json` files

---

## Usage Examples

### Bookmark Workflow
```
1. Open cheat window → Navigate to Items
2. Click ⭐ on frequently used items
3. Check "Only Bookmarked" to see just those items
4. Modify bookmarked items quickly
```

### Lock Workflow  
```
1. Set Potion amount to 99
2. Click 🔒 to lock it
3. Use potions in game freely
4. Value stays at 99 automatically
```

### Translation Workflow
```
1. Open Translate settings
2. Select "Ollama (Any → Any)"  
3. Set Source: Japanese, Target: English
4. Enable translation
5. Navigate to Variables to see translated names
```

### Give All Workflow
```
1. Navigate to Items → Weapon
2. Click 🎁 button
3. All weapons set to 99 instantly
```

---

## Migration Notes

### For Users of Older Versions

No migration needed! All new features are:
- Opt-in (disabled by default)
- Non-breaking (existing functionality preserved)
- Self-contained (new storage files created as needed)

### Settings Files

If you want to reset any feature:
- Delete corresponding JSON file from `www/cheat-settings/`
- Files will be recreated with default settings on next use

---

## Known Issues

None at this time. Please report any issues you encounter.

---

## Future Enhancements

Potential features for future releases:
- Export/import bookmarks
- Lock variables (not just items)
- Custom lock values beyond 99
- Bookmark groups/categories
- Translation cache for performance
- More translation providers
- Batch lock/unlock operations
- Bookmark sorting and organization

---

## Credits

- Original plugin by paramonos
- New features implemented through community contributions
- Translation providers: Ollama, Google, DeepL, ezTransWeb, eztrans-server

---

## License

Same as the original RPG Maker MV/MZ Cheat UI Plugin project.
