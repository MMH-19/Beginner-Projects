# Stopwatch App

A simple, elegant stopwatch web application that helps you track time spent on activities.

## Features

- Start/stop the timer
- Continuing counting after stopping
- Reset the timer
- Record laps during timing
- Clear all laps

## How to Use

1. Open `index.html` in any modern browser
2. Use the buttons to control the stopwatch:
   - **Start**: Begin timing
   - **Stop**: Pause the timer
   - **Reset**: Reset the timer to zero
   - **Lap**: Record the current time as a lap (only works when timer is running)
   - **Clear Laps**: Remove all recorded laps

## Technology Used

- HTML5
- CSS3
- JavaScript (ES6+)

## Implementation Details

The stopwatch uses the `setInterval` method to update the timer display every 10 milliseconds, providing accurate timing. The app tracks elapsed time based on the system clock to ensure accuracy even if the page loses focus. 