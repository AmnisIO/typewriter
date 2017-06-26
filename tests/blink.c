

#include <Arduino.h>
#include <Gyrus.h>

Byte toggle(Byte value) {
  return value == HIGH ? LOW : HIGH;
};

Sinks* blink(Sources* arduino) {
  Sinks* sinks = sinks_create();
  ByteStream* sample = byte_stream_periodic(1000);
  ByteStream* sampledLED = sample->sample(sample, arduino->LED);
  sinks->LED = sampledLED->map(sampledLED, toggle);
  return sinks;
};

void setup() {
  gyrus_run(blink);
}

void loop() {
	
}
