

#include <Arduino.h>
#include <Gyrus.h>

int brightness = 0;

int change = 5;

int getCurrentBrightness(int event) {
  brightness = brightness + change;
  if (brightness <= GYRUS_LOW || brightness >= GYRUS_HIGH) change = -change; 
  return brightness;
}

Sinks* application(Sources* arduino) {
  Sinks* sinks = sinks_create();
  RivuletStream* _typewriter_intermediary_1 = rivulet_stream_periodic(30);
  sinks->D10 = _typewriter_intermediary_1->map(_typewriter_intermediary_1, getCurrentBrightness);
  return sinks;
}

void setup() {
  gyrus_run(application);
}

void loop() {
	
}
