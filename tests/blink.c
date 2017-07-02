

#include <Arduino.h>
#include <Gyrus.h>

(x: Byte) => Byte _typewriter_anonymous_1(Byte x) {
  return x == LOW ? HIGH : LOW;
}

Sinks* blink(Sources* arduino) {
  Sinks* sinks = sinks_create();
  ByteStream* _typewriter_1 = byte_stream_periodic(1000);
  ByteStream* _typewriter_2 = _typewriter_1->sample(_typewriter_1, arduino->LED);
  sinks->LED = _typewriter_2->map(_typewriter_2, _typewriter_anonymous_1);
  return sinks;
}

void setup() {
  gyrus_run(blink);
}

void loop() {
	
}
