import sut from './arrays';
import { expect } from 'chai';

describe('array utils', function() {
  let items;
  let original;
  let result;

  beforeEach(function() {
    items = [1, 2, 3, 4];
  });

  describe('visiting each element', () => {
    describe('with a visitor that returns values', function() {
      let values_visited;
      let visitor;

      beforeEach(function() {
        values_visited = [];
      });

      beforeEach(function() {
        visitor = value => {
          values_visited.push(value);
          return values_visited.length < 3;
        };
      });

      beforeEach(function() {
        sut.each(visitor, items);
      });

      it('iteration visits all of the items in the array', function() {
        expect(values_visited).to.eql([1, 2, 3, 4]);
      });
    });
  });

  describe('visiting each element in the array with a visitor', function() {
    let visitor;

    describe('with a visitor that indicates whether iteration should continue', function() {
      let values_visited;

      beforeEach(function() {
        values_visited = [];
      });

      beforeEach(function() {
        visitor = function(value) {
          values_visited.push(value);
          return values_visited.length < 3;
        };
      });

      beforeEach(function() {
        sut.each_until(visitor, items);
      });

      it('iteration stops when the visitor returns false', function() {
        expect(values_visited).to.eql([1, 2, 3]);
      });
    });

    describe('with a visitor that does not leverage the index', function() {
      let values_visited;
      beforeEach(function() {
        values_visited = [];
      });

      beforeEach(function() {
        visitor = function(value) {
          values_visited.push(value);
        };
      });

      beforeEach(function() {
        sut.each(visitor, items);
      });

      it('runs the visitor against each element', function() {
        expect(values_visited).to.eql([1, 2, 3, 4]);
      });
    });

    describe('with a visitor that includes the index', function() {
      it('visitor leverages the index', function() {
        let current_index = 0;
        sut.each(function(value, index) {
          expect(index).to.eql(current_index);
          current_index++;
        }, items);
      });
    });

    describe('when the visitor is provided the array', function() {
      it('the visitor is provided the array', function() {
        sut.each(function(value, index, array) {
          expect(array).to.eql(items);
        }, items);
      });
    });
  });

  describe('filtering an array with a condition', function() {
    describe('with a condition that does not leverage the index', function() {
      let results;
      let items = [1, 2, 3, 4];

      beforeEach(function() {
        results = [];
      });

      beforeEach(function() {
        results = sut.filter(function(value) {
          return value % 2 === 0;
        }, items);
      });

      it('returns all the items matching the condition', function() {
        expect(results).to.eql([2, 4]);
      });
    });

    describe('with a condition that leverages the index', function() {
      let results;
      let items = [1, 2, 3, 4];
      let indexes;

      beforeEach(function() {
        results = [];
        indexes = [];
      });

      beforeEach(function() {
        results = sut.filter(function(value, index) {
          indexes.push(index);
          return value % 2 === 0;
        }, items);
      });

      it('returns all the items matching the condition', function() {
        expect(results).to.eql([2, 4]);
      });
      it('used the index correctly', function() {
        expect(indexes).to.eql([0, 1, 2, 3]);
      });
    });
  });

  describe('mappping each element with a mapper', function() {
    let results;
    let mapper;
    describe('with a mapper that does not leverage the index', function() {
      beforeEach(function() {
        results = [];
      });

      beforeEach(function() {
        mapper = function(value) {
          return 'Value ' + value;
        };
      });

      beforeEach(function() {
        results = sut.map(mapper, items);
      });

      it('returns the mapped result set', function() {
        expect(results).to.eql(['Value 1', 'Value 2', 'Value 3', 'Value 4']);
      });
    });
    describe('with a mapper that leverages the index', function() {
      let indexes;
      beforeEach(function() {
        results = [];
        indexes = [];
      });

      beforeEach(function() {
        mapper = function(value, index) {
          indexes.push(index);
          return 'Value ' + value;
        };
      });

      beforeEach(function() {
        results = sut.map(mapper, items);
      });

      it('provides the index correctly', function() {
        expect(indexes).to.eql([0, 1, 2, 3]);
      });
    });
    describe('with a visitor that includes the index', function() {
      it('visitor leverages the index', function() {
        let current_index = 0;
        sut.each(function(value, index) {
          expect(index).to.eql(current_index);
          current_index++;
        }, items);
      });
    });

    describe('when the visitor is provided the array', function() {
      it('the visitor is provided the array', function() {
        sut.each(function(value, index, array) {
          expect(array).to.eql(items);
        }, items);
      });
    });
  });

  describe('flat mappping an array', function() {
    let mapper;
    describe('with a mapper that returns another array', function() {
      let results;
      beforeEach(function() {
        results = [];
      });

      beforeEach(function() {
        mapper = function(value) {
          return [1, 2];
        };
      });

      beforeEach(function() {
        results = sut.flat_map(mapper, items);
      });

      it('returns the aggregates set of mapped results', function() {
        expect(results.length).to.eql(8);
      });
    });

    describe('and one of the items returns an emtpy array', function() {
      let results;
      let items = [];
      let mapper;

      beforeEach(() => {
        items = [
          {
            items: []
          },
          {
            items: [1, 2]
          }
        ];
      });

      beforeEach(function() {
        mapper = function(value) {
          return value.items;
        };
      });

      beforeEach(function() {
        results = sut.flat_map(mapper, items);
      });

      it('returns the aggregates set of mapped results', function() {
        expect(results.length).to.eql(2);
      });
    });
  });

  describe('flattening an array', function() {
    describe('and none of the items are an array', function() {
      let results;
      let items = [];

      beforeEach(() => {
        items = [1, 2];
      });

      beforeEach(function() {
        results = sut.flatten(items);
      });

      it('returns the items as is', function() {
        expect(results).to.eql([1, 2]);
      });
    });

    describe('and some of the items are an array', function() {
      let results;
      let items = [];

      beforeEach(() => {
        items = [1, 2, [4, 5, 6, [7, 8, 9]]];
      });

      beforeEach(function() {
        results = sut.flatten(items);
      });

      it('returns the items as a singular flattened array', function() {
        expect(results).to.eql([1, 2, 4, 5, 6, 7, 8, 9]);
      });
    });
  });

  describe('first', function() {
    describe('and there is only 1 item matching the condition in the array', function() {
      let times_called;
      let numbers;
      let result;
      beforeEach(function() {
        numbers = [1, 2, 3];
        times_called = 0;
      });

      beforeEach(function() {
        const deferred = sut.first(function(value) {
          times_called++;
          return value % 2 === 0;
        });
        result = deferred(numbers);
      });

      it('returns the item that matches the condition', function() {
        expect(result).to.eql(2);
      });

      it('does not iterate through all of the items in the array', function() {
        expect(times_called).to.eql(2);
      });
    });

    describe('and there are no items in the array', function() {
      let numbers;
      let result;
      beforeEach(function() {
        numbers = [];
      });

      beforeEach(function() {
        result = sut.first(numbers);
      });

      it('returns null', function() {
        expect(result).to.be.null;
      });
    });

    describe('and there are more than one items that match the condition', function() {
      let times_called;
      let numbers;
      let result;
      beforeEach(function() {
        numbers = [1, 2, 3, 4];
        times_called = 0;
      });

      beforeEach(function() {
        result = sut.first(function(value) {
          times_called++;
          return value % 2 === 0;
        }, numbers);
      });

      it('returns the first item that matches the condition', function() {
        expect(result).to.eql(2);
      });

      it('does not iterate through subsequent items after it has found the first match', function() {
        expect(times_called).to.eql(2);
      });
    });

    describe('and there are no items that match the condition', function() {
      let times_called;
      let numbers;
      let result;
      beforeEach(function() {
        numbers = [1, 2, 3, 4];
        times_called = 0;
      });

      beforeEach(function() {
        result = sut.first(function(value) {
          times_called++;
          return value > 10;
        }, numbers);
      });

      it('iterates through all of the items', function() {
        expect(times_called).to.eql(4);
      });

      it('returns null', function() {
        expect(result).to.be.null;
      });
    });
  });

  describe('last', function() {
    describe('and there is only 1 item matching the condition in the array', function() {
      let times_called;
      let numbers;
      let result;
      beforeEach(function() {
        numbers = [1, 2, 3];
        times_called = 0;
      });

      beforeEach(function() {
        result = sut.last(function(value) {
          times_called++;
          return value % 3 === 0;
        }, numbers);
      });

      it('returns the item that matches the condition', function() {
        expect(result).to.eql(3);
      });

      it('does not iterate through all of the items in the array', function() {
        expect(times_called).to.eql(1);
      });
    });

    describe('and there are no items in the array', function() {
      let numbers;
      let result;
      beforeEach(function() {
        numbers = [];
      });

      beforeEach(function() {
        result = sut.last(numbers);
      });

      it('returns null', function() {
        expect(result).to.be.null;
      });
    });

    describe('and there are more than one items that match the condition', function() {
      let times_called;
      let numbers;
      let result;
      beforeEach(function() {
        numbers = [1, 2, 4, 3, 4];
        times_called = 0;
      });

      beforeEach(function() {
        result = sut.last(function(value) {
          times_called++;
          return value % 4 === 0;
        }, numbers);
      });

      it('returns the first item that matches the condition', function() {
        expect(result).to.eql(4);
      });

      it('does not iterate through subsequent items after it has found the first match', function() {
        expect(times_called).to.eql(1);
      });
    });

    describe('and there are no items that match the condition', function() {
      let times_called;
      let numbers;
      let result;
      beforeEach(function() {
        numbers = [1, 2, 3, 4];
        times_called = 0;
      });

      beforeEach(function() {
        result = sut.last(function(value) {
          times_called++;
          return value > 10;
        }, numbers);
      });

      it('iterates through all of the items', function() {
        expect(times_called).to.eql(4);
      });

      it('returns null', function() {
        expect(result).to.be.null;
      });
    });
  });

  describe('true for all', function() {
    describe('and all the items match the condition', function() {
      beforeEach(function() {
        items = [1, 2, 3, 4];
      });

      beforeEach(function() {
        result = sut.true_for_all(function(value) {
          return value > 0;
        }, items);
      });

      it('returns true', function() {
        expect(result).to.be.true;
      });
    });

    describe('and not all the items match the condition', function() {
      beforeEach(function() {
        items = [1, 0, 3, 4];
      });

      beforeEach(function() {
        result = sut.true_for_all(function(value) {
          return value > 0;
        }, items);
      });

      it('returns false', function() {
        expect(result).to.be.false;
      });
    });
  });

  describe('checking if any items match the condition', function() {
    let result;
    let items;

    describe('and one of the items match the condition', function() {
      beforeEach(function() {
        items = [1, 2, 3, 4];
      });

      beforeEach(function() {
        result = sut.any(function(value) {
          return value > 0;
        }, items);
      });

      it('returns true', function() {
        expect(result).to.be.true;
      });
    });

    describe('and none of the items match the condition', function() {
      beforeEach(function() {
        items = [1, 0, 3, 4];
      });

      beforeEach(function() {
        result = sut.any(function(value) {
          return value > 8;
        }, items);
      });

      it('returns false', function() {
        expect(result).to.be.false;
      });
    });
  });

  describe('checking if none of the items match a condition', function() {
    let result;
    let items;

    describe('and one of the items match the condition', function() {
      beforeEach(function() {
        items = [1, 2, 3, 4];
      });

      beforeEach(function() {
        result = sut.none(function(value) {
          return value > 0;
        }, items);
      });

      it('returns false', function() {
        expect(result).to.be.false;
      });
    });

    describe('and none of the items match the condition', function() {
      beforeEach(function() {
        items = [1, 0, 3, 4];
      });

      beforeEach(function() {
        result = sut.none(function(value) {
          return value > 8;
        }, items);
      });

      it('returns true', function() {
        expect(result).to.be.true;
      });
    });
  });

  describe('reducing an array', function() {
    beforeEach(function() {
      original = [1, 2, 3, 4];
    });

    describe('with a simple reducer', function() {
      beforeEach(function() {
        result = sut.reduce(
          0,
          function(accumulator, current_value) {
            return (accumulator += current_value);
          },
          original
        );
      });

      it('passes', function() {
        expect(result).to.eql(10);
      });
    });

    describe('with a reducer that leverages the index and the array', function() {
      beforeEach(function() {
        let orig = original;
        result = sut.reduce(
          0,
          function(accumulator, current_value, index, array) {
            expect(array).to.eql(orig);
            return (accumulator += current_value);
          },
          original
        );
      });

      it('passes', function() {
        expect(result).to.eql(10);
      });
    });

    describe('correctly handles accumulator that returns bool', function() {
      let values;
      let result;
      let values_visited = 0;

      beforeEach(function() {
        values = [true, true, false, true];
        result = sut.reduce(
          true,
          function(accumulator, current_value, index, array) {
            values_visited += 1;
            return accumulator && current_value;
          },
          values
        );
      });

      it('reduces using all of the values', function() {
        expect(values_visited).to.eql(4);
      });

      it('returns the correct result', function() {
        expect(result).to.be.false;
      });
    });

    describe('correctly reduces array of arrays', function() {
      let values;
      let result;

      beforeEach(function() {
        values = [[], [1, 2], [3, 4]];
        result = sut.reduce(
          [],
          (accumulator, current_value, index, array) => accumulator.concat(current_value),
          values
        );
      });

      it('returns the correct result', function() {
        expect(result).to.eql([1, 2, 3, 4]);
      });
    });
  });

  describe('sorting', function() {
    let result;

    describe('an empty array', function() {
      let original;

      beforeEach(function() {
        original = [];
      });

      beforeEach(function() {
        result = sut.sort(original);
      });

      it('returns another empty array', function() {
        expect(result).not.to.be.null;
        expect(result !== original).to.be.true;
      });
    });

    describe('an nonempty array', function() {
      beforeEach(function() {
        original = [4, 3, 2, 1];
      });

      beforeEach(function() {
        result = sut.sort(original);
      });

      it('does not modify original array', function() {
        expect(original).to.eql([4, 3, 2, 1]);
      });

      it('returns a sorted array', function() {
        expect(result).not.to.be.null;
        expect(result !== original).to.be.true;
        expect(result).to.eql([1, 2, 3, 4]);
      });

      describe('with a comparer', () => {
        beforeEach(function() {
          original = [1, 2, 3, 4];
        });

        beforeEach(function() {
          const deferred = sut.sort((a, b) => b - a);
          result = deferred(original);
        });

        it('does not modify original array', function() {
          expect(original).to.eql([1, 2, 3, 4]);
        });

        it('returns a sorted array', function() {
          expect(result).not.to.be.null;
          expect(result !== original).to.be.true;
          expect(result).to.eql([4, 3, 2, 1]);
        });
      });

      describe('with a comparer and a target', () => {
        beforeEach(function() {
          original = [1, 2, 3, 4];
        });

        beforeEach(function() {
          result = sut.sort((a, b) => b - a, original);
        });

        it('does not modify original array', function() {
          expect(original).to.eql([1, 2, 3, 4]);
        });

        it('returns a sorted array', function() {
          expect(result).not.to.be.null;
          expect(result !== original).to.be.true;
          expect(result).to.eql([4, 3, 2, 1]);
        });
      });
    });
  });

  describe('getting the max value in an array', function() {
    let items;
    let result;

    describe('when the array is not emptry', function() {
      beforeEach(function() {
        items = [1, 2, 10, 20, 3, 5];
      });

      beforeEach(function() {
        result = sut.max(function(value) {
          return value;
        }, items);
      });

      it('returns the max value', function() {
        expect(result).to.eql(20);
      });
    });

    describe('when the array is empty', function() {
      beforeEach(function() {
        items = [];
      });

      beforeEach(function() {
        result = sut.max(
          function(value) {
            return value;
          },
          0,
          items
        );
      });

      it('returns the max value', function() {
        expect(result).to.eql(0);
      });
    });
  });

  describe('getting the unique items in an array', function() {
    describe('and the array contains simple value types', function() {
      let items;
      let result;

      beforeEach(function() {
        items = [1, 2, 2, 2, 3, 3, 4];
      });

      beforeEach(function() {
        result = sut.uniq(items);
      });

      it('returns only the unique items', function() {
        expect(result).to.eql([1, 2, 3, 4]);
      });
    });

    describe('and a uniqueness mapper is provided', function() {
      let items;
      let result;

      beforeEach(function() {
        items = [
          {
            id: 1,
            name: 'First',
            city: 'MH'
          },
          {
            id: 2,
            name: 'Second',
            city: 'MH'
          },
          {
            id: 3,
            name: 'Third',
            city: 'CAL'
          }
        ];
      });

      beforeEach(function() {
        result = sut.uniq(item => item.city, items);
      });

      it('returns only the unique items according to the mapped value', function() {
        expect(result.length).to.equal(2);
        expect(result[0].id).to.eql(1);
        expect(result[1].id).to.eql(3);
      });
    });
  });

  describe('generating a set of items', function() {
    let results;

    describe('and the index is leveraged in the mapper', function() {
      beforeEach(() => {
        results = sut.generate(100, () => 'hello');
      });

      it('returns a list of the specified length', () => {
        expect(results.length).to.eql(100);
      });

      it('returns a list of items using the mapper', () => {
        expect(sut.true_for_all(x => x === 'hello', results)).to.be.true;
      });
    });

    describe('and the index is leveraged in the mapper', function() {
      beforeEach(() => {
        results = sut.generate(100, i => `hello ${i}`);
      });

      it('returns a list of the specified length', () => {
        expect(results.length).to.eql(100);
      });

      it('returns a list of items using the mapper', () => {
        expect(sut.true_for_all((x, index) => x === `hello ${index}`, results)).to.be.true;
      });
    });
  });
});
