#include <WiFi.h>
#include <WiFiClient.h>
#include <WebServer.h>
#include <ESPmDNS.h>
#include <FirebaseESP32.h>

#define FIREBASE_HOST "https://proyectohumedad-a68df-default-rtdb.firebaseio.com/"
#define FIREBASE_AUTH "mjm96ElEVdmWTTSXvRAvUN7kVwsF3ReO0gk5Ubre"

const char* ssid = "MIGUEL";
const char* password = "1061806264";
FirebaseData firebaseData;

WebServer server(80);


String ruta = "/ESP32";
String ruta2 = "/BD";
float I = 6;
const int sensorPin = A0;
const byte LED = 32; 
int sensorValue;
int RelatHumidity; 

void handleRoot() {
  
  server.send(200, "text/plain", "hello from esp8266!");
}

void handleNotFound() {
  
  String message = "File Not Found\n\n";
  message += "URI: ";
  message += server.uri();
  message += "\nMethod: ";
  message += (server.method() == HTTP_GET) ? "GET" : "POST";
  message += "\nArguments: ";
  message += server.args();
  message += "\n";
  for (uint8_t i = 0; i < server.args(); i++) {
    message += " " + server.argName(i) + ": " + server.arg(i) + "\n";
  }
  server.send(404, "text/plain", message);
 
}

void setup(void) {
  pinMode(LED, OUTPUT);
  
  Serial.begin(115200);
  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);
  Serial.println("");

  // Wait for connection
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.print("Connected to ");
  Serial.println(ssid);
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());

  if (MDNS.begin("esp32")) {
    Serial.println("MDNS responder started");
  }



  server.onNotFound(handleNotFound);

  server.begin();
  Serial.println("HTTP server started");

   Firebase.begin(FIREBASE_HOST, FIREBASE_AUTH);
  Firebase.reconnectWiFi(true);
}

void loop(void) {
  server.handleClient();
  sensorValue = analogRead(sensorPin);  
  RelatHumidity = map(sensorValue, 2350, 4095, 100, 0);
  Serial.println(RelatHumidity);
  Firebase.push(firebaseData, ruta2 + "/", RelatHumidity); 
  Firebase.setInt(firebaseData, ruta + "/Humedad" , RelatHumidity);
  if(sensorValue <= 3000 && sensorValue >= 2450){
    Serial.println("Humedo");
    Firebase.setString(firebaseData, ruta + "/Motor" , "desactivara");
     Firebase.setString(firebaseData, ruta + "/LED" , "red");
     digitalWrite(LED, LOW);
  }else{
    Serial.println("Seco");
    Firebase.setString(firebaseData, ruta + "/Motor" , "activara");
     Firebase.setString(firebaseData, ruta + "/LED" , "green");
     digitalWrite(LED, HIGH);
  }
}
