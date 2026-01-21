<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

class SongsAPI {
    private $musicDir;
    
    public function __construct() {
        $this->musicDir = __DIR__ . '/../music/';
        if (!is_dir($this->musicDir)) {
            mkdir($this->musicDir, 0755, true);
        }
    }
    
    public function handleRequest() {
        $action = $_GET['action'] ?? 'list';
        
        switch ($action) {
            case 'list':
                return $this->listSongs();
            case 'folders':
                return $this->getFolders();
            case 'folder_songs':
                return $this->getFolderSongs($_GET['folder'] ?? '');
            case 'search':
                return $this->searchSongs($_GET['q'] ?? '');
            default:
                return ['error' => 'Invalid action'];
        }
    }
    
    private function listSongs($dir = '') {
        $fullPath = $this->musicDir . $dir;
        $songs = [];
        
        if (!is_dir($fullPath)) {
            return ['error' => 'Directory not found'];
        }
        
        $files = scandir($fullPath);
        foreach ($files as $file) {
            if ($file === '.' || $file === '..') continue;
            
            $filePath = $fullPath . $file;
            $relativePath = $dir . $file;
            
            if (is_dir($filePath)) {
                $subSongs = $this->listSongs($relativePath . '/');
                if (!isset($subSongs['error'])) {
                    $songs = array_merge($songs, $subSongs);
                }
            } else {
                $ext = strtolower(pathinfo($file, PATHINFO_EXTENSION));
                if (in_array($ext, ['mp3', 'wav', 'ogg', 'm4a', 'flac'])) {
                    $songs[] = [
                        'id' => md5($relativePath),
                        'title' => pathinfo($file, PATHINFO_FILENAME),
                        'file' => $relativePath,
                        'url' => 'music/' . $relativePath,
                        'folder' => dirname($relativePath),
                        'duration' => $this->getAudioDuration($filePath),
                        'size' => filesize($filePath)
                    ];
                }
            }
        }
        
        return $songs;
    }
    
    private function getFolders($dir = '') {
        $fullPath = $this->musicDir . $dir;
        $folders = [];
        
        if (!is_dir($fullPath)) {
            return ['error' => 'Directory not found'];
        }
        
        $files = scandir($fullPath);
        foreach ($files as $file) {
            if ($file === '.' || $file === '..') continue;
            
            $filePath = $fullPath . $file;
            $relativePath = $dir . $file;
            
            if (is_dir($filePath)) {
                $songCount = count($this->listSongs($relativePath . '/'));
                $folders[] = [
                    'name' => $file,
                    'path' => $relativePath,
                    'songCount' => $songCount
                ];
                
                $subFolders = $this->getFolders($relativePath . '/');
                if (!isset($subFolders['error'])) {
                    $folders = array_merge($folders, $subFolders);
                }
            }
        }
        
        return $folders;
    }
    
    private function getFolderSongs($folder) {
        return $this->listSongs($folder . '/');
    }
    
    private function searchSongs($query) {
        $allSongs = $this->listSongs();
        if (isset($allSongs['error'])) {
            return $allSongs;
        }
        
        $results = [];
        $query = strtolower($query);
        
        foreach ($allSongs as $song) {
            if (strpos(strtolower($song['title']), $query) !== false ||
                strpos(strtolower($song['folder']), $query) !== false) {
                $results[] = $song;
            }
        }
        
        return $results;
    }
    
    private function getAudioDuration($file) {
        // Simple duration estimation - in a real app you'd use getID3 or similar
        $size = filesize($file);
        $estimatedDuration = $size / 128000; // Rough estimate for 128kbps MP3
        return round($estimatedDuration);
    }
}

$api = new SongsAPI();
echo json_encode($api->handleRequest());
?>
