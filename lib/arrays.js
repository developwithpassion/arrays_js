import curry from '@developwithpassion/curry_js';

/**
 * A visitor processes each element in a data structure. A return value of false
 * to the caller will cause iteration to stop.
 * @callback each~Visitor
 * @param {any} item - Item that is currently being processed
 * @param {Number} [index] - Index of the item that is being processed
 * @param {Array} [target] - Array that is currently being iterated over
 * @returns {undefined|Boolean} - Returning a value of false will cause the iterator to stop iterating
 */

export const each_until = curry((visitor, target) => {
  const items = Array.prototype.slice.call(target, 0);

  for (let index = 0; index < items.length; index++) {
    const continue_iteration = visitor(items[index], index, items);
    if (continue_iteration === false) return;
  }
});

export const each_in_reverse_until = curry((visitor, target) => {
  const items = Array.prototype.slice.call(target, 0);

  for (let index = items.length - 1; index >= 0; index--) {
    const continue_iteration = visitor(items[index], index, items);
    if (continue_iteration === false) return;
  }
});

const _each = direction =>
  curry((visitor, target) =>
    direction((...args) => {
      visitor(...args);
    }, target)
  );

/**
 * This function is used to iterate and perform an action over every element in an array
 *
 * @param {each~Visitor} visitor a function to invoke against each element in the array.
 *
 *
 * @param {Array} target for the function
 *
 * @example <caption>Basic usage with a visitor that will log every element in the array</caption>
 * let numbers = [1,2,3,4]
 * each_until(console.log.bind(console), numbers)
 *
 * @example <caption>Basic usage with the index provided for each item</caption>
 * let numbers = [1,2,3,4]
 * each_until((val, index) => { console.log(`${val} - ${index}`)}, numbers)
 *
 * @example <caption>Iterate over a set of numbers, stop when the number 5 has been processed</caption>
 * let numbers = [3,4,5,7,10,11]
 * each_until((val) => { console.log(val); return val !== 5}, numbers)
 *
 */
export const each = _each(each_until);

/**
 * This function is used to iterate and perform an action over every element in an array in reverse
 *
 * @param {each~Vistor} visitor a function to invoke against each element in the array.
 *
 *
 * @param {Array} target for the function
 *
 * @example <caption>Basic usage with a visitor that will log every element in the array</caption>
 * let numbers = [1,2,3,4]
 * each_in_reverse(console.log.bind(console), numbers)
 *
 * @example <caption>Basic usage with the index provided for each item</caption>
 * let numbers = [1,2,3,4]
 * each_in_reverse((val, index) => { console.log(`${val} - ${index}`)}, numbers)
 *
 * @example <caption>Iterate over a set of numbers, stop when the number 5 has been processed</caption>
 * let numbers = [3,4,5,7,10,11]
 * each_in_reverse((val) => { console.log(val); return val !== 5}, numbers)
 *
 */
export const each_in_reverse = _each(each_in_reverse_until);

/**
 * A reducer processes each element in a data structure and returns the result of processing
 * the element along with an accumulator that is being adjusted as each item is being processed
 * @callback reduce~Reducer
 * @param {any} accumulator - Result that holds the accumulated result that has been built up so far
 * @param {any} item - Current item being processed
 * @param {Number} [index] - Index of the item that is being processed
 * @param {Array} [array] - Target array that is being processed
 * @returns {any} - Returns the accumulator value that was built up
 */

/**
 * Performs a {@link https://en.wikipedia.org/wiki/Fold_(higher-order_function) fold}
 *
 * @param {any} initial_value - The initial result of the accumulator
 * @param {reduce~Reducer} visitor a function to invoke against each element in the array.
 * @param {Array} target - Array containing items to be folded
 *
 * @example <caption>Summing all numbers in an array</caption>
 * let numbers = [1,2,3,4]
 * let result = reduce(0, (sum, val) => sum + val, numbers)
 * console.log(result) // 10
 *
 * @example <caption>Determining if all numbers are even</caption>
 * let numbers = [2,4,6,7,8]
 * let result = reduce(true, (is_even, val) => is_even && val % 2 === 0, numbers)
 * console.log(result) // false
 *
 */
