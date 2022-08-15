const { expect } = require('chai');

describe('Utility library', function() {
    describe('.isDate(target) function', function() {
        const { isDate } = require('../util');

        it('returns true when target is an instance of Date', function() {
            expect(isDate(new Date())).to.be.true;
        });

        it('returns false when the target is not an instance of Date', function() {
            expect(isDate('foo')).to.be.false;
            expect(isDate(12)).to.be.false;
            expect(isDate('2022-01-11T12:00:00Z')).to.be.false;
        });
    });

    describe('.parseDate(target) function', function() {
        const { parseDate } = require('../util');

        it('returns a new Date if none supplied', function() {
            expect(parseDate()).to.eql(new Date());
        });

        it('throws if the target is an invalid date ISO string', function() {
            expect(()=>parseDate('foo')).to.throw();
            expect(()=>parseDate('2022-13-11T12:00:00Z')).to.throw();
        });

        it('returns the target if it is already an instance of Date', function() {
            const dateExample = new Date('2021-01-21T03:00:00Z');
            const dateCopy = new Date('2021-01-21T03:00:00Z');
            expect(parseDate(dateExample)).to.deep.equal(dateCopy);
        });

        it('returns an instance of Date if target is a valid date ISO string', function() {
            expect(parseDate('2022-01-11T12:00:00Z').getMonth()).to.equal(0);
        });
    });

    describe('withinDates function', function(){

        const { withinDates } = require('../util');

        it('requires {startTime, endTime} argument', function() {
            expect(()=>withinDates({endTime: new Date()})).to.throw();
            expect(()=>withinDates({startTime: new Date()})).to.throw();
        });

        it('uses the current date if none provided', function() {
            const now = new Date().getTime();
            const before = new Date(now - 1000);
            const after = new Date(now + 1000);
            expect(withinDates({startTime: before, endTime: after})).to.be.true;
        });

        it('returns false if before start of range', function() {
            const now = new Date().getTime();
            expect(withinDates({startTime: now - 1000, endTime: now + 1000}, now - 2000))
                .to.be.false;
        });

        it('returns false if after end of range', function() {
            const now = new Date().getTime();
            expect(withinDates({startTime: now - 1000, endTime: now + 1000}, now + 2000))
                .to.be.false;
        });

        it('returns true if within range', function() {
            const now = new Date().getTime();

            // With target provided
            expect(withinDates({startTime: now - 1000, endTime: now + 1000}, now + 500))
                .to.be.true;

            // With target not provided
            expect(withinDates({startTime: now - 1000, endTime: now + 1000}))
                .to.be.true;
        });
    });

    describe('.randomFrom(list, quantity, options) function', function() {

        const { randomFrom } = require('../util');

        it('throws when input is not an array', function() {
            expect(()=>randomFrom({sampletype: "object"})).to.throw;
        });

        describe('Single item mode', function() {
            it('returns a single item in its original type', function() {
                expect(randomFrom([1, 2, 3])).to.be.a('number');
                expect(randomFrom([true, true, true])).to.be.a('boolean');
                expect(randomFrom(['one', 'two', 'three'])).to.be.a('string');
            });
        });

        describe('Multiple item mode', function() {
            it('returns a list of items', function() {
                expect(randomFrom([1, 2, 3], 2)).to.be.an('array');
            });
            it('returns large arrays in non-subtractive mode', function() {
                expect(randomFrom([1,2], 25, {subtractive: false})).to.be.lengthOf(25);
            });
            it('only contains items from the input', function() {
                expect(randomFrom([1,2], 25, {subtractive: false})).to.include.members([1,2]);
                expect(randomFrom([1,2], 25, {subtractive: false})).to.not.include(undefined);
            });

            it("doesn't return duplicates in subtractive mode", function() {
                function checkDuplicates() {
                    const results = [];
                    for (let i = 0; i < 100; i++) {
                        results.push(randomFrom([1, 2, 3], 2))
                    };
                    return results.filter(result => result[0] == result[1]);
                };

                expect(checkDuplicates()).to.be.empty;
            });

            it('throws when subtractive and requesting > input size', function() {
                expect(()=>randomFrom(['item1', 'item2'], 2, {subtractive: true})).to.throw;
            });
        });

    });
})
