

#include <Arduino.h>
#include <Gyrus.h>

int brightness = 0;

int change = 5;

int getBrightness(ignored_NumberKeyword led) {
  brightness = brightness + change;
  if (brightness <= GYRUS_LOW ignored_BarBarToken brightness >= GYRUS_HIGH) change = ignored_PrefixUnaryExpression; 
  return brightness;
}

Sinks* fade(Sources* arduino) {
  Sinks* sinks = sinks_create();
  RivuletStream* _typewriter_intermediary_1 = rivulet_stream_periodic(30);
  sinks->D10 = _typewriter_intermediary_1->map(_typewriter_intermediary_1, getBrightness);
  return sinks;
}

void setup() {
  gyrus_run(fade);
}

void loop() {
	
}
