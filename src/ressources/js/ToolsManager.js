class ToolsManager {
    constructor() {
        this.modal = document.getElementById('toolsModal');
        this.showFilesButton = document.getElementById('showAllFiles').onclick = () => this.showAllFiles();
        this.closeButton = document.getElementById('closeTools').onclick = () => this.closeModalWindow();
        this.init();
    }
    init() {
        this.modal.style.display = 'block';
    }
    showAllFiles() {
        window.location.href = './files';
    }
    closeModalWindow() {
        this.modal.style.display = 'none';
    }
}