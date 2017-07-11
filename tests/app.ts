import { periodic } from '@amnisio/rivulet';
import { Sources, HIGH, LOW, run, createSinks } from '@amnisio/arduino-uno';

// Sample application that will fade an LED attached to the D10 pin using PWM.
// Requires an LED to be connected at pin D10.
// Every 30ms, the brightness of the LED attached to D10 is updated.
const application = (arduino: Sources) => {
  const sinks = createSinks();
  sinks.D10$ =
    periodic(30)
      .fold((brightness, event) => brightness == 101 ? 0 : (brightness + 1), 0)
      .map(brightness => {
        const x = brightness % 51;
        return brightness > x ? 51 - x : x;
      })
      .map(brightness => 5 * brightness);
  return sinks;
};

run(application);
