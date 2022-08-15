const { parseDate } = require('../util');
const Playlist = require('./Playlist');
const ScheduledPlaylistItem = require('./ScheduledPlaylistItem');

/**
 * An implementation for playlists which have two maps and change at a
 * designated 'split time', e.g. Ranked Leagues.
 *
 * @extends Playlist
 */
class SplitPlaylist extends Playlist {
    /**
     * Create a split playlist from {@link playlistData}.
     *
     * @param {playlistData} playlistData data for this playlist
     * @param {seasonData} seasonData data for the parent season
     */
    constructor(playlistData, seasonData) {
        super(playlistData, seasonData);

        if(!playlistData.splitTime || !playlistData.maps)
            throw new Error('requires maps and splitTime from playlistData');

        /**
         * The time at which the playlist switches from the first map to the
         * second.
         *
         * @type {date}
         */
        this.splitTime = parseDate(playlistData.splitTime);

        /**
         * Gets the map rotations available in this playlist. As the playlist
         * will only ever have 2 maps, the values are hard-coded and can be
         * accessed predictably using Array indexes.
         *
         * @type {ScheduledPlaylistItem[]}
         */
        this.rotations = [
            new ScheduledPlaylistItem({
                mapName: this.maps[0],
                mapDuration: ((this.splitTime - this.startTime)),
                startTime: this.startTime,
            }, this),
            new ScheduledPlaylistItem({
                mapName: this.maps[1],
                mapDuration: ((this.endTime - this.splitTime)),
                startTime: this.splitTime,
            }, this),
        ];
    };

    /**
     * Gets the current map rotation, or {@link null} if none available (e.g.
     * outside of date boundaries).
     *
     * @readonly
     * @memberof SplitPlaylist
     * @type {?ScheduledPlaylistItem}
     */
    get currentMap() {
        if (new Date() < this.startTime) return null;
        if (new Date() > this.endTime) return null;
        return this.getMapByDate();
    };

    /**
     * Gets the next map rotation, the first map rotation if called before the
     * playlist startTime, or {@link null} if during the last rotation or after
     * the playlist endTime.
     *
     * @readonly
     * @memberof SplitPlaylist
     * @type {?ScheduledPlaylistItem}
     */
    get nextMap() {
        if (new Date() > this.endTime) return null;
        if (new Date() < this.startTime) return this.rotations[0]
        if (this.getMapByDate() == this.rotations[0]) return this.rotations[1];
        return null;
    };

    /**
     * Get the map rotation for a given date, or the current date if none
     * provided, or {@link null} if outside of date boundaries.
     *
     * @param {parseableDate} [date=new Date()] the date to query
     * @returns {?ScheduledPlaylistItem} active map or {@link null}
     */
    getMapByDate(date) {
        const targetDate = parseDate(date);

        if (targetDate < this.startTime) return null;
        if (targetDate > this.endTime) return null;

        return this.rotations.find(rotation =>
            rotation.startTime < targetDate &&
            rotation.endTime > targetDate
        );
    };

};

module.exports = SplitPlaylist;
