import { describe, expect, it, vi } from "vitest";
import { VideoFrameSource } from "../../src/browser-frame-processing";

class FakeVideo extends EventTarget {
  currentTime = 0;
  duration = 2;
  videoWidth = 1920;
  videoHeight = 1080;
  src = "";
  pause = vi.fn();
  load = vi.fn();

  removeAttribute(name: string): void {
    if (name === "src") this.src = "";
  }
}

describe("browser frame source", () => {
  it("rejects an in-flight seek and removes listeners when disposed", async () => {
    const video = new FakeVideo();
    const revokeObjectURL = vi.spyOn(URL, "revokeObjectURL").mockImplementation(() => undefined);
    const source = new VideoFrameSource(video as unknown as HTMLVideoElement, "blob:test");

    const seek = source.seek(500);
    source.dispose();

    await expect(seek).rejects.toThrow("MEDIA_SOURCE_DISPOSED");
    video.dispatchEvent(new Event("seeked"));
    expect(revokeObjectURL).toHaveBeenCalledWith("blob:test");
    expect(video.pause).toHaveBeenCalledOnce();
    revokeObjectURL.mockRestore();
  });

  it("rejects an in-flight metadata load when disposed", async () => {
    const video = new FakeVideo();
    const revokeObjectURL = vi.spyOn(URL, "revokeObjectURL").mockImplementation(() => undefined);
    const source = new VideoFrameSource(video as unknown as HTMLVideoElement, "blob:test");

    const load = source.load();
    source.dispose();

    await expect(load).rejects.toThrow("MEDIA_SOURCE_DISPOSED");
    video.dispatchEvent(new Event("loadedmetadata"));
    revokeObjectURL.mockRestore();
  });
});
