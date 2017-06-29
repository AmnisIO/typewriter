import { ByteStream, Byte, periodic } from '@amnisio/rivulet';
import { Sources, Sinks, HIGH, LOW, run, createSinks } from '@amnisio/arduino-uno';

const toggle = (value: Byte): Byte => value == HIGH ? LOW : HIGH;

const blink = (arduino: Sources): Sinks => {
  const sinks: Sinks = createSinks();
  const sample$: ByteStream = periodic(1000);
  const sampledLED$: ByteStream = sample$.sample(arduino.LED$);
  sinks.LED$ = sampledLED$.map(toggle);
  return sinks;
}

run(blink);