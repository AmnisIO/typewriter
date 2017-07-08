import { periodic } from '@amnisio/rivulet';
import { Sources, HIGH, LOW, run, createSinks } from '@amnisio/arduino-uno';

let brightness = 0;
let change = 5;

const getBrightness = (led: number) => {
  brightness = brightness + change;
  if (brightness <= LOW || brightness >= HIGH) change = -change;
  return brightness;
}

function fade(arduino: Sources) {
  const sinks = createSinks();
  sinks.D10$ = periodic(30).map(getBrightness);
  return sinks;
}

run(fade);
