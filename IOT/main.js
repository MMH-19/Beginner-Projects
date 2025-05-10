/**
 * Monitor the light levels inside an IOT enabled snail mailbox to detect
 * when the mailbox door has been opened and closed.
 * @class IOTMailbox
 */
class IOTMailbox {
  /**
   * Creates an instance of IOTMailbox.
   * @param {number} [signalInterval=500] Timer interval for checking mailbox status.
   * @param {function} signalCallback Function to invoke when the timer interval expires.
   * @memberof IOTMailbox
   */
  constructor(signalInterval = 500, signalCallback) {
    this.signalInterval = signalInterval;
    this.signalCallback = signalCallback;
    this.intervalID = null;
    this.lastLightLevel = 0;
  }

  /**
   * Start monitoring of the mailbox and invoke the caller specified callback
   * function when the interval expires.
   * @memberof IOTMailbox
   */
  startMonitoring = () => {
    console.log(`Starting monitoring of mailbox...`);
    this.intervalID = window.setInterval(this.signalStateChange, this.signalInterval);
  }

  /**
   * Stop monitoring the mailbox status
   * @memberof IOTMailbox
   */
  stopMonitoring = () => {
    if (this.intervalID === null) return;
    window.clearInterval(this.intervalID);
    this.intervalID = null;
    console.log(`Mailbox monitoring stopped...`);
  }

  /**
   * Pass the current light level inside the mailbox to the users callback
   * function. The positive light levels indicate the door is open while 
   * negative levels indicate it is closed. Depending on the sampling interval 
   * the mailbox door could be in any postion from fully closed to fully open. 
   * This means the light level varies from interval-to-interval.
   * @memberof IOTMailbox
   */
  signalStateChange = () => {
    // Generate a random value between 0 and 1, then format to 2 decimal places
    const randomValue = parseFloat((Math.random()).toFixed(2));
    
    // If last state was positive (door open), make it negative (door closed) and vice versa
    const lightLevel = this.lastLightLevel >= 0 ? -randomValue : randomValue;
    
    console.log(`Mailbox state changed - lightLevel: ${lightLevel}`);
    this.signalCallback(lightLevel);
    this.lastLightLevel = lightLevel;
  }
};

// DOM Elements
const startBtn = document.getElementById('start-btn');
const stopBtn = document.getElementById('stop-btn');
const resetBtn = document.getElementById('reset-btn');
const intervalInput = document.getElementById('interval');
const notificationsPanel = document.getElementById('notifications');
const logPanel = document.getElementById('log');
const themeToggle = document.getElementById('theme-toggle');
const soundSelect = document.getElementById('sound-select');
const testSoundBtn = document.getElementById('test-sound');
const exportLogBtn = document.getElementById('export-log');

// Stats elements
const doorOpensCounter = document.getElementById('door-opens');
const doorClosesCounter = document.getElementById('door-closes');
const avgOpenTime = document.getElementById('avg-open-time');
const lastActivity = document.getElementById('last-activity');

// Mailbox visual elements
const mailboxDoor = document.querySelector('.mailbox-door');
const mailboxFlag = document.querySelector('.mailbox-flag');

// App State
let mailbox = null;
let isDoorOpen = false;
let doorOpenTimeoutId = null;
const doorOpenAlertTime = 5000; // 5 seconds

// Statistics tracking
let doorOpenCount = 0;
let doorCloseCount = 0;
let totalOpenTime = 0;
let doorLastOpenedTime = null;
let doorOpenTimes = [];

// Audio for door alerts
const soundUrls = {
  default: 'https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3',
  bell: 'https://assets.mixkit.co/active_storage/sfx/1080/1080-preview.mp3',
  chime: 'https://assets.mixkit.co/active_storage/sfx/2911/2911-preview.mp3',
  notification: 'https://assets.mixkit.co/active_storage/sfx/1518/1518-preview.mp3'
};

let doorOpenSound = new Audio(soundUrls.default);

// Check for saved theme preference
const savedTheme = localStorage.getItem('mailbox-theme') || 'dark';
if (savedTheme) {
  document.documentElement.classList.toggle('dark', savedTheme === 'dark');
}

// Functions
function addLogEntry(message) {
  const logEntry = document.createElement('div');
  logEntry.className = 'py-2 border-b border-gray-200 dark:border-gray-600 text-sm';
  logEntry.innerHTML = `<span class="text-gray-500 dark:text-gray-400">[${new Date().toLocaleTimeString()}]</span> ${message}`;
  logPanel.appendChild(logEntry);
  logPanel.scrollTop = logPanel.scrollHeight; // Auto scroll to bottom
  
  // Add subtle fade-in animation
  logEntry.style.opacity = '0';
  setTimeout(() => {
    logEntry.style.transition = 'opacity 0.3s ease';
    logEntry.style.opacity = '1';
  }, 10);
}

