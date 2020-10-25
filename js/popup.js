$(document).ready(function () {
    var uniqueId = "amazon-analysis-" + chrome.runtime.id;
    
    chrome.storage.local.get(uniqueId + "_isEnable", function (data) {
        console.log("data ec", data[uniqueId + "_isEnable"]);
        if (data[uniqueId + "_isEnable"] === "true" || data[uniqueId + "_isEnable"] === undefined) {
            $("#extension_status").prop("checked", true);
        }
    });

    $("#extension_status").change(function () {
        chrome.storage.local.set({
            [uniqueId + "_isEnable"]: $(this).is(":checked")
        }, function () {
            if (chrome.runtime.lastError) {
                console.log("Error Storing 2: ", chrome.runtime.lastError.message);
            }
        });

        if ($(this).is(":checked")) {
            chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
                var activeTab = tabs[0];
                chrome.tabs.sendMessage(activeTab.id, { isEnable: "true" });
            });
        } else {
            chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
                var activeTab = tabs[0];
                chrome.tabs.sendMessage(activeTab.id, { isEnable: "false" });
            });
        }
    });
});