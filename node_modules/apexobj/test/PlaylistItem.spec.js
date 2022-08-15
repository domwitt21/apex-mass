/*

This set of tests uses unit tests. This is fine, but I've moved to using tests
only on the API surface for the rest of the classes so I don't have to fiddle
with implementation tests for things which don't affect output. At some point
I should rewrite these.

*/

// TODO: rewrite unit tests as integration tests

const { expect } = require('chai');
const PlaylistItem = require('../classes/PlaylistItem');

const apex = require('../');

const season11 = apex.seasons.find(season => season.id === 11);
const season11BR = season11.playlists.find(playlist => playlist.mode === 'Play Apex');
const season11Ranked = season11.playlists.find(playlist => playlist.mode === 'Ranked Leagues');

function map(_mapName, _mapDuration) {
    return {mapName: _mapName, mapDuration: _mapDuration};
};

function playlist(_mode, _ranked) {
    return {mode: _mode, ranked: _ranked};
};

describe('@PlaylistItem', function() {
    it('returns an object', function() {
        expect(new PlaylistItem(map('we', 30), playlist('br', false)))
            .to.include({map: 'we', duration: 30, mode: 'br'});
    });

    it('throws if map is not provided as a String', function() {
        expect(()=> new PlaylistItem(map('', 30))).to.throw();
        expect(()=> new PlaylistItem(10, 30)).to.throw();
        expect(()=> new PlaylistItem(map('ol', 60), playlist('br', false))).to.not.throw();
    });

    it('throws if playlist.mode is not provided', function() {
        expect(()=> new PlaylistItem(map('we', 30), playlist('', false))).to.throw();
        expect(()=> new PlaylistItem(map('we', 30), playlist(false, false))).to.throw();
        expect(()=> new PlaylistItem(map('ol', 60), playlist('br', false))).to.not.throw();
    });

    describe('.map property', function() {
        it('returns the supplied map', function() {
            expect(new PlaylistItem(map('we', 30), season11BR).map).to.equal('we');
        });
    });

    describe('.duration property', function() {
        it('returns the duration of the map', function() {
            expect(new PlaylistItem(map('we', 30), season11BR).duration).to.equal(30);
        });
    });

    describe('.mode property', function() {
        it('returns the mode of the parent playlist', function() {
            expect(new PlaylistItem(map('we', 30), season11BR).mode).to.equal('Play Apex');
        });
    });

    describe('.ranked conditional property', function() {
        it('returns true if the parent season is ranked', function() {
            expect(new PlaylistItem(map('we', 30), season11Ranked).ranked).to.be.true;
        });
        it('is undefined if the parent playlist is unranked', function() {
            expect(new PlaylistItem(map('we', 30), season11BR).ranked).to.be.undefined;
        });
    });
});
