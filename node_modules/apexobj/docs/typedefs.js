
/**
 * @typedef {string} dateString
 * @description A string representing a date in a simplified ISO 8601 format,
 *      as recognised by the `Date.parse()` method.
 *
 * @see {@link https://tc39.es/ecma262/#sec-date-time-string-format}
 */

/**
 * @typedef {object} seasonData
 * @description Data parsed from `/data/seasons.json` by importing it as a
 *      CJS module and targeting one element of the array.
 */

/**
 * @typedef {object} playlistData
 * @description Playlist data parsed from `/data/seasons.json` by importing it
 *      as a CJS module and targeting an element of a playlists array.
 */

/**
 * @typedef {dateString|Date} parseableDate
 * @description A value that is in a format that the module is able to convert
 *      into a date. This includes {@link dateString}s and instances of the
 *      [date object]{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date}.
 */

/**
 * @typedef null
 * @description The JavaScript `null` primitive type, used to denote the
 *      deliberate absence of a value. It is used throughout the module because
 *      is useful for conditional tests on properties – it is falsy, unlike an empty
 *      [Array]{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array},
 *      and is distinguishable from the [undefined]{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/undefined}
 *      primitive type, which is useful for testing purposes.
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/null}
 */
