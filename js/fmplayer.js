const tpl = document.createElement("template");
tpl.innerHTML = `
    <style>
      :host {
        position: fixed;        /* 悬浮在视口上 */
        left: 20px;             /* 默认左偏移 */
        bottom: 20px;              /* 默认上偏移 */
        z-index: 999999;          /* 保持在较高层级 */
        display: flex;
        width: 400px;
        height:100px;
        box-sizing: border-box;
        user-select: none;      /* 禁止选中以便拖拽体验 */
        touch-action: none;     /* 阻止浏览器对触摸滑动的默认处理，便于使用 pointer 事件 */
     }
      #myAudio {
        display: none;
      }
      .player {
        position: relative;
      }
      .control {
        width: 300px;
        height: 80px;
        background-color: rgb(255, 255, 255);
        border-radius: 15px;
        box-shadow: 0 15px 20px 5px rgba(54, 148, 196, 0.5);
        position: relative;
      }
      .alarm {
        position: absolute;
        width: 110px;
        height: 110px;
        top: 0;
        left: 50%;
        border-radius: 50%;
        background-color: rgba(0, 0, 0, 1);
        transform: scale(1) translateX(-50%) translateY(-50%);
        transition: all 0.5s ease;
        z-index: -1;
      }
      .alarm::before {
        content: "";
        top: 0;
        left: 0;
        bottom: 0;
        width: 100%;
        border-radius: 50%;
        background: var(--alarm-image, url("../static/img/3.jpg")) no-repeat center center;
        background-size: cover;
        position: absolute;
        box-shadow: 0 0px 6px 2px rgba(38, 38, 38, 0.8);
      }
      .control.active .alarm::before {
        animation: rotateF 5s infinite linear;
      }
      @keyframes rotateF {
        0% {
          transform: rotate(0deg);
        }
        100% {
          transform: rotate(360deg);
        }
      }
      .alarm::after {
        content: "";
        position: absolute;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: #7dbbf0;
        top: 50%;
        left: 50%;
        transform: translateX(-50%) translateY(-50%);
        z-index: 1;
        box-shadow: 0 0px 10px 5px rgba(38, 38, 38, 0.8);
      }
      .buts {
        display: flex;
        justify-content: space-around;
        height: 50px;
        padding: 10px 30px 0px 30px;
      }
      .prev,
      .play,
      .next,.volume,.mode {
        width: 50px;
        height: auto;
        border-radius: 10px;
        background: #000;
        cursor: pointer;
        transition: all 0.5s ease;
      }
      .prev:hover,
      .play:hover,
      .next:hover,
      .volume:hover,
      .mode:hover ,
      .control.active .play:hover {
        background: #40c2c9ad;
        transform: scale(0.6);
        border-radius: 50%;
      }
      .prev {
        background: url("../static/img/svg/skip-back.svg") no-repeat center
          center;
        /* background-size: 25px; */
      }
      .next {
        background: url("../static/img/svg/skip-forward.svg") no-repeat center
          center;
        /* background-size: 25px; */
      }
      .play {
        background: url("../static/img/svg/play.svg") no-repeat center center;
        background-size: 35px;
      }
      .control.active .play {
        background: url("../static/img/svg/pause.svg") no-repeat center center;
        background-size: 35px;
      }
      .volume{
        background: var(--volume-icon, url("../static/img/svg/volume/volume-1.svg")) no-repeat center center;
        background-size: 30px;
        margin-right:10px;
      }
      .mode{
        background: var(--mode-icon, url("../static/img/svg/mode/menu.svg")) no-repeat center center;
        background-size: 25px;
        margin-left: 10px;
      }
      /*隐藏*/
      .info {
        opacity: 0;
        position: absolute;
        height: 100px;
        top: -90px;
        left: 15px;
        right: 15px;
        background: rgba(255, 255, 255, 0.3);
        padding: 5px 15px 5px 15px;
        z-index: -2;
        border-radius: 15px;
        box-shadow: 0 0 25px 1px rgba(255, 255, 255, 0.3);
        transition: all 1.0s ease;
        animation: hiddenInfo 0.5s ease forwards;
      }

      .info.active {
        opacity: 1;
        animation: showInfo 0.5s ease forwards;
        transition: all 1.0s ease;
      }
      @keyframes showInfo {
        0% {
          top: 0px;
        }
        100% {
          top: -90px;
        }
      }
        @keyframes hiddenInfo {
        0% {
          top: -90px;
        }
        100% {
          top: 0px;
        }
      }
      .song {
        color: rgba(67, 95, 164, 0.9);
        font-size: 16px;
        margin-bottom: 2px;
        font-weight: bolder;
        font-style: italic;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .name {
        font-size: 12px;
        color: rgba(94, 154, 208, 1);
        font-weight: bolder;
        font-style: oblique;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .progress-bar {
        position: absolute;
        margin: 5px 10px 5px 10px;
        width: 84%;
        left: 5%;
        height: 3px;
        background-color: #5dc3d7;
        z-index: 1;
        border-radius: 2px;
        overflow: hidden;
      }
      .bar {
        width: 0%;
        height: 3px;
        background: rgb(79, 127, 248);
      }
        .progress-bar:hover {
        cursor: pointer;
      }
      .bar:hover {
        cursor: pointer;
      }
      .bar:active {
      background: rgba(68, 84, 208, 1);
      }
    .component-control {
        display: flex;
        justify-content: flex-start;
        width:400px;
        height: 100px;
      }
      .grab{
        position:relative;
        top:20px;
        margin-right: 10px;
        width: 45px;
        height: 45px;
        background: rgba(255,255,255,1);
        border-radius: 50%;
        box-shadow: 0 0 30px 1px rgba(54, 148, 196, 0.5);
        cursor:pointer;
        transition: all 0.5s ease;
        z-index : 3000;
      }
      .grab::after{
        content: "";
        position: absolute;
        background: url(../static/img/svg/music.svg) no-repeat center center;
        background-size: 35px;
        width: 40px;
        height: 40px;
        padding: 5px 4px 5px 0px;
      }
      .grab:hover{
        transform: scale(1.2);
      }
    .hide {
        display: none;
        opacity: 0;
      }
      .volume-panel{
        position:relative;
        top:5px;
        left:10%;
        height: 25px;
        width: 140px;
        background: rgba(255,255,255,1);
        border-radius: 5px;
        display: flex;
        justify-content: flex-start;
        align-items: center;
      }
      .volume-icon{
        position:relative;
        background:  url("../static/img/svg/volume/volume.svg") no-repeat center center;
        width: 25px;
        height: 25px;
        left:10px;
        margin-right: 15px;
        cursor:pointer;
      }
        .volume-icon:hover{
        transform: scale(1.1);
      }
      .volume-slider{
        background: #5dc3d7;
        height: 3px;
        width: 60%;
        z-index: 1;
        border-radius: 2px;
        overflow: hidden;
      }
      .volume-bar {
        width: 100%;
        height: 3px;
        background: rgb(79, 127, 248);
      }
    </style>

      <div class="component-control">
      <div class="grab" id="grab"></div>
      <div class = "hide" id = "musicPanel">
      <!---播放器-->
      <audio id="myAudio">
      </audio>

      <div class="player">
        <!--播放信息-->
        <div class="info" id="info">
          <div class="song">曲名</div>
          <div class="name">作者名字</div>
        </div>
        <!---播放信息 end-->
        <!--控件-->
        <div class="control" id="control">
          <div class="alarm"></div>
          <div class="buts">
            <div class="volume"></div>
            <div class="prev"></div>
            <div class="play"></div>
            <div class="next"></div>
            <div class="mode"></div>
          </div>
          <div class="progress-bar">
            <div class="bar" id="bar"></div>
          </div>
        </div>
        <div class = "volume-panel hide">
          <div class="volume-icon"></div>
          <div class="volume-slider"><div class="volume-bar" id="volume-bar"></div></div>
        </div>
        </div>
      </div>
    </div>
`;

