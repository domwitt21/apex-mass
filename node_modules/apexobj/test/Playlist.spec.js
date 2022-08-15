const { expect } = require('chai');
const RotatingPlaylist = require('../classes/RotatingPlaylist');

describe('@Playlist', function() {

    const apex = require('../');

    const season11 = apex.seasons.find(season => season.id === 11);
    const season11BR = season11.playlists.find(playlist =>  playlist.mode === 'Play Apex');
    const season11Ranked = season11.playlists.find(playlist => playlist.mode === 'Ranked Leagues');

    const season12 = apex.seasons.find(season => season.id === 12);
    const season12BR = season12.playlists.find(playlist => playlist.mode === "Play Apex");
    const olympus247 = season12.LTMs.find(ltm => ltm.mode === 'Olympus 24/7');

    it('throws if not provided with required ApexSeason properties', function() {
        expect(()=>new RotatingPlaylist({})).to.throw
    });

    describe('.maps property', function() {
        it("returns an Array of this season's maps", function() {
            console.log(season11);
            expect(season11BR.maps).to.eql(["Storm Point", "World's Edge"]);
        });
    });

    describe('.mode property', function() {
        it('returns the mode', function() {
            expect(season11BR.mode).to.equal("Play Apex");
        });
    });

    describe('.ranked conditional property', function() {
        it('returns true if the playlist is ranked, else undefined', function() {
            expect(season11BR.ranked).to.be.undefined;
            expect(season11Ranked.ranked).to.be.true;
        });
    });

    describe('.baseTime property', function() {
        it('exists if the playlist has a baseTime', function() {
            expect(season12BR.baseTime).to.be.ok;
        });

        it('does not exist if the playlist does not have a baseTime', function() {
            expect(olympus247.baseTime).to.not.be.ok
        });
    });

    describe('.takeover conditional property', function() {
        it('returns true if the playlist is a takeover, else undefined', function() {
            expect(season11BR.takeover).to.be.undefined;
            expect(olympus247.takeover).to.be.true;
        });
    });

    describe('.replaces conditional property', function() {
        it('is undefined if the playlist is not a takeover', function() {
            expect(season11BR.replaces).to.be.undefined;
        });

        it('references an entry from the parent playlists array', function() {
            expect(season12.playlists).to.contain.something.like({mode: olympus247.replaces});
        });

    });
});
