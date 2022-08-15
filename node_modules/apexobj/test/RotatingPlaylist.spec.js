const { expect } = require('chai');
const MockDate = require('mockdate');


describe('@RotatingPlaylist', function() {

    const data = require('../data/seasons.json');
    const apex = require('../');

    const season11BRData = data.seasons.find(season => season.id === 11)
        .playlists.find(playlist => playlist.mode === 'Play Apex');
    const season11 = apex.seasons.find(season => season.id === 11);
    const season11BR = season11.playlists.find(playlist => playlist.mode === 'Play Apex');

    const season12 = apex.seasons.find(season => season.id === 12);
    const season12ControlData = data
        .seasons.find(season => season.id === 12)
        .LTMs.find(playlist => playlist.mode === 'Control');
    const season12Control = season12.playlists.find(playlist => playlist.mode === 'Control');


    describe('.rotations property', function() {
        it('returns an array', function() {
            expect(season11BR.rotations)
                .to.be.an('array');
        });
        it('returns the correct number of rotations', function() {
            const totalRotations = season11BRData.maps.length * season11BRData.mapDurations.length;
            expect(season11BR.rotations.length).to.equal(totalRotations);
        });
    });

    describe('.rotationBaseTime pseudo property', function() {
        it('returns the baseTime if available', function() {
            expect(season11BR.rotationBaseTime).to.eql(new Date(season11BRData.baseTime));
        });

        it('returns the startTime if baseTime not provided', function() {
            expect(season12Control.rotationBaseTime).to.eql(new Date(season12ControlData.startTime));
        });
    });

    describe('.playlistRotationsDuration pseudo property', function() {
        it('returns the total playlist duration', function() {
            expect(season11BR.playlistRotationsDuration).to.equal(1080 * 60 * 1000);
        });
    });

    describe('.currentIndex pseudo property', function() {

        function check(date, index) {
            MockDate.set(date);
            expect(season11BR.currentIndex)
            .to.equal(index);
            MockDate.reset();
        };

        it('returns the current playlist index', function() {
            // First rotation of the season
            check('2021-11-02T12:00:00Z', 0);
            check('2021-11-03T04:00:00Z', 11);
        });

        it('returns correct responses for season 11', function() {
            check('2022-01-11T12:00:00Z', 5 );
            check('2022-01-11T13:00:00Z', 6 );
            check('2022-01-11T15:00:00Z', 7 );
            check('2022-01-11T17:00:00Z', 8 );
            check('2022-01-11T18:30:00Z', 9 );
            check('2022-01-11T20:00:00Z', 10);
            check('2022-01-11T22:00:00Z', 11);
            check('2022-01-12T00:00:00Z', 0 );
            check('2022-01-12T01:30:00Z', 1 );
            check('2022-01-12T03:00:00Z', 2 );
            check('2022-01-12T04:00:00Z', 3 );
        });
    });

    describe('.currentMap psuedo property', function() {

        it('returns null when out of season', function() {
            MockDate.set(new Date(season11BR.startTime.getTime() - 1000));
            expect(season11BR.currentMap).to.be.null;
            MockDate.reset();

            MockDate.set(new Date(season11BR.endTime.getTime() + 1000));
            expect(season11BR.currentMap).to.be.null;
            MockDate.reset();
        });

        it("provides correct values for Season 11 'Escape'", function() {

            function check(date, mapName, duration, startOverride) {
                const startDate = startOverride ?? date; // to check maps partway through rotations
                MockDate.set(date);
                const testMap = season11BR.currentMap;
                const testStartTime = new Date(startDate);
                const testEndTime = new Date(testStartTime.getTime() + (duration * 60 * 1000));

                // Map and duration properties can be tested simply
                expect(testMap).to.include({
                    map: mapName,
                    duration: duration * 60 * 1000,
                });

                // Dates must be compared using strict equality
                expect(testMap.startTime).to.eql(testStartTime);
                expect(testMap.endTime).to.eql(testEndTime);

                MockDate.reset();
            };

            check('2022-01-11T12:00:00Z',   "World's Edge", 60  )
            check('2022-01-11T13:00:00Z',   "Storm Point",  120 )
            check('2022-01-11T15:00:00Z',   "World's Edge", 120 )
            check('2022-01-11T17:00:00Z',   "Storm Point",  90  )
            check('2022-01-11T18:30:00Z',   "World's Edge", 90  )
            check('2022-01-11T20:00:00Z',   "Storm Point",  120 )
            check('2022-01-11T22:00:00Z',   "World's Edge", 120 )
            check('2022-01-12T00:00:00Z',   "Storm Point",  90  )
            check('2022-01-12T01:30:00Z',   "World's Edge", 90  )
            check('2022-01-12T03:00:00Z',   "Storm Point",  60  )
            check('2022-01-12T04:00:00Z',   "World's Edge", 60  )

            // Half an hour into a map rotation
            check('2022-01-11T12:30:00Z', "World's Edge", 60, '2022-01-11T12:00:00Z');
        });
    });

    describe('.nextMap pseudo property', function() {

        it('returns null if after season end', function() {
            // After season ends
            const afterSeason = new Date(season11BR.endTime.getTime() + 1000);
            MockDate.set(afterSeason);
            expect(season11BR.nextMap).to.be.null;
            MockDate.reset();

            // during the last season rotation
            const duringLastRotation = new Date(season11BR.endTime.getTime() - (1000 * 60 * 30));
            MockDate.set(duringLastRotation);
            expect(season11BR.nextMap).to.be.null;
            MockDate.reset();
        });

        it('returns the first rotation if before season start', function() {
            MockDate.set(season11BR.startTime - 1000);
            expect(season11BR.nextMap).to.eql(season11BR.getMapByDate(season11BR.startTime));
            MockDate.reset()
        });

        it("provides correct values for Season 11 'Escape'", function() {

            function check(date, mapName, duration) {
                MockDate.set(date);
                expect(season11BR.nextMap).to.include({map: mapName, duration: duration * 60 * 1000});
                expect(season11BR.nextMap.startTime).to.eql(season11BR.currentMap.endTime);
                MockDate.reset();
            };

            check('2022-01-11T12:00:00Z',   "Storm Point",  120 )
            check('2022-01-11T13:00:00Z',   "World's Edge", 120 )
            check('2022-01-11T15:00:00Z',   "Storm Point",  90  )
            check('2022-01-11T17:00:00Z',   "World's Edge", 90  )
            check('2022-01-11T18:30:00Z',   "Storm Point",  120 )
            check('2022-01-11T20:00:00Z',   "World's Edge", 120 )
            check('2022-01-11T22:00:00Z',   "Storm Point",  90  )
            check('2022-01-12T00:00:00Z',   "World's Edge", 90  )
            check('2022-01-12T01:30:00Z',   "Storm Point",  60  )
            check('2022-01-12T03:00:00Z',   "World's Edge", 60  )
            check('2022-01-12T04:00:00Z',   "Storm Point",  60  )
        });
    });

    describe('.getIndexByOffset(minutes) method', function() {
        it('gets the rotation index by the given time offset', function() {
            function check(offset, index) {
                const offsetInMs = offset * 60 * 1000;
                return expect(season11BR.getIndexByOffset(offsetInMs)).to.equal(index);
            };

            check(0,    0   );
            check(90,   1   );
            check(180,  2   );
            check(240,  3   );
            check(300,  4   );
            check(360,  5   );
            check(420,  6   );
            check(540,  7   );
            check(660,  8   );
            check(750,  9   );
            check(840,  10  );
            check(960,  11  );
        });
    });

    describe('.getOffsetByIndex(index) method', function() {
        it('gets the minutes offset from the playlist start for the map at the given index', function() {
            function check(index, offset) {
                const offsetInMs = offset * 60 * 1000;
                return expect(season11BR.getOffsetByIndex(index)).to.equal(offsetInMs);
            };

            check(0, 0);
            check(1, 90);
            check(2, 180);
            check(11, 960);
            check(13, 90);
        });
    });

    describe('normaliseIndex(index) method', function() {
        function check(index, normalised) {
            return expect(season11BR.normaliseIndex(index)).to.equal(normalised);
        }
        it("returns the input index if it won't overflow the playlist", function() {
            check(0, 0);
            check(1, 1);
            check(11, 11);
        });

        it('returns a looped index if input index would overflow the playlist', function() {
            check(12, 0);
            check(13, 1);
            check(24, 0);
        });
    });

    describe('.getPlaylistTimeElapsed(date) method', function() {
        it('returns the time elapsed in this playlist rotation', function() {
            expect(season11BR.getPlaylistTimeElapsed('2022-01-24T02:00:00Z'))
                .to.equal(120 * 60 * 1000);
        });
        it('passes regression tests', function() {
            expect(season11BR.getPlaylistTimeElapsed('2022-02-08T00:50:00Z'))
                .to.equal(50 * 60 * 1000);
        });
    });

    describe('.getMapByDate(date) method', function() {

        it('throws if the provided date is invalid', function() {
            expect(()=>season11BR.getMapByDate('zzz')).to.throw()
            expect(()=>season11BR.getMapByDate('2022-01-28T03:00:00Z'))
                .to.not.throw();
        });

        it('uses the current date if none provided', function() {
            MockDate.set('2022-01-11T12:00:00Z');
            expect(season11BR.getMapByDate()).to.include({map: "World's Edge", duration: 60 * 60 * 1000});
            MockDate.reset();
        });

        it('returns null if date out of bounds', function() {
            const beforeSeason = new Date(season11BR.startTime.getTime() - 1000);
            const afterSeason = new Date(season11BR.endTime.getTime() + 1000);
            expect(season11BR.getMapByDate(beforeSeason)).to.be.null;
            expect(season11BR.getMapByDate(afterSeason)).to.be.null;
        });

        it('returns correct maps for Season 11', function() {

            function check(date, mapName, duration) {
                const testMap = season11BR.getMapByDate(date);
                const testStartTime = new Date(date);
                const testEndTime = new Date( new Date(date).getTime() + (duration * 60 * 1000));

                // Map and duration properties can be tested simply
                expect(testMap).to.include({
                    map: mapName,
                    duration: duration * 60 * 1000,
                });

                // Dates must be compared using strict equality
                expect(testMap.startTime).to.eql(testStartTime);
                expect(testMap.endTime).to.eql(testEndTime);
            };

            check('2022-01-11T12:00:00Z',   "World's Edge", 60  )
            check('2022-01-11T13:00:00Z',   "Storm Point",  120 )
            check('2022-01-11T15:00:00Z',   "World's Edge", 120 )
            check('2022-01-11T17:00:00Z',   "Storm Point",  90  )
            check('2022-01-11T18:30:00Z',   "World's Edge", 90  )
            check('2022-01-11T20:00:00Z',   "Storm Point",  120 )
            check('2022-01-11T22:00:00Z',   "World's Edge", 120 )
            check('2022-01-12T00:00:00Z',   "Storm Point",  90  )
            check('2022-01-12T01:30:00Z',   "World's Edge", 90  )
            check('2022-01-12T03:00:00Z',   "Storm Point",  60  )
            check('2022-01-12T04:00:00Z',   "World's Edge", 60  )
        });

        it('passes regression tests', function() {
            MockDate.set('2022-02-08T01:00:00Z')
            expect(season11BR.getMapByDate().timeRemaining)
                .to.equal(30 * 60 * 1000);
            MockDate.reset();
        });
    });
});
