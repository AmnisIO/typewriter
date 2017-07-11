

#include <Rivulet.h>

#include <Arduino.h>
#include <Gyrus.h>

int _typewriter_anonymous_1(int brightness, int event) {
  return brightness == 49 ? 0 : ++brightness;
}

int _typewriter_anonymous_2(int brightness) {
  int x = brightness % 25;
  return brightness > x ? 25 - x : x;
}

int _typewriter_anonymous_3(int brightness) {
  return 5 * brightness;
}

Sinks* application(Sources* arduino) {
  Sinks* sinks = sinks_create();
  sinks->D10 = rivulet_stream_map(rivulet_stream_map(rivulet_stream_fold(rivulet_stream_periodic(30), _typewriter_anonymous_1, 0), _typewriter_anonymous_2), _typewriter_anonymous_3);
  return sinks;
}

void setup() {
  gyrus_run(application);
}

void loop() {
	
}
