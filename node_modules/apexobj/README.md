# ApexObj

A filterable, queryable object providing data about the game [Apex Legends](https://www.ea.com/games/apex-legends), including:

[x] Start and end times for seasons, playlists, and limited-time modes
[x] Current and next maps per season or playlist
[x] Active maps for a given date

Still to come:

[ ] Support for Arenas mode
[ ] Information on legends
[ ] Random mode/legend generators

Full documentation is available at [https://danfoy.github.io/ApexObj](https://danfoy.github.io/ApexObj).

## Beta information

There may be frequent breaking changes before the project reaches the v1 milestone.

## Basic usage

Install via NPM

```sh
npm install --save apexobj
```

Use as a nodejs module

```js
const apex = require('apexobj')
```

Access data about Apex Legends map locations via the properties and methods on the object.

```js
apex.seasons
// -> list of seasons for which data is available

apex.currentMaps
// -> array of PlaylistItem/ScheduledPlaylistItem(s) describing current maps, or null if no data

apex.nextMaps
// -> as above but with the upcoming map rotations

apex.currentSeason
// -> a Season object describing the current season inc. dates, available playlists etc

apex.getMapsByDate(date)
// -> the map for a specific date in ISO format, e.g. 2022-03-22T17:00:00Z

apex.getSeasonByDate(date)
// -> as above, but for seasons
```

Returned objects are filterable also have their own properties and methods for convenience:

```js
const season = apex.seasons.find(season => season.id === 11);
console.log(`Limited Time Modes for Season ${season.id}${' - ' + season.name}:`, season.LTMs);

const splitTime = season.playlists.find(playlist => playlist.mode === 'Ranked Leagues').splitTime;
console.log(`The ranked split for Season ${season.id} is at ${splitTime}`)
```

See [the documentation](https://danfoy.github.io/ApexObj) for full details on available properties and methods.
