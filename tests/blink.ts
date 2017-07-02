import { ByteStream, Byte, periodic } from '@amnisio/rivulet';
import { Sources, Sinks, HIGH, LOW, run, createSinks } from '@amnisio/arduino-uno';

const toggle = (value: Byte) => value == HIGH ? LOW : HIGH;

const blink = (arduino: Sources) => {
  const sinks = createSinks();
  sinks.LED$ =
    periodic(1000)
      .sample(arduino.LED$)
      .map(toggle);
  return sinks;
}

run(blink);
