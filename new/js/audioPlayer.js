class AudioPlayer {
    constructor() {
        this.audio = document.getElementById('audioPlayer');
        this.currentSong = null;
        this.playlist = [];
        this.currentPlaylistIndex = -1;
        this.isPlaying = false;
        this.isShuffle = false;
        this.repeatMode = 0; // 0: no repeat, 1: repeat all, 2: repeat one
        this.volume = 0.5;
        this.allSongs = [];
        this.folders = [];
        this.currentFolder = null;
        
        this.initializeElements();
        this.bindEvents();
        this.loadInitialData();
    }
    
    initializeElements() {
        // Control buttons
        this.playPauseBtn = document.getElementById('playPauseBtn');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.shuffleBtn = document.getElementById('shuffleBtn');
        this.repeatBtn = document.getElementById('repeatBtn');
        this.muteBtn = document.getElementById('muteBtn');
        
        // Progress and volume
        this.progressSlider = document.getElementById('progressSlider');
        this.progressFill = document.getElementById('progressFill');
        this.volumeSlider = document.getElementById('volumeSlider');
        this.currentTime = document.getElementById('currentTime');
        this.totalTime = document.getElementById('totalTime');
        
        // Display elements
        this.currentTitle = document.getElementById('currentTitle');
        this.currentArtist = document.getElementById('currentArtist');
        this.songList = document.getElementById('songList');
        this.folderList = document.getElementById('folderList');
        this.currentPlaylist = document.getElementById('currentPlaylist');
        this.sectionTitle = document.getElementById('sectionTitle');
        
        // Search and controls
        this.searchInput = document.getElementById('searchInput');
        this.searchBtn = document.getElementById('searchBtn');
        this.refreshBtn = document.getElementById('refreshBtn');
        this.addAllBtn = document.getElementById('addAllBtn');
        
        // Overlays and menus
        this.loadingOverlay = document.getElementById('loadingOverlay');
        this.contextMenu = document.getElementById('contextMenu');
        
        // Set initial volume
        this.audio.volume = this.volume;
        this.volumeSlider.value = this.volume * 100;
    }
    
    bindEvents() {
        // Audio events
        this.audio.addEventListener('loadedmetadata', () => this.updateDuration());
        this.audio.addEventListener('timeupdate', () => this.updateProgress());
        this.audio.addEventListener('ended', () => this.handleSongEnd());
        this.audio.addEventListener('error', (e) => this.handleAudioError(e));
        
        // Control button events
        this.playPauseBtn.addEventListener('click', () => this.togglePlayPause());
        this.prevBtn.addEventListener('click', () => this.previousSong());
        this.nextBtn.addEventListener('click', () => this.nextSong());
        this.shuffleBtn.addEventListener('click', () => this.toggleShuffle());
        this.repeatBtn.addEventListener('click', () => this.toggleRepeat());
        this.muteBtn.addEventListener('click', () => this.toggleMute());
        
        // Progress and volume events
        this.progressSlider.addEventListener('input', () => this.seekTo());
        this.volumeSlider.addEventListener('input', () => this.setVolume());
        
        // Search events
        this.searchBtn.addEventListener('click', () => this.searchSongs());
        this.searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.searchSongs();
        });
        
        // Control events
        this.refreshBtn.addEventListener('click', () => this.loadInitialData());
        this.addAllBtn.addEventListener('click', () => this.addAllToPlaylist());
        
        // Context menu events
        document.addEventListener('click', () => this.hideContextMenu());
        this.contextMenu.addEventListener('click', (e) => this.handleContextAction(e));
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
    }
    
    async loadInitialData() {
        this.showLoading(true);
        try {
            await Promise.all([
                this.loadSongs(),
                this.loadFolders()
            ]);
        } catch (error) {
            console.error('Error loading initial data:', error);
            this.showError('Failed to load music library');
        } finally {
            this.showLoading(false);
        }
    }
    
    async loadSongs() {
        try {
            const response = await fetch('https://nostaplay.com/api/songs.php?action=list');
            const songs = await response.json();
            
            if (songs.error) {
                throw new Error(songs.error);
            }
            
            this.allSongs = songs;
            this.displaySongs(songs);
        } catch (error) {
            console.error('Error loading songs:', error);
            this.songList.innerHTML = '<div class="error">Failed to load songs</div>';
        }
    }
    
    async loadFolders() {
        try {
            const response = await fetch('https://nostaplay.com/api/songs.php?action=folders');
            const folders = await response.json();
            
            if (folders.error) {
                throw new Error(folders.error);
            }
            
            this.folders = folders;
            this.displayFolders(folders);
        } catch (error) {
            console.error('Error loading folders:', error);
            this.folderList.innerHTML = '<div class="error">Failed to load folders</div>';
        }
    }
    
    displaySongs(songs) {
        if (!songs || songs.length === 0) {
            this.songList.innerHTML = '<div class="empty-playlist">No songs found</div>';
            return;
        }
        
        this.songList.innerHTML = songs.map(song => `
            <div class="song-item" data-song-id="${song.id}">
                <div class="song-info">
                    <div class="song-title">${this.escapeHtml(song.title)}</div>
                    <div class="song-details">${this.escapeHtml(song.folder)} • ${this.formatFileSize(song.size)}</div>
                </div>
                <div class="song-duration">${this.formatTime(song.duration)}</div>
                <div class="song-actions">
                    <button class="action-btn" onclick="audioPlayer.playSong('${song.id}')" title="Play">
                        <i class="fas fa-play"></i>
                    </button>
                    <button class="action-btn" onclick="audioPlayer.addToPlaylist('${song.id}')" title="Add to playlist">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
            </div>
        `).join('');
        
        // Add right-click context menu
        this.songList.querySelectorAll('.song-item').forEach(item => {
            item.addEventListener('contextmenu', (e) => this.showContextMenu(e, item.dataset.songId));
            item.addEventListener('dblclick', () => this.playSong(item.dataset.songId));
        });
    }
    
    displayFolders(folders) {
if(folders.length === 0){

}
        if (!folders || folders.length === 0) {
            this.folderList.innerHTML = '<div class="empty-playlist">No folders found</div>';
            return;
        }
        
              const folderHtml = folders.map(folder => `
    <div class="folder-item${folder.path.includes('/') ? '' : ' g'}" data-folder="${folder.path}">
        <i class=" b fas fa-folder"></i> ${this.escapeHtml(folder.name)}
        <span class="song-count">(${folder.songCount})</span>
    </div>
`).join('');
        
        // Add "All Songs" option
        this.folderList.innerHTML = `
            <div id="total" class="folder-item active" data-folder="">
                <i class="fas fa-music"></i> All Songs
                <span class="song-count">(${this.allSongs.length})</span>
            </div>
            ${folderHtml}
        `;
        
        // Add click events
        this.folderList.querySelectorAll('.folder-item').forEach(item => {
            item.addEventListener('click', () => this.selectFolder(item.dataset.folder, item));
        });
    }
    
    async selectFolder(folderPath, element) {
        // Update active folder
        this.folderList.querySelectorAll('.folder-item').forEach(item => item.classList.remove('active'));
        element.classList.add('active');
        
        this.currentFolder = folderPath;
        
        if (folderPath === '') {
            // Show all songs
            this.sectionTitle.textContent = 'All Songs';
            this.displaySongs(this.allSongs);
        } else {
            // Load folder songs
            try {
                const response = await fetch(`https://nostaplay.com/api/songs.php?action=folder_songs&folder=${encodeURIComponent(folderPath)}`);
                const songs = await response.json();
                
                if (songs.error) {
                    throw new Error(songs.error);
                }
                
                this.sectionTitle.textContent = `Folder: ${folderPath}`;
                this.displaySongs(songs);
            } catch (error) {
                console.error('Error loading folder songs:', error);
                this.showError('Failed to load folder songs');
            }
        }
    }
    
    async searchSongs() {
        const query = this.searchInput.value.trim();
        if (!query) {
            this.displaySongs(this.allSongs);
            this.sectionTitle.textContent = 'All Songs';
            return;
        }
        
        try {
            const response = await fetch(`https://nostaplay.com/api/songs.php?action=search&q=${encodeURIComponent(query)}`);
            const songs = await response.json();
            
            if (songs.error) {
                throw new Error(songs.error);
            }
            
            this.sectionTitle.textContent = `Search Results: "${query}"`;
            this.displaySongs(songs);
        } catch (error) {
            console.error('Error searching songs:', error);
            this.showError('Search failed');
        }
    }
    
    playSong(songId) {
        const song = this.allSongs.find(s => s.id === songId);
        if (!song) return;
        
        this.currentSong = song;
        this.audio.src = song.url;
        this.audio.load();
        
        // Update UI
        this.currentTitle.textContent = song.title;
        this.currentArtist.textContent = song.folder || 'Unknown Folder';
        
        // Update song list display
        this.songList.querySelectorAll('.song-item').forEach(item => {
            item.classList.toggle('playing', item.dataset.songId === songId);
        });
        
        // Play the song
        this.audio.play().then(() => {
            this.isPlaying = true;
            this.updatePlayPauseButton();
        }).catch(error => {
            console.error('Error playing song:', error);
            this.showError('Failed to play song');
        });
        
        // Add to playlist if not already there
        if (!this.playlist.find(s => s.id === songId)) {
            this.addToPlaylist(songId);
        }
        
        // Update current playlist index
        this.currentPlaylistIndex = this.playlist.findIndex(s => s.id === songId);
    }
    
    addToPlaylist(songId) {
        const song = this.allSongs.find(s => s.id === songId);
        if (!song || this.playlist.find(s => s.id === songId)) return;
        
        this.playlist.push(song);
        this.updatePlaylistDisplay();
    }
    
    removeFromPlaylist(songId) {
        const index = this.playlist.findIndex(s => s.id === songId);
        if (index === -1) return;
        
        this.playlist.splice(index, 1);
        
        // Update current index if needed
        if (this.currentPlaylistIndex > index) {
            this.currentPlaylistIndex--;
        } else if (this.currentPlaylistIndex === index) {
            this.currentPlaylistIndex = -1;
        }
        
        this.updatePlaylistDisplay();
    }
    
    addAllToPlaylist() {
        const currentSongs = this.getCurrentDisplayedSongs();
        currentSongs.forEach(song => {
            if (!this.playlist.find(s => s.id === song.id)) {
                this.playlist.push(song);
            }
        });
        this.updatePlaylistDisplay();
    }
    
    getCurrentDisplayedSongs() {
        const songItems = this.songList.querySelectorAll('.song-item');
        return Array.from(songItems).map(item => 
            this.allSongs.find(song => song.id === item.dataset.songId)
        ).filter(Boolean);
    }
    
    updatePlaylistDisplay() {
        if (this.playlist.length === 0) {
            this.currentPlaylist.innerHTML = '<div class="empty-playlist">No songs in playlist</div>';
            return;
        }
        
        this.currentPlaylist.innerHTML = this.playlist.map((song, index) => `
            <div class="playlist-item ${this.currentPlaylistIndex === index ? 'active' : ''}" data-song-id="${song.id}">
                <div class="song-info">
                    <div class="song-title">${this.escapeHtml(song.title)}</div>
                    <div class="song-details">${this.escapeHtml(song.folder)}</div>
                </div>
                <button class="action-btn" onclick="audioPlayer.removeFromPlaylist('${song.id}')" title="Remove">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `).join('');
        
        // Add click events
        this.currentPlaylist.querySelectorAll('.playlist-item').forEach(item => {
            item.addEventListener('click', () => this.playSong(item.dataset.songId));
        });
    }
    
    togglePlayPause() {
        if (!this.currentSong) return;
        
        if (this.isPlaying) {
            this.audio.pause();
            this.isPlaying = false;
        } else {
            this.audio.play().then(() => {
                this.isPlaying = true;
            }).catch(error => {
                console.error('Error playing audio:', error);
            });
        }
        
        this.updatePlayPauseButton();
    }
    
    previousSong() {
        if (this.playlist.length === 0) return;
        
        let nextIndex;
        if (this.isShuffle) {
            nextIndex = Math.floor(Math.random() * this.playlist.length);
        } else {
            nextIndex = this.currentPlaylistIndex - 1;
            if (nextIndex < 0) {
                nextIndex = this.playlist.length - 1;
            }
        }
        
        this.playSong(this.playlist[nextIndex].id);
    }
    
    nextSong() {
        if (this.playlist.length === 0) return;
        
        let nextIndex;
        if (this.isShuffle) {
            nextIndex = Math.floor(Math.random() * this.playlist.length);
        } else {
            nextIndex = this.currentPlaylistIndex + 1;
            if (nextIndex >= this.playlist.length) {
                nextIndex = 0;
            }
        }
        
        this.playSong(this.playlist[nextIndex].id);
    }
    
    handleSongEnd() {
        if (this.repeatMode === 2) {
            // Repeat current song
            this.audio.currentTime = 0;
            this.audio.play();
        } else if (this.repeatMode === 1 || this.currentPlaylistIndex < this.playlist.length - 1) {
            // Repeat all or has next song
            this.nextSong();
        } else {
            // End of playlist
            this.isPlaying = false;
            this.updatePlayPauseButton();
        }
    }
    
    toggleShuffle() {
        this.isShuffle = !this.isShuffle;
        this.shuffleBtn.classList.toggle('active', this.isShuffle);
    }
    
    toggleRepeat() {
        this.repeatMode = (this.repeatMode + 1) % 3;
        
        this.repeatBtn.classList.remove('active');
        const icon = this.repeatBtn.querySelector('i');
        
        switch (this.repeatMode) {
            case 0:
                icon.className = 'fas fa-redo';
                break;
            case 1:
                icon.className = 'fas fa-redo';
                this.repeatBtn.classList.add('active');
                break;
            case 2:
                icon.className = 'fas fa-redo-alt';
                this.repeatBtn.classList.add('active');
                break;
        }
    }
    
    toggleMute() {
        if (this.audio.muted) {
            this.audio.muted = false;
            this.muteBtn.querySelector('i').className = 'fas fa-volume-up';
        } else {
            this.audio.muted = true;
            this.muteBtn.querySelector('i').className = 'fas fa-volume-mute';
        }
    }
    
    setVolume() {
        this.volume = this.volumeSlider.value / 100;
        this.audio.volume = this.volume;
        
        // Update mute button icon
        const icon = this.muteBtn.querySelector('i');
        if (this.volume === 0) {
            icon.className = 'fas fa-volume-mute';
        } else if (this.volume < 0.5) {
            icon.className = 'fas fa-volume-down';
        } else {
            icon.className = 'fas fa-volume-up';
        }
    }
    
    seekTo() {
        if (!this.currentSong) return;
        
        const seekTime = (this.progressSlider.value / 100) * this.audio.duration;
        this.audio.currentTime = seekTime;
    }
    
    updateProgress() {
        if (!this.audio.duration) return;
        
        const progress = (this.audio.currentTime / this.audio.duration) * 100;
        this.progressFill.style.width = progress + '%';
        this.progressSlider.value = progress;
        
        this.currentTime.textContent = this.formatTime(this.audio.currentTime);
    }
    
    updateDuration() {
        this.totalTime.textContent = this.formatTime(this.audio.duration);
    }
    
    updatePlayPauseButton() {
        const icon = this.playPauseBtn.querySelector('i');
        icon.className = this.isPlaying ? 'fas fa-pause' : 'fas fa-play';
    }
    
    showContextMenu(event, songId) {
        event.preventDefault();
        
        this.contextMenu.dataset.songId = songId;
        this.contextMenu.style.display = 'block';
        this.contextMenu.style.left = event.pageX + 'px';
        this.contextMenu.style.top = event.pageY + 'px';
    }
    
    hideContextMenu() {
        this.contextMenu.style.display = 'none';
    }
    
    handleContextAction(event) {
        const action = event.target.closest('.context-item')?.dataset.action;
        const songId = this.contextMenu.dataset.songId;
        
        if (!action || !songId) return;
        
        switch (action) {
            case 'play':
                this.playSong(songId);
                break;
            case 'add-to-playlist':
                this.addToPlaylist(songId);
                break;
            case 'remove-from-playlist':
                this.removeFromPlaylist(songId);
                break;
        }
        
        this.hideContextMenu();
    }
    
    handleKeyboard(event) {
        if (event.target.tagName === 'INPUT') return;
        
        switch (event.code) {
            case 'Space':
                event.preventDefault();
                this.togglePlayPause();
                break;
            case 'ArrowLeft':
                this.previousSong();
                break;
            case 'ArrowRight':
                this.nextSong();
                break;
            case 'ArrowUp':
                event.preventDefault();
                this.volumeSlider.value = Math.min(100, parseInt(this.volumeSlider.value) + 5);
                this.setVolume();
                break;
            case 'ArrowDown':
                event.preventDefault();
                this.volumeSlider.value = Math.max(0, parseInt(this.volumeSlider.value) - 5);
                this.setVolume();
                break;
        }
    }
    
    handleAudioError(event) {
        console.error('Audio error:', event);
        this.showError('Error playing audio file');
        this.isPlaying = false;
        this.updatePlayPauseButton();
    }
    
    showLoading(show) {
        this.loadingOverlay.style.display = show ? 'flex' : 'none';
    }
    
    showError(message) {
        alert(message); // Simple error display - could be enhanced with a custom modal
    }
    
    formatTime(seconds) {
        if (!seconds || isNaN(seconds)) return '0:00';
        
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
    
    formatFileSize(bytes) {
        if (!bytes) return '0 B';
        
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(1024));
        return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
    }
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize the audio player when the page loads
let audioPlayer;
document.addEventListener('DOMContentLoaded', () => {
    audioPlayer = new AudioPlayer();
});
