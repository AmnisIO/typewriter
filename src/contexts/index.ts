import { context as unoContext } from './arduino-uno';
import { context as rivuletContext } from './rivulet';

export interface Context {
  [x: string]: string;
  include_headers: string;
}

interface IndexedContexts {
  [x: string]: Context;
}

const contexts = {
  'arduino-uno': unoContext,
  rivulet: rivuletContext
};

export const getContext = (key: string) => contexts[key];
