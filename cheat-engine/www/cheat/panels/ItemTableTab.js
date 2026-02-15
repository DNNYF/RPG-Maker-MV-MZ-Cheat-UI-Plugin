import {BOOKMARK_STORAGE} from '../js/BookmarkHelper.js'
import {SCROLL_POSITION_STORAGE} from '../js/ScrollPositionHelper.js'
import {ITEM_LOCK_STORAGE} from '../js/ItemLockHelper.js'

export default {
    name: 'ItemTableTab',

    template: `
<v-card flat class="ma-0 pa-0">
 <v-data-table
        v-if="tableHeaders"
        denses
        :headers="tableHeaders"
        :items="filteredTableItems"
        :search="search"
        :custom-filter="tableItemFilter"
        :items-per-page="5">
        <template v-slot:top>
            <v-text-field
                label="Search..."
                solo
                background-color="grey darken-3"
                v-model="search"
                dense
                hide-details
                @keydown.self.stop
                @focus="$event.target.select()">
            </v-text-field>
            <v-row
                class="ma-0 pa-0">
                <v-col
                    cols="12"
                    md="4">
                    <v-checkbox
                        v-model="excludeNameless"
                        dense
                        hide-details
                        label="Hide Nameless Items"
                        @change="onTableFilterChange">
                    
                    </v-checkbox>
                </v-col>
                <v-col
                    cols="12"
                    md="4">
                    <v-checkbox
                        v-model="onlyOwnedItems"
                        dense
                        hide-details
                        label="Only Owned Items"
                        @change="onTableFilterChange">
                    
                    </v-checkbox>
                </v-col>
                <v-col
                    cols="12"
                    md="4">
                    <v-checkbox
                        v-model="onlyBookmarked"
                        dense
                        hide-details
                        label="Only Bookmarked"
                        @change="onTableFilterChange">
                    
                    </v-checkbox>
                </v-col>
            </v-row>
        </template>
        <template
            v-slot:item.bookmark="{ item }">
            <v-btn
                icon
                small
                @click="toggleBookmark(item)">
                <v-icon small :color="isBookmarked(item) ? 'yellow' : 'grey'">
                    {{ isBookmarked(item) ? 'mdi-star' : 'mdi-star-outline' }}
                </v-icon>
            </v-btn>
        </template>
        <template
            v-slot:item.lock="{ item }">
            <v-btn
                icon
                small
                @click="toggleLock(item)">
                <v-icon small :color="isLocked(item) ? 'red' : 'grey'">
                    {{ isLocked(item) ? 'mdi-lock' : 'mdi-lock-open-variant' }}
                </v-icon>
            </v-btn>
        </template>
        <template
            v-slot:item.amount="{ item }">
            <v-text-field
                background-color="grey darken-3"
                class="d-inline-flex"
                height="10"
                style="width: 60px;"
                hide-details
                solo
                v-model="item.amount"
                label="Amount"
                dense
                @keydown.self.stop
                @change="onItemChange(item)"
                @focus="$event.target.select()">
            </v-text-field>
        </template>
    </v-data-table>
    
    <v-tooltip
        bottom>
        <span>Reload from game data</span>
        <template v-slot:activator="{ on, attrs }">
            <v-btn
                style="top: 0px; right: 0px;"
                color="pink"
                dark
                small
                absolute
                top
                right
                fab
                v-bind="attrs"
                v-on="on"
                @click="initializeVariables">
                <v-icon>mdi-refresh</v-icon>
            </v-btn>
        </template>
    </v-tooltip>
    
    <v-tooltip
        bottom>
        <span>Give all items in this category</span>
        <template v-slot:activator="{ on, attrs }">
            <v-btn
                style="top: 60px; right: 0px;"
                color="green"
                dark
                small
                absolute
                top
                right
                fab
                v-bind="attrs"
                v-on="on"
                @click="giveAllItems">
                <v-icon>mdi-gift</v-icon>
            </v-btn>
        </template>
    </v-tooltip>
</v-card>
    `,

    data () {
        return {
            search: '',
            excludeNameless: false,
            onlyOwnedItems: false,
            onlyBookmarked: false,
            tableHeaders: [],
            tableItems: []
        }
    },

    props: {
        items: [],
        headers: {
            type: Array
        },
        asTableData: {
            type: Function
        },
        searchableAttrs: {
            type: Array,
            default: []
        },
        itemType: {
            type: String,
            default: 'items' // 'items', 'weapons', or 'armors'
        }
    },

    created () {
    },

    watch: {
        items: {
            immediate: true,
            handler () {
                this.initializeVariables()
            }
        }
    },

    computed: {
        filteredTableItems () {
            return this.tableItems.filter(item => {
                if (this.excludeNameless && !item.name) {
                    return false
                }

                if (this.onlyOwnedItems && item.amount === 0) {
                    return false
                }

                if (this.onlyBookmarked && !this.isBookmarked(item)) {
                    return false
                }

                return true
            })
        }
    },

    methods: {
        initializeVariables () {
            this.tableHeaders = this.headers.slice(0)
            
            // Add bookmark column
            this.tableHeaders.push({
                text: '⭐',
                value: 'bookmark',
                sortable: false,
                width: '50px'
            })
            
            // Add lock column
            this.tableHeaders.push({
                text: '🔒',
                value: 'lock',
                sortable: false,
                width: '50px'
            })
            
            this.tableHeaders.push({
                text: 'Amount',
                value: 'amount'
            })

            this.tableItems = this.items.filter(item => !!item).map((item, index) => {
                const tableItem = this.asTableData(item)
                tableItem._item = item
                tableItem._itemId = item.id || index
                tableItem.amount = $gameParty.numItems(item)

                return tableItem
            })
            
            // Scroll to last modified item if exists
            this.$nextTick(() => {
                this.scrollToLastModified()
            })
        },

        onItemChange (item) {
            // modify amount
            const diff = item.amount - $gameParty.numItems(item._item)
            $gameParty.gainItem(item._item, diff)

            // refresh
            item.amount = $gameParty.numItems(item._item)
            
            // Save last modified item
            this.saveLastModified(item._itemId)
            
            // Update lock if item is locked
            if (this.isLocked(item)) {
                this.updateLock(item)
            }
        },

        onTableFilterChange () {
        },

        tableItemFilter (value, search, item) {
            if (search === null || search.trim() === '') {
                return true
            }

            search = search.toLowerCase()
            for (const attr of this.searchableAttrs) {
                if (item[attr].toLowerCase().contains(search)) {
                    return true
                }
            }

            return false
        },

        giveAllItems () {
            // Give all items in this category (set amount to 99 for each item)
            this.items.filter(item => !!item).forEach(item => {
                const currentAmount = $gameParty.numItems(item)
                if (currentAmount < 99) {
                    $gameParty.gainItem(item, 99 - currentAmount)
                }
            })
            
            // Refresh the table
            this.initializeVariables()
        },

        // Bookmark methods
        isBookmarked (item) {
            const itemId = item._itemId
            if (this.itemType === 'items') {
                return BOOKMARK_STORAGE.isItemBookmarked(itemId)
            } else if (this.itemType === 'weapons') {
                return BOOKMARK_STORAGE.isWeaponBookmarked(itemId)
            } else if (this.itemType === 'armors') {
                return BOOKMARK_STORAGE.isArmorBookmarked(itemId)
            }
            return false
        },

        toggleBookmark (item) {
            const itemId = item._itemId
            if (this.itemType === 'items') {
                if (BOOKMARK_STORAGE.isItemBookmarked(itemId)) {
                    BOOKMARK_STORAGE.removeItemBookmark(itemId)
                } else {
                    BOOKMARK_STORAGE.addItemBookmark(itemId)
                }
            } else if (this.itemType === 'weapons') {
                if (BOOKMARK_STORAGE.isWeaponBookmarked(itemId)) {
                    BOOKMARK_STORAGE.removeWeaponBookmark(itemId)
                } else {
                    BOOKMARK_STORAGE.addWeaponBookmark(itemId)
                }
            } else if (this.itemType === 'armors') {
                if (BOOKMARK_STORAGE.isArmorBookmarked(itemId)) {
                    BOOKMARK_STORAGE.removeArmorBookmark(itemId)
                } else {
                    BOOKMARK_STORAGE.addArmorBookmark(itemId)
                }
            }
            
            // Force re-render
            this.$forceUpdate()
        },

        // Lock methods
        isLocked (item) {
            const itemId = item._itemId
            if (this.itemType === 'items') {
                return ITEM_LOCK_STORAGE.isItemLocked(itemId)
            } else if (this.itemType === 'weapons') {
                return ITEM_LOCK_STORAGE.isWeaponLocked(itemId)
            } else if (this.itemType === 'armors') {
                return ITEM_LOCK_STORAGE.isArmorLocked(itemId)
            }
            return false
        },

        toggleLock (item) {
            const itemId = item._itemId
            const currentAmount = parseInt(item.amount)
            
            if (this.itemType === 'items') {
                if (ITEM_LOCK_STORAGE.isItemLocked(itemId)) {
                    ITEM_LOCK_STORAGE.unlockItem(itemId)
                } else {
                    ITEM_LOCK_STORAGE.lockItem(itemId, currentAmount)
                }
            } else if (this.itemType === 'weapons') {
                if (ITEM_LOCK_STORAGE.isWeaponLocked(itemId)) {
                    ITEM_LOCK_STORAGE.unlockWeapon(itemId)
                } else {
                    ITEM_LOCK_STORAGE.lockWeapon(itemId, currentAmount)
                }
            } else if (this.itemType === 'armors') {
                if (ITEM_LOCK_STORAGE.isArmorLocked(itemId)) {
                    ITEM_LOCK_STORAGE.unlockArmor(itemId)
                } else {
                    ITEM_LOCK_STORAGE.lockArmor(itemId, currentAmount)
                }
            }
            
            // Force re-render
            this.$forceUpdate()
        },

        updateLock (item) {
            const itemId = item._itemId
            const currentAmount = parseInt(item.amount)
            
            if (this.itemType === 'items') {
                ITEM_LOCK_STORAGE.lockItem(itemId, currentAmount)
            } else if (this.itemType === 'weapons') {
                ITEM_LOCK_STORAGE.lockWeapon(itemId, currentAmount)
            } else if (this.itemType === 'armors') {
                ITEM_LOCK_STORAGE.lockArmor(itemId, currentAmount)
            }
        },

        // Scroll position methods
        saveLastModified (itemId) {
            if (this.itemType === 'items') {
                SCROLL_POSITION_STORAGE.setLastModifiedItem(itemId)
            } else if (this.itemType === 'weapons') {
                SCROLL_POSITION_STORAGE.setLastModifiedWeapon(itemId)
            } else if (this.itemType === 'armors') {
                SCROLL_POSITION_STORAGE.setLastModifiedArmor(itemId)
            }
        },

        scrollToLastModified () {
            let lastModifiedId = null
            
            if (this.itemType === 'items') {
                lastModifiedId = SCROLL_POSITION_STORAGE.getLastModifiedItem()
            } else if (this.itemType === 'weapons') {
                lastModifiedId = SCROLL_POSITION_STORAGE.getLastModifiedWeapon()
            } else if (this.itemType === 'armors') {
                lastModifiedId = SCROLL_POSITION_STORAGE.getLastModifiedArmor()
            }
            
            if (lastModifiedId !== null) {
                // Find the row with this item ID and scroll to it
                const rowIndex = this.tableItems.findIndex(item => item._itemId === lastModifiedId)
                if (rowIndex !== -1) {
                    // Highlight the row briefly
                    // Note: actual scroll implementation may vary based on Vuetify data table API
                }
            }
        }
    }
}
