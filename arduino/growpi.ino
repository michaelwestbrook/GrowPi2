#include <OneWire.h>
#include <DallasTemperature.h>
#include <Wire.h>
#include <Adafruit_Sensor.h>
#include "Adafruit_TSL2591.h"

// Data wire is plugged into port 2 on the Arduino
#define ONE_WIRE_BUS 2
#define arr_len( x )  ( sizeof( x ) / sizeof( *x ) )

const tsl2591Gain_t            GAIN             = TSL2591_GAIN_LOW;
const tsl2591IntegrationTime_t INTEGRATION_TIME = TSL2591_INTEGRATIONTIME_100MS;

const byte          IR_INDEX              = 0;
const byte          FULL_INDEX            = 1;
const byte          LUX_INDEX             = 2;
const uint32_t      SPEED                 = 9600;
const byte          MOISTURE_SENSOR       = A0;
const byte          MOISTURE_POWER        = 2;
const byte          SENSOR_COMMAND        = 1;
const byte          RELAY_COMMAND         = 2;
const byte          MOISTURE_COMMAND      = 1;
const byte          TEMPERATURE_COMMAND   = 2;
const byte          LUX_COMMAND           = 4;
const byte          NUM_MOISTURE_READINGS = 10;
const byte          RELAY_POWER           = 5;

// Setup a oneWire instance to communicate with any OneWire devices (not just Maxim/Dallas temperature ICs)
OneWire oneWire(ONE_WIRE_BUS);

// Pass our oneWire reference to Dallas Temperature.
DallasTemperature sensors(&oneWire);

Adafruit_TSL2591 my_tsl = Adafruit_TSL2591(2591); // pass in a number for the sensor identifier (for your use later)

byte my_relay_state = 255;

void setRelays(byte the_relays)
{
  byte state = the_relays;
  for (int i = 6; i < 14; i++)
  {
    uint8_t mode;
    if (state & 1)
    {
      mode = LOW;
    } else
    {
      mode = HIGH;
    }
    state = state >> 1;
    digitalWrite(i, mode);
  }

  my_relay_state = the_relays;
}

void configureSensor(tsl2591Gain_t the_gain, tsl2591IntegrationTime_t the_integration_time)
{
  my_tsl.setGain(the_gain);
  my_tsl.setTiming(the_integration_time);
}

void setup() {
  // start serial port
  Serial.begin(SPEED);
  // Start up the library
  sensors.begin();
  pinMode(MOISTURE_POWER, OUTPUT);
  for (int i = 6; i < 14; i++)
  {
    pinMode(i, OUTPUT);
  }

  analogReference(DEFAULT);
  if (!my_tsl.begin())
  {
    Serial.println("No sensor found ... check your wiring?");
    while (1);
  }

  /* Configure the sensor */
  configureSensor(GAIN, INTEGRATION_TIME);
  setRelays(0);
  pinMode(RELAY_POWER, OUTPUT);
  digitalWrite(RELAY_POWER, HIGH);
}

/**************************************************************************/
/*
    Show how to read IR and Full Spectrum at once and convert to lux
*/
/**************************************************************************/
void advancedRead(uint32_t* the_array)
{
  // More advanced data read example. Read 32 bits with top 16 bits IR, bottom 16 bits full spectrum
  // That way you can do whatever math and comparisons you want!
  uint32_t lum = my_tsl.getFullLuminosity();
  uint16_t ir, full;
  ir = lum >> 16;
  full = lum & 0xFFFF;
  the_array[IR_INDEX] = ir;
  the_array[FULL_INDEX] = full;
  the_array[LUX_INDEX] = my_tsl.calculateLux(full, ir);
}

