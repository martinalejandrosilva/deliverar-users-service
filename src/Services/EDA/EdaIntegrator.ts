import { Client } from "@stomp/stompjs";
import { WebSocket } from "ws";
import { EventName, IEvent } from "../../Models/types";
import { eventNames } from "process";
import { adminPersonalHandler } from "./handlers/adminPersonalHandler";
let fs = require("fs");
Object.assign(global, { WebSocket });

export class EDA {
  private static instance: EDA;
  private brokerURL!: string;
  public client!: Client;
  private isConnected: boolean = false;
  private messageQueue: Array<{ topic: string; message: any }> = [];

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

  public publishMessage<T>(topic: string, eventName: EventName, message: T) {
    const event: IEvent<T> = {
      sender: "usuarios",
      created_at: Date.now(),
      event_name: eventName,
      data: message,
    };

    if (this.client.connected) {
      this.client.publish({
        destination: topic,
        body: JSON.stringify(event),
      });
    } else {
      this.messageQueue.push({ topic, message });
    }
  }

  private processMessageQueue() {
    while (this.messageQueue.length > 0) {
      const dequeuedItem = this.messageQueue.shift();
      if (dequeuedItem) {
        // Check if dequeuedItem is not undefined
        const { topic, message } = dequeuedItem;
        this.client.publish({
          destination: topic,
          body: JSON.stringify(message),
        });
      }
    }
  }

  private process_usuarios(data: string) {
    fs.appendFile("logs.txt", data + "\n", function (err: { message: string }) {
      if (err) {
        console.log("EDA Usuarios error" + err.message);
      }
    });
  }
  private process_admin_personal(data: string) {
    fs.appendFile(
      "AdminDePersonal.txt",
      data + "\n",
      function (err: { message: string }) {
        if (err) {
          console.log("EDA Adm. Personal error" + err.message);
        }
      }
    );
  }

  // Vamos a quedarnos escuchando las diferentes colas aca
  // Como no sabemos la info que nos va a llegar, vamos a meter todos los mensajes
  // en un archivo hasta que sepamos procesarlos todos
  private eda_init() {
    this.client = new Client({
      brokerURL: this.brokerURL,
      onConnect: (frame) => {
        this.isConnected = true;
        this.processMessageQueue();

        let sub_usuarios = this.client.subscribe(
          "/topic/usuarios",
          (message) => {
            adminPersonalHandler(message.body); //remove
            this.process_usuarios(message.body);
          }
        );

        let sub_adm_pesonal = this.client.subscribe(
          "/topic/admin-personal",
          (message) => {
            adminPersonalHandler(message.body);
            this.process_admin_personal(message.body);
          }
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
