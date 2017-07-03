

#include <Arduino.h>
#include <Gyrus.h>

Byte invert(Byte value) {
  return value == LOW ? HIGH : LOW;
}

Sinks* application(Sources* arduino) {
  Sinks* sinks = sinks_create();
  ByteStream* _typewriter_intermediary_1 = byte_stream_periodic(100);
  ByteStream* _typewriter_intermediary_2 = _typewriter_intermediary_1->sample(_typewriter_intermediary_1, arduino->D2);
  sinks->D2 = _typewriter_intermediary_2->map(_typewriter_intermediary_2, invert);
  ByteStream* _typewriter_intermediary_3 = byte_stream_periodic(250);
  ByteStream* _typewriter_intermediary_4 = _typewriter_intermediary_3->sample(_typewriter_intermediary_3, arduino->D3);
  sinks->D3 = _typewriter_intermediary_4->map(_typewriter_intermediary_4, invert);
  sinks->LED = byte_stream_periodic(500)->sample(byte_stream_periodic(500), arduino->LED)->map(byte_stream_periodic(500)->sample(byte_stream_periodic(500), arduino->LED), invert);
  return sinks;
}

void setup() {
  gyrus_run(application);
}

void loop() {
	
}
