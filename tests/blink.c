

#include <Arduino.h>
#include <Gyrus.h>

Byte toggle(Byte value) {
  return value == HIGH ? LOW : HIGH;
}

Sinks* blink(Sources* arduino) {
  Sinks* sinks = sinks_create();
  any ___typewriter_1 = byte_stream_periodic(1000);
  any ___typewriter_2 = ___typewriter_1->sample(___typewriter_1, arduino->LED);
  sinks->LED = ___typewriter_2->map(___typewriter_2, toggle);
  return sinks;
}

void setup() {
  gyrus_run(blink);
}

void loop() {
	
}