function addNotification(message, isAlert = false) {
  const notifEntry = document.createElement('div');
  notifEntry.className = isAlert 
    ? 'p-2 mb-2 rounded-md bg-yellow-100 dark:bg-yellow-900 border-l-4 border-yellow-500 dark:border-yellow-600 text-sm animate-fadeIn'
    : 'p-2 mb-2 rounded-md bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-500 dark:border-blue-600 text-sm animate-fadeIn';
  notifEntry.innerHTML = `<span class="text-gray-500 dark:text-gray-400">[${new Date().toLocaleTimeString()}]</span> ${message}`;
  notificationsPanel.appendChild(notifEntry);
  notificationsPanel.scrollTop = notificationsPanel.scrollHeight; // Auto scroll to bottom
}

function updateMailboxVisual(isOpen) {
  if (isOpen) {
    mailboxDoor.classList.remove('closed');
    mailboxDoor.classList.add('open');
    setTimeout(() => {
      mailboxFlag.classList.remove('down');
      mailboxFlag.classList.add('up');
    }, 200); // Slight delay for a more natural animation sequence
  } else {
    mailboxDoor.classList.remove('open');
    mailboxDoor.classList.add('closed');
    setTimeout(() => {
      mailboxFlag.classList.remove('up');
      mailboxFlag.classList.add('down');
    }, 200);
  }
}

function updateStatistics() {
  const updateWithAnimation = (element, value) => {
    element.classList.add('scale-110', 'text-green-500', 'dark:text-green-400');
    element.textContent = value;
    setTimeout(() => {
      element.classList.remove('scale-110', 'text-green-500', 'dark:text-green-400');
    }, 500);
  };

  updateWithAnimation(doorOpensCounter, doorOpenCount);
  updateWithAnimation(doorClosesCounter, doorCloseCount);
  
  if (doorOpenTimes.length > 0) {
    const avgTime = totalOpenTime / doorOpenTimes.length;
    updateWithAnimation(avgOpenTime, `${avgTime.toFixed(1)}s`);
  }
  
  lastActivity.textContent = new Date().toLocaleTimeString();
  lastActivity.classList.add('animate-pulse');
  setTimeout(() => {
    lastActivity.classList.remove('animate-pulse');
  }, 1000);
}

function loadSound(soundType) {
  const url = soundUrls[soundType] || soundUrls.default;
  doorOpenSound = new Audio(url);
}

function playCurrentSound() {
  doorOpenSound.currentTime = 0;
  doorOpenSound.play().catch(err => {
    console.log('Error playing sound:', err);
  });
}

function handleMailboxStateChange(lightLevel) {
  // Positive light level indicates door is open
  const isDoorOpenNow = parseFloat(lightLevel) > 0;
  const doorState = isDoorOpenNow ? 'open' : 'closed';
  
  addLogEntry(`Light level: ${lightLevel} - Door is ${doorState}`);
  
  // Update mailbox visual
  updateMailboxVisual(isDoorOpenNow);
  
  // Check if door state changed from closed to open
  if (isDoorOpenNow && !isDoorOpen) {
    doorOpenCount++;
    doorLastOpenedTime = Date.now();
    playCurrentSound();
    addNotification('<span class="font-medium">Mail has arrived!</span> The mailbox door is now open.', true);
    
    // Set timeout for door left open alert
    doorOpenTimeoutId = setTimeout(() => {
      addNotification('<span class="font-medium text-red-600 dark:text-red-400">Warning:</span> The mailbox door has been left open!', true);
    }, doorOpenAlertTime);
  }
  
  // Check if door state changed from open to closed
  if (!isDoorOpenNow && isDoorOpen) {
    doorCloseCount++;
    
    if (doorLastOpenedTime) {
      const openDuration = (Date.now() - doorLastOpenedTime) / 1000; // in seconds
      doorOpenTimes.push(openDuration);
      totalOpenTime += openDuration;
      addLogEntry(`Door was open for ${openDuration.toFixed(1)} seconds`);
    }
    
    addNotification('The mailbox door has been closed.');
    
    // Clear timeout for door left open alert
    if (doorOpenTimeoutId) {
      clearTimeout(doorOpenTimeoutId);
      doorOpenTimeoutId = null;
    }
  }
  
  // Update door state
  isDoorOpen = isDoorOpenNow;
  
  // Update statistics
  updateStatistics();
}

function startMonitoring() {
  const interval = parseInt(intervalInput.value);
  
  if (isNaN(interval) || interval < 100) {
    addLogEntry('<span class="text-red-500 dark:text-red-400">Error:</span> Please provide a valid interval (minimum 100ms)');
    return;
  }
  
  mailbox = new IOTMailbox(interval, handleMailboxStateChange);
  mailbox.startMonitoring();
  
  addLogEntry(`Started monitoring with interval of <span class="font-medium">${interval}ms</span>`);
  
  // Update UI
  startBtn.disabled = true;
  stopBtn.disabled = false;
  intervalInput.disabled = true;
  
  // Add UI feedback
  startBtn.classList.add('opacity-50');
  stopBtn.classList.remove('opacity-50', 'cursor-not-allowed', 'bg-gray-400', 'dark:bg-gray-600');
  stopBtn.classList.add('bg-primary', 'hover:bg-primary-dark');
}

