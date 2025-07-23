#include <WiFi.h>
#include <HTTPClient.h>

// WiFi credentials
const char* ssid = "BadAssCoffee Admin-Guest";
const char* password = "badasscoffee";

// Firebase Realtime Database info
const char* firebaseHost = "https://habittracker-51406-default-rtdb.firebaseio.com";
const char* firebasePath = "/habits";

// Pin definitions
#define SWITCH1_PIN 15
#define LED1_PIN    4

#define SWITCH2_PIN 23
#define LED2_PIN    5

#define SWITCH3_PIN 22
#define LED3_PIN    6

#define SWITCH4_PIN 21
#define LED4_PIN    8

#define TOGGLE_SWITCH_PIN 20
#define TOGGLE_LED_PIN    10

bool lastState1 = HIGH;
bool lastState2 = HIGH;
bool lastState3 = HIGH;
bool lastState4 = HIGH;

void setup() {
  Serial.begin(115200);

  // Setup switch pins
  pinMode(SWITCH1_PIN, INPUT_PULLUP);
  pinMode(LED1_PIN, OUTPUT);

  pinMode(SWITCH2_PIN, INPUT_PULLUP);
  pinMode(LED2_PIN, OUTPUT);

  pinMode(SWITCH3_PIN, INPUT_PULLUP);
  pinMode(LED3_PIN, OUTPUT);

  pinMode(SWITCH4_PIN, INPUT_PULLUP);
  pinMode(LED4_PIN, OUTPUT);

  pinMode(TOGGLE_SWITCH_PIN, INPUT_PULLUP);
  pinMode(TOGGLE_LED_PIN, OUTPUT);

  // Connect to WiFi
  WiFi.begin(ssid, password);
  Serial.print("Connecting to WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(300);
    Serial.print(".");
  }
  Serial.println("\nWiFi connected!");
}

void loop() {
  bool toggleState = digitalRead(TOGGLE_SWITCH_PIN);  // LOW = ON
  digitalWrite(TOGGLE_LED_PIN, toggleState == LOW ? HIGH : LOW);

  // If toggle switch is OFF, turn off all LEDs and exit
  if (toggleState == HIGH) {
    digitalWrite(LED1_PIN, LOW);
    digitalWrite(LED2_PIN, LOW);
    digitalWrite(LED3_PIN, LOW);
    digitalWrite(LED4_PIN, LOW);
    delay(10);
    return;
  }

  bool currentState1 = digitalRead(SWITCH1_PIN);
  bool currentState2 = digitalRead(SWITCH2_PIN);
  bool currentState3 = digitalRead(SWITCH3_PIN);
  bool currentState4 = digitalRead(SWITCH4_PIN);

  if (lastState1 == HIGH && currentState1 == LOW) {
    Serial.println("CLICK: Switch 1");
    blinkAndSend(LED1_PIN, "switch1");
  }
  if (lastState2 == HIGH && currentState2 == LOW) {
    Serial.println("CLICK: Switch 2");
    blinkAndSend(LED2_PIN, "switch2");
  }
  if (lastState3 == HIGH && currentState3 == LOW) {
    Serial.println("CLICK: Switch 3");
    blinkAndSend(LED3_PIN, "switch3");
  }
  if (lastState4 == HIGH && currentState4 == LOW) {
    Serial.println("CLICK: Switch 4");
    blinkAndSend(LED4_PIN, "switch4");
  }

  lastState1 = currentState1;
  lastState2 = currentState2;
  lastState3 = currentState3;
  lastState4 = currentState4;

  delay(10); // debounce
}

void blinkAndSend(int ledPin, String habitName) {
  digitalWrite(ledPin, HIGH);
  delay(200);
  digitalWrite(ledPin, LOW);
  sendToFirebase(habitName);
}

void sendToFirebase(String habitName) {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    String url = String(firebaseHost) + firebasePath + "/" + habitName + ".json";
    
    http.begin(url);
    http.addHeader("Content-Type", "application/json");

    String json = "{\"timestamp\":" + String(millis()) + "}";
    int code = http.POST(json);

    Serial.print("Firebase POST (");
    Serial.print(habitName);
    Serial.print(") response: ");
    Serial.println(code);

    http.end();
  } else {
    Serial.println("WiFi disconnected!");
  }
}
