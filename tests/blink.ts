import { ByteStream, Byte, periodic } from '@amnisio/rivulet';
import { Sources, Sinks, HIGH, LOW, run, createSinks } from '@amnisio/arduino-uno';

const blink = (arduino: Sources) => {
  const sinks = createSinks();
  sinks.LED$ =
    periodic(1000)
      .sample(arduino.LED$)
      .map(x => x == LOW ? HIGH : LOW);
  return sinks;
}

run(blink);