export const reduce = curry((initial_value, reducer, target) => {
  let accumulator = initial_value;

  each((value, index, array) => {
    accumulator = reducer(accumulator, value, index, array);
  }, target);
  return accumulator;
});

const first_with_target = curry((direction, condition, target) => {
  let result = null;

  direction((...args) => {
    const match = condition(...args);

    if (match) result = args[0];

    return !match;
  }, target);

  return result;
});

const find_first_in_direction = direction => (condition_or_target, ...rest) => {
  if (Array.isArray(condition_or_target)) return condition_or_target[0] || null;
  if (condition_or_target == null) return null;
  const condition = condition_or_target;

  return rest.length > 0
    ? first_with_target(direction, condition, rest.pop())
    : first_with_target(direction, condition);
};

/**
 * An Predicate matches an item
 * @callback match~Predicate
 * @param {any} item - Item to evaluate
 * @param {Number} [index] - Index of the item that is being processed
 * @param {Array} [array] - Target array that is being processed
 * @returns {Boolean} - Whether the item matches the necessary criteria
 */

/**
 * Find the last item in an array.
 * If a {@link https://en.wikipedia.org/wiki/Predicate_(mathematical_logic) predicate}
 * is provided, the predicate will be used to find the last item that matches the predicate.
 *
 * @param {match~Predicate} [condition] - Condition used to match the item, if not provided
 * last will return the last element in the array
 * @param {Array} target - Array containing items to be checked
 *
 * @example <caption>Get the last item in the array</caption>
 * let numbers = [1,2,3,4]
 * let result = last(numbers);
 * console.log(result) // 4
 *
 * @example <caption>Get the last even number in the array</caption>
 * let numbers = [1,2,3,4, 8, 9]
 * let result = last(val => val % 2 === 0, numbers);
 * console.log(result) // 8
 *
 */
export const last = find_first_in_direction(each_in_reverse_until);

/**
 * Find the first item in an array.
 * If a {@link https://en.wikipedia.org/wiki/Predicate_(mathematical_logic) predicate}
 * is provided, the predicate will be used to find the first item that matches the predicate.
 *
 * @param {match~Predicate} [condition] - Condition used to match the item, if not provided
 * first will return the first element in the array
 * @param {Array} target - Array containing items to be checked
 *
 * @example <caption>Get the first item in the array</caption>
 * let numbers = [1,2,3,4]
 * let result = first(numbers);
 * console.log(result) // 1
 *
 * @example <caption>Get the first even number in the array</caption>
 * let numbers = [1,2,3,4, 8, 9]
 * let result = first(val => val % 2 === 0, numbers);
 * console.log(result) // 2
 *
 */
export const first = find_first_in_direction(each_until);

/**
 * Determine if any items in the array match the predicate. As soon as a match
 * is found, the remainder of the list will not be processed.
 *
 * @param {match~Predicate} [condition] - Condition used to match the item
 * @param {Array} target - Array containing items to be checked
 *
 * @example <caption>Check if any numbers in an array are greater than 0</caption>
 * let numbers = [1,2,3,4]
 * let result = any(val => val > 0, numbers);
 * console.log(result) // true
 *
 */
export const any = curry((condition, target) => !!first(condition, target));

/**
 * Determine if none of the items in the array match the predicate. As soon as a match
 * is found, the remainder of the list will not be processed.
 *
 * @param {match~Predicate} [condition] - Condition used to match the item
 * @param {Array} target - Array containing items to be checked
 *
 * @example <caption>Check if none of the numbers are greater than 0</caption>
 * let numbers = [1,2,3,4]
 * let result = none(val => val > 0, numbers);
 * console.log(result) // false
 *
 */
export const none = curry((condition, target) => !any(condition, target));

/**
 * Determine if all of the items in the array match the predicate. As soon as a match
 * is not found, the remainder of the list will not be processed.
 *
 * @param {match~Predicate} [condition] - Condition used to match the item
 * @param {Array} target - Array containing items to be checked
 *
 * @example <caption>Check if all of the numbers are even</caption>
 * let numbers = [1,2,3,4]
 * let result = all(val => val % 2 === 0, numbers);
 * console.log(result) // false
 *
 */
export const all = curry((condition, target) =>
  reduce(true, (acc, ...args) => acc && condition(...args), target)
);

