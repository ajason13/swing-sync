// Loading a local preview never initializes pose processing or persists media.
import { isValidAnalysisInterval, type AnalysisInterval } from "./analysis-interval";
export const PREVIEW_LOAD_TIMEOUT_MS = 30_000;

export class LocalVideoPreview {
  private file?: File;
  private video?: HTMLVideoElement;
  private objectUrl?: string;
  private timer?: ReturnType<typeof setTimeout>;
  private status?: HTMLElement;
  private toggle?: HTMLButtonElement;
  private intervalToggle?: HTMLButtonElement;
  private interval?: AnalysisInterval;
  private playingInterval = false;
  private message = "Loading local video preview…";
  private ready = false;

  constructor(private readonly onDuration?: (duration: number) => void) {}

  // Capture rerenders retain the same media element and playback position.
  mount(root: ParentNode, file?: File, interval?: AnalysisInterval): void {
    const placeholder = root.querySelector<HTMLVideoElement>("#local-video-preview");
    if (!placeholder || !file) {
      this.close();
      return;
    }
    if (this.file !== file) this.close();
    if (this.interval?.startSeconds !== interval?.startSeconds || this.interval?.endSeconds !== interval?.endSeconds) {
      if (this.playingInterval) this.video?.pause();
      this.playingInterval = false;
    }
    this.interval = interval ? { ...interval } : undefined;
    this.toggle?.removeEventListener("click", this.togglePlayback);
    this.intervalToggle?.removeEventListener("click", this.playInterval);
    this.status = root.querySelector<HTMLElement>("#local-preview-status") ?? undefined;
    this.toggle = root.querySelector<HTMLButtonElement>("[data-preview-toggle]") ?? undefined;
    this.intervalToggle = root.querySelector<HTMLButtonElement>("[data-interval-preview]") ?? undefined;
    this.toggle?.addEventListener("click", this.togglePlayback);
    this.intervalToggle?.addEventListener("click", this.playInterval);
    if (this.video) {
      placeholder.replaceWith(this.video);
      this.updateUi();
      return;
    }
    this.file = file;
    this.video = placeholder;
    this.message = "Loading local video preview…";
    this.ready = false;
    this.updateUi();
    placeholder.addEventListener("loadeddata", this.onReady);
    placeholder.addEventListener("error", this.onError);
    placeholder.addEventListener("play", this.onPlaybackChange);
    placeholder.addEventListener("pause", this.onPlaybackChange);
    placeholder.addEventListener("ended", this.onPlaybackChange);
    placeholder.addEventListener("timeupdate", this.onIntervalTime);
    placeholder.addEventListener("seeked", this.onIntervalTime);
    this.timer = setTimeout(() => this.fail("PREVIEW_LOAD_TIMEOUT"), PREVIEW_LOAD_TIMEOUT_MS);
    try {
      this.objectUrl = URL.createObjectURL(file);
      placeholder.src = this.objectUrl;
      placeholder.load();
    } catch {
      this.fail("PREVIEW_LOAD_FAILED");
    }
  }

  close(): void {
    this.releaseMedia();
    this.toggle?.removeEventListener("click", this.togglePlayback);
    this.intervalToggle?.removeEventListener("click", this.playInterval);
    this.video = undefined;
    this.file = undefined;
    this.status = undefined;
    this.toggle = undefined;
    this.intervalToggle = undefined;
    this.interval = undefined;
    this.playingInterval = false;
    this.ready = false;
  }

  private onReady = (): void => {
    if (this.ready) return;
    const duration = this.video?.duration ?? NaN;
    if (!isValidAnalysisInterval(duration, { startSeconds: 0, endSeconds: duration })) {
      this.fail("PREVIEW_LOAD_FAILED");
      return;
    }
    clearTimeout(this.timer);
    this.ready = true;
    this.message = "Preview ready. Play or pause the local clip before beginning analysis.";
    this.updateUi();
    this.onDuration?.(duration);
  };

  private onError = (): void => this.fail("PREVIEW_LOAD_FAILED");
  private onPlaybackChange = (): void => this.updateUi();

  private togglePlayback = (): void => {
    const video = this.video;
    if (!video || !this.ready) return;
    this.playingInterval = false;
    if (!video.paused) {
      video.pause();
    } else {
      void video.play().catch(() => {
        if (this.video !== video || !this.ready) return;
        this.message = "Playback could not start. Try Play preview again or choose another local video. (PREVIEW_PLAY_FAILED)";
        this.updateUi();
      });
    }
  };

  private playInterval = (): void => {
    const video = this.video;
    const interval = this.interval;
    if (!this.ready || !video || !interval || !isValidAnalysisInterval(video.duration, interval)) return;
    video.pause();
    this.playingInterval = true;
    try {
      video.currentTime = interval.startSeconds;
      void video.play().catch(() => {
        if (this.video !== video || !this.ready) return;
        this.playingInterval = false;
        this.message = "Interval playback could not start. Try Preview interval again or choose another video. (PREVIEW_PLAY_FAILED)";
        this.updateUi();
      });
    } catch {
      this.playingInterval = false;
      this.message = "Interval playback could not start. Try Preview interval again. (PREVIEW_PLAY_FAILED)";
      this.updateUi();
    }
  };

  private onIntervalTime = (): void => {
    const video = this.video;
    const interval = this.interval;
    if (!this.playingInterval || !video || !interval) return;
    if (video.currentTime < interval.startSeconds || video.currentTime >= interval.endSeconds) {
      this.playingInterval = false;
      video.pause();
      video.currentTime = Math.max(interval.startSeconds, Math.min(interval.endSeconds, video.currentTime));
    }
  };

  private fail(code: "PREVIEW_LOAD_FAILED" | "PREVIEW_LOAD_TIMEOUT"): void {
    this.ready = false;
    this.releaseMedia();
    this.message = `This video could not be previewed. Choose another local video or convert it to a format supported by your browser. (${code})`;
    this.updateUi();
  }

  private releaseMedia(): void {
    clearTimeout(this.timer);
    this.timer = undefined;
    const video = this.video;
    if (video) {
      video.removeEventListener("loadeddata", this.onReady);
      video.removeEventListener("error", this.onError);
      video.removeEventListener("play", this.onPlaybackChange);
      video.removeEventListener("pause", this.onPlaybackChange);
      video.removeEventListener("ended", this.onPlaybackChange);
      video.removeEventListener("timeupdate", this.onIntervalTime);
      video.removeEventListener("seeked", this.onIntervalTime);
      video.pause();
      video.removeAttribute("src");
      video.load();
    }
    if (this.objectUrl) URL.revokeObjectURL(this.objectUrl);
    this.objectUrl = undefined;
    this.playingInterval = false;
  }

  private updateUi(): void {
    if (this.status) this.status.textContent = this.message;
    if (this.toggle) {
      this.toggle.disabled = !this.ready;
      this.toggle.textContent = this.video?.paused === false ? "Pause preview" : "Play preview";
    }
    if (this.intervalToggle) this.intervalToggle.disabled = !this.ready || !this.interval ||
      !isValidAnalysisInterval(this.video?.duration ?? NaN, this.interval);
  }
}
