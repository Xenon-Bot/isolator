((window) => {
    const bootstrap = window.__bootstrap;

    const mutation_types = {
        CHANNEL_CREATE: 0,
        CHANNEL_UPDATE: 1,
        CHANNEL_DELETE: 2,
        ROLE_CREATE: 3,
        ROLE_UPDATE: 4,
        ROLE_DELETE: 5,
        GUILD_UPDATE: 6,
        MEMBER_UPDATE: 7,
    }

    class GuildContainer {
        #originalRoles
        #roles

        #originalChannels
        #channels

        #mutations
        #idCounter

        constructor() {
            this.#originalRoles = {}
            this.#originalChannels = {}

            this.reset()
        }

        #addMutation(kind, target_id, data) {
            this.#mutations.push({
                kind: kind,
                target_id: target_id,
                data: JSON.stringify(data)
            })
        }

        reset() {
            this.#roles = JSON.parse(JSON.stringify(this.#originalRoles))
            this.#channels = JSON.parse(JSON.stringify(this.#originalChannels))
            this.#mutations = []
            this.#idCounter = 0
        }

        createChannel(options) {
            const newId = this.#idCounter++
            this.#channels[newId] = options
        }

        editChannel(channel_id, options) {
            if (!this.#channels.hasOwnProperty(channel_id)) return false
            Object.assign(this.#channels[channel_id], options)
            return true
        }

        deleteChannel(channel_id) {
            if (!this.#channels.hasOwnProperty(channel_id)) return false
            delete this.#channels[channel_id]
            this.#addMutation(mutation_types.CHANNEL_DELETE, channel_id)
            return true
        }

        __export() {
            return this.#mutations
        }
    }

    async function applyMutations(container) {
        isolator.makeResourceRequest('apply_mutations', container.__export())
    }

    bootstrap.mutations = {
        GuildContainer,
        applyMutations
    }
})()

