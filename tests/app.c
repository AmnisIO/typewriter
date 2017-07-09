

#include <Arduino.h>
#include <Gyrus.h>

int _typewriter_anonymous_1(int led) {
  return led == GYRUS_SIGNAL_LEVEL_LOW ? GYRUS_SIGNAL_LEVEL_HIGH : GYRUS_SIGNAL_LEVEL_LOW;
}

int brightness = 0;

int change = 5;

int getCurrentBrightness(int event) {
  brightness = brightness + change;
  if (brightness <= GYRUS_SIGNAL_LEVEL_LOW || brightness >= GYRUS_SIGNAL_LEVEL_HIGH) change = -change; 
  return brightness;
}

Sinks* application(Sources* arduino) {
  Sinks* sinks = sinks_create();
  RivuletStream* sample = rivulet_stream_periodic(50);
  RivuletStream* fade = rivulet_stream_map(sample, getCurrentBrightness);
  sinks->D10 = fade;
  sinks->D5 = fade;
  RivuletStream* _typewriter_intermediary_1 = rivulet_stream_sample(sample, arduino->LED);
  sinks->LED = rivulet_stream_map(_typewriter_intermediary_1, _typewriter_anonymous_1);
  return sinks;
}

void setup() {
  gyrus_run(application);
}

void loop() {
	
}
