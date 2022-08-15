const chai = require('chai');
const { expect } = chai;
chai.use(require('chai-like'));
chai.use(require('chai-things'));
const MockDate = require('mockdate');

const data = require('../data/seasons.json');
const apex = require('../');

const season11data = data.seasons.find(season => season.id === 11);
const season11 = apex.seasons.find(season => season.id === 11);

const season12data = data.seasons.find(season => season.id === 12);
const season12 = apex.seasons.find(season => season.id === 12);

describe('@ApexObj', function() {

    describe('.seasons', function() {

        it('returns an array', function() {
            expect(apex.seasons).to.be.an('array');
        });

        it('parses season data', function() {

            // Season 11
            expect(season11.id).to.equal(season11data.id);
            expect(season11.name).to.equal(season11data.name);
            expect(season11.playlists).to.be.an('array');

            // Season 12
            expect(season12.id).to.equal(season12data.id);
            expect(season12.name).to.equal(season12data.name);
            expect(season12.playlists).to.be.an('array');
        });

    });

    describe('.currentSeason psuedo property', function() {
        it('returns null if no season currently active', function() {
            function check(date) {
                MockDate.set(date);
                expect(apex.currentSeason).to.be.null;
                MockDate.reset();
            };

            check('2018-01-01T00:00:00Z');
            check('2100-01-01T00:00:00Z');
        });

        it('returns the current season', function() {
            function check(date, name) {
                MockDate.set(date);
                expect(apex.currentSeason.name).to.equal(name);
                MockDate.reset();
            };

            check('2021-11-10T00:00:00Z', 'Escape');
            check('2022-02-10T00:00:00Z', 'Defiance');
        });
    });

    describe('.nextSeason pseudo property', function() {
        it('returns the next season if data is available', function() {
            MockDate.set(season11.startTime);
            expect(apex.nextSeason).to.eql(season12);
            MockDate.reset()
        });

        it('is null if next season data not available', function() {
            const finalSeason = [...apex.seasons].pop();
            MockDate.set(finalSeason.startTime);
            expect(apex.nextSeason).to.be.null;
            MockDate.reset()
        });
    });

    describe('.currentMaps pseudo property', function() {
        it('returns null if no season currently active', function() {
            function check(date) {
                MockDate.set(date);
                expect(apex.currentMaps).to.be.null;
                MockDate.reset();
            };

            check('2018-01-01T00:00:00Z');
            check('2100-01-01T00:00:00Z');
        });

        it('provides correct values for Season 11', function() {
            function check(date, map, duration) {
                MockDate.set(date);
                expect(apex.currentMaps)
                    .to.contain.something.like({map: map, duration: duration * 60 * 1000});
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
        });
    });

    describe('.nextMaps pseudo property', function() {
        it('returns null if there is no next season', function() {
            const finalSeason = [...apex.seasons].pop();
            MockDate.set(finalSeason.endTime);
            expect(apex.nextMaps).to.be.null;
            MockDate.reset()
        });

        it('returns null if there are no next maps', function() {
            MockDate.set(season11.endTime - 1000);
            expect(apex.nextMaps).to.be.null;
            MockDate.reset()
        });

        it('is equal to .currentSeason.nextMaps at the season start', function() {
            MockDate.set(season12.startTime);
            expect(apex.nextMaps).to.eql(season12.nextMaps);
            MockDate.reset();
        });
    });

    describe('.currentLTMs pseudo property', function() {
        it('is an alias for .currentSeason.currentLTMs', function() {
            MockDate.set(season12.startTime);
            expect(apex.currentLTMs)
                .to.have.length(2)
                .and.to.eql(season12.currentLTMs);
            MockDate.reset();
        });
    });

    describe('.currentTakeovers pseudo property', function() {
        it('is an alias for .currentSeason.currentTakeovers', function() {
            MockDate.set(season12.startTime);
            expect(apex.currentTakeovers)
                .to.have.length(1)
                .and.to.eql(season12.currentTakeovers);
            MockDate.reset();
        });
    });

    describe('.getSeasonByDate() method', function() {
        it('returns null if no season found', function() {
            expect(apex.getSeasonByDate('2000-01-01T00:00:00Z')).to.be.null;
        });

        it('uses the current date if none provided', function() {
            MockDate.set('2022-02-05T02:00:00Z');
            expect(apex.getSeasonByDate().id).to.equal(11);
            MockDate.reset();
        });

        it('returns correct seasons at known dates', function() {
            expect(apex.getSeasonByDate('2022-02-05T02:00:00Z').id).to.equal(11);
            expect(apex.getSeasonByDate('2022-03-05T02:00:00Z').id).to.equal(12);
        });
    });

    describe('.getMapsByDate() method', function() {
        it('returns correct maps for season 11', function() {

            function check(date, map, duration) {
                return expect(apex.getMapsByDate(date))
                    .to.contain.something.like({map: map, duration: duration * 60 * 1000})
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
        })
    })
});
