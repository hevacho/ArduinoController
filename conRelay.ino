#include <ArduinoJson.h>

const int PIN_RELAY_1=2;
const int PIN_RELAY_2=3;
const int PIN_RELAY_3=4;
const int PIN_RELAY_4=5;
int myPin [] = {PIN_RELAY_1, PIN_RELAY_2, PIN_RELAY_3, PIN_RELAY_4};

void setup() {
  Serial.begin(9600);
  for(int i=1; i<=4; i++){
    pinMode(getNumberPin(i),OUTPUT);
    digitalWrite(i,LOW);
  }
  while(!Serial){}

}

void loop() {
  const size_t documentRead = JSON_OBJECT_SIZE(2)+40;
  
  if(Serial.available() > 1){
    
    DynamicJsonDocument doc(documentRead);
    DeserializationError err = deserializeJson(doc, Serial);
    if (err) {
      Serial.print(F("deserializeJson() failed with code "));
      Serial.println(err.c_str());
    }else{
      String command = doc["command"];
      int relayNumber = doc["relayNumber"];
     
      if(command.equals("getData")){
        getData();
      }else if(command.equals("on")){
        switchOn(relayNumber);
        getData();
      }else if(command.equals("off")){
        switchOff(relayNumber);
        getData();
      }
      
    }
  }
  
}

void getData(){
  const int capacity = JSON_OBJECT_SIZE(4);
  StaticJsonDocument<capacity> doc;
  doc["relay1"] = digitalRead(PIN_RELAY_1);
  doc["relay2"] = digitalRead(PIN_RELAY_2);
  doc["relay3"] = digitalRead(PIN_RELAY_3);
  doc["relay4"] = digitalRead(PIN_RELAY_4);
  String aux;
  serializeJson(doc, aux);
  aux=aux+"END";
  Serial.print(aux);

}

void switchOn(int number){
  switchState(number, HIGH);
}

void switchOff(int number){
  switchState(number, LOW);
}

void switchState(int number, int state){
  int numberPin = getNumberPin(number);
  if(numberPin != -1){
    digitalWrite(numberPin, state);  
  }
}

int getNumberPin(int number){
  if(number>=1 && number<=4){
    return myPin[number-1];
  }
}
