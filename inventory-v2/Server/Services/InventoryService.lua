local InventoryService = {}

-- Requires the JSON library for encoding/decoding
-- Requires the db-manager global database connection
local sqlite_db = _G.sqlite_db

--- Fetches the player's inventory data from the database.
-- @param player The player object.
-- @return A table containing the player's inventory data.
function InventoryService.GetPlayerInventory(player)
    Console.Log("[InventoryService] Fetching inventory for player: " .. player:GetName())
    local player_id = player:GetSteamID()
    if not player_id then
        Console.Log("[InventoryService] Error: No player_id found for player.")
        return {}
    end

    local inventory = {}
    -- SQL query to select inventory items for the player, joining with the Items table
    local query = [[
         SELECT i.*, pi.quantity, pi.slotIndex, pi.equipped
         FROM Items i
         INNER JOIN PlayerInventory pi ON i.item_id = pi.item_id
         INNER JOIN players p ON pi.player_id = p.player_id
         WHERE p.player_id = :steam_id;
    ]]

    local results = sqlite_db:Select(query, player_id)

    if results then
        Console.Log("[InventoryService] Database query returned " .. tostring(#results) .. " rows.")
        for _, row in ipairs(results) do
            table.insert(inventory, {
                id = row.id,
                item_id = row.item_id,
                type = row.type,
                mesh = row.mesh,
                name = row.name,
                description = row.description,
                category = row.category,
                stackable = (row.stackable == 1),
                droppable = (row.droppable == 1),
                quantity = row.quantity,
                slotIndex = row.slotIndex,
                equipped = (row.equipped == 1)
            })
        end
    else
        Console.Log("[InventoryService] No data retrieved from database for player " .. player:GetName())
    end

    return inventory
end

--- Synchronizes the player's inventory with the client.
-- Fetches the latest inventory data and sends it to the client via a remote event.
-- @param player The player object.
function InventoryService.SyncInventory(player)
    local inventoryData = InventoryService.GetPlayerInventory(player)
    local inventoryJson = JSON.stringify(inventoryData)
 
     Console.Log("[InventoryService] Syncing inventory for player: " .. player:GetName())
     Console.Log("[InventoryService] Sending JSON data: " .. tostring(inventoryJson)) -- Log the JSON string
     Events.CallRemote("UpdateInventoryUI", player, inventoryJson)
end

return InventoryService