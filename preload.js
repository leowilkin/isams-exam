// Preload script for Electron
// do i need this? idk...
// what this does: https://www.electronjs.org/docs/latest/tutorial/context-isolation#preload-scripts
const { ipcRenderer, contextBridge } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // Send exam data to main process for notification scheduling
  updateExams: (examData) => {
    ipcRenderer.send('exams-updated', examData);
  },
  // Notify main process that exam data was cleared
  clearExams: () => {
    ipcRenderer.send('exams-cleared');
  },
  // Get list of scheduled notifications
  getScheduledNotifications: () => {
    return ipcRenderer.invoke('get-scheduled-notifications');
  }
});