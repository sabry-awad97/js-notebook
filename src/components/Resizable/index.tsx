import { ReactNode, useState } from 'react';
import { ResizableBox, ResizableBoxProps } from 'react-resizable';
import { useEventListener } from '../../hooks/useEventListener';
import './resizable.css';

interface ResizableProps {
  direction: 'horizontal' | 'vertical';
  children: ReactNode;
}

const Resizable: React.FC<ResizableProps> = ({ direction, children }) => {
  const [innerHeight, setInnerHeight] = useState(window.innerHeight);
  const [innerWidth, setInnerWidth] = useState(window.innerWidth);
  const [width, setWidth] = useState(window.innerWidth * 0.75);

  let timer: ReturnType<typeof setTimeout>;
  useEventListener('resize', () => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      setInnerHeight(window.innerHeight);
      setInnerWidth(window.innerWidth);
      if (window.innerWidth * 0.75 < width) setWidth(window.innerWidth * 0.75);
    }, 100);
  });

  const resizableProps: Record<ResizableProps['direction'], ResizableBoxProps> =
    {
      horizontal: {
        className: 'resize-horizontal',
        minConstraints: [innerWidth * 0.2, Infinity],
        maxConstraints: [innerWidth * 0.75, Infinity],
        height: Infinity,
        width,
        resizeHandles: ['e'],
        onResizeStop: (_event, data) => {
          setWidth(data.size.width);
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