/**
 * Filter the array to return an array containing all items that match
 * the predicate.
 *
 * @param {match~Predicate} constraint - Condition used to match the item
 * @param {Array} target - Array containing items to be checked
 *
 * @example <caption>Filter for all even numbers</caption>
 * let numbers = [1,2,3,4]
 * let result = filter(val => val % 2 === 0, numbers);
 * console.log(result) // [2, 4]
 *
 */
export const filter = curry((constraint, target) =>
  reduce(
    [],
    (acc, val, ...args) => {
      if (constraint(val, ...args)) {
        acc.push(val);
      }
      return acc;
    },
    target
  )
);

/**
 * @callback map~Mapper
 * @param {any} item - Item to map
 * @param {Number} [index] - Index of the item that is being processed
 * @param {Array} [array] - Target array that is being processed
 * @returns {any} - Result of mapping
 */

/**
 * Perform a map over each item in the array and return an
 * array containing the results of each map operation.
 *
 * @param {map~Mapper} constraint - Condition used to match the item
 * @param {Array} target - Array containing items to be checked
 *
 * @example <caption>Double all numbers in an array</caption>
 * let numbers = [1,2,3,4]
 * let result = map(val => val * 2, numbers);
 * console.log(result) // [2, 4, 6, 8]
 *
 */
export const map = curry((mapper, target) =>
  reduce(
    [],
    (acc, ...args) => {
      acc.push(mapper(...args));
      return acc;
    },
    target
  )
);

/**
 * Perform a map over each item in the array, results of a map operation
 * will be flattened to a singular array, in the event that each map
 * operation itself results in an array result.
 *
 * @param {map~Mapper} constraint - Condition used to match the item
 * @param {Array} target - Array containing items to be checked
 *
 * @example <caption>Gets an array of the numbers with their doubles</caption>
 * let numbers = [1,2,3,4]
 * let result = map(val => [val, val * 2], numbers);
 * console.log(result) // [1, 2, 2, 4, 3, 6, 4 , 8]
 *
 */
export const flat_map = curry((mapper, target) =>
  reduce([], (results, next_item) => results.concat(mapper(next_item)), target)
);

/**
 * Flatten an array that may contain nested arrays into a singular array
 *
 * @param {Array} target - Array that may contain nested arrays
 *
 * @example <caption>Gets an array of the numbers with their doubles</caption>
 * let numbers = [1, 2, [4, 5, 6, [7, 8, 9]]];
 * let result = flatten(numbers);
 * console.log(result) // [1, 2, 4, 5, 6, 7, 8, 9]
 *
 */
export const flatten = flat_map(item => (Array.isArray(item) ? flatten(item) : [item]));

const uniq_with_target_and_mapper = curry((mapper, target) =>
  filter((value, index) => {
    const mapped = mapper(value);
    const first_matching_index = target.findIndex(value => mapper(value) === mapped);
    return index === first_matching_index;
  }, target)
);

/**
 * Return all unique items in an array. If a mapper is provided, the result of the mapper
 * will become the selector that is used to determine uniqueness.
 *
 * @param {Array | map~Mapper} mapper_or_target - If a mapper is provided, the result
 * of the mapper will become the value for the uniqueness check. If no mapper
 * is provided, uniq will just return each item in the list that is unique
 * following normal rules of equality.
 *
 * @example <caption>Gets an array of the numbers with their doubles</caption>
 * let numbers = [1, 2, 2, 3, 3, 4];
 * let result = uniq(numbers);
 * console.log(result) // [1, 2, 3, 4]
 *
 * @example <caption>Gets all people of different ages</caption>
 * let people = [
 *   { name: 'Person 1', age: 10 },
 *   { name: 'Person 2', age: 10 },
 *   { name: 'Person 3', age: 11 },
 *   { name: 'Person 4', age: 12 },
 * ];
 * let result = uniq(({age}) => age, people);
 * console.log(result) // [ {..., name: 'Person 1}, { ..., name: 'Person 3'}, { ..., name: 'Person 4'} ]
 *
 */
export const uniq = (mapper_or_target, ...args) =>
  args.length === 0 && Array.isArray(mapper_or_target)
    ? uniq_with_target_and_mapper(val => val, mapper_or_target)
    : uniq_with_target_and_mapper(mapper_or_target, ...args);

