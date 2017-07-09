

#include <Arduino.h>
#include <Gyrus.h>

int invert(int value) {
  return value == GYRUS_SIGNAL_LEVEL_LOW ? GYRUS_SIGNAL_LEVEL_HIGH : GYRUS_SIGNAL_LEVEL_LOW;
}

Sinks* application(Sources* arduino) {
  Sinks* sinks = sinks_create();
  sinks->D5 = rivulet_stream_map(rivulet_stream_sample(rivulet_stream_periodic(100), arduino->D5), invert);
  sinks->D10 = rivulet_stream_map(rivulet_stream_sample(rivulet_stream_periodic(250), arduino->D10), invert);
  sinks->LED = rivulet_stream_map(rivulet_stream_sample(rivulet_stream_periodic(500), arduino->LED), invert);
  return sinks;
}