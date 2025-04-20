# Plan for Implementing Server-Side Inventory in `inventory-v2`

**Objective:** Implement the server-side logic to fetch a player's inventory and send it to the client in the `inventory-v2` package.

**Proposed Architecture:**

We will introduce a Service layer on the server to handle the inventory business logic and interact with the database provided by the `db-manager` package.

```mermaid
graph TD
    A[Client - inventory-v2] -->|CallRemote("getInventory")| B(Server - inventory-v2/Index.lua)
    B -->|Call InventoryService.SyncInventory| C(Server - inventory-v2/Services/InventoryService.lua)
    C -->|Call InventoryService.GetPlayerInventory| C
    C -->|Query _G.sqlite_db| D(Server - db-manager)
    D -->|Return Inventory Data| C
    C -->|Send Inventory Data (JSON)| C
    C -->|CallClient("UpdateInventoryUI", inventoryData)| A
```

**Detailed Steps:**

1.  **Create Server-Side Service Directory:**
    *   Create a new directory: `inventory-v2/Server/Services/`

2.  **Create Inventory Service File:**
    *   Create a new Lua file: `inventory-v2/Server/Services/InventoryService.lua`

3.  **Implement `InventoryService.lua`:**
    *   Define a Lua module `InventoryService`.
    *   Implement `InventoryService.GetPlayerInventory(player)`:
        *   This function will take the `player` object.
        *   It will execute a SQL query using `_G.sqlite_db:Select` to join the `PlayerInventory` and `Items` tables based on `player_id` (SteamID) and `item_id`.
        *   Process the query results into a structured Lua table representing the player's inventory.
        *   Return the inventory data table.
    *   Implement `InventoryService.SyncInventory(player)`:
        *   This function will call `InventoryService.GetPlayerInventory(player)` to get the latest data.
        *   It will use `JSON.stringify` to convert the Lua table to a JSON string.
        *   It will send the JSON string to the client using `Events.CallClient(player, "UpdateInventoryUI", inventoryData)`.

4.  **Modify `inventory-v2/Server/Index.lua`:**
    *   Require the newly created `InventoryService` module.
    *   Subscribe to the `getInventory` remote event from the client.
    *   In the `getInventory` event handler, call `InventoryService.SyncInventory(player)`.

5.  **Verify Client-Side `UpdateInventoryUI`:**
    *   Confirm that the client-side React application in `inventory-v2` (likely in `inventory-v2/Client/dev/src/`) has a JavaScript function exposed to the WebUI (e.g., `window.updateInventory`) that can receive and process the inventory data sent from the server. (Based on V1, this is expected, but it's good to verify during implementation).

**Expected Outcome:**

After these steps, when a player opens their inventory in `inventory-v2`, the client will call the `getInventory` remote event. The server will receive this event, fetch the player's inventory data from the database using the `InventoryService`, and send it back to the client, allowing the UI to display the player's inventory.