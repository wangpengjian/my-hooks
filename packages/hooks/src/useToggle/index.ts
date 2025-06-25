import { useMemo, useState } from 'react';

// useToggle
// true false
// 1. defaultValue
// 2. defaultValue reverseValue true false
// 3. defaultValue 'left' reverseValue 'right'

type noop = () => void;

interface Action<T> {
  toggle: noop;
  setLeft: noop;
  setRight: noop;
  set: (value: T) => void;
}

function useToggle<T = boolean>(): [boolean, Action<T>];

function useToggle<T>(defaultValue: T): [T, Action<T>];

function useToggle<D, R>(defaultValue: D, reverseValue?: R): [D | R, Action<D | R>];

function useToggle<D, R>(defaultValue: D = false as D, reverseValue?: R) {
  const [state, setState] = useState<D | R>(defaultValue);

  const actions = useMemo(() => {
    const reverseValueOrigin = (reverseValue === undefined ? !defaultValue : reverseValue) as D | R;

    const toggle = () => setState((s) => (s === defaultValue ? reverseValueOrigin : defaultValue));

    const setLeft = () => setState(defaultValue);

    const setRight = () => setState(reverseValueOrigin);

    const set = (value: D | R) => setState(value);

    return {
      toggle,
      setLeft,
      setRight,
      set,
    };
  }, []);

  return [state, actions];
}

export default useToggle;