import React from 'react';
import './Inventory.css'; // We will create this CSS file next

// Define the interface for an individual inventory item
interface InventoryItem {
  slotIndex: number;
  name: string;
  stackable: boolean;
  quantity: number;
}

// Define the interface for the component's props
interface InventoryProps {
  inventoryData: InventoryItem[]; // inventoryData is an array of InventoryItem
}

// Use the defined interface for the component props
function Inventory({ inventoryData }: InventoryProps) {
  // Function to generate item slots
  const renderItemSlots = (count: number, startIndex: number = 1) => {
    const slots: React.ReactNode[] = []; // Array to hold JSX elements
    for (let i = 0; i < count; i++) {
      const slotIndex = startIndex + i;
      // Find the item that belongs in this slot
      const itemInSlot = inventoryData.find(item => item.slotIndex === slotIndex);

      slots.push(
        <div key={slotIndex} className="item-slot" data-slot-index={slotIndex}>
          {/* Render item details if an item is found in this slot */}
          {itemInSlot && (
            <div className="item-content">
              {/* Display the item image */}
              <img
                src={`images/${itemInSlot.name}.png`} // Using relative path from index.html (standard build output)
                alt={itemInSlot.name}
                className="item-image"
              />
              {/* Display quantity if stackable and quantity > 1 */}
              {itemInSlot.stackable && itemInSlot.quantity > 1 && (
                <span className="item-quantity">{itemInSlot.quantity}</span>
              )}
              {/* Optional: Display item name on hover or as a tooltip */}
              {/* <span className="item-name">{itemInSlot.name}</span> */}
            </div>
          )}
        </div>
      );
    }
    return slots;
  };

  return (
    <div className="inventory-container">
      {/* Header */}
      <header className="inventory-header">
        <img src="images/header-gauche.png" alt="Header Left" className="header-image left" />
        Inventaire
        <img src="images/header-droit.png" alt="Header Right" className="header-image right" />
      </header>

      {/* Main content area */}
      <div className="inventory-main">
        {/* Left section (Backpack and Bottom Slots) */}
        <div className="inventory-left">
          {/* Top-left: Backpack/Cosmetics tabs and grid */}
          <div className="backpack-section">
            {/* Tabs */}
            <div className="tabs">
              <span className="active">Sac à dos</span>
              <span>Cosmétiques</span>
            </div>
            {/* Backpack Grid */}
            <div className="backpack-grid">
              {renderItemSlots(70, 1)} {/* 70 slots for backpack */}
            </div>
          </div>

          {/* Bottom-left: Consumables and Tools slots */}
          <div className="bottom-slots">
            {/* Consumables */}
            <div className="consumables">
              <div className="slot-title">Consommables</div>
              <div className="slots-row">
                {renderItemSlots(2, 82)} {/* 2 slots for consumables */}
              </div>
            </div>
            {/* Tool */}
            <div className="tool">
              <div className="slot-title">Outil</div>
              <div className="slots-row">
                {renderItemSlots(3, 71)} {/* 3 slots for tools */}
              </div>
            </div>
          </div>
        </div>

        {/* Right section (Equipment, Cosmetics, Artefact) */}
        <div className="character-section">
          {/* Character image or model will go here (background in CSS) */}
          <div className="character-display">
            {/* This div is primarily for the background image */}
          </div>

          {/* Equipment and other slots container */}
          <div className="character-slots-container"> {/* New container for the two columns */}
            {/* Left column for equipment and weapon */}
            <div className="left-slots">
              {/* Weapon slot */}
              <div className="weapon-slot">
                <div className="slot-title">Arme</div>
                {renderItemSlots(1, 74)} {/* 1 slot for weapon */}
              </div>
              {/* Equipment slots */}
              <div className="equipment-slots">
                <div className="slot-title">Équipement</div>
                <div className="equipment-row">
                  {renderItemSlots(3, 75)} {/* 3 slots for equipment (helmet, chest, legs) */}
                </div>
              </div>
            </div>

            {/* Right column for cosmetics and artefact */}
            <div className="right-slots">
              {/* Cosmetics slots */}
              <div className="cosmetics-slots">
                <div className="slot-title">Cosmétiques</div>
                <div className="cosmetics-row">
                  {renderItemSlots(3, 78)} {/* 3 slots for cosmetics */}
                </div>
              </div>
              {/* Artefact slot */}
              <div className="artefact-slot">
                <div className="slot-title">Artefact</div>
                {renderItemSlots(1, 81)} {/* 1 slot for artefact */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Inventory;