const { parseDate, withinDates } = require('../util');
const RotatingPlaylist = require('./RotatingPlaylist');
const SplitPlaylist = require('./SplitPlaylist');
const SingleItemPlaylist = require('./SingleItemPlaylist');
const PlaylistItem = require('./PlaylistItem');
const Playlist = require('./Playlist');

/** Represents a Apex Legends season. */
class Season {
    /**
     * Parse a Season object from JSON.
     * @param {seasonData} seasonData Apex Legends season data
     */
    constructor (seasonData) {
        /**
         * The season number (e.g. `12`).
         * @type {number}
         */
        this.id = seasonData.id;

        /**
         * The title of the season (e.g. `Defiance`).
         * @type {string}
         */
        this.name = seasonData.name;

        /**
         * The time at which the season starts.
         * @type {date}
         */
        this.startTime = parseDate(seasonData.startTime);

        /**
         * The time at which the season ends.
         * @type {date}
         */
        this.endTime = parseDate(seasonData.endTime);

        /**
         * Array of {@link Playlist}s for this season.
         * @type {Playlist[]}
         */
        this.playlists = (()=>{
            // Array of standard playlists
            const availablePlaylists = [...seasonData.playlists]
                .map(playlist => this.parsePlaylist(playlist));

            // Array of LTM playlists if available, else empty array
            const availableLTMs = seasonData.LTMs
                ? [...seasonData.LTMs]
                    .map(ltm => this.parsePlaylist({...ltm, LTM: true}))
                : [];

            // return combined standard and LTM playlists
            return [
                ...availablePlaylists,
                ...availableLTMs,
            ];
        })();
    };

    /**
     * Alias for Play Apex mode.
     *
     * @readonly
     * @memberof Season
     * @deprecated
     * @todo remove this alias?
     */
    get unranked() {
        return {
            battleRoyale: this.playlists
                .find(playlist => playlist.mode == 'Play Apex')
        };
    };

    /**
     * Alias for Ranked Leagues.
     *
     * @readonly
     * @memberof Season
     * @deprecated
     * @todo remove this alias?
     */
    get ranked() {
        return {
            battleRoyale: this.playlists
                .find(playlist => playlist.mode == 'Ranked Leagues')
        };
    };

    /**
     * Gets an array of current playlists via this instance's
     * [getPlaylistsByDate]{@link Season#getPlaylistsByDate} method.
     *
     * @readonly
     * @memberof Season
     */
    get currentPlaylists() {
        return this.getPlaylistsByDate();
    };

    /**
     * Gets an array of current maps from this instance's
     * [getMapsByDate]{@link Season#getMapsByDate} method.
     *
     * @readonly
     * @memberof Season
     */
    get currentMaps() {
        return this.getMapsByDate();
    };

    /**
     * Gets an array containing the upcoming {@link PlaylistItem}s for each
     * {@link Playlist} by calling the `.nextMap` method on each instance
     * (depending on playlist type, e.g. {@link RotatingPlaylist#nextMap}).
     * Takes into account whether a takeover LTM is about to end and will
     * attempt to replace this entry with the 'regular' mode map.
     *
     * @readonly
     * @memberof Season
     * @type {?PlaylistItem[]}
     */
    get nextMaps() {
        let nextMaps = this.playlists
            .map(playlist => playlist.nextMap)
            .filter(map => map !== null);

        if (this.currentTakeovers) this.currentTakeovers.forEach(takeover => {
            nextMaps = nextMaps.filter(map => map.mode !== takeover.replaces);
            nextMaps.push(this.playlists
                .find(playlist => playlist.mode === takeover.replaces)
                .getMapByDate(takeover.endTime)
            );
        });

        if (!nextMaps.length) return null;
        return nextMaps;
    };

    /**
     * Array of limited time modes for this season, or {@link null} if none found.
     *
     * @readonly
     * @memberof Season
     * @type {?Playlist[]}
     */
    get LTMs() {
        const availableLTMs = this.playlists.filter(playlist => playlist.LTM);
        if (!availableLTMs.length) return null;
        return availableLTMs;
    };

    /**
     * Array of currently-active limited time modes, or {@link null} if none found.
     *
     * @readonly
     * @memberof Season
     * @type {?Playlist[]}
     */
    get currentLTMs() {
        if (!this.LTMs) return null;
        const currentLTMs = this.LTMs
            .filter(ltm => withinDates(ltm));
        if (currentLTMs.length === 0) return null;
        return currentLTMs;
    };

    /**
     * Array of limited time modes in this season which replace another mode, or
     * {@link null} if none found.
     *
     * @readonly
     * @memberof Season
     * @type {?Playlist[]}
     */
    get takeovers() {
        if (!this.LTMs) return null;
        const takeovers = this.LTMs.filter(ltm => ltm.takeover);
        if (!takeovers.length) return null;
        return takeovers;
    };

    /**
     * Array of currently-active limited time modes which replace another
     * playlist in the season, or {@link null} if none found.
     *
     * @readonly
     * @memberof Season
     * @type {?Playlist[]}
     */
    get currentTakeovers() {
        if (!this.takeovers) return null;
        const now = new Date();
        const currentTakeovers = this.takeovers
            .filter(takeover => withinDates(takeover));
        if (!currentTakeovers.length) return null;
        return currentTakeovers;
    };

    /**
     * Take playlist data and parse into an instance of a {@link Playlist}
     * subclass, determined by querying sections of the data.
     *
     * @todo move into a private or static method
     * @param {playlistData} playlistData data for this playlist
     * @returns {SingleItemPlaylist|RotatingPlaylist|SplitPlaylist}
     */
    parsePlaylist(playlistData) {
        if (playlistData.splitTime)
            return new SplitPlaylist(playlistData, this);
        if (playlistData.mapDurations)
            return new RotatingPlaylist(playlistData, this);
        if (playlistData.maps.length === 1)
            return new SingleItemPlaylist(playlistData, this);
    };

    /**
     * Get an array of {@link Playlist} subclass instances active during the
     * provided date, or the current date if not provided. Returns {@link null}
     * if none found.
     *
     * @param {parseableDate} date the query date
     * @returns {?Playlist[]} active playlists or {@link null}
     */
    getPlaylistsByDate(date) {
        const targetDate = parseDate(date);
        let availablePlaylists = this.playlists
            .filter(playlist => withinDates(playlist, targetDate));

        const takeovers = availablePlaylists
            .filter(playlist => playlist.takeover);

        takeovers.forEach(takeover => availablePlaylists = availablePlaylists
            .filter(playlist => playlist.mode !== takeover.replaces));

        if (availablePlaylists.length === 0) return null;
        return availablePlaylists;
    };

    /**
     * Get an Array of maps active at a given date, or the current date if not
     * provided. Returns {@link null} if outside of season date boundaries.
     *
     * @todo should return null if no maps found.
     *
     * @param {parseableDate} [date=new Date()] the query date
     * @returns {?ScheduledPlaylistItem[]} an array of maps or {@link null}
     */
    getMapsByDate(date) {
        if (!withinDates(this, date)) return null;
        const targetDate = parseDate(date);
        return this.getPlaylistsByDate(targetDate)
            .map(playlist => playlist.getMapByDate(targetDate));
    };
};

module.exports = Season;
