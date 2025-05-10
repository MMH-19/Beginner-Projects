# IOT Mailbox Simulator

A web application that simulates an Internet of Things (IOT) enabled mailbox that notifies you when mail has arrived.

## Features

- Start and stop monitoring of the virtual mailbox
- Receive notifications when mail arrives (mailbox door opens)
- Receive warnings if the mailbox door is left open
- Audio alerts when mail arrives with customizable sound options
- Adjustable monitoring interval
- Detailed logging of mailbox activity
- Visual representation of mailbox status with animated door and flag
- Dark/Light theme toggle with local storage persistence
- Statistics tracking (door opens, door closes, average open time)
- Export logs and statistics to a text file
- Responsive design for mobile and desktop

## How to Use

1. Open `index.html` in a modern web browser
2. Use the Control Panel to:
   - Set the monitoring interval (in milliseconds)
   - Choose your preferred alert sound
   - Start/Stop monitoring
   - Reset the application
3. Watch the animated mailbox visual representation to see door state
4. View the Statistics Panel for monitoring metrics
5. Watch the Notification Panel for important alerts about your mailbox
6. Check the Log Panel for detailed information about the mailbox state
7. Toggle between dark and light themes using the button in the top-right corner
8. Export logs and statistics to a file using the clipboard button in the Log Panel

## Requirements

- Modern web browser with JavaScript enabled
- Internet connection (for audio alerts)
- LocalStorage enabled for theme and sound preferences (optional)

## Technical Details

This application simulates an IOT mailbox using JavaScript. The IOTMailbox class sends periodic signals about the light level inside the mailbox, which indicates whether the door is open (positive light level) or closed (negative light level).

The application uses callbacks to communicate state changes between different components, making it a good example of event-driven programming.

### Persistence

The application uses localStorage to remember your theme and sound preferences between sessions.

### Statistics Tracking

The application tracks:
- Number of door opens
- Number of door closes
- Average time the door is left open
- Last activity timestamp

### Keyboard Accessibility

All interactive elements are keyboard accessible for improved usability.

## User Stories Implemented

- Control panel with Start, Stop, and Reset buttons
- Notification panel for mailbox status updates
- Scrollable log panel for execution details
- State notifications from the mailbox
- Logging of monitoring events and light levels
- Notifications when the door is opened/closed
- Button state management (enabled/disabled)
- Configurable monitoring interval
- Notification when door is left open
- Audio alert when door is opened
- Dark/light theme toggle
- Visual mailbox representation
- Statistics tracking
- Multiple sound options
- Log export functionality
- Responsive design 