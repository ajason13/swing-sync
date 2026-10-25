import { describe, expect, it, vi } from "vitest";
import { createBrowserFrameController, VideoFrameSource } from "../../src/browser-frame-processing";

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
  it("retains a network-blocked abort received before worker initialization", async () => {
    const video = new FakeVideo();
    const createObjectURL = vi.spyOn(URL, "createObjectURL").mockReturnValue("blob:test");
    const revokeObjectURL = vi.spyOn(URL, "revokeObjectURL").mockImplementation(() => undefined);
    const worker = vi.fn(() => { throw new Error("WORKER_SHOULD_NOT_START"); });
    vi.stubGlobal("Worker", worker);
    const states: string[] = [];
    try {
      const { controller, abort } = createBrowserFrameController(
        video as unknown as HTMLVideoElement,
        new File(["synthetic"], "synthetic.webm"),
        {
          onState: (state, code) => states.push(code ? `${state}:${code}` : state),
          onProgress: () => undefined,
          onOutput: () => { throw new Error("No output should be produced after abort"); }
        }
      );
      const run = controller.start();
      await vi.waitFor(() => expect(video.load).toHaveBeenCalledOnce());
      abort("UNEXPECTED_NETWORK_BLOCKED");
      video.dispatchEvent(new Event("loadedmetadata"));
      await run;

      expect(states).toEqual(["loading", "failed:UNEXPECTED_NETWORK_BLOCKED"]);
      expect(worker).not.toHaveBeenCalled();
      expect(controller.getOutputs()).toEqual([]);
      expect(revokeObjectURL).toHaveBeenCalledWith("blob:test");
    } finally {
      createObjectURL.mockRestore();
      revokeObjectURL.mockRestore();
      vi.unstubAllGlobals();
    }
  });

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
