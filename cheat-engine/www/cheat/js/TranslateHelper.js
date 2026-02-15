import {KeyValueStorage} from './KeyValueStorage.js'

export const END_POINT_URL_PATTERN_TEXT_SYMBOL = '${TEXT}'

export const DEFAULT_END_POINTS = {
    ezTransWeb: {
        id: 'ezTransWeb',
        name: 'ezTransWeb (JP → KR)',
        helpUrl: 'https://github.com/HelloKS/ezTransWeb',
        data: {
            method: 'get',
            urlPattern: `http://localhost:5000/translate?text=${END_POINT_URL_PATTERN_TEXT_SYMBOL}`
        }
    },

    ezTransServer: {
        id: 'ezTransServer',
        name: 'eztrans-server (JP → KR)',
        helpUrl: 'https://github.com/nanikit/eztrans-server',
        data: {
            method: 'post',
            urlPattern: `http://localhost:8000`,
            body: END_POINT_URL_PATTERN_TEXT_SYMBOL
        }
    },

    ollama: {
        id: 'ollama',
        name: 'Ollama (Any → Any)',
        helpUrl: 'https://ollama.ai',
        data: {
            method: 'post',
            urlPattern: `http://localhost:11434/api/generate`,
            body: JSON.stringify({
                model: 'llama2',
                prompt: `Translate the following text to English: ${END_POINT_URL_PATTERN_TEXT_SYMBOL}`,
                stream: false
            }),
            isOllama: true
        }
    },

    googleTranslate: {
        id: 'googleTranslate',
        name: 'Google Translate (Any → Any)',
        helpUrl: 'https://cloud.google.com/translate',
        data: {
            method: 'get',
            urlPattern: `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=en&dt=t&q=${END_POINT_URL_PATTERN_TEXT_SYMBOL}`
        }
    },

    deepL: {
        id: 'deepL',
        name: 'DeepL (Any → Any)',
        helpUrl: 'https://www.deepl.com/translator',
        data: {
            method: 'post',
            urlPattern: `https://api-free.deepl.com/v2/translate`,
            body: `auth_key=YOUR_API_KEY&text=${END_POINT_URL_PATTERN_TEXT_SYMBOL}&target_lang=EN`
        }
    }
}

export const RECOMMEND_CHUNK_SIZE = {
    ezTransWeb: 500,
    ezTransServer: 100,
    ollama: 50,
    googleTranslate: 200,
    deepL: 100
}


class Translator {
    constructor (settings) {
        this.settings = settings
    }

    async isAvailable () {
        try {
            await this.__translate('test')
            return true
        } catch (e) {
            return false
        }

    }

    async __translate (text) {
        const epData = this.settings.getEndPointData()

        const realUrl = epData.urlPattern.replace(END_POINT_URL_PATTERN_TEXT_SYMBOL, encodeURI(text))

        if (epData.method === 'get') {
            const response = (await axios.get(realUrl)).data
            
            // Handle Google Translate response format
            if (Array.isArray(response) && response[0] && Array.isArray(response[0])) {
                return response[0].map(item => item[0]).join('')
            }
            
            return response
        } else if (epData.method === 'post') {
            const body = epData.body ? epData.body : ''
            const requestBody = body.replace(END_POINT_URL_PATTERN_TEXT_SYMBOL, text)
            
            let response
            if (epData.isOllama) {
                // Parse JSON body for Ollama
                const bodyObj = JSON.parse(requestBody)
                response = (await axios.post(realUrl, bodyObj)).data
                
                // Handle Ollama response format
                if (response.response) {
                    return response.response
                }
            } else {
                response = (await axios.post(realUrl, requestBody)).data
                
                // Handle DeepL response format
                if (response.translations && Array.isArray(response.translations)) {
                    return response.translations[0].text
                }
            }
            
            return response
        }

        return text
    }

    async __translateBulk (texts) {
        return (await this.translate(texts.join('\n'))).split('\n')
    }

    async translate (text) {
        try {
            return (await this.__translate(text))
        } catch (err) {
            return text
        }
    }

