import { ReactNode, useReducer } from 'react';
import { ResizableBox, ResizableBoxProps } from 'react-resizable';
import { useEventListener } from '../../hooks/useEventListener';
import './resizable.css';

interface ResizableProps {
  direction: 'horizontal' | 'vertical';
  children: ReactNode;
}

interface ResizeState {
  innerHeight: number;
  innerWidth: number;
  width: number;
}

type ResizeAction =
  | { type: 'SET_INNER_HEIGHT'; height: number }
  | { type: 'SET_INNER_WIDTH'; width: number }
  | { type: 'SET_WIDTH'; width: number };

const initialState: ResizeState = {
  innerHeight: window.innerHeight,
  innerWidth: window.innerWidth,
  width: window.innerWidth * 0.75,
};

const resizeReducer = (
  state: ResizeState,
  action: ResizeAction
): ResizeState => {
  switch (action.type) {
    case 'SET_INNER_HEIGHT':
      return { ...state, innerHeight: action.height };
    case 'SET_INNER_WIDTH':
      return { ...state, innerWidth: action.width };
    case 'SET_WIDTH':
      return { ...state, width: action.width };
    default:
      return state;
  }
};

const Resizable: React.FC<ResizableProps> = ({ direction, children }) => {
  const [state, dispatch] = useReducer(resizeReducer, initialState);

  let timer: ReturnType<typeof setTimeout>;
  useEventListener('resize', () => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      dispatch({ type: 'SET_INNER_HEIGHT', height: window.innerHeight });
      dispatch({ type: 'SET_INNER_WIDTH', width: window.innerWidth });
      if (window.innerWidth * 0.75 < state.width) {
        dispatch({ type: 'SET_WIDTH', width: window.innerWidth * 0.75 });
      }
    }, 100);
  });

  const resizableProps: Record<ResizableProps['direction'], ResizableBoxProps> =
    {
      horizontal: {
        className: 'resize-horizontal',
        minConstraints: [innerWidth * 0.2, Infinity],
        maxConstraints: [innerWidth * 0.75, Infinity],
        height: Infinity,
        width: state.width,
        resizeHandles: ['e'],
        onResizeStop: (_event, data) => {
          dispatch({ type: 'SET_WIDTH', width: data.size.width });
        },
      },
      vertical: {
        minConstraints: [Infinity, 24],
        maxConstraints: [Infinity, innerHeight * 0.9],
        height: 300,
        width: Infinity,
        resizeHandles: ['s'],
      },
    };

  return <ResizableBox {...resizableProps[direction]}>{children}</ResizableBox>;
};

export default Resizable;
