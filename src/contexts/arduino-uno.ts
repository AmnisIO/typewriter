export const context = {
  include_headers: 'Arduino,Gyrus',
  Sources: 'Sources*',
  Sinks: 'Sinks*',
  createSinks: 'sinks_create',
  run: 'gyrus_run',
  run_wrapper: 'void setup() {\n  :::\n}\n\nvoid loop() {\n\t\n}\n',
  HIGH: 'GYRUS_SIGNAL_LEVEL_HIGH',
  LOW: 'GYRUS_SIGNAL_LEVEL_LOW' 
};
