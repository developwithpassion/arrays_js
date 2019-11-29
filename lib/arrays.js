import curry from '@developwithpassion/curry_js';

export const each_until = curry((visitor, target) => {
  const items = Array.prototype.slice.call(target, 0);

  for (let index = 0; index < items.length; index++) {
    const continue_iteration = visitor(items[index], index, items);
    if (typeof continue_iteration !== 'undefined' && continue_iteration !== null) {
      if (continue_iteration === false) {
        return;
      }
    }
  }
});

export const each_in_reverse_until = curry((visitor, target) => {
  const items = Array.prototype.slice.call(target, 0);

  for (let index = items.length - 1; index >= 0; index--) {
    const continue_iteration = visitor(items[index], index, items);

    if (typeof continue_iteration !== 'undefined' && continue_iteration !== null) {
      if (continue_iteration === false) {
        return;
      }
    }
  }
});

const _each = direction =>
  curry((visitor, target) =>
    direction((...args) => {
      visitor(...args);
    }, target)
  );

export const each = _each(each_until);

export const each_in_reverse = _each(each_in_reverse_until);

const operators = ['+', '-', '/', '*'];

export const reduce = curry(
  (initial_value_or_symbol, reducer_or_initial_value_for_symbolic_reduce, ...rest) => {
    const target = rest.pop();

    if (operators.indexOf(initial_value_or_symbol) > -1)
      return reduce_using_operator.apply(
        null,
        [initial_value_or_symbol, reducer_or_initial_value_for_symbolic_reduce, target].concat(rest)
      );

    return reduce_using_reducer.apply(
      null,
      [reducer_or_initial_value_for_symbolic_reduce, initial_value_or_symbol, target].concat(rest)
    );
  }
);

function reduce_using_reducer(reducer, initial_value, target) {
  let start_index = 0;

  if (initial_value === undefined) {
    initial_value = target[0];
    start_index = 1;
  }

  let accumulator = initial_value;

  each((value, index, array) => {
    if (index >= start_index) {
      accumulator = reducer(accumulator, value, index, array);
    }
  }, target);
  return accumulator;
}

function reduce_using_operator(symbol, initial_value, target) {
  const body = `return accumulator ${symbol}=current_value`;

  const reducer = new Function('accumulator, current_value', body);

  return reduce_using_reducer(reducer, initial_value, target);
}

const first_with_target = curry((direction, condition, target) => {
  let result = null;

  direction((...args) => {
    const match = condition(...args);

    if (match) result = args[0];

    return !match;
  }, target);

  return result;
});

function find_first_in_direction(direction) {
  return (condition_or_target, ...rest) => {
    if (Array.isArray(condition_or_target)) return condition_or_target[0] || null;
    if (condition_or_target === null) return null;
    const condition = condition_or_target;

    return rest.length > 0
      ? first_with_target(direction, condition, rest.pop())
      : first_with_target(direction, condition);
  };
}

export const last = find_first_in_direction(each_in_reverse_until);

export const first = find_first_in_direction(each_until);

export const any = curry((condition, target) => !!first(condition, target));

export const none = curry((condition, target) => !any(condition, target));

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

export const flat_map = curry((mapper, target) =>
  reduce([], (results, next_item) => results.concat(mapper(next_item)), target)
);

const flatten = flat_map(item => (Array.isArray(item) ? flatten(item) : [item]));

const uniq_with_target_and_mapper = curry((mapper, target) =>
  filter((value, index) => {
    const mapped = mapper(value);
    const first_matching_index = target.findIndex(value => mapper(value) === mapped);
    return index === first_matching_index;
  }, target)
);

export const uniq = (mapper_or_target, ...args) =>
  args.length === 0 && Array.isArray(mapper_or_target)
    ? uniq_with_target_and_mapper(val => val, mapper_or_target)
    : uniq_with_target_and_mapper(mapper_or_target, ...args);

export const true_for_all = curry((condition, target) =>
  reduce(true, (acc, ...args) => acc && condition(...args), target)
);

export const max = curry((value_resolver, target) =>
  reduce(
    0,
    (max_value, ...args) => {
      const item_value = value_resolver(...args);
      return item_value > max_value ? item_value : max_value;
    },
    target
  )
);

const default_comparer = (a, b) => (a < b ? -1 : a > b ? 1 : 0);

const sort_with_comparer_and_target = curry((comparer, target) => {
  const target_to_sort = target || [];
  const results = target_to_sort.slice(0);

  results.sort(comparer);

  return results;
});

export const sort = (comparer_or_target, ...args) => {
  if (comparer_or_target === null) return [];
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
  any,
  none,
  filter,
  map,
  flat_map,
  flatten,
  uniq,
  true_for_all,
  reduce,
  sort,
  max,
  generate
};
