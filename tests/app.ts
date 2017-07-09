import { Int, periodic } from '@amnisio/rivulet';
import { Sources, HIGH, LOW, run, createSinks } from '@amnisio/arduino-uno';

// Initialize brightness and change
let brightness = 0;
let change = 5;

const getCurrentBrightness = (event: Int) => {
  // Make the change to brightness
  brightness = brightness + change;
  // If the cycle has ended, invert the change
  if (brightness <= LOW || brightness >= HIGH) change = -change;
  // Return the current brightness
  return brightness;
}

// Sample application that will fade an LED attached to the D10 pin using PWM.
// Requires an LED to be connected at pin D10.
// Every 30ms, the brightness of the LED attached to D10 is updated.
const application = (arduino: Sources) => {
  const sinks = createSinks();
  const sample$ = periodic(50);
  const fade$ = sample$.map(getCurrentBrightness);
  sinks.D10$ = fade$;
  sinks.D5$ = fade$;
  sinks.LED$ = sample$.sample(arduino.LED$).map(led => led === LOW ? HIGH : LOW);
  return sinks;
};

run(application);
