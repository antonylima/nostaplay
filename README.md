# Audio Player

A modern, full-featured web-based audio player with PHP backend for managing music libraries organized in folders.

## Features

### 🎵 Core Audio Features
- **Full Audio Controls**: Play, pause, previous, next, shuffle, repeat modes
- **Progress Control**: Seek to any position in the track
- **Volume Control**: Adjustable volume with mute functionality
- **Keyboard Shortcuts**: Space (play/pause), arrow keys (navigation/volume)

### 📁 Library Management
- **Folder Navigation**: Browse music organized in folders
- **Search Functionality**: Search songs by title or folder
- **Multiple Audio Formats**: Supports MP3, WAV, OGG, M4A, FLAC

### 🎶 Playlist Features
- **Dynamic Playlists**: Add/remove songs from current playlist
- **Playlist Navigation**: Click to play any song in playlist
- **Bulk Operations**: Add all displayed songs to playlist
- **Context Menus**: Right-click for quick actions

### 🎨 Modern UI
- **Responsive Design**: Works on desktop and mobile devices
- **Beautiful Interface**: Gradient backgrounds, smooth animations
- **Real-time Updates**: Live progress bars and time displays
- **Visual Feedback**: Hover effects, active states

## Installation

### Requirements
- PHP 7.0 or higher
- Web server (Apache, Nginx, etc.)
- Modern web browser with HTML5 audio support

### Setup Steps

1. **Clone/Download** the project to your web server directory
2. **Create Music Directory**: The system will automatically create a `music/` folder
3. **Upload Music Files**: Place your audio files in the `music/` directory, organized in folders as desired
4. **Set Permissions**: Ensure the web server can read the `music/` directory
5. **Access**: Open `index.html` in your web browser

### Directory Structure
```
audio-player/
├── index.html          # Main application
├── css/
│   └── style.css       # Styling
├── js/
│   └── audioPlayer.js  # JavaScript functionality
├── api/
│   └── songs.php       # PHP API endpoints
├── music/              # Your music files (auto-created)
│   ├── Rock/
│   ├── Jazz/
│   └── Classical/
└── README.md
```

## API Endpoints

The PHP backend provides several API endpoints:

### `GET api/songs.php?action=list`
Returns all songs in the music library
```json
[
  {
    "id": "unique_hash",
    "title": "Song Title",
    "file": "folder/song.mp3",
    "url": "music/folder/song.mp3",
    "folder": "folder",
    "duration": 180,
    "size": 5242880
  }
]
```

### `GET api/songs.php?action=folders`
Returns all folders in the music library
```json
[
  {
    "name": "Rock",
    "path": "Rock",
    "songCount": 15
  }
]
```

### `GET api/songs.php?action=folder_songs&folder=FolderName`
Returns songs from a specific folder

### `GET api/songs.php?action=search&q=query`
Search songs by title or folder name

## Usage

### Basic Playback
1. **Browse Songs**: Use the folder list to navigate your music library
2. **Play Song**: Click the play button on any song or double-click the song
3. **Control Playback**: Use the control buttons in the "Now Playing" section

### Playlist Management
1. **Add to Playlist**: Click the + button on any song
2. **Add All**: Use "Add All" button to add all displayed songs
3. **Remove from Playlist**: Click the × button in the playlist
4. **Play from Playlist**: Click any song in the current playlist

### Keyboard Shortcuts
- **Space**: Play/Pause
- **Left Arrow**: Previous song
- **Right Arrow**: Next song
- **Up Arrow**: Increase volume
- **Down Arrow**: Decrease volume

### Search
1. Type in the search box in the header
2. Press Enter or click the search button
3. Results will show songs matching your query

## Customization

### Adding More Audio Formats
Edit `api/songs.php` and add extensions to this array:
```php
if (in_array($ext, ['mp3', 'wav', 'ogg', 'm4a', 'flac', 'aac'])) {
```

### Styling
Modify `css/style.css` to customize:
- Colors and gradients
- Layout and spacing
- Animations and transitions
- Responsive breakpoints

### Functionality
Extend `js/audioPlayer.js` to add:
- Equalizer controls
- Lyrics display
- Social sharing
- Advanced playlist features

## Browser Compatibility

- **Chrome**: Full support
- **Firefox**: Full support
- **Safari**: Full support
- **Edge**: Full support
- **Mobile Browsers**: Responsive design supported

## Troubleshooting

### Songs Not Loading
- Check that the `music/` directory exists and is readable
- Verify audio file formats are supported
- Check browser console for API errors

### Audio Not Playing
- Ensure browser supports HTML5 audio
- Check that audio files are not corrupted
- Verify file paths are correct

### Search Not Working
- Check that PHP is properly configured
- Verify API endpoints are accessible
- Check for JavaScript errors in browser console

## Security Notes

- The system only reads files, never writes or deletes
- File paths are sanitized to prevent directory traversal
- CORS headers are configured for local development

## Performance Tips

- **Large Libraries**: For libraries with 1000+ songs, consider pagination
- **File Sizes**: Compress audio files for faster loading
- **Caching**: Enable browser caching for better performance

## License

This project is open source. Feel free to modify and distribute according to your needs.

## Contributing

Contributions are welcome! Areas for improvement:
- Advanced audio features (equalizer, effects)
- Better mobile experience
- Playlist persistence
- User authentication
- Music metadata extraction
