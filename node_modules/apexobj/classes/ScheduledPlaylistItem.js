const PlaylistItem = require('./PlaylistItem');
const { parseDate } = require('../util');

/**
 * A {@link PlaylistItem} with a designated start and end time.
 *
 * @extends PlaylistItem
 */
class ScheduledPlaylistItem extends PlaylistItem {
    /**
     *
     * @param {object} itemData object containing item data
     * @param {string} itemData.mapName the name of the map
     * @param {number} itemData.mapDuration the duration of the map in milliseconds
     * @param {Date} itemData.startTime the time this map rotation starts
     * @param {Playlist} playlist the parent playlist of this item
     */
    constructor({mapName, mapDuration, startTime}, playlist) {
        super({mapName, mapDuration}, playlist);

        /**
         * When this map rotation starts
         * @type {Date}
         */
        this.startTime = parseDate(startTime);

        /**
         * When this map rotation ends
         * @type {Date}
         */
        this.endTime = new Date(this.startTime.getTime() + mapDuration);
    };

    /**
     * The time until (or since the end of) this map rotation. Returns a negative
     * value if the end of this rotation has already passed when called.
     *
     * @type {number}
     * @readonly
     * @memberof ScheduledPlaylistItem
     */
    get timeRemaining() {
        return this.endTime - new Date();
    };
};

module.exports = ScheduledPlaylistItem;
