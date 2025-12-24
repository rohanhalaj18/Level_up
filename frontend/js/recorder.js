export class Recorder {
  constructor({ previewEl = null, maxSeconds = 180 } = {}) {
    this.previewEl = previewEl;
    this.maxSeconds = maxSeconds;
    this.combinedStream = null;
    this.mediaRecorder = null;
    this.chunks = [];
    this.seconds = 0;
    this.tickCb = null;
    this.timer = null;
  }

  async init() {
    // request both audio and video for preview; we'll record audio track only
    this.combinedStream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: { width: 640, height: 360 },
    });
    if (this.previewEl) {
      this.previewEl.srcObject = this.combinedStream;
      await this.previewEl.play().catch(() => {});
    }
  }

  start() {
    if (!this.combinedStream) throw new Error("Recorder not initialized");
    const audioTrack = this.combinedStream.getAudioTracks()[0];
    const audioStream = new MediaStream([audioTrack]);
    this.chunks = [];
    this.mediaRecorder = new MediaRecorder(audioStream);
    this.mediaRecorder.ondataavailable = (e) => {
      if (e.data && e.data.size) this.chunks.push(e.data);
    };
    this.mediaRecorder.start();
    this.seconds = 0;
    this.timer = setInterval(() => {
      this.seconds++;
      if (this.tickCb) this.tickCb(this.seconds);
      if (this.seconds >= this.maxSeconds) this.stop();
    }, 1000);
  }

  stop() {
    if (this.mediaRecorder && this.mediaRecorder.state !== "inactive")
      this.mediaRecorder.stop();
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  getBlob() {
    if (!this.chunks.length) return null;
    return new Blob(this.chunks, { type: "audio/webm" });
  }

  clear() {
    this.chunks = [];
    this.seconds = 0;
  }

  onTick(cb) {
    this.tickCb = cb;
  }
}
