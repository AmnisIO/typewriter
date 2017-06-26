import { ByteStream, Byte, periodic } from 'rivulet';
// Use the arduino-uno configuration of AmnisIO
import { Sources, Sinks, HIGH, LOW, run, createSinks } from '@amnisio/arduino-uno';

const toggle = (value: Byte): Byte => {
  return value == HIGH ? LOW : HIGH;
}

const blink = (arduino: Sources): Sinks => {
  const sinks: Sinks = createSinks();
  const sample$: ByteStream = periodic(1000);
  const sampledLED$: ByteStream = sample$.sample(arduino.LED$);
  sinks.LED$ = sampledLED$.map(toggle);
  return sinks;
}

run(blink);