

#include <Arduino.h>
#include <Gyrus.h>

Byte toggle(Byte value) {
  return value == HIGH ? LOW : HIGH;
}

Sinks* blink(Sources* arduino) {
  Sinks* sinks = sinks_create();
  ByteStream* _typewriter_1 = byte_stream_periodic(1000);
  ByteStream* _typewriter_2 = _typewriter_1->sample(_typewriter_1, arduino->LED);
  sinks->LED = _typewriter_2->map(_typewriter_2, toggle);
  return sinks;
}

void setup() {
  gyrus_run(blink);
}

void loop() {
	
}
