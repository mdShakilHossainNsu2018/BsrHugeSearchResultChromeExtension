$(document).ready(function () {
    var uniqueId = "amazon-analysis-" + chrome.runtime.id;

    var hostname = window.location.hostname;

    var validDomains = {
        "www.amazon.com": "english",
        "www.amazon.co.uk": "english",
        "www.amazon.com.au": "english",
        "www.amazon.ca": "canadian",
        "www.amazon.es": "estonia",
        "www.amazon.it": "italian",
        "www.amazon.de": "germani",
        "www.amazon.fr": "french"
    };

    console.log('hostname')
    var isInAmazon = false;
    chrome.tabs.query({active:true,currentWindow:true},function(tab){
        //Be aware that `tab` is an array of Tabs

        Object.keys(validDomains).forEach(key => {
            if ('https://'+ key+'/' === tab[0].url){
                isInAmazon = true;
                // console.log('in amazon')
            }
        })
        // console.log(tab[0].url);
    });
    // console.log(hostname);
    
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

    $("#advanceKeyword").click( function (){
        // window.postMessage({type: "FROM_PAGE", text: "Hello wordl"}, "*")
        chrome.tabs.query({currentWindow: true, active: true }, function (tabs) {
            var activeTab = tabs[0];
            chrome.tabs.sendMessage(activeTab.id, {advanceKeyword: 'true'})
        })

        window.close();
        // chrome.windows.create('window.html', {
        //     'outerBounds': {
        //         'width': 400,
        //         'height': 500
        //     }
        // });
        // chrome.tabs.create({'url': chrome.extension.getURL('popup.html')}, function(tab) {
        //     // Tab opened.
        // });
    });
});