class FMPlayer extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(tpl.content.cloneNode(true));

    this._show = this.shadowRoot.getElementById("grab");
    this._musicPanel = this.shadowRoot.getElementById("musicPanel");
    this._grab = this.shadowRoot.getElementById("grab");
    this._audio = this.shadowRoot.getElementById("myAudio");
    this._bar = this.shadowRoot.getElementById("bar");
    this._progressBar = this.shadowRoot.querySelector(".progress-bar");
    this._playBtn = this.shadowRoot.querySelector(".play");
    this._prevBtn = this.shadowRoot.querySelector(".prev");
    this._nextBtn = this.shadowRoot.querySelector(".next");
    this._volumeBtn = this.shadowRoot.querySelector(".volume");
    this._volumeMuteBtn = this.shadowRoot.querySelector(".volume-icon");
    this._modeBtn = this.shadowRoot.querySelector(".mode");
    this._volumePanel = this.shadowRoot.querySelector(".volume-panel");
    this._volumeBar = this.shadowRoot.querySelector(".volume-bar");
    this._volumeSlider = this.shadowRoot.querySelector(".volume-slider");
    this._info = this.shadowRoot.getElementById("info");
    this._songEl = this.shadowRoot.querySelector(".song");
    this._nameEl = this.shadowRoot.querySelector(".name");
    this._alarmEl = this.shadowRoot.querySelector(".alarm");

    this._playlist = [];
    this._currentIndex = 0;
    this._dragging = false;
    this._draggingProgress = false;
    this._draggingVolume = false;

    this._STORAGE_KEY = "fmplayer-state-v1";

    this._playing = true;
    this._audioVolume = 0.5;

    this._lastSavedSecond = -1;

    this.mutedIconUrl = "../static/img/svg/volume/volume-x.svg";
    this.volume1IconUrl = "../static/img/svg/volume/volume-1.svg";
    this.volume2IconUrl = "../static/img/svg/volume/volume-2.svg";

    this._playMode = 0; // 0:顺序播放 1:单曲循环 2:随机播放
    this._randoming = false;

    this.singleIconUrl = "../static/img/svg/mode/menu.svg";
    this.randomIconUrl = "../static/img/svg/mode/shuffle.svg";
    this.loopIconUrl = "../static/img/svg/mode/refresh-cw.svg";

    this._onShowMusicPointerDown = this._onShowMusicPointerDown.bind(this);

    this._onPointerDown = this._onPointerDown.bind(this);
    this._onPointerMove = this._onPointerMove.bind(this);
    this._onPointerUp = this._onPointerUp.bind(this);

    this._onBarPointerDown = this._onBarPointerDown.bind(this);
    this._onBarPointerMove = this._onBarPointerMove.bind(this);
    this._onBarPointerUp = this._onBarPointerUp.bind(this);

    this._onTimeUpdate = this._onTimeUpdate.bind(this);
    this._onAudioEnded = this._onAudioEnded.bind(this);

    this._saveStateToStorage = this._saveStateToStorage.bind(this);
    this._onLoadedMetadata = this._onLoadedMetadata.bind(this);

    this._onShowVolumePointerDown = this._onShowVolumePointerDown.bind(this);
    this._onVolumePointerUp = this._onVolumePointerUp.bind(this);
    this._onVolumePointerDown = this._onVolumePointerDown.bind(this);
    this._onVolumePointerMove = this._onVolumePointerMove.bind(this);
    this._onVolumeChange = this._onVolumeChange.bind(this);
    this._onVolumeMuteBtnClick = this._onVolumeMuteBtnClick.bind(this);

    this._onModeBtnClick = this._onModeBtnClick.bind(this);
  }
  static get observedAttributes() {
    return ["src", "playlist-src"];
  }
  connectedCallback() {
    this._restoreStateFromStorage();
    const playlistSrc = this.getAttribute("playlist-src");
    if (playlistSrc) {
      this._loadPlaylistFromSrc(playlistSrc); //从json加载列表
    } else if (this.hasAttribute("playlist")) {
      this.setPlaylist(JSON.parse(this.getAttribute("playlist")), true); //从属性加载列表
    }

    this._show.addEventListener("click", this._onShowMusicPointerDown);
    this._volumeBtn.addEventListener("click", this._onShowVolumePointerDown);

    this._grab.addEventListener("pointerdown", this._onPointerDown);
    document.addEventListener("pointermove", this._onPointerMove);
    document.addEventListener("pointerup", this._onPointerUp);

    this._bar.addEventListener("pointerdown", this._onBarPointerDown);
    document.addEventListener("pointermove", this._onBarPointerMove);
    document.addEventListener("pointerup", this._onBarPointerUp);

    this._volumeSlider.addEventListener(
      "pointerdown",
      this._onVolumePointerDown
    );
    document.addEventListener("pointermove", this._onVolumePointerMove);
    document.addEventListener("pointerup", this._onVolumePointerUp);
    this._volumeMuteBtn.addEventListener("click", this._onVolumeMuteBtnClick);

    this._modeBtn.addEventListener("click", this._onModeBtnClick);
    /*开关播放 */
    this._playBtn.addEventListener("click", () => this._togglePlay());
    this._nextBtn.addEventListener("click", () => this.next());
    this._prevBtn.addEventListener("click", () => this.prev());

    this._grab.tabIndex = 0;
    this._grab.addEventListener("keydown", (e) => {
      if (e.key == " " || e.key == "Enter") {
        e.preventDefault();
        this._togglePlay();
      }
    });

    this._audio.addEventListener("timeupdate", this._onTimeUpdate);
    this._audio.addEventListener("loadedmetadata", this._onLoadedMetadata);
    this._audio.addEventListener("ended", this._onAudioEnded);
    this._audio.addEventListener("play", () => this._toggleActiveClass(true));
    this._audio.addEventListener("pause", () => this._toggleActiveClass(false));
    this._audio.addEventListener("volumechange", this._onVolumeChange);

    window.addEventListener("beforeunload", this._saveStateToStorage);
    this.initAudioVolume(this._audioVolume);
    this._changePlayMode();
    if (this._playing) this.play();
  }
  disconnectedCallback() {
    this._show.removeEventListener("click", this._onShowMusicPointerDown);
    this._volumeBtn.removeEventListener("click", this._onShowVolumePointerDown);

    this._grab.removeEventListener("pointerdown", this._onPointerDown);
    document.removeEventListener("pointermove", this._onPointerMove);
    document.removeEventListener("pointerup", this._onPointerUp);

    this._bar.removeEventListener("pointerdown", this._onBarPointerDown);
    document.removeEventListener("pointermove", this._onBarPointerMove);
    document.removeEventListener("pointerup", this._onBarPointerUp);

    this._volumeSlider.removeEventListener(
      "pointerdown",
      this._onVolumePointerDown
    );
    document.removeEventListener("pointermove", this._onVolumePointerMove);
    document.removeEventListener("pointerup", this._onVolumePointerUp);
    this._volumeMuteBtn.removeEventListener(
      "click",
      this._onVolumeMuteBtnClick
    );
    this._modeBtn.removeEventListener("click", this._onModeBtnClick);

    this._audio.removeEventListener("timeupdate", this._onTimeUpdate);
    this._audio.removeEventListener("loadedmetadata", this._onLoadedMetadata);
    this._audio.removeEventListener("ended", this._onAudioEnded);
    this._audio.removeEventListener("volumechange", this._onVolumeChange);
    window.removeEventListener("beforeunload", this._saveStateToStorage);
  }
  /*初始化 */
  initAudioVolume(initVol) {
    this._audio.volume = Math.max(0, Math.min(1, initVol));

    this._volumeBar.style.width = `${initVol * 100}%`;
  }
  /*共有的API */
  getRandomInt(min, max) {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled);
  }
  setPlaylist(arr, isInit = false) {
    if (!Array.isArray(arr)) return;
    this._playlist = arr.slice(); //浅拷贝
    if (!isInit) this._currentIndex = 0;
    if (this._playlist.length > 0) this._loadTrack(this._currentIndex);
  }
  addTrack(track) {
    if (!track || !track.src) return;
    this._playlist.push(track);
  }
  play() {
    return this._audio.play().catch(() => {});
  }
  pause() {
    this._audio.pause();
  }
  _togglePlay() {
    if (this._audio.paused) return this.play();
    else return this.pause();
  }
  playIndex(i) {
    if (i < 0 || i >= this._playlist.length) return;
    this._currentIndex = i;
    this._loadTrack(this._currentIndex);
    this.play();
  }
  next() {
    if (this._playlist.length === 0) return;
    if (this._randoming) {
      let i = this.getRandomInt(0, this._playlist.length);
      this.playIndex(i);
    } else {
      this._currentIndex = (this._currentIndex + 1) % this._playlist.length;
      this._loadTrack(this._currentIndex);
      this.play();
    }
  }
  prev() {
    if (this._playlist.length === 0) return;
    this._currentIndex =
      (this._currentIndex - 1 + this._playlist.length) % this._playlist.length;
    this._loadTrack(this._currentIndex);
    this.play();
  }
  getState() {
    return {
      _playlist: this._playlist,
      currentIndex: this._currentIndex,
      currentTime: this._audio.currentTime,
      paused: this._audio.paused,
    };
  }
  /*内部方法 */
  _loadPlaylistFromSrc(url) {
    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        // 成功获取数据后，设置播放列表并加载第一首
        this.setPlaylist(data, true);
        console.log("Playlist loaded from:", url);

        if (this._playing) this.play();
      })
      .catch((error) => {
        console.error("Error loading playlist from JSON file:", error);
      });
  }
  _loadTrack(index) {
    const t = this._playlist[index];
    if (!t) return;
    this._songEl.textContent = t.title;
    this._nameEl.textContent = "-- " + t.name;
    if (t.image) {
      this._alarmEl.style.setProperty("--alarm-image", `url(${t.image})`);
    } else {
      this._alarmEl.style.removeProperty("--alarm-image");
    }
    if (this._audio.src !== t.src) {
      this._audio.src = t.src;
    } else {
      if (this._audio.readyState >= 1) this._onLoadedMetadata();
    }
    this._saveStateToStorage();
  }
  /*显示 */
  _onShowMusicPointerDown() {
    if (this._musicPanel.classList.contains("hide")) {
      this._musicPanel.classList.remove("hide");
    } else {
      this._musicPanel.classList.add("hide");
    }
  }
  _onShowVolumePointerDown() {
    if (this._volumePanel.classList.contains("hide")) {
      this._volumePanel.classList.remove("hide");
    } else {
      this._volumePanel.classList.add("hide");
    }
  }
  /* 进度条 */
  _onBarPointerDown(e) {
    if (!e.isPrimary) return;
    this._draggingProgress = true;
    this._updateProgressFromEvent(e, true);
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch (err) {}
    e.preventDefault();
  }
  _onBarPointerMove(e) {
    if (!this._draggingProgress) return;
    this._updateProgressFromEvent(e, false);
  }
  _onBarPointerUp(e) {
    if (!this._draggingProgress) return;
    this._draggingProgress = false;
    this._updateProgressFromEvent(e, true);
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch (err) {}
  }
  _updateProgressFromEvent(e, commitToAudio = false) {
    const rect = this._progressBar.getBoundingClientRect();
    let x = e.clientX;
    let progress = Math.max(0, Math.min((x - rect.left) / rect.width, 1));
    this._bar.style.width = `${progress * 100}%`;
    if (
      commitToAudio &&
      this._audio.duration &&
      isFinite(this._audio.duration)
    ) {
      this._audio.currentTime = progress * this._audio.duration;
    }
  }
  _onTimeUpdate() {
    if (
      this._audio.duration &&
      isFinite(this._audio.duration) &&
      !this._draggingProgress
    ) {
      const progress = this._audio.currentTime / this._audio.duration;
      this._bar.style.width = `${progress * 100}%`;
    }
  }
  /*播放按钮 */
  _onPointerDown(e) {
    this._dragging = true;
    const rect = this.getBoundingClientRect();
    this._offsetX = e.clientX - rect.left;
    this._offsetY = e.clientY - rect.top;

    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch (err) {}
    this._grab.style.cursor = "grabbing";
  }
  _onPointerMove(e) {
    if (!this._dragging) return;
    let left = e.clientX - this._offsetX;
    let top = e.clientY - this._offsetY;

    const pad = 20;
    const rect = this.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;
    left = Math.max(pad, Math.min(window.visualViewport.width - w - pad, left));
    top = Math.max(pad, Math.min(window.visualViewport.height - h - pad, top));
    this.style.left = left + "px";
    this.style.top = top + "px";
  }
  _onPointerUp(e) {
    if (!this._dragging) return;
    this._dragging = false;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch (err) {}

    this._grab.style.cursor = "grab";
    const rect = this.getBoundingClientRect();
    this._saveStateToStorage();
  }
  /*Audio*/
  _toggleActiveClass(isPlaying) {
    const _control = this.shadowRoot.getElementById("control");
    const _info = this.shadowRoot.getElementById("info");
    if (isPlaying) {
      _control.classList.add("active");
      _info.classList.add("active");
    } else {
      _control.classList.remove("active");
      _info.classList.remove("active");
    }
  }
  _onAudioEnded() {
    if (this._playlist.length > 1) {
      this.next();
    } else this._audio.pause();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "playlist-src" && this._audio && newValue)
      this._loadPlaylistFromSrc(newValue);
    else if (name === "playlist" && this._audio && newValue) {
      this.setPlaylist(JSON.parse(newValue), true);
      if (this._playing) this.play();
    } else if (name === "src" && this._audio && newValue) {
      this._audio.src = newValue;
      if (this._playing) this.play();
    }
  }

  _onLoadedMetadata() {
    try {
      const raw = localStorage.getItem(this._STORAGE_KEY);
      if (!raw) return;
      const st = JSON.parse(raw);
      if (!st) return;
      if (
        typeof st.index === "number" &&
        st.index === this._currentIndex &&
        typeof st.time === "number"
      ) {
        const t = Math.min(st.time, Math.floor(this._audio.duration || 0));
        if (!isNaN(t) && isFinite(t)) {
          try {
            this._audio.currentTime = Math.max(0, t);
          } catch {}
        }
      }
    } catch (e) {}
  }
  /*音量 */
  _onVolumePointerDown(e) {
    if (!e.isPrimary) return;
    this._draggingVolume = true;
    this._updateVolumeFromEvent(e, true);
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch (err) {}
    e.preventDefault();
  }
  _onVolumePointerMove(e) {
    if (!this._draggingVolume) return;
    this._updateVolumeFromEvent(e, true);
  }
  _onVolumePointerUp(e) {
    if (!this._draggingVolume) return;
    this._draggingVolume = false;
    this._updateVolumeFromEvent(e, true);
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch (err) {}
  }
  _updateVolumeFromEvent(e, commitToAudioVolume = false) {
    const rect = this._volumeSlider.getBoundingClientRect();
    let x = e.clientX;
    let progress = Math.max(0, Math.min((x - rect.left) / rect.width, 1));
    this._volumeBar.style.width = `${progress * 100}%`;
    if (commitToAudioVolume) {
      this._audio.volume = progress;
    }
    this._saveStateToStorage();
  }
  _onVolumeMuteBtnClick() {
    if (this._audio.muted) this._audio.muted = false;
    else this._audio.muted = true;
  }
  _onVolumeChange() {
    const volume = this._audio.volume;
    if (volume === 0 || this._audio.muted === true) {
      this._volumeBtn.style.setProperty(
        "--volume-icon",
        `url(${this.mutedIconUrl})`
      );
    } else if (volume <= 0.5) {
      this._volumeBtn.style.setProperty(
        "--volume-icon",
        `url(${this.volume1IconUrl})`
      );
    } else if (volume > 0.5) {
      this._volumeBtn.style.setProperty(
        "--volume-icon",
        `url(${this.volume2IconUrl})`
      );
    }
  }
  /*播放模式 */
  _onModeBtnClick() {
    this._playMode = (this._playMode + 1) % 3;
    this._changePlayMode();
    this._saveStateToStorage();
  }
  _changePlayMode() {
    this._audio.loop = false;
    this._randoming = false;
    switch (this._playMode) {
      case 0:
        this._modeBtn.style.setProperty(
          "--mode-icon",
          `url(${this.singleIconUrl})`
        );
        break;
      case 1:
        this._modeBtn.style.setProperty(
          "--mode-icon",
          `url(${this.loopIconUrl})`
        );
        this._audio.loop = true;
        break;
      case 2:
        this._modeBtn.style.setProperty(
          "--mode-icon",
          `url(${this.randomIconUrl})`
        );
        this._randoming = true;
        break;
    }
  }
  /*存储*/
  _restoreStateFromStorage() {
    try {
      const saved = JSON.parse(localStorage.getItem(this._STORAGE_KEY) || "{}");
      if (saved) {
        if (saved.left != null) {
          this.style.left = saved.left + "px";
          this.style.top = saved.top + "px";
        }
        if (saved.hide != null) {
          this._musicPanel.classList.toggle("hide", saved.hide);
        }
        if (saved.index != null) {
          this._currentIndex = saved.index;
        }
        if (saved.time != null) {
          this._audio.currentTime = saved.time;
        }
        if (saved.paused != null) {
          this._playing = !saved.paused;
        }
        if (saved.volume != null) {
          this._audioVolume = saved.volume;
        }
        if (saved.playMode != null) {
          this._playMode = saved.playMode;
        }
        if (saved.muted != null) {
          this._audio.muted = saved.muted;
        }
      }
    } catch (err) {}
  }
  _saveStateToStorage() {
    try {
      const rect = this.getBoundingClientRect();
      const st = {
        left: Math.round(rect.left),
        top: Math.round(rect.top),
        hide: this._musicPanel.classList.contains("hide"),
        index: this._currentIndex,
        time: Math.floor(this._audio.currentTime || 0),
        paused: this._audio.paused,
        volume: Math.max(0, Math.min(1, this._audio.volume)),
        playMode: this._playMode,
        muted: this._audio.muted,
      };
      localStorage.setItem(this._STORAGE_KEY, JSON.stringify(st));
    } catch (e) {}
  }
}
customElements.define("fm-player", FMPlayer);

export default FMPlayer;
