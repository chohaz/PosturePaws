// Array of reminder sentences
const sentences = [
    "Check your posture human!",
    "Time to drink some water.",
    "Take a short walk, stretch your legs.",
    "Cat-approved posture break!"
];

// Listener for alarm
chrome.alarms.onAlarm.addListener(() => {
    const selectedSentence = sentences[Math.floor(Math.random() * sentences.length)];
    chrome.notifications.create('', {
        type: 'basic',
        iconUrl: 'icon.png', // Ensure this path matches your actual icon location
        title: 'Time for a Posture Check!',
        message: selectedSentence,
        priority: 2
    });
});

// Listener for messages from the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "setAlarm") {
        const frequency = parseFloat(request.frequency);
        createAlarm(frequency);
        // Directly respond with a simple serializable object
        sendResponse({result: `Alarm set for every ${frequency} minutes.`});
    } else if (request.action === "stopAlarm") {
        clearAlarm();
        // Again, ensure the response is serializable
        sendResponse({result: "Alarm cleared."});
    }
    return true; // Indicates an asynchronous response may be sent
});

function createAlarm(frequency) {
    chrome.alarms.create("PostureCheckAlarm", {
        delayInMinutes: frequency, // Set initial delay to frequency for consistency
        periodInMinutes: frequency
    });
}

function clearAlarm() {
    chrome.alarms.clear("PostureCheckAlarm");
}
