const { parseDate } = require('../util');

/**
 * Base Playlist class, used as a foundation for the more specialised playlist
 * types. You will rarely if ever see this class used explicitly - refer to the
 * specialised Playlist derivatives for each mode:
 *
 * - {@link SingleItemPlaylist}: Single-map LTMs
 * - {@link RotatingPlaylist}: Play Apex, most LTMs
 * - {@link SplitPlaylist}: Ranked Leagues
 */
class Playlist {
    /**
     * Parses a playlist from {@link playlistData}
     *
     * @param {object} playlistData data for this playlist parsed from `/data/seasons.json`
     * @param {object} seasonData data for the parent season parsed from `/data/seasons.json`
     */
    constructor(playlistData, seasonData) {

        /**
         * The mode of the playlist (e.g. `Play Apex`, `Ranked Leagues`)
         * @type {string}
         */
        this.mode = playlistData.mode;

        /**
         * Whether this playlist is a Limited Time Mode.
         *
         * @member {boolean} [LTM]
         * @memberof Playlist
         * @instance
         */
        if (playlistData.LTM) this.LTM = true;

        /** Whether this playlist is a takeover-style limited time mode (i.e.
         * that it replaces a 'regular' mode for its duration).
         *
         * @member {boolean} [takeover]
         * @memberof Playlist
         * @instance
         */
        if (playlistData.replaces) this.takeover = true;

        /**
         * The 'standard' playlist that is replaced if this playlist is a
         * 'takeover-style'LTM.
         *
         * @member {string} [replaces]
         * @memberof Playlist
         * @instance
         */
        if (playlistData.replaces) this.replaces = playlistData.replaces;


        /**
         * Whether this is a ranked playlist.
         *
         * @member {boolean} [ranked]
         * @memberof Playlist
         * @instance
         */
        if (this.mode.includes("Ranked")) this.ranked = true;

        /**
         * The time to use as base for calculating rotation times. This is
         * needed for some playlists as they appear to start at odd times that
         * don't align with the season start, mode start, or even each other.
         *
         * @member {Date} [baseTime]
         * @memberof Playlist
         * @instance
         */
        if (playlistData.baseTime) this.baseTime = parseDate(playlistData.baseTime);

        /**
         * The time at which this playlist starts.
         * @type {Date}
         */
        this.startTime = playlistData.startTime
            ? parseDate(playlistData.startTime)
            : parseDate(seasonData.startTime);

        /**
         * The time at which this playlist ends.
         * @type {Date}
         */
        this.endTime = playlistData.endTime
            ? parseDate(playlistData.endTime)
            : parseDate(seasonData.endTime);

        /**
         * Array of maps used in this playlist.
         * @type {string[]}
         */
        this.maps = playlistData.maps;
    };

};

module.exports = Playlist;
