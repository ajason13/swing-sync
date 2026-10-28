// Loading a local preview never initializes pose processing or persists media.
export const PREVIEW_LOAD_TIMEOUT_MS = 30_000;

export class LocalVideoPreview {
  private file?: File;
  private video?: HTMLVideoElement;
  private objectUrl?: string;
  private timer?: ReturnType<typeof setTimeout>;
  private status?: HTMLElement;
  private toggle?: HTMLButtonElement;
  private message = "Loading local video preview…";
  private ready = false;

  // Capture rerenders retain the same media element and playback position.
  mount(root: ParentNode, file?: File): void {
    const placeholder = root.querySelector<HTMLVideoElement>("#local-video-preview");
    if (!placeholder || !file) {
      this.close();
      return;
    }
    if (this.file !== file) this.close();
    this.status = root.querySelector<HTMLElement>("#local-preview-status") ?? undefined;
    this.toggle = root.querySelector<HTMLButtonElement>("[data-preview-toggle]") ?? undefined;
    this.toggle?.addEventListener("click", this.togglePlayback);
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
    this.video = undefined;
    this.file = undefined;
    this.status = undefined;
    this.toggle = undefined;
    this.ready = false;
  }

  private onReady = (): void => {
    clearTimeout(this.timer);
    this.ready = true;
    this.message = "Preview ready. Play or pause the local clip before beginning analysis.";
    this.updateUi();
  };

  private onError = (): void => this.fail("PREVIEW_LOAD_FAILED");
  private onPlaybackChange = (): void => this.updateUi();

  private togglePlayback = (): void => {
    const video = this.video;
    if (!video || !this.ready) return;
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
      video.pause();
      video.removeAttribute("src");
      video.load();
    }
    if (this.objectUrl) URL.revokeObjectURL(this.objectUrl);
    this.objectUrl = undefined;
  }

  private updateUi(): void {
    if (this.status) this.status.textContent = this.message;
    if (this.toggle) {
      this.toggle.disabled = !this.ready;
      this.toggle.textContent = this.video?.paused === false ? "Pause preview" : "Play preview";
    }
  }
}
