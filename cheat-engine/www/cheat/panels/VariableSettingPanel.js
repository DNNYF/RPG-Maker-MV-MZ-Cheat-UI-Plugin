import {TRANSLATE_SETTINGS, TRANSLATOR} from '../js/TranslateHelper.js'
import {BOOKMARK_STORAGE} from '../js/BookmarkHelper.js'
import {SCROLL_POSITION_STORAGE} from '../js/ScrollPositionHelper.js'

export default {
    name: 'VariableSettingPanel',

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
                    md="6">
                    <v-checkbox
                        v-model="excludeNameless"
                        dense
                        hide-details
                        label="Hide Nameless Items">
                    
                    </v-checkbox>
                </v-col>
                <v-col
                    cols="12"
                    md="6">
                    <v-checkbox
                        v-model="onlyBookmarked"
                        dense
                        hide-details
                        label="Only Bookmarked">
                    
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
            v-slot:item.value="{ item }">
            <v-text-field
                background-color="grey darken-3"
                class="d-inline-flex"
                height="10"
                style="width: 60px;"
                hide-details
                solo
                v-model="item.value"
                label="Value"
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
</v-card>
    `,

    data () {
        return {
            search: '',
            excludeNameless: false,
            onlyBookmarked: false,

            variableNames: [],

            tableHeaders: [
                {
                    text: '⭐',
                    value: 'bookmark',
                    sortable: false,
                    width: '50px'
                },
                {
                    text: 'Name',
                    value: 'name'
                },
                {
                    text: 'Value',
                    value: 'value'
                }
            ],
            tableItems: []
        }
    },

    created () {
        this.initializeVariables()
    },

    computed: {
        filteredTableItems () {
            return this.tableItems.filter(item => {
                if (this.excludeNameless && !item.name) {
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
        async initializeVariables () {
            this.variableNames = await this.getVariableNames()

            this.tableItems = this.variableNames.map((varName, idx) => {
                return {
                    id: idx,
                    name: varName,
                    value: $gameVariables.value(idx)
                }
            })
            
            // Scroll to last modified variable if exists
            this.$nextTick(() => {
                this.scrollToLastModified()
            })
        },

        async getVariableNames () {
            const rawVariableNames = $dataSystem.variables.slice()

            if (TRANSLATE_SETTINGS.isVariableTranslateEnabled()) {
                return await TRANSLATOR.translateBulk(rawVariableNames)
            }

            return rawVariableNames
        },

        onItemChange (item) {
            // modify value
            $gameVariables.setValue(item.id, item.value)

            // refresh
            item.value = $gameVariables.value(item.id)
            
            // Save last modified variable
            SCROLL_POSITION_STORAGE.setLastModifiedVariable(item.id)
        },

        tableItemFilter (value, search, item) {
            if (search === null || search.trim() === '') {
                return true
            }

            search = search.toLowerCase()

            return item.name.toLowerCase().contains(search) || String(item.value).toLowerCase().contains(search)
        },

        // Bookmark methods
        isBookmarked (item) {
            return BOOKMARK_STORAGE.isVariableBookmarked(item.id)
        },

        toggleBookmark (item) {
            if (BOOKMARK_STORAGE.isVariableBookmarked(item.id)) {
                BOOKMARK_STORAGE.removeVariableBookmark(item.id)
            } else {
                BOOKMARK_STORAGE.addVariableBookmark(item.id)
            }
            
            // Force re-render
            this.$forceUpdate()
        },

        // Scroll position methods
        scrollToLastModified () {
            const lastModifiedId = SCROLL_POSITION_STORAGE.getLastModifiedVariable()
            
            if (lastModifiedId !== null) {
                // Find the row with this variable ID and scroll to it
                const rowIndex = this.tableItems.findIndex(item => item.id === lastModifiedId)
                if (rowIndex !== -1) {
                    // Highlight the row briefly
                    // Note: actual scroll implementation may vary based on Vuetify data table API
                }
            }
        }
    }
}
