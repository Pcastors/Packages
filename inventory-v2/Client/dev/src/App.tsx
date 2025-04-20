import React, { useState, useEffect } from 'react';
import './App.css';
import Inventory from './Inventory.tsx'; // Import the Inventory component (now .tsx)
// import Events from './Events'; // Import the Events module

// Define the interface for an individual inventory item (re-using from Inventory.tsx)
interface InventoryItem {
  slotIndex: number;
  name: string;
  stackable: boolean;
  quantity: number;
}

// Define types for the functions exposed on the window object
function App() {
  // Use type annotation for state variables
  const [showInventory, setShowInventory] = useState<boolean>(true); // Set to true for browser debugging
  const [inventoryData, setInventoryData] = useState<InventoryItem[]>([]); // State to hold inventory data

  // Effect to handle inventory visibility changes and expose functions to Lua
  useEffect(() => {
    // Expose a function on the window object for Lua to call
    window.toggleInventoryVisibility = (isVisible: boolean) => {
      setShowInventory(isVisible);
    };

    // Expose a function on the window object for Lua to call with inventory data
    window.updateInventoryData = (data: string) => {
      console.log("Raw inventory data received (via updateInventoryData):", data); // Log raw data
      try {
        // Parse the JSON string into an array of InventoryItem
        const parsedData: InventoryItem[] = JSON.parse(data);
        setInventoryData(parsedData);
        console.log("Inventory data parsed and set (via updateInventoryData):", parsedData); // Log parsed data
      } catch (error) {
        console.error("Failed to parse inventory data (via updateInventoryData):", error);
      }
    };

    // Remove the old Events.Subscribe for UpdateInventoryUI as data will now come directly from Lua
    // Events.Subscribe("UpdateInventoryUI", (data) => {
    //   console.log("Raw inventory data received:", data); // Log raw data
    //   try {
    //     const parsedData = JSON.parse(data);
    //     setInventoryData(parsedData);
    //     console.log("Inventory data parsed and set:", parsedData); // Log parsed data
    //   } catch (error) {
    //     console.error("Failed to parse inventory data:", error);
    //   }
    // }); // End of old Events.Subscribe block

    // Cleanup function to remove the global functions
    return () => {
      delete window.toggleInventoryVisibility;
      delete window.updateInventoryData;
      // Note: Events.js doesn't have an Unsubscribe function,
      // in a real app you would need one here.
    };
  }, []); // Empty dependency array ensures this runs once on mount and cleans up on unmount

  // Effect to request inventory data when the inventory becomes visible
  useEffect(() => {
    if (showInventory) {
      console.log("Inventory is now visible, requesting data from server...");
      // Use the Events object exposed on the window
      if (window.Events && window.Events.Call) {
        window.Events.Call("getInventory"); // Request inventory data from the server
      } else {
        console.error("window.Events or window.Events.Call is not defined.");
      }
    }
  }, [showInventory]); // This effect runs whenever showInventory changes

  return (
    <div>
      {/* Render the Inventory component if showInventory is true, pass inventoryData as prop */}
      {showInventory && <Inventory inventoryData={inventoryData} />}
    </div>
  );
}

export default App;