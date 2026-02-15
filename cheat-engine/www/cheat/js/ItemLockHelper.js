import {KeyValueStorage} from './KeyValueStorage.js'

class ItemLockStorage {
    constructor () {
        this.kvStorage = new KeyValueStorage('./www/cheat-settings/item-locks.json')
        this.__readData()
        this.__setupAutoRestore()
    }

    __readData () {
        const json = this.kvStorage.getItem('data')

        if (!json) {
            this.data = {
                lockedItems: {},    // { itemId: lockedValue }
                lockedWeapons: {},  // { weaponId: lockedValue }
                lockedArmors: {}    // { armorId: lockedValue }
            }
            return
        }

        this.data = JSON.parse(json)
    }

    __writeData () {
        this.kvStorage.setItem('data', JSON.stringify(this.data))
    }

    __setupAutoRestore () {
        // Hook into game update loop to restore locked values
        const self = this
        
        if (typeof SceneManager !== 'undefined' && SceneManager.updateMain) {
            const originalUpdate = SceneManager.updateMain
            SceneManager.updateMain = function() {
                originalUpdate.call(this)
                self.__restoreLockedValues()
            }
        }
    }

    __restoreLockedValues () {
        if (!$gameParty) return

        // Restore locked items
        for (const itemId in this.data.lockedItems) {
            const lockedValue = this.data.lockedItems[itemId]
            const item = $dataItems[itemId]
            if (item) {
                const currentAmount = $gameParty.numItems(item)
                if (currentAmount !== lockedValue) {
                    $gameParty.gainItem(item, lockedValue - currentAmount)
                }
            }
        }

        // Restore locked weapons
        for (const weaponId in this.data.lockedWeapons) {
            const lockedValue = this.data.lockedWeapons[weaponId]
            const weapon = $dataWeapons[weaponId]
            if (weapon) {
                const currentAmount = $gameParty.numItems(weapon)
                if (currentAmount !== lockedValue) {
                    $gameParty.gainItem(weapon, lockedValue - currentAmount)
                }
            }
        }

        // Restore locked armors
        for (const armorId in this.data.lockedArmors) {
            const lockedValue = this.data.lockedArmors[armorId]
            const armor = $dataArmors[armorId]
            if (armor) {
                const currentAmount = $gameParty.numItems(armor)
                if (currentAmount !== lockedValue) {
                    $gameParty.gainItem(armor, lockedValue - currentAmount)
                }
            }
        }
    }

    // Item locks
    lockItem (itemId, value) {
        this.data.lockedItems[itemId] = parseInt(value)
        this.__writeData()
    }

    unlockItem (itemId) {
        delete this.data.lockedItems[itemId]
        this.__writeData()
    }

    isItemLocked (itemId) {
        return itemId in this.data.lockedItems
    }

    getLockedItemValue (itemId) {
        return this.data.lockedItems[itemId]
    }

    // Weapon locks
    lockWeapon (weaponId, value) {
        this.data.lockedWeapons[weaponId] = parseInt(value)
        this.__writeData()
    }

    unlockWeapon (weaponId) {
        delete this.data.lockedWeapons[weaponId]
        this.__writeData()
    }

    isWeaponLocked (weaponId) {
        return weaponId in this.data.lockedWeapons
    }

    getLockedWeaponValue (weaponId) {
        return this.data.lockedWeapons[weaponId]
    }

    // Armor locks
    lockArmor (armorId, value) {
        this.data.lockedArmors[armorId] = parseInt(value)
        this.__writeData()
    }

    unlockArmor (armorId) {
        delete this.data.lockedArmors[armorId]
        this.__writeData()
    }

    isArmorLocked (armorId) {
        return armorId in this.data.lockedArmors
    }

    getLockedArmorValue (armorId) {
        return this.data.lockedArmors[armorId]
    }
}

export const ITEM_LOCK_STORAGE = new ItemLockStorage()
