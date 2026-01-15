# Audio Player Project Structure

## 📁 Directory Structure

```
/home/vando/projects/np/
├── 📄 index.html              # Main application entry point
├── 📁 css/
│   └── 📄 style.css           # Complete UI styling
├── 📁 js/
│   └── 📄 audioPlayer.js      # Core application logic
├── 📁 api/
│   └── 📄 songs.php           # Backend API endpoints
├── 📁 music/                  # Music library (auto-created)
│   ├── 📁 Rock/
│   ├── 📁 Jazz/
│   └── 📁 Classical/
├── 📄 .htaccess               # Server configuration
├── 📄 README.md               # Documentation
└── 📄 STRUCTURE.md            # This file
```

## 🏗️ AudioPlayer Class Structure

### Core Properties
```javascript
class AudioPlayer {
    // Audio Management
    this.audio                 // HTML5 Audio element
    this.currentSong          // Currently playing song object
    this.isPlaying            // Playback state boolean
    
    // Playlist Management
    this.playlist             // Array of songs in current playlist
    this.currentPlaylistIndex // Index of current song in playlist
    this.allSongs             // Complete library of available songs
    
    // Playback Controls
    this.isShuffle            // Shuffle mode boolean
    this.repeatMode           // 0: off, 1: all, 2: one
    this.volume               // Volume level (0-1)
    
    // Library Organization
    this.folders              // Available folder structure
    this.currentFolder        // Currently selected folder
}
```

### Method Categories

#### 🎵 Core Audio Methods
- `togglePlayPause()` - Play/pause current song
- `playSong(songId)` - Load and play specific song
- `previousSong()` - Navigate to previous track
- `nextSong()` - Navigate to next track
- `handleSongEnd()` - Handle track completion

#### 🎛️ Control Methods
- `toggleShuffle()` - Enable/disable shuffle mode
- `toggleRepeat()` - Cycle through repeat modes
- `toggleMute()` - Mute/unmute audio
- `setVolume()` - Adjust volume level
- `seekTo()` - Seek to specific time position

#### 📚 Library Management
- `loadSongs()` - Fetch all songs from API
- `loadFolders()` - Fetch folder structure
- `searchSongs()` - Search songs by query
- `selectFolder()` - Filter songs by folder

#### 🎶 Playlist Operations
- `addToPlaylist(songId)` - Add song to current playlist
- `removeFromPlaylist(songId)` - Remove song from playlist
- `addAllToPlaylist()` - Add all displayed songs
- `updatePlaylistDisplay()` - Refresh playlist UI

#### 🖥️ UI Management
- `displaySongs(songs)` - Render song list
- `displayFolders(folders)` - Render folder navigation
- `updateProgress()` - Update progress bar
- `updatePlayPauseButton()` - Update play/pause icon

#### ⚙️ System Methods
- `initializeElements()` - Get DOM references
- `bindEvents()` - Attach event listeners
- `loadInitialData()` - Load songs and folders on startup
- `handleKeyboard(event)` - Process keyboard shortcuts

## 🔌 API Endpoints Structure

### Base URL: `api/songs.php`

#### GET Parameters:
- `?action=list` - Get all songs
- `?action=folders` - Get folder structure
- `?action=folder_songs&folder=NAME` - Get songs from specific folder
- `?action=search&q=QUERY` - Search songs

#### Response Format:
```javascript
// Songs Response
[{
    id: "unique_hash",
    title: "Song Name",
    file: "folder/file.mp3",
    url: "music/folder/file.mp3",
    folder: "folder_name",
    duration: 180,
    size: 5242880
}]

// Folders Response
[{
    name: "Rock",
    path: "Rock",
    songCount: 15
}]
```

## 🎨 CSS Structure

### Main Sections:
- **Global Styles** - Reset, fonts, base layout
- **Header** - Search bar, title, navigation
- **Sidebar** - Folder list, current playlist
- **Main Content** - Now playing, song list
- **Controls** - Audio controls, progress bars
- **Responsive** - Mobile adaptations
- **Animations** - Hover effects, transitions

### Key Classes:
- `.audio-player` - Main container
- `.now-playing` - Current track display
- `.song-item` - Individual song row
- `.control-btn` - Audio control buttons
- `.progress-bar` - Seek/progress controls

## 🔄 Data Flow

```
1. Page Load
   ├── AudioPlayer constructor
   ├── initializeElements()
   ├── bindEvents()
   └── loadInitialData()
       ├── loadSongs() → API
       └── loadFolders() → API

2. User Interaction
   ├── Click Song → playSong()
   ├── Search → searchSongs() → API
   ├── Select Folder → selectFolder() → API
   └── Controls → togglePlayPause(), etc.

3. Audio Events
   ├── timeupdate → updateProgress()
   ├── ended → handleSongEnd()
   └── error → handleAudioError()
```

## 🎯 Key Features

### Audio Controls
- ▶️ Play/Pause with visual feedback
- ⏮️⏭️ Previous/Next track navigation
- 🔀 Shuffle mode toggle
- 🔁 Repeat modes (off/all/one)
- 🔊 Volume control with mute
- 📊 Progress bar with seeking

### Library Management
- 📁 Folder-based organization
- 🔍 Real-time search
- 📋 Dynamic playlists
- 🎵 Multiple audio format support

### User Experience
- 📱 Responsive design
- ⌨️ Keyboard shortcuts
- 🖱️ Context menus
- ⚡ Real-time updates
- 🎨 Modern UI with animations
