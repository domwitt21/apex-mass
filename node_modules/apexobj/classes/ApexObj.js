const { parseDate } = require('../util');
const Playlist = require('./Playlist');
const ScheduledPlaylistItem = require('./ScheduledPlaylistItem');
const Season = require('./Season');

/**
 * This is the base class for the module, and the first port of call for making
 * queries. All data available for the module is parsed into an object, for
 * which this class is the starting point.
 *
 * It parses information from `/data/seasons.json` and uses this to construct
 * an array of {@link Season} objects. Each is comprised of properties (and
 * psuedo, 'read only' properties retrieved using [getters]{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/get})
 * containing useful information such as start and end times, and an array
 * of playlists available during the season, each constructed from a class
 * which extends the base {@link Playlist} class. Each season and playlist
 * contains further methods for querying current maps and modes available at
 * the time the methods were called or at some specified date.
 */
class ApexObj {
    /**
     * Creates the base object for the module. Throws an error if no data is
     * provided.
     *
     * @param {object} seasonsData data parsed from `/data/seasons.json`
     */
    constructor(seasonsData) {
        if (!seasonsData) throw new Error('No Apex Legends data provided');
        const { seasons } = seasonsData;

        /**
         * Array of seasons
         * @type {Season[]}
         */
        this.seasons = seasons.map(season => new Season(season));
    };

    /**
     * Returns the current {@link Season}, or {@link null} if outside of the date
     * boundaries for available seasons.
     *
     * @readonly
     * @memberof ApexObj
     * @type {?Season}
     */
    get currentSeason() {
        if (new Date() < this.seasons[0].startTime) return null;
        if (new Date() > [...this.seasons].pop().endTime) return null;
        return this.getSeasonByDate();
    };

    /**
     * Returns the next {@link Season} via {@link Season#getSeasonByDate}, or
     * {@link null} if no data available.
     *
     * @readonly
     * @memberof ApexObj
     * @type {?Season}
     */
    get nextSeason() {
        return this.getSeasonByDate(this.currentSeason.endTime);
    };

    /**
     * Returns an array of current maps ({@link PlaylistItem}s), or
     * {@link null} if not called during a season or if no maps are found.
     *
     * @readonly
     * @memberof ApexObj
     * @type {?ScheduledPlaylistItem[]}
     */
    get currentMaps() {
        if (!this.currentSeason) return null;
        return this.currentSeason.currentMaps;
    };

    /**
     * Returns an array of the upcoming maps (as {@link ScheduledPlaylistItem}s)
     * or `null` if none found.
     *
     * @readonly
     * @memberof ApexObj
     * @type {?ScheduledPlaylistItem[]}
     */
    get nextMaps() {
        if (!this.currentSeason) return null;
        return this.currentSeason.nextMaps;
    };

    /**
     * Returns an array of the currently-running limited time modes for the
     * current season, or {@link null} if none found.
     *
     * @readonly
     * @memberof ApexObj
     * @type {?ScheduledPlaylistItem[]}
     */
    get currentLTMs() {
        if (!this.currentSeason) return null;
        return this.currentSeason.currentLTMs;
    };

    /**
     * Returns an array of the current limited time modes which replace
     * 'standard' modes, or {@link null} if none found.
     *
     * @readonly
     * @memberof ApexObj
     * @type {?Playlist[]}
     */
    get currentTakeovers() {
        if (!this.currentSeason) return null;
        return this.currentSeason.currentTakeovers;
    };

    /**
     * Returns the season for the given date, or {@link null} if none found. Uses
     * the current date if none provided.
     *
     * @param {parseableDate} [date=new Date()] the date to query
     * @returns {?Season}
     */
    getSeasonByDate(date) {
        const targetDate = parseDate(date);
        const foundSeason = this.seasons
            .find(season => (season.startTime <= targetDate) && (season.endTime > targetDate))
        return foundSeason || null;
    };

    /**
     * Returns an array of the current maps ({@link ScheduledPlaylistItem}s)
     * for the given date, or {@link null} if none found. Uses the current date
     * if none provided.
     *
     * @param {parseableDate} [date=new Date()]
     * @returns
     */
    getMapsByDate(date) {
        const targetDate = parseDate(date);
        const targetSeason = this.getSeasonByDate(targetDate);
        if (!targetSeason) return null;
        return targetSeason.getMapsByDate(targetDate);
    };
};

module.exports = ApexObj;
