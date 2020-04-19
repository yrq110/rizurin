
import { Transform } from '@rizurin/util';
export const setTransform = (el: any, transform: Transform) => {
  const matrix = transform.matrix();
  el.setAttribute('transform', `matrix(${matrix.join(' ')})`);
};
