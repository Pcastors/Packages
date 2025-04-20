-- Create the WebUI
local inventoryUI = WebUI("InventoryUI", "file://UI/index.html", 1, true, true)

-- Set the WebUI to be initially hidden
inventoryUI:SetVisibility(0)  -- Commence masqué

local inventoryOpen = 0
local mouseEnable = false

local function ToggleInventory()
    if inventoryOpen == 0 then
        inventoryOpen = 1
        mouseEnable = true
        Events.CallRemote("getInventory")
    else
        inventoryOpen = 0
        mouseEnable = false
    end

    inventoryUI:SetVisibility(inventoryOpen)
    Input.SetMouseEnabled(mouseEnable)

    -- Send event to React app to toggle inventory visibility
    -- Use ExecuteJavaScript to call the function exposed on window
    inventoryUI:ExecuteJavaScript("window.toggleInventoryVisibility(" .. tostring(inventoryOpen == 1) .. ");")
end

-- Register keybind for 'i' and bind it to ToggleInventory
Input.Register("inventory", "I")
Input.Bind("inventory", InputEvent.Pressed, ToggleInventory)

-- Subscribe to the UpdateInventoryUI remote event from the server
Events.SubscribeRemote("UpdateInventoryUI", function(inventoryData)
    Console.Log("[Client/Index.lua] Received UpdateInventoryUI from server with data:")
    Console.Log(inventoryData) -- Log the received data

    -- Call the JavaScript function in the WebUI to update the React app's state
    -- Need to properly escape the inventoryData string for JavaScript
    local escapedJson = string.gsub(inventoryData, "'", "\\'") -- Escape single quotes
    escapedJson = string.gsub(escapedJson, "\n", "\\n") -- Escape newlines
    escapedJson = string.gsub(escapedJson, "\r", "\\r") -- Escape carriage returns
    escapedJson = string.gsub(escapedJson, "\\", "\\\\") -- Escape backslashes
    escapedJson = string.gsub(escapedJson, '"', '\\"') -- Escape double quotes

    inventoryUI:ExecuteJavaScript("window.updateInventoryData('" .. escapedJson .. "');")
end)

-- Optional: Hide UI and disable cursor when pressing Escape
Input.Register("hide_inventory", "Escape")
Input.Bind("hide_inventory", InputEvent.Pressed, function()
    if inventoryOpen == 1 then
        inventoryOpen = 0
        mouseEnable = false
        inventoryUI:SetVisibility(inventoryOpen)
        Input.SetMouseEnabled(mouseEnable)
        -- Hide in React using the exposed function
        inventoryUI:ExecuteJavaScript("window.toggleInventoryVisibility(false);")
    end
end)
