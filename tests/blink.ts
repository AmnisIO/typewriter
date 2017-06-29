import { ByteStream, Byte, periodic } from '@amnisio/rivulet';
import { Sources, Sinks, HIGH, LOW, run, createSinks } from '@amnisio/arduino-uno';

const toggle = (value: Byte) => value == HIGH ? LOW : HIGH;

const blink = (arduino: Sources) => {
  const sinks = createSinks();
  const sample$ = periodic(1000);
  const sampledLED$ = sample$.sample(arduino.LED$);
  sinks.LED$ = sampledLED$.map(toggle);
  return sinks;
}

run(blink);