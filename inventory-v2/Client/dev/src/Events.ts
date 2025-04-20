// Define the interface for the global Events object expected from the game environment
interface GlobalEvents {
  Call: (sEventName: string, ...args: any[]) => void;
  Subscribe: (sEventName: string, callback: (...args: any[]) => void) => void;
}

// Declare the global window object and add the Events property
declare global {
  interface Window {
    Events?: GlobalEvents; // Make it optional as the check `typeof (window.Events) == "undefined"` exists
    toggleInventoryVisibility?: (isVisible: boolean) => void; // Declare global function for Lua
    updateInventoryData?: (data: string) => void; // Declare global function for Lua
  }
}

// Define the interface for the local Events object we are exporting
interface LocalEvents {
  Call: (sEventName: string, ...args: any[]) => void;
  Subscribe: (sEventName: string, callback: (...args: any[]) => void) => void;
}

const Events: LocalEvents = {
  Call: function (sEventName: string, ...args: any[]): void {
    if (typeof (window.Events) == "undefined" || !window.Events) {
      console.warn("window.Events is not defined. Cannot call event:", sEventName);
      return;
    }
    window.Events.Call(sEventName, ...args);
  },

  Subscribe: function (sEventName: string, callback: (...args: any[]) => void): void {
    if (typeof (window.Events) == "undefined" || !window.Events) {
      console.warn("window.Events is not defined. Cannot subscribe to event:", sEventName);
      return;
    }
    window.Events.Subscribe(sEventName, callback);
  }
};

export default Events;