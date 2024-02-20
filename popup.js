document.addEventListener('DOMContentLoaded', () => {
    const submitFrequencyButton = document.getElementById('submitFrequency');
    const toggleAlarmSlider = document.getElementById('toggleAlarm');
    const alarmFrequencyInput = document.getElementById('alarmFrequency');

    submitFrequencyButton.addEventListener('click', () => {
        const frequency = alarmFrequencyInput.value;
        if (frequency > 0) {
            chrome.runtime.sendMessage({action: "setAlarm", frequency: parseFloat(frequency)}, () => {
                toggleAlarmSlider.checked = true; // Reflects the alarm is active
                updateAlarmTimeLeft(); // Start or update the countdown
            });
        } else {
            alert("Please enter a valid frequency.");
        }
    });

    toggleAlarmSlider.addEventListener('change', () => {
        if (toggleAlarmSlider.checked) {
            const frequency = alarmFrequencyInput.value;
            if (frequency > 0) {
                chrome.runtime.sendMessage({action: "setAlarm", frequency: parseFloat(frequency)}, updateAlarmTimeLeft);
            } else {
                alert("Please set a frequency first.");
                toggleAlarmSlider.checked = false; // Keeps the slider off if no frequency is set
            }
        } else {
            chrome.runtime.sendMessage({action: "stopAlarm"}, () => {
                clearInterval(window.countdownInterval); // Clear the interval when the alarm is stopped
                document.getElementById('timeLeft').textContent = "No active reminder."; // Update UI to show no active reminder
            });
        }
    });

    function updateAlarmTimeLeft() {
        chrome.alarms.get("PostureCheckAlarm", (alarm) => {
            if (alarm) {
                clearInterval(window.countdownInterval); // Clear any existing interval
                const updateCountdown = () => {
                    const timeLeftInSeconds = Math.round((alarm.scheduledTime - Date.now()) / 1000);
                    const minutes = Math.floor(timeLeftInSeconds / 60);
                    const seconds = timeLeftInSeconds % 60;
                    document.getElementById('timeLeft').textContent = `Time left until the next reminder: ${minutes}m ${seconds}s.`;

                    if (timeLeftInSeconds <= 0) {
                        clearInterval(window.countdownInterval); // Stop the countdown when time is up
                        document.getElementById('timeLeft').textContent = "Time for a posture check!";
                    }
                };
                updateCountdown(); // Update immediately to prevent delay
                window.countdownInterval = setInterval(updateCountdown, 1000); // Start the countdown
            } else {
                document.getElementById('timeLeft').textContent = "No active reminder.";
                clearInterval(window.countdownInterval); // Ensure to clear interval if no alarm
            }
        });
    }
});
