import { io, Socket } from "socket.io-client";
import axiosInstance from "../../apis/axiosInstance";

const API_URL = axiosInstance.defaults.baseURL || "http://10.0.2.2:3000";

class SocketService {
  private socket: Socket | null = null;
  private userId: string | null = null;
  private isConnecting: boolean = false;
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 5;

  // Get the socket instance
  getSocket(): Socket | null {
    return this.socket;
  }

  // Connect to socket server
  connect(userId: string): Promise<Socket> {
    return new Promise((resolve, reject) => {
      if (this.isConnecting) {
        console.log("Socket connection already in progress");
        reject(new Error("Connection already in progress"));
        return;
      }

      // If socket exists and is connected
      if (this.socket && this.socket.connected) {
        console.log("Socket already connected");

        // If userId changed, register with new ID
        if (this.userId !== userId) {
          this.userId = userId;
          this.socket.emit("register", userId, (response: any) => {
            console.log("Re-registered with new user ID:", response);
          });
        }

        resolve(this.socket);
        return;
      }

      this.isConnecting = true;
      this.userId = userId;

      console.log(`Connecting to socket at ${API_URL} for user ${userId}`);
      this.socket = io(API_URL, {
        transports: ["websocket"],
        reconnection: true,
        reconnectionAttempts: this.maxReconnectAttempts,
        reconnectionDelay: 1000,
        timeout: 10000,
      });

      this.socket.on("connect", () => {
        console.log("Socket connected with ID:", this.socket?.id);
        this.isConnecting = false;
        this.reconnectAttempts = 0;

        // Register user with their ID
        this.socket?.emit("register", userId, (response: any) => {
          console.log("User registered:", response);
        });

        resolve(this.socket as Socket);
      });

      this.socket.on("connect_error", (error) => {
        console.error("Socket connection error:", error);
        this.reconnectAttempts++;

        if (this.reconnectAttempts >= this.maxReconnectAttempts) {
          this.isConnecting = false;
          reject(new Error("Failed to connect after max attempts"));
        }
      });

      this.socket.on("disconnect", (reason) => {
        console.log("Socket disconnected:", reason);
      });

      // Set a timeout in case connection hangs
      setTimeout(() => {
        if (this.isConnecting) {
          this.isConnecting = false;
          reject(new Error("Connection timeout"));
        }
      }, 10000);
    });
  }

  // Join a conversation room
  joinConversation(conversationId: string) {
    if (!this.socket || !this.socket.connected) {
      console.error("Socket not connected - cannot join conversation");
      return false;
    }

    console.log(`Joining conversation: ${conversationId}`);
    this.socket.emit("join_conversation", conversationId, (response: any) => {
      console.log("Join conversation response:", response);
    });
    return true;
  }

  // Leave a conversation room
  leaveConversation(conversationId: string) {
    if (!this.socket || !this.socket.connected) {
      console.error("Socket not connected - cannot leave conversation");
      return false;
    }

    console.log(`Leaving conversation: ${conversationId}`);
    this.socket.emit("leave_conversation", conversationId);
    return true;
  }

  // Send a message
  sendMessage(payload: { conversationId: string; message: any }) {
    if (!this.socket || !this.socket.connected) {
      console.error("Socket not connected - cannot send message");
      return false;
    }

    console.log("Sending message via socket:", payload);
    this.socket.emit("send_message", payload);
    return true;
  }

  // Listen for new messages
  onReceiveMessage(callback: (message: any) => void) {
    if (!this.socket) {
      console.error("Socket not initialized - cannot listen for messages");
      return () => {};
    }

    this.socket.on("receive_message", callback);
    return () => {
      this.socket?.off("receive_message", callback);
    };
  }

  // Listen for conversation updates
  onConversationUpdated(callback: (data: any) => void) {
    if (!this.socket) {
      console.error("Socket not initialized - cannot listen for updates");
      return () => {};
    }

    this.socket.on("conversation_updated", callback);
    return () => {
      this.socket?.off("conversation_updated", callback);
    };
  }

  // Disconnect socket
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.userId = null;
      this.isConnecting = false;
      console.log("Socket disconnected manually");
    }
  }
}

// Create a singleton instance
const socketService = new SocketService();
export default socketService;