//NOTE changed serial buffer size to 128 in <base Arduino folder>\hardware\arduino\avr\libraries\SoftwareSerial\SoftwareSerial.h
void printToSerial(uint32_t* the_lux, double the_temp, uint16_t the_moisture, byte the_command [])
{
  //{LUX:{IR:<int>,FULL:<int>,LUX:<int>},TEMP:<double>,MOISTURE:<int>}
  String result = "{";

  if (the_command[0] & SENSOR_COMMAND && the_command[1] & LUX_COMMAND)
  {
    result.concat("\"LUX\":");
    result.concat("{\"IR\":");
    result.concat(the_lux[IR_INDEX]);
    result.concat(",\"FULL\":");
    result.concat(the_lux[FULL_INDEX]);
    result.concat(",\"LUX\":");
    result.concat(the_lux[LUX_INDEX]);
    result.concat("}");
  }

  if (the_command[0] & SENSOR_COMMAND && the_command[1] & TEMPERATURE_COMMAND)
  {
    if (the_command[1] & LUX_COMMAND)
    {
      result.concat(",");
    }

    result.concat("\"TEMP\":");
    result.concat(the_temp);
  }

  if (the_command[0] & SENSOR_COMMAND && the_command[1] & MOISTURE_COMMAND)
  {
    if (the_command[1] & TEMPERATURE_COMMAND || the_command[1] & LUX_COMMAND)
    {
      result.concat(",");
    }

    result.concat("\"MOISTURE\":");
    result.concat(the_moisture);
  }

  if (the_command[0] & SENSOR_COMMAND && the_command[1] != 0)
  {
    result.concat(",");
  }

  // Always return the state of the relays
  result.concat("\"RELAYS\":");
  result.concat(my_relay_state);
  result.concat("}");
  byte bytes[result.length() + 1];
  result.getBytes(bytes, arr_len(bytes));
  Serial.write(bytes, result.length());
}

uint16_t readMoisture()
{
  //average NUM_MOISTURE_READINGS reading since they can be all over the place.
  uint16_t sum = 0;
  digitalWrite(MOISTURE_POWER, HIGH);
  for (int i = 0; i < NUM_MOISTURE_READINGS; i++)
  {
    sum = sum + analogRead(MOISTURE_SENSOR);
  }

  digitalWrite(MOISTURE_POWER, LOW);
  return sum / NUM_MOISTURE_READINGS;
}

double readTemperature()
{
  sensors.requestTemperatures(); // Send the command to get temperatures
  float temperature = sensors.getTempCByIndex(0);
  while (temperature == -127.0) {
    temperature = sensors.getTempCByIndex(0);
  }
  return temperature;
}

void performCommand(byte command, byte sensors, byte relays) {
  uint32_t lux [3] = {0, 0, 0};
  double temp = 0.0;
  uint16_t moisture = 0;
  if (command & SENSOR_COMMAND)
  {
    if (sensors & TEMPERATURE_COMMAND)
    {
      temp = readTemperature();
    }

    if (sensors & MOISTURE_COMMAND)
    {
      moisture = readMoisture();
    }

    if (sensors & LUX_COMMAND)
    {
      advancedRead(lux);
    }
  }

  if (command & RELAY_COMMAND)
  {
    if (relays != my_relay_state)
    {
      setRelays(relays);
    }
  }
  byte commands [3] = {command, sensors, relays};
  printToSerial(lux, temp, moisture, commands);
}

unsigned long lastCheck = millis();
void loop()
{
  if (Serial.available() == 3)
  {
    byte commands [3];
    Serial.readBytes(commands, 3);
    byte command = commands[0]; // (bitmask) 1 = read sensors, 2 = write to relays
    byte sensors = commands[1]; // (bitmask) 1 = moisture, 2 = temperature, 4 = LUX
    byte relays =  commands[2]; // (bitmask) 'Relay number'^2 - 1
    performCommand(command, sensors, relays);
  } else if (millis() - lastCheck > 60000) {
    lastCheck = millis();
    performCommand(SENSOR_COMMAND, MOISTURE_COMMAND + TEMPERATURE_COMMAND + LUX_COMMAND, 0);
  }
}