# Testing Guide for New Features

This guide helps you test all the new features added to the RPG Maker MV/MZ Cheat UI Plugin.

## Prerequisites

1. Apply the cheat plugin to an RPG Maker MV or MZ game
2. Start the game
3. Press Ctrl + C to open the cheat window

## Test 1: Bookmark Feature

### For Items/Weapons/Armors

1. Open the cheat window (Ctrl + C)
2. Navigate to Items → Item (or Weapons/Armors)
3. Find any item in the list
4. Click the star icon (⭐) next to the item
5. **Expected**: Star should turn yellow, indicating the item is bookmarked
6. Close and reopen the cheat window
7. **Expected**: The star should still be yellow (bookmark persisted)
8. Check the "Only Bookmarked" checkbox
9. **Expected**: Only bookmarked items should be visible
10. Click the yellow star to unbookmark
11. **Expected**: Star should turn gray and item should disappear from filtered view

### For Variables

1. Navigate to Variables tab
2. Find any variable
3. Click the star icon (⭐) next to it
4. **Expected**: Same behavior as items
5. Test "Only Bookmarked" filter
6. **Expected**: Only bookmarked variables should be visible

**Success Criteria**: 
- Bookmarks persist across cheat window close/open
- Filter works correctly
- Bookmarks saved to `www/cheat-settings/bookmarks.json`

---

## Test 2: Item Lock System

### Basic Locking

1. Navigate to Items → Item
2. Find a healing item (e.g., Potion)
3. Set the amount to 50
4. Click the lock icon (🔒) next to the item
5. **Expected**: Lock icon turns red
6. Press Ctrl + C to close the cheat window
7. In the game, use/consume the item (e.g., use a potion)
8. Press Ctrl + C to reopen the cheat window
9. Navigate back to Items → Item
10. **Expected**: The item amount should still be 50

### Advanced Testing

1. Lock multiple items with different values
2. Try to consume them in-game
3. **Expected**: All locked values should be maintained
4. Change a locked item's value (e.g., from 50 to 100)
5. **Expected**: The lock should update to the new value
6. Unlock an item (click red lock)
7. **Expected**: Lock icon turns gray, item can now be consumed normally

**Success Criteria**:
- Locked items maintain their values even when used
- Locks persist across cheat window close/open
- Lock settings saved to `www/cheat-settings/item-locks.json`

---

## Test 3: Smart Scroll Position

1. Navigate to Items → Item
2. Scroll down to find an item in the middle/bottom of the list
3. Change the item's amount
4. Press Ctrl + C to close the cheat window
5. Press Ctrl + C to reopen
6. Navigate to Items → Item
7. **Expected**: The table should automatically show/highlight the last modified item

### Test with Different Tabs

Repeat the above test for:
- Items → Weapons
- Items → Armors
- Variables

**Success Criteria**:
- Last modified item is remembered per category
- Scroll position restores when reopening the panel
- Last modified IDs saved to `www/cheat-settings/scroll-positions.json`

---

## Test 4: Give All Feature

### Test for Items

1. Navigate to Items → Item
2. Note the current item counts
3. Click the green gift icon (🎁) in the top-right corner
4. **Expected**: All items in the Items category should be set to 99

### Test for Weapons

1. Navigate to Items → Weapon
2. Click the green gift icon (🎁)
3. **Expected**: Only weapons should be set to 99 (items remain unchanged)

### Test for Armors

1. Navigate to Items → Armor
2. Click the green gift icon (🎁)
3. **Expected**: Only armors should be set to 99 (items and weapons remain unchanged)

**Success Criteria**:
- "Give All" only affects the current category
- Items that already have 99 or more are not affected
- Changes reflect immediately in the game

---

## Test 5: Enhanced Translation System

### Test Default Providers

#### ezTransWeb (if available)

1. Install and run ezTransWeb server on localhost:5000
2. Navigate to Translate Settings
3. Enable translation
4. Select "ezTransWeb (JP → KR)"
5. Check if server status shows green
6. Navigate to Variables
7. **Expected**: Japanese variable names should be translated to Korean