    // async translateBulk (texts) {
    //     texts = texts.map(text => text.replace('\n', ''))
    //
    //     const chunkSize = 100
    //     const textsChunk = []
    //
    //     for (let i = 0; i < texts.length; i += chunkSize) {
    //         textsChunk.push(texts.slice(i, Math.min(texts.length, i + chunkSize)))
    //     }
    //
    //     const ret = [].concat(...await Promise.all(textsChunk.map(chunk => this.__translateBulk(chunk))))
    //     return ret
    // }

    async translateBulk (texts) {
        texts = texts.map(text => text.replace('\n', ''))

        const chunkSize = this.settings.getBulkTranslateChunkSize()
        const textsChunk = []

        for (let i = 0; i < texts.length; i += chunkSize) {
            textsChunk.push(await this.__translateBulk(texts.slice(i, Math.min(texts.length, i + chunkSize))))
        }

        return [].concat(...textsChunk)
    }
}


class TranslateSettings {
    constructor () {
        this.kvStorage = new KeyValueStorage('./www/cheat-settings/translate.json')
        this.__readSettings()
    }

    __readSettings () {
        const json = this.kvStorage.getItem('data')

        if (!json) {
            this.data = {
                enabled: false,

                endPointSelection: 'ezTransWeb',

                customEndPointData: {
                    method: 'get',
                    urlPattern: `http://localhost:5000/translate?text=${END_POINT_URL_PATTERN_TEXT_SYMBOL}`,
                    body: ''
                },

                targets: {
                    items: false,
                    variables: true,
                    switches: true,
                    maps: true,
                },

                bulkTranslateChunkSize: 500,
                
                sourceLanguage: 'auto',
                targetLanguage: 'en'
            }
            return
        }

        this.data = JSON.parse(json)
        
        // Ensure new fields exist for backward compatibility
        if (!this.data.sourceLanguage) {
            this.data.sourceLanguage = 'auto'
        }
        if (!this.data.targetLanguage) {
            this.data.targetLanguage = 'en'
        }
    }

    __writeSettings () {
        this.kvStorage.setItem('data', JSON.stringify(this.data))
    }

    getEndPointData () {
        if (this.getEndPointSelection() === 'custom') {
            return this.getCustomEndPointData()
        }

        return DEFAULT_END_POINTS[this.getEndPointSelection()].data
    }

    setEnabled (flag) {
        this.data.enabled = flag
        this.__writeSettings()
    }

    isEnabled () {
        return this.data.enabled
    }


    getEndPointSelection () {
        return this.data.endPointSelection
    }

    setEndPointSelection (endPointId) {
        this.data.endPointSelection = endPointId
        this.__writeSettings()
    }

    getCustomEndPointData () {
        return this.data.customEndPointData
    }

    setCustomEndPointMethod (method) {
        this.data.customEndPointData.method = method
        this.__writeSettings()
    }

    setCustomEndPointUrlPattern (urlPattern) {
        this.data.customEndPointData.urlPattern = urlPattern
        this.__writeSettings()
    }

    setCustomEndPointBody (body) {
        this.data.customEndPointData.body = body
        this.__writeSettings()
    }

    getBulkTranslateChunkSize() {
        return this.data.bulkTranslateChunkSize
    }

    setBulkTranslateChunkSize (chunkSize) {
        this.data.bulkTranslateChunkSize = chunkSize
        this.__writeSettings()
    }

    getTargets () {
        return this.data.targets
    }

    setTargets (targets) {
        this.data.targets = targets
        this.__writeSettings()
    }

    isItemTranslateEnabled () {
        return this.isEnabled() && this.getTargets().items
    }

    isVariableTranslateEnabled () {
        return this.isEnabled() && this.getTargets().variables
    }

    isSwitchTranslateEnabled () {
        return this.isEnabled() && this.getTargets().switches
    }

    isMapTranslateEnabled () {
        return this.isEnabled() && this.getTargets().maps
    }

    getSourceLanguage () {
        return this.data.sourceLanguage
    }

    setSourceLanguage (lang) {
        this.data.sourceLanguage = lang
        this.__writeSettings()
    }

    getTargetLanguage () {
        return this.data.targetLanguage
    }

    setTargetLanguage (lang) {
        this.data.targetLanguage = lang
        this.__writeSettings()
    }
}

export const TRANSLATE_SETTINGS = new TranslateSettings()
export const TRANSLATOR = new Translator(TRANSLATE_SETTINGS)
