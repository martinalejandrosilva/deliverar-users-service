import { Client } from "@stomp/stompjs";
import { WebSocket } from "ws";
let fs = require("fs");
Object.assign(global, { WebSocket });

export class EDA {
  private static instance: EDA;
  private brokerURL!: string;
  public client!: Client;

  private constructor() {
    // Singleton
  }

  public static getInstance(): EDA {
    if (!this.instance) {
      this.instance = new EDA();
      this.instance.initialize(); // Optionally, initialize here or externally
    }
    return this.instance;
  }

  private initialize() {
    console.log("Initializing EDA connection...");
    this.brokerURL = "ws://intappscore.azurewebsites.net/usuarios";
    this.eda_init();
    this.client.activate();
    console.log("Finished EDA init...");
  }

  public publishMessage(topic: string, message: any) {
    if (!this.client.connected) {
      this.client = new Client({
        brokerURL: this.brokerURL,
        onConnect: (frame) => {
          this.client.publish({
            destination: topic,
            body: JSON.stringify(message),
          });
        },
        onDisconnect: () => {
          console.log("Disconnected from websocket");
        },
        onStompError: (frame) => {
          console.log("Broker reported error: " + frame.headers["message"]);
          console.log("Additional details: " + frame.body);
        },
      });
    }
  }

  private process_usuarios(data: string) {
    fs.appendFile("logs.txt", data + "\n", function (err: { message: string }) {
      if (err) {
        console.log("EDA Usuarios error" + err.message);
      }
    });
  }

  // Vamos a quedarnos escuchando las diferentes colas aca
  // Como no sabemos la info que nos va a llegar, vamos a meter todos los mensajes
  // en un archivo hasta que sepamos procesarlos todos
  private eda_init() {
    this.client = new Client({
      brokerURL: this.brokerURL,
      onConnect: (frame) => {
        // Sub a Usuarios
        let sub_usuarios = this.client.subscribe("/topic/usuarios", (message) =>
          this.process_usuarios(message.body)
        );
      },
      onDisconnect: () => {
        console.log("Disconnected from websocket");
      },
      onStompError: (frame) => {
        console.log("Broker reported error: " + frame.headers["message"]);
        console.log("Additional details: " + frame.body);
      },
    });
  }
}
