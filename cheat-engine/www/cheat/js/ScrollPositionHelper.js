import {KeyValueStorage} from './KeyValueStorage.js'

class ScrollPositionStorage {
    constructor () {
        this.kvStorage = new KeyValueStorage('./www/cheat-settings/scroll-positions.json')
        this.__readData()
    }

    __readData () {
        const json = this.kvStorage.getItem('data')

        if (!json) {
            this.data = {
                lastModified: {
                    variables: null,
                    items: null,
                    weapons: null,
                    armors: null
                }
            }
            return
        }

        this.data = JSON.parse(json)
    }

    __writeData () {
        this.kvStorage.setItem('data', JSON.stringify(this.data))
    }

    setLastModifiedVariable (variableId) {
        this.data.lastModified.variables = variableId
        this.__writeData()
    }

    getLastModifiedVariable () {
        return this.data.lastModified.variables
    }

    setLastModifiedItem (itemId) {
        this.data.lastModified.items = itemId
        this.__writeData()
    }

    getLastModifiedItem () {
        return this.data.lastModified.items
    }

    setLastModifiedWeapon (weaponId) {
        this.data.lastModified.weapons = weaponId
        this.__writeData()
    }

    getLastModifiedWeapon () {
        return this.data.lastModified.weapons
    }

    setLastModifiedArmor (armorId) {
        this.data.lastModified.armors = armorId
        this.__writeData()
    }

    getLastModifiedArmor () {
        return this.data.lastModified.armors
    }
}

export const SCROLL_POSITION_STORAGE = new ScrollPositionStorage()