function stopMonitoring() {
  if (mailbox) {
    mailbox.stopMonitoring();
    addLogEntry('Stopped monitoring');
  }
  
  // Update UI
  startBtn.disabled = false;
  stopBtn.disabled = true;
  intervalInput.disabled = false;
  
  // Add UI feedback
  startBtn.classList.remove('opacity-50');
  stopBtn.classList.add('opacity-50', 'cursor-not-allowed', 'bg-gray-400', 'dark:bg-gray-600');
  stopBtn.classList.remove('bg-primary', 'hover:bg-primary-dark');
  
  // Clear door open timeout
  if (doorOpenTimeoutId) {
    clearTimeout(doorOpenTimeoutId);
    doorOpenTimeoutId = null;
  }
}

function resetApp() {
  // Stop monitoring if active
  if (mailbox) {
    mailbox.stopMonitoring();
    mailbox = null;
  }
  
  // Reset visual state
  mailboxDoor.classList.remove('open');
  mailboxDoor.classList.add('closed');
  mailboxFlag.classList.remove('up');
  mailboxFlag.classList.add('down');
  
  // Reset app state
  isDoorOpen = false;
  doorOpenCount = 0;
  doorCloseCount = 0;
  totalOpenTime = 0;
  doorLastOpenedTime = null;
  doorOpenTimes = [];
  
  // Clear notificationa and logs with animation
  while (notificationsPanel.firstChild) {
    const notification = notificationsPanel.firstChild;
    notification.style.opacity = '0';
    notification.style.height = '0';
    notification.style.transition = 'opacity 0.3s ease, height 0.3s ease';
    setTimeout(() => {
      notificationsPanel.removeChild(notification);
    }, 300);
  }
  
  // Clear timeout for door left open alert
  if (doorOpenTimeoutId) {
    clearTimeout(doorOpenTimeoutId);
    doorOpenTimeoutId = null;
  }
  
  // Update UI
  startBtn.disabled = false;
  stopBtn.disabled = true;
  intervalInput.disabled = false;
  intervalInput.value = 500;
  
  // Update UI feedback
  startBtn.classList.remove('opacity-50');
  stopBtn.classList.add('opacity-50', 'cursor-not-allowed', 'bg-gray-400', 'dark:bg-gray-600');
  stopBtn.classList.remove('bg-primary', 'hover:bg-primary-dark');
  
  // Clear statistics
  doorOpensCounter.textContent = '0';
  doorClosesCounter.textContent = '0';
  avgOpenTime.textContent = '0.0s';
  lastActivity.textContent = '-';
  
  addLogEntry('<span class="font-medium text-green-500 dark:text-green-400">System Reset:</span> All statistics and states have been reset');
}

function toggleTheme() {
  // Toggle dark class on html element
  document.documentElement.classList.toggle('dark');
  
  // Save preference
  const isDark = document.documentElement.classList.contains('dark');
  localStorage.setItem('mailbox-theme', isDark ? 'dark' : 'light');
  
  // Add transition effect to the body
  document.body.classList.add('transition-all');
  setTimeout(() => {
    document.body.classList.remove('transition-all');
  }, 300);
  
  addLogEntry(`Theme changed to ${isDark ? 'dark' : 'light'} mode`);
}

function changeSoundType() {
  const selectedSound = soundSelect.value;
  loadSound(selectedSound);
  addLogEntry(`Alert sound changed to "${selectedSound}"`);
}

function testSound() {
  playCurrentSound();
  // Add visual feedback
  testSoundBtn.classList.add('animate-pulse');
  setTimeout(() => {
    testSoundBtn.classList.remove('animate-pulse');
  }, 1000);
}

function exportLogs() {
  const logEntries = Array.from(logPanel.children).map(entry => entry.textContent);
  const exportText = logEntries.join('\n');
  
  // Create a blob with the data
  const blob = new Blob([exportText], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  
  // Create a temporary link and click it
  const a = document.createElement('a');
  const date = new Date().toISOString().replace(/:/g, '-').substring(0, 19);
  a.href = url;
  a.download = `mailbox-log-${date}.txt`;
  document.body.appendChild(a);
  a.click();
  
  // Cleanup
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  
  // Add visual feedback
  exportLogBtn.classList.add('animate-bounce');
  setTimeout(() => {
    exportLogBtn.classList.remove('animate-bounce');
  }, 1000);
  
  addLogEntry('Log exported to file');
}

// Event Listeners
startBtn.addEventListener('click', startMonitoring);
stopBtn.addEventListener('click', stopMonitoring);
resetBtn.addEventListener('click', resetApp);
themeToggle.addEventListener('click', toggleTheme);
soundSelect.addEventListener('change', changeSoundType);
testSoundBtn.addEventListener('click', testSound);
exportLogBtn.addEventListener('click', exportLogs);

// Initialize
loadSound(soundSelect.value);
addLogEntry('IOT Mailbox Simulator initialized');

// Add welcome notification with delay for animation effect
setTimeout(() => {
  addNotification('<span class="font-medium">Welcome!</span> The IOT Mailbox Simulator is ready. Click "Start Monitoring" to begin.');
}, 500); 