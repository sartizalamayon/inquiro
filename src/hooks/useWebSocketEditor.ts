'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

interface WebSocketMessage {
  type: string;
  sectionId?: string;
  content?: string;
  message?: string;
}

interface PendingUpdate {
  sectionId: string;
  content: string;
  timestamp: number;
}

interface UseWebSocketEditorParams {
  paperId: string;
  onExternalUpdate?: (sectionId: string, content: string) => void;
}

interface UseWebSocketEditorResult {
  connected: boolean;
  sendUpdate: (sectionId: string, content: string) => void;
  error: string | null;
}

// Get the correct type for timeout functions in both browser and Node environments
type TimeoutId = ReturnType<typeof setTimeout>;

// Singleton to track active connections
const activeConnections: Record<string, {
  socket: WebSocket;
  listeners: Set<(message: WebSocketMessage) => void>;
  isConnecting: boolean;
  reconnectAttempts: number;
  reconnectTimeout: TimeoutId | null;
  pingInterval: TimeoutId | null;
  pendingUpdates: Map<string, PendingUpdate>; // Map of sectionId to update
  processingUpdates: boolean;
}> = {};

// Track component instances using the hook
const connectedComponents: Record<string, number> = {};

const useWebSocketEditor = ({ paperId, onExternalUpdate }: UseWebSocketEditorParams): UseWebSocketEditorResult => {
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const listenerRef = useRef<(message: WebSocketMessage) => void>(() => {});
  const errorTimeoutRef = useRef<TimeoutId | null>(null);

  // Clear error after some time
  const clearErrorAfterDelay = useCallback((errorMessage: string) => {
    setError(errorMessage);
    
    if (errorTimeoutRef.current) {
      clearTimeout(errorTimeoutRef.current);
    }
    
    errorTimeoutRef.current = setTimeout(() => {
      setError(null);
    }, 5000); // Clear error after 5 seconds
  }, []);

  // Create a listener function for this component instance
  const createListener = useCallback(() => {
    const listener = (message: WebSocketMessage) => {
      if (message.type === 'update' && message.sectionId && message.content) {
        onExternalUpdate?.(message.sectionId, message.content);
      } else if (message.type === 'error' && message.message) {
        clearErrorAfterDelay(message.message);
      } else if (message.type === 'status') {
        if (message.message === 'Connected successfully') {
          setConnected(true);
          setError(null);
        } else if (message.message === 'Disconnected') {
          setConnected(false);
        }
      }
    };
    
    listenerRef.current = listener;
    return listener;
  }, [onExternalUpdate, clearErrorAfterDelay]);

  // Process pending updates from the queue
  const processUpdateQueue = useCallback((connection: typeof activeConnections[string]) => {
    if (!connection || connection.processingUpdates || connection.pendingUpdates.size === 0) {
      return;
    }

    if (connection.socket.readyState !== WebSocket.OPEN) {
      return; // Wait until connection is open
    }

    connection.processingUpdates = true;

    try {
      // Sort updates by timestamp (oldest first)
      const sortedUpdates = Array.from(connection.pendingUpdates.values())
        .sort((a, b) => a.timestamp - b.timestamp);
      
      // Process only the most recent update for each section
      const latestUpdates = new Map<string, PendingUpdate>();
      
      for (const update of sortedUpdates) {
        latestUpdates.set(update.sectionId, update);
      }

      // Send each latest update
      for (const [sectionId, update] of latestUpdates.entries()) {
        try {
          const message: WebSocketMessage = {
            type: 'update',
            sectionId: update.sectionId,
            content: update.content
          };
          
          connection.socket.send(JSON.stringify(message));
          connection.pendingUpdates.delete(sectionId);
        } catch (err) {
          console.error(`Failed to send update for section ${sectionId}:`, err);
        }
      }
    } finally {
      connection.processingUpdates = false;
      
      // If there are still updates in the queue, process them again
      if (connection.pendingUpdates.size > 0) {
        setTimeout(() => processUpdateQueue(connection), 100);
      }
    }
  }, []);
  
  // Create or get WebSocket connection
  const getOrCreateConnection = useCallback(() => {
    // If we already have a connection, return it
    if (activeConnections[paperId]) {
      return activeConnections[paperId];
    }
    
    console.log(`Creating new WebSocket connection for paper ${paperId}`);
    
    // Create new connection entry
    const connection = {
      socket: null as unknown as WebSocket,
      listeners: new Set<(message: WebSocketMessage) => void>(),
      isConnecting: false,
      reconnectAttempts: 0,
      reconnectTimeout: null,
      pingInterval: null,
      pendingUpdates: new Map<string, PendingUpdate>(),
      processingUpdates: false
    };
    
    activeConnections[paperId] = connection;
    
    // Start the connection process
    const connectWebSocket = () => {
      if (connection.isConnecting) return;
      
      if (connection.reconnectAttempts >= 5) {
        clearErrorAfterDelay('Connection failed after multiple attempts. Please try refreshing the page.');
        return;
      }
      
      connection.isConnecting = true;
      
      try {
        // Clear any existing ping interval
        if (connection.pingInterval) {
          clearInterval(connection.pingInterval);
          connection.pingInterval = null;
        }
        
        // Close existing socket if necessary
        if (connection.socket && 
            connection.socket.readyState !== WebSocket.CLOSED && 
            connection.socket.readyState !== WebSocket.CLOSING) {
          connection.socket.close();
        }
        
        const socket = new WebSocket(`ws://localhost:8000/paper/${paperId}/ws`);
        
        // Set a connection timeout
        const connectionTimeout = setTimeout(() => {
          if (socket.readyState !== WebSocket.OPEN) {
            console.log(`Connection timeout for paper ${paperId}`);
            socket.close();
          }
        }, 10000); // 10 second timeout
        
        socket.onopen = () => {
          console.log(`WebSocket connected for paper ${paperId}`);
          clearTimeout(connectionTimeout);
          connection.isConnecting = false;
          connection.reconnectAttempts = 0;
          
          if (connection.reconnectTimeout) {
            clearTimeout(connection.reconnectTimeout);
            connection.reconnectTimeout = null;
          }
          
          // Setup ping interval to keep connection alive
          connection.pingInterval = setInterval(() => {
            if (socket.readyState === WebSocket.OPEN) {
              socket.send(JSON.stringify({ type: 'ping' }));
            }
          }, 20000); // Send ping every 20 seconds
          
          // Notify all listeners about successful connection
          connection.listeners.forEach(listener => {
            listener({
              type: 'status',
              message: 'Connected successfully'
            });
          });
          
          // Process any pending updates
          if (connection.pendingUpdates.size > 0) {
            processUpdateQueue(connection);
          }
        };
        
        socket.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data) as WebSocketMessage;
            // Broadcast message to all listeners
            connection.listeners.forEach(listener => listener(data));
          } catch (err) {
            console.error('Error parsing WebSocket message:', err);
          }
        };
        
        socket.onclose = (event) => {
          clearTimeout(connectionTimeout);
          console.log(`WebSocket closed for paper ${paperId}, code: ${event.code}`);
          
          // Notify all listeners
          connection.listeners.forEach(listener => {
            listener({
              type: 'status',
              message: 'Disconnected'
            });
          });
          
          connection.isConnecting = false;
          
          // Only try to reconnect if we still have components listening and it wasn't a clean close
          if (connection.listeners.size > 0 && !event.wasClean) {
            connection.reconnectAttempts += 1;
            const delay = Math.min(1000 * Math.pow(2, connection.reconnectAttempts), 15000);
            
            console.log(`Scheduling reconnect attempt ${connection.reconnectAttempts} in ${delay}ms for paper ${paperId}`);
            
            // Clear any existing reconnect timeout
            if (connection.reconnectTimeout) {
              clearTimeout(connection.reconnectTimeout);
              connection.reconnectTimeout = null;
            }
            
            // Schedule reconnect
            connection.reconnectTimeout = setTimeout(() => {
              if (connection.listeners.size > 0) {
                console.log(`Attempting to reconnect to paper ${paperId}`);
                connectWebSocket();
              } else {
                console.log(`No more listeners for paper ${paperId}, abandoning reconnect`);
                cleanup();
              }
            }, delay);
          } else if (connection.listeners.size === 0) {
            // Clean up if no more listeners
            cleanup();
          }
        };
        
        socket.onerror = (event) => {
          console.error(`WebSocket error for paper ${paperId}:`, event);
          connection.isConnecting = false;
          
          // Notify all listeners
          connection.listeners.forEach(listener => {
            listener({
              type: 'error',
              message: 'Connection error. Updates will be queued and sent when connection is restored.'
            });
          });
        };
        
        connection.socket = socket;
      } catch (err) {
        console.error(`Error creating WebSocket for paper ${paperId}:`, err);
        connection.isConnecting = false;
        
        // Notify all listeners
        connection.listeners.forEach(listener => {
          listener({
            type: 'error',
            message: 'Failed to connect. Updates will be saved when connection is restored.'
          });
        });
        
        // Schedule reconnect
        const delay = Math.min(1000 * Math.pow(2, connection.reconnectAttempts), 15000);
        
        // Clear any existing reconnect timeout
        if (connection.reconnectTimeout) {
          clearTimeout(connection.reconnectTimeout);
          connection.reconnectTimeout = null;
        }
        
        // Schedule reconnect
        connection.reconnectTimeout = setTimeout(() => {
          connectWebSocket();
        }, delay);
      }
    };
    
    // Function to clean up the connection
    const cleanup = () => {
      if (connection.reconnectTimeout) {
        clearTimeout(connection.reconnectTimeout);
        connection.reconnectTimeout = null;
      }
      
      if (connection.pingInterval) {
        clearInterval(connection.pingInterval);
        connection.pingInterval = null;
      }
      
      if (connection.socket) {
        if (connection.socket.readyState === WebSocket.OPEN || 
            connection.socket.readyState === WebSocket.CONNECTING) {
          connection.socket.close();
        }
      }
      
      delete activeConnections[paperId];
      console.log(`Removed WebSocket connection for paper ${paperId}`);
    };
    
    // Start connection
    connectWebSocket();
    
    return connection;
  }, [paperId, clearErrorAfterDelay, processUpdateQueue]);

  // Initialize connection and add listener
  useEffect(() => {
    // Track number of components using this paper's connection
    connectedComponents[paperId] = (connectedComponents[paperId] || 0) + 1;
    
    const connection = getOrCreateConnection();
    const listener = createListener();
    
    // Register this component's listener
    connection.listeners.add(listener);
    
    // Set initial connected state based on socket state
    if (connection.socket && connection.socket.readyState === WebSocket.OPEN) {
      setConnected(true);
    } else {
      setConnected(false);
    }
    
    return () => {
      // Clean up error timeout
      if (errorTimeoutRef.current) {
        clearTimeout(errorTimeoutRef.current);
        errorTimeoutRef.current = null;
      }
      
      // Cleanup on unmount
      if (activeConnections[paperId]) {
        // Remove this component's listener
        activeConnections[paperId].listeners.delete(listener);
        
        // Decrement counter of components using this connection
        connectedComponents[paperId] = Math.max(0, (connectedComponents[paperId] || 1) - 1);
        
        // If no more components are using this connection, close and clean up after a delay
        // (short delay to prevent rapid close/reopen cycles during navigation)
        if (connectedComponents[paperId] === 0) {
          console.log(`No more components using paper ${paperId}. Will close connection in 1 second.`);
          
          // Keep a reference to avoid race conditions
          const conn = activeConnections[paperId];
          
          setTimeout(() => {
            // Double check if the counter is still 0 (no new components connected in the meantime)
            if (connectedComponents[paperId] === 0 && conn === activeConnections[paperId]) {
              console.log(`Closing WebSocket for paper ${paperId} due to no more active components`);
              
              if (conn.socket && 
                  (conn.socket.readyState === WebSocket.OPEN || 
                   conn.socket.readyState === WebSocket.CONNECTING)) {
                conn.socket.close();
              }
              
              if (conn.reconnectTimeout) {
                clearTimeout(conn.reconnectTimeout);
              }
              
              if (conn.pingInterval) {
                clearInterval(conn.pingInterval);
              }
              
              delete activeConnections[paperId];
            }
          }, 1000);
        }
      }
    };
  }, [paperId, getOrCreateConnection, createListener]);

  // Queue updates to be sent when connection is available
  const queueUpdate = useCallback((sectionId: string, content: string) => {
    const connection = activeConnections[paperId];
    if (!connection) return;
    
    // Add to pending updates
    connection.pendingUpdates.set(sectionId, {
      sectionId,
      content,
      timestamp: Date.now()
    });
    
    // Try to process queue if connection is ready
    if (connection.socket && connection.socket.readyState === WebSocket.OPEN && !connection.processingUpdates) {
      processUpdateQueue(connection);
    }
  }, [paperId, processUpdateQueue]);

  // Send updates to the server
  const sendUpdate = useCallback((sectionId: string, content: string) => {
    const connection = activeConnections[paperId];
    
    if (!connection) {
      clearErrorAfterDelay('Connection not established. Trying to reconnect...');
      return;
    }
    
    // Always queue updates to handle connection issues
    queueUpdate(sectionId, content);
    
    // Only show error if not connected AND no error is currently showing
    if (!connected && !error) {
      clearErrorAfterDelay('Not connected. Updates will be sent when connection is restored.');
    }
  }, [paperId, connected, error, queueUpdate, clearErrorAfterDelay]);
  
  return {
    connected,
    sendUpdate,
    error
  };
};

export default useWebSocketEditor; 