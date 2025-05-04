// Preload script for Electron
import { ipcRenderer, contextBridge } from 'electron';

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // Data persistence methods
  saveExams: (examData) => ipcRenderer.invoke('save-exams', examData),
  loadExams: () => ipcRenderer.invoke('load-exams'),
  deleteExams: () => ipcRenderer.invoke('delete-exams'),
  
  // Theme persistence
  saveTheme: (theme) => ipcRenderer.invoke('save-theme', theme),
  loadTheme: () => ipcRenderer.invoke('load-theme')
});