-- Print a message to the server console
Console.Log("Loading some Props =D")

-- Require the InventoryService module
local InventoryService = Package.Require("Services/InventoryService.lua")

-- Spawn some props in the game world
local prop_table = Prop(Vector(200, 0, 0), Rotator(0, 0, 0), "nanos-world::SM_WoodenTable")
local prop_chair = Prop(Vector(400, 200, 0), Rotator(0, 0, 0), "nanos-world::SM_WoodenChair")
local prop_tire = Prop(Vector(600, 0, 0), Rotator(0, 0, 0), "nanos-world::SM_TireLarge")

-- Subscribe to the getInventory remote event from the client
Events.SubscribeRemote("getInventory", function(player)
    InventoryService.SyncInventory(player)
end)
