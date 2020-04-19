import { Container } from './Container';
import { Shape } from './Shape';

export class Group extends Container<Group | Shape> {
  readonly type = 'Group';
}
