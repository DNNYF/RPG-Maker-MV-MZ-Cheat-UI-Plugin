import {KeyValueStorage} from './KeyValueStorage.js'

class BookmarkStorage {
    constructor () {
        this.kvStorage = new KeyValueStorage('./www/cheat-settings/bookmarks.json')
        this.__readBookmarks()
    }

    __readBookmarks () {
        const json = this.kvStorage.getItem('data')

        if (!json) {
            this.data = {
                variables: [],
                items: [],
                weapons: [],
                armors: []
            }
            return
        }

        this.data = JSON.parse(json)
    }

    __writeBookmarks () {
        this.kvStorage.setItem('data', JSON.stringify(this.data))
    }

    // Variable bookmarks
    addVariableBookmark (variableId) {
        if (!this.data.variables.includes(variableId)) {
            this.data.variables.push(variableId)
            this.__writeBookmarks()
        }
    }

    removeVariableBookmark (variableId) {
        const index = this.data.variables.indexOf(variableId)
        if (index > -1) {
            this.data.variables.splice(index, 1)
            this.__writeBookmarks()
        }
    }

    isVariableBookmarked (variableId) {
        return this.data.variables.includes(variableId)
    }

    getVariableBookmarks () {
        return this.data.variables.slice()
    }

    // Item bookmarks
    addItemBookmark (itemId) {
        if (!this.data.items.includes(itemId)) {
            this.data.items.push(itemId)
            this.__writeBookmarks()
        }
    }

    removeItemBookmark (itemId) {
        const index = this.data.items.indexOf(itemId)
        if (index > -1) {
            this.data.items.splice(index, 1)
            this.__writeBookmarks()
        }
    }

    isItemBookmarked (itemId) {
        return this.data.items.includes(itemId)
    }

    getItemBookmarks () {
        return this.data.items.slice()
    }

    // Weapon bookmarks
    addWeaponBookmark (weaponId) {
        if (!this.data.weapons.includes(weaponId)) {
            this.data.weapons.push(weaponId)
            this.__writeBookmarks()
        }
    }

    removeWeaponBookmark (weaponId) {
        const index = this.data.weapons.indexOf(weaponId)
        if (index > -1) {
            this.data.weapons.splice(index, 1)
            this.__writeBookmarks()
        }
    }

    isWeaponBookmarked (weaponId) {
        return this.data.weapons.includes(weaponId)
    }

    getWeaponBookmarks () {
        return this.data.weapons.slice()
    }

    // Armor bookmarks
    addArmorBookmark (armorId) {
        if (!this.data.armors.includes(armorId)) {
            this.data.armors.push(armorId)
            this.__writeBookmarks()
        }
    }

    removeArmorBookmark (armorId) {
        const index = this.data.armors.indexOf(armorId)
        if (index > -1) {
            this.data.armors.splice(index, 1)
            this.__writeBookmarks()
        }
    }

    isArmorBookmarked (armorId) {
        return this.data.armors.includes(armorId)
    }

    getArmorBookmarks () {
        return this.data.armors.slice()
    }
}

export const BOOKMARK_STORAGE = new BookmarkStorage()