#### Ollama (if available)

1. Install and run Ollama on localhost:11434
2. Pull a model: `ollama pull llama2`
3. In Translate Settings, select "Ollama (Any → Any)"
4. Set Source Language to "Japanese"
5. Set Target Language to "English"
6. Enable translation
7. **Expected**: Japanese text should be translated to English

### Test Custom Provider

1. In Translate Settings, select "Custom"
2. Set Method to "GET" or "POST"
3. Enter a custom URL pattern with `${TEXT}` placeholder
4. Configure optional body for POST requests
5. Test with your translation service
6. **Expected**: Translation should work with custom endpoint

### Test Language Selection

1. Select Google Translate (no API key needed)
2. Change Source Language to different options:
   - Auto Detect
   - Japanese
   - Korean
3. Change Target Language to different options:
   - English
   - Spanish
   - French
4. **Expected**: Language parameters should be used in translation

**Success Criteria**:
- Translation status indicator shows correct state
- Different providers work independently
- Language selection affects translation results
- Settings persist in `www/cheat-settings/translate.json`

---

## Test 6: Combined Features

### Bookmark + Lock + Give All

1. Bookmark several healing items
2. Use "Give All" to set all items to 99
3. Lock the bookmarked items
4. Filter to show "Only Bookmarked"
5. Use items in game
6. **Expected**: 
   - Only bookmarked items visible
   - Locked items maintain value of 99
   - Non-bookmarked items can be consumed normally

### Translation + Bookmark

1. Enable translation
2. Bookmark some translated variables
3. Disable translation
4. **Expected**: 
   - Bookmarks still work with original names
   - Bookmarks work with translated names when enabled

---

## Common Issues and Solutions

### Issue: Bookmarks not saving
- **Solution**: Check that `www/cheat-settings/` folder exists and is writable
- **Solution**: Make sure you're running in NW.js mode, not browser mode

### Issue: Item locks not working
- **Solution**: Verify SceneManager is available (game fully loaded)
- **Solution**: Check browser console for JavaScript errors
- **Solution**: Try unlocking and locking again

### Issue: Translation not working
- **Solution**: Verify translation server is running (check status indicator)
- **Solution**: Test server connection manually
- **Solution**: Try reducing chunk size in settings
- **Solution**: Check if source/target languages are supported by provider

### Issue: Scroll position not restoring
- **Solution**: Make sure you're returning to the same tab
- **Solution**: Verify you've actually modified an item before closing
- **Solution**: Check `scroll-positions.json` exists

### Issue: Give All button not working
- **Solution**: Verify you're in a game with items loaded
- **Solution**: Check browser console for errors
- **Solution**: Try refreshing the panel with the refresh button

---

## Verification Checklist

After testing, verify these files exist in `www/cheat-settings/`:

- [ ] `bookmarks.json` - Contains bookmarked items
- [ ] `item-locks.json` - Contains locked item values  
- [ ] `scroll-positions.json` - Contains last modified item IDs
- [ ] `translate.json` - Contains translation settings

## Performance Testing

1. Bookmark 20+ items
2. Lock 10+ items
3. Play the game normally for 5-10 minutes
4. **Expected**: 
   - No noticeable lag or slowdown
   - Locked items maintain their values
   - Game remains playable

---

## Reporting Issues

If you find any bugs, please report them with:

1. Description of the issue
2. Steps to reproduce
3. Expected vs actual behavior
4. Browser console errors (if any)
5. Contents of relevant settings files (bookmarks.json, etc.)
6. Game version (MV or MZ)
7. NW.js version

---

## Success Summary

If all tests pass, you should have:

✅ Working bookmark system for items and variables  
✅ Item lock system that maintains values in-game  
✅ Smart scroll that returns to last modified item  
✅ Category-specific "Give All" feature  
✅ Enhanced translation with multiple providers  
✅ Configurable source and target languages  
✅ All settings persisting across sessions  
✅ Good performance with no lag  

Enjoy the enhanced cheat plugin! 🎮
