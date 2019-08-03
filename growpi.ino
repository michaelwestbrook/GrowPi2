#include <Wire.h>
#include <Adafruit_Sensor.h>
#include "Adafruit_TSL2591.h"

#include <OneWire.h> 
#include <DallasTemperature.h>

// Temperature Sensor 
#define TEMP_SENSOR_BUS 2 
OneWire oneWire(TEMP_SENSOR_BUS); 
DallasTemperature temperatureSensor(&oneWire);

// Lux Sensor
Adafruit_TSL2591 tsl = Adafruit_TSL2591(2591); // pass in a number for the sensor identifier (for your use later)

// Relays
int RELAY_POWER = 5;
int ONE = 6;
int TWO = 7;
int THREE = 8;
int FOUR = 9;
int FIVE = 10;
int SIX = 11;
int SEVEN = 12;
int EIGHT = 13;
int relayState = HIGH;


/**************************************************************************/
/*
    Configures the gain and integration time for the TSL2591
*/
/**************************************************************************/
void configureLuxSensor(void)
{
  // You can change the gain on the fly, to adapt to brighter/dimmer light situations
  //tsl.setGain(TSL2591_GAIN_LOW);    // 1x gain (bright light)
  tsl.setGain(TSL2591_GAIN_MED);      // 25x gain
  // tsl.setGain(TSL2591_GAIN_HIGH);   // 428x gain
  
  // Changing the integration time gives you a longer time over which to sense light
  // longer timelines are slower, but are good in very low light situtations!
  tsl.setTiming(TSL2591_INTEGRATIONTIME_100MS);  // shortest integration time (bright light)
}

void configureRelays() {
  pinMode(RELAY_POWER, OUTPUT);
  digitalWrite(RELAY_POWER, relayState);
  pinMode(ONE, OUTPUT);
  pinMode(TWO, OUTPUT);
  pinMode(THREE, OUTPUT);
  pinMode(FOUR, OUTPUT);
  pinMode(FIVE, OUTPUT);
  pinMode(SIX, OUTPUT);
  pinMode(SEVEN, OUTPUT);
  pinMode(EIGHT, OUTPUT); 
}

void setup(void){
  Serial.begin(9600);
  temperatureSensor.begin(); 
  
  if (!tsl.begin()) 
  {
    Serial.println("No sensor found ... check your wiring?");
    while (1);
  }
      
  configureLuxSensor();
  configureRelays();
}

void loop() {}
unsigned char status = OFF;
/*
  SerialEvent occurs whenever a new data comes in the hardware serial RX. This
  routine is run between each time loop() runs, so using delay inside loop can
  delay response. Multiple bytes of data may be available.
*/
void serialEvent() {
  int inByte = Serial.read();
  status = status == ON ? OFF : ON;
  // Serial.println(status);
  digitalWrite(ONE, status);
  digitalWrite(TWO, status);
  digitalWrite(THREE, status);
  digitalWrite(FOUR, status);
  digitalWrite(FIVE, status);
  digitalWrite(SIX, status);
  digitalWrite(SEVEN, status);
  digitalWrite(EIGHT, status);
  Serial.println(inByte);
  uint32_t lum = tsl.getFullLuminosity();
  uint16_t ir, full;
  ir = lum >> 16;
  full = lum & 0xFFFF;
  float lux = tsl.calculateLux(full, ir);
  temperatureSensor.requestTemperatures();
  float temp = temperatureSensor.getTempCByIndex(0);
  // Serial.println("{\"IR\":" + String(ir) + ",\"Visible\":" + String(full - ir) + "\"Full\":" + String(full) + ",\"Temperature\":" + String(temp) + "}");
}