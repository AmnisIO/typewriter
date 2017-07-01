

#include <Arduino.h>
#include <Gyrus.h>

Byte toggle(Byte value) {
  return value == HIGH ? LOW : HIGH;
}

Sinks* blink(Sources* arduino) {
  Sinks* sinks = sinks_create();
  any ___typewriter_generated_variable_900 = byte_stream_periodic(1000);
  any ___typewriter_generated_variable_901 = ___typewriter_generated_variable_902->sample(___typewriter_generated_variable_902, arduino->LED);
  any ___typewriter_generated_variable_902 = ___typewriter_generated_variable_900;
  sinks->LED = ___typewriter_generated_variable_901->map(___typewriter_generated_variable_901, toggle);
  return sinks;
}

void setup() {
  gyrus_run(blink);
}

void loop() {
	
}
