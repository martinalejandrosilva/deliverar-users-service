import { Client } from "@stomp/stompjs";
import { WebSocket } from "ws";
import { EventName, IEmployee, IEvent } from "../../Models/types";
import { eventNames } from "process";
import { adminPersonalHandler } from "./handlers/adminPersonalHandler";
import { robotsHandler } from "./handlers/robotsHandler";
import { marketplaceHandler } from "./handlers/marketplaceHandler";
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
      this.instance.initialize();
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
      console.log("Publishing message to topic", topic);
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
        console.log("Publishing message to topiccccc", topic);
        try {
          this.client.publish({
            destination: topic,
            body: JSON.stringify(message),
          });
        } catch (err) {
          console.log("Error en el publish");
        }
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
    console.log("Admin Personal");
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

  private process_robots(data: string) {
    fs.appendFile(
      "robots.txt",
      data + "\n",
      function (err: { message: string }) {
        if (err) {
          console.log("EDA Robots error" + err.message);
        }
      }
    );
  }

  private process_core_bancario(data: string) {
    fs.appendFile(
      "logsBancario.txt",
      data + "\n",
      function (err: { message: string }) {
        if (err) {
          console.log("EDA Core Bancario error" + err.message);
        }
      }
    );
  }

  private process_marketplace(data: string) {
    fs.appendFile(
      "marketplace.txt",
      data + "\n",
      function (err: { message: string }) {
        if (err) {
          console.log("EDA Marketplace error" + err.message);
        }
      }
    );
  }

  // Vamos a quedarnos escuchando las diferentes colas aca
  // Como no sabemos la info que nos va a llegar, vamos a meter todos los mensajes
  // en un archivo hasta que sepamos procesarlos todos
  private eda_init() {
    console.log("Eda Init function....");
    this.client = new Client({
      brokerURL: this.brokerURL,
      onConnect: (frame) => {
        console.log("Connected to websocket");
        this.isConnected = true;

        this.client.subscribe("/topic/usuarios", (message) => {
          this.process_usuarios(message.body);
        });

        this.client.subscribe("/topic/admin-personal", (message) => {
          console.log("Admin Personal");
          adminPersonalHandler(message.body);
          this.process_admin_personal(message.body);
        });

        this.client.subscribe("/topic/robots", (message) => {
          console.log("Robots");
          robotsHandler(message.body);
          this.process_robots(message.body);
        });

        this.client.subscribe("/topic/marketplace", (message) => {
          console.log("Marketplace");
          marketplaceHandler(message.body);
          this.process_marketplace(message.body);
        });

        this.client.subscribe("/topic/core-bancario", (message) =>
          this.process_core_bancario(message.body)
        );

        this.processMessageQueue();
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