/**
 * Return max of all items in the array using the mapper to
 * map the value being used for the calculation
 *
 * @param {map~Mapper} mapper - Mapper used to map the value used for
 * the max calculation.
 * @param {Array} target - Target array
 *
 * @example <caption>Get the max number in an array</caption>
 * let numbers = [1, 2, 3, 10, 5];
 * let result = max(val => val, numbers);
 * console.log(result) // 10
 *
 * @example <caption>Get the age of the oldest person</caption>
 * let people = [
 *   { name: 'Person 1', age: 10 },
 *   { name: 'Person 2', age: 10 },
 *   { name: 'Person 3', age: 11 },
 *   { name: 'Person 4', age: 12 },
 * ];
 * let result = max(({age}) => age, people);
 * console.log(result) // 12
 *
 */
export const max = curry((mapper, target) =>
  reduce(
    0,
    (max_value, ...args) => {
      const item_value = mapper(...args);
      return item_value > max_value ? item_value : max_value;
    },
    target
  )
);

/**
 * Return min of all items in the array using the mapper to
 * map the value being used for the calculation
 *
 * @param {map~Mapper} mapper - Mapper used to map the value used for
 * the min calculation.
 * @param {Array} target - Target array
 *
 * @example <caption>Get the min number in an array</caption>
 * let numbers = [1, 2, 3, 10, 5];
 * let result = min(val => val, numbers);
 * console.log(result) // 1
 *
 * @example <caption>Get the age of the youngest person</caption>
 * let people = [
 *   { name: 'Person 1', age: 10 },
 *   { name: 'Person 2', age: 10 },
 *   { name: 'Person 3', age: 11 },
 *   { name: 'Person 4', age: 12 },
 * ];
 * let result = min(({age}) => age, people);
 * console.log(result) // 10
 *
 */
export const min = curry((value_resolver, target) => {
  let processingFirstElement = true;

  return reduce(
    0,
    (min_value, ...args) => {
      let item_value = value_resolver(...args);

      if (processingFirstElement) {
        processingFirstElement = false;
        return item_value;
      }

      return item_value < min_value ? item_value : min_value;
    },
    target
  );
});

const default_comparer = (a, b) => (a < b ? -1 : a > b ? 1 : 0);

const sort_with_comparer_and_target = curry((comparer, target) => {
  const target_to_sort = target || [];
  const results = target_to_sort.slice(0);

  results.sort(comparer);

  return results;
});

/**
 * @callback sort~Comparer
 * @param {any} a - first item to compare
 * @param {any} b - second item to compar
 * @returns {Number} - Result of the comparison
 */

/**
 * Sorts an array using an optional comparer. Does not modify the
 * original list, rather returns a new array containing the results
 * sorted using the comparer
 *
 * @param {Array | sort~Comparer} comparer_or_target - If a comparer is provided,
 * the comparer will be used to perform the comparison of items to one another.
 * If a comparer is not provided, the default comparer will be used.
 *
 * @example <caption>Sort all numbers in an array</caption>
 * let numbers = [4, 2, 1, 10, 5];
 * let result = sort(numbers);
 * console.log(result) // [1, 2, 4, 5, 10]
 *
 * @example <caption>Sort all numbers in an array descending</caption>
 * let numbers = [4, 2, 1, 10, 5];
 * let result = sort((a,b) => b - a, numbers);
 * console.log(result) // [10, 5, 4, 2, 1]
 *
 */
export const sort = (comparer_or_target, ...args) => {
  if (comparer_or_target == null) return [];
  if (Array.isArray(comparer_or_target))
    return sort_with_comparer_and_target(default_comparer, comparer_or_target);

  return sort_with_comparer_and_target(comparer_or_target, ...args);
};

export const generate = (number, mapper) => map((_, index) => mapper(index), new Array(number).fill(null));

export default {
  each,
  each_until,
  each_in_reverse,
  each_in_reverse_until,
  last,
  first,
  all,
  any,
  none,
  filter,
  map,
  flat_map,
  flatten,
  uniq,
  true_for_all: all,
  reduce,
  sort,
  min,
  max,
  generate
};
