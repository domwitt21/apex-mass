/**
 * Represents an item in a playlist - i.e. a map rotation. Provides a duration
 * property but no start and end times - this is because they are sometimes
 * not available internally, e.g. when building a {@link RotatingPlaylist} but
 * before the start/end times have been calculated. Items for which this
 * information is available should instead be created as instances of the child
 * class {@link ScheduledPlaylistItem}.
 */
class PlaylistItem {
    /**
     * Creates a playlist item (aka a 'map rotation').
     *
     * @param {object} item data about this item
     * @param {string} item.mapName name of the map for this item
     * @param {number} item.mapDuration duration of this rotation in milliseconds
     * @param {Playlist} playlist the parent playlist of this item
     */
    constructor({mapName, mapDuration}, playlist) {

        // Validaton
        if (typeof mapName !== 'string' || mapName == '')
            throw new Error('mapName String required and not provided');
        if (typeof playlist.mode !== 'string' || playlist.mode == '')
            throw new Error('playlist.mode String required and not provided');

        /**
         * Returns the [mode]{@link Playlist#mode} of the {@link Playlist} to
         * which this item belongs (e.g. `Play Apex`, `Ranked Leagues`)
         *
         * @type {string}
         */
        this.mode       = playlist.mode;

        /**
         * Returns the name of the map for this item (e.g. `King's Canyon`).
         * @type {string}
         */
        this.map        = mapName;

        /**
         * Returns the duration of this map rotation in milliseconds.
         * @type {number}
         */
        this.duration   = mapDuration;

        /**
         * Whether the {@link Playlist} this item is from is
         * [ranked]{@link Playlist#ranked}. The property only exists when its
         * value is true.
         *
         * @member {boolean} [ranked]
         * @memberof PlaylistItem
         * @instance
         */
        if (playlist.ranked)    this.ranked     = true;

        /**
         * Whether this item is from a playlist which is an [LTM]{@link Playlist#LTM}.
         * The property only exists when its value is true.
         *
         * @member {boolean} [LTM]
         * @memberof PlaylistItem
         * @instance
         */
        if (playlist.LTM)       this.LTM        = true;

        /**
         * Whether the playlist this item belongs to is a [takeover]{@link Playlist#takeover}
         * [LTM]{@link Playlist#LTM}. This property only exists when its value is true.
         *
         * @member {boolean} [takeover]
         * @memberof PlaylistItem
         * @instance
         */
        if (playlist.takeover)  this.takeover   = true;

        /**
         * When the item's parent {@link Playlist} is a 'takeover LTM'-type
         * playlist, this property returns the name of the playlist this item
         * replaces. This property only exists if the parent playlist has the
         * [replaces]{@link Playlist#replaces} property.
         *
         * @member {string} [replaces]
         * @memberof PlaylistItem
         * @instance
         */
        if (playlist.replaces)  this.replaces   = playlist.replaces;
    };
};

module.exports = PlaylistItem;
