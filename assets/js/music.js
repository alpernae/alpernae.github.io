class RetroMusicPlayer {
    constructor() {
        this.playlist = [
            // Add your YouTube video IDs and titles here
            { id: 'wlei_MKXomc', title: 'Never Gonna Give You Up' },
            { id: 'djV11Xbc914', title: 'Take On Me' },
            // Add more songs as needed
        ];
        this.currentTrack = 0;
        this.isPlaying = false;
        this.player = null;
    }

    async initializePlayer() {
        try {
            // Load YouTube IFrame API
            await this.loadYouTubeAPI();
            
            // Create player container
            this.createPlayerUI();
            
            // Initialize YouTube player
            this.initYouTubePlayer();
        } catch (error) {
            console.error('Error initializing music player:', error);
        }
    }

    loadYouTubeAPI() {
        return new Promise((resolve) => {
            const tag = document.createElement('script');
            tag.src = 'https://www.youtube.com/iframe_api';
            const firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
            window.onYouTubeIframeAPIReady = resolve;
        });
    }

    createPlayerUI() {
        const playerContainer = document.createElement('div');
        playerContainer.className = 'retro-music-player terminal-window';
        playerContainer.innerHTML = `
            <div class="window-title">> MUSIC_PLAYER</div>
            <div class="player-content">
                <div id="youtube-player"></div>
                <div class="track-info">
                    <span class="track-title">[ NO TRACK LOADED ]</span>
                    <div class="progress-container">
                        <div class="progress-bar">
                            <div class="progress-fill"></div>
                        </div>
                        <span class="time-display">00:00 / 00:00</span>
                    </div>
                </div>
                <div class="controls">
                    <button class="prev-btn">|◄</button>
                    <button class="play-btn">►</button>
                    <button class="next-btn">►|</button>
                </div>
                <div class="volume-control">
                    <button class="volume-down">🔉</button>
                    <input type="range" class="volume-slider" min="0" max="100" value="50">
                    <button class="volume-up">🔊</button>
                </div>
                <div class="visualizer">
                    ▮▯▮▯▮▯▮▯▮▯▮▯▮
                </div>
            </div>
        `;

        document.querySelector('.terminal-container').insertBefore(
            playerContainer,
            document.querySelector('.content')
        );

        this.attachEventListeners();
    }

    initYouTubePlayer() {
        this.player = new YT.Player('youtube-player', {
            height: '0',
            width: '0',
            videoId: this.playlist[0].id,
            events: {
                onReady: () => this.onPlayerReady(),
                onStateChange: (event) => this.onPlayerStateChange(event)
            },
            playerVars: {
                controls: 0,
                disablekb: 1
            }
        });

        // Start progress update interval
        setInterval(() => this.updateProgress(), 1000);
    }

    onPlayerReady() {
        // Update initial track display
        this.updateTrackInfo();
        // Set initial volume
        this.player.setVolume(50);
    }

    onPlayerStateChange(event) {
        // Handle state changes (playing, paused, ended)
        if (event.data === YT.PlayerState.ENDED) {
            this.playNext();
        }
        this.isPlaying = event.data === YT.PlayerState.PLAYING;
        this.updatePlayButton();
    }

    attachEventListeners() {
        document.querySelector('.play-btn').addEventListener('click', () => this.togglePlay());
        document.querySelector('.prev-btn').addEventListener('click', () => this.playPrevious());
        document.querySelector('.next-btn').addEventListener('click', () => this.playNext());

        const progressBar = document.querySelector('.progress-bar');
        progressBar.addEventListener('click', (e) => {
            const rect = progressBar.getBoundingClientRect();
            const position = (e.clientX - rect.left) / rect.width;
            const duration = this.player.getDuration();
            this.player.seekTo(duration * position, true);
        });

        const volumeSlider = document.querySelector('.volume-slider');
        volumeSlider.addEventListener('input', (e) => {
            this.player.setVolume(e.target.value);
        });

        document.querySelector('.volume-down').addEventListener('click', () => {
            const currentVolume = this.player.getVolume();
            this.player.setVolume(Math.max(currentVolume - 10, 0));
            volumeSlider.value = this.player.getVolume();
        });

        document.querySelector('.volume-up').addEventListener('click', () => {
            const currentVolume = this.player.getVolume();
            this.player.setVolume(Math.min(currentVolume + 10, 100));
            volumeSlider.value = this.player.getVolume();
        });
    }

    togglePlay() {
        if (this.isPlaying) {
            this.player.pauseVideo();
        } else {
            this.player.playVideo();
        }
        this.isPlaying = !this.isPlaying;
        this.updatePlayButton();
    }

    playNext() {
        this.currentTrack = (this.currentTrack + 1) % this.playlist.length;
        this.loadAndPlayTrack();
    }

    playPrevious() {
        this.currentTrack = (this.currentTrack - 1 + this.playlist.length) % this.playlist.length;
        this.loadAndPlayTrack();
    }

    loadAndPlayTrack() {
        const track = this.playlist[this.currentTrack];
        this.player.loadVideoById(track.id);
        document.querySelector('.track-title').textContent = `[ NOW PLAYING: ${track.title} ]`;
        this.startVisualizer();
    }

    updatePlayButton() {
        const playBtn = document.querySelector('.play-btn');
        playBtn.textContent = this.isPlaying ? '❚❚' : '►';
    }

    startVisualizer() {
        const visualizer = document.querySelector('.visualizer');
        let bars = '▮▯▮▯▮▯▮▯▮▯▮▯▮';
        
        setInterval(() => {
            bars = bars.split('').map(char => 
                Math.random() > 0.5 ? '▮' : '▯'
            ).join('');
            visualizer.textContent = bars;
        }, 200);
    }

    updateTrackInfo() {
        const track = this.playlist[this.currentTrack];
        document.querySelector('.track-title').textContent = 
            `[ NOW PLAYING: ${track.title} ]`;
    }

    updateProgress() {
        if (this.player && this.isPlaying) {
            const currentTime = this.player.getCurrentTime() || 0;
            const duration = this.player.getDuration() || 0;
            const progress = (currentTime / duration) * 100;

            const progressFill = document.querySelector('.progress-fill');
            const timeDisplay = document.querySelector('.time-display');

            if (progressFill) {
                progressFill.style.width = `${progress}%`;
            }

            if (timeDisplay) {
                timeDisplay.textContent = `${this.formatTime(currentTime)} / ${this.formatTime(duration)}`;
            }
        }
    }

    formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
}

// Initialize player
window.addEventListener('load', () => {
    const player = new RetroMusicPlayer();
    player.initializePlayer();
});
