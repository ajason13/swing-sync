import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createBrowserFrameController, MEDIA_WAIT_TIMEOUT_MS, VideoFrameSource } from "../../src/browser-frame-processing";

import { FrameProcessingController } from "../../src/frame-processing";

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
  it("fails immediately on a network abort before metadata settles and ignores later source events", async () => {
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
      abort("LATER_ABORT");
      await run;
      await vi.waitFor(() => expect(states).toEqual(["loading", "failed:UNEXPECTED_NETWORK_BLOCKED"]));
      video.dispatchEvent(new Event("error"));
      video.dispatchEvent(new Event("loadedmetadata"));

      expect(states).toEqual(["loading", "failed:UNEXPECTED_NETWORK_BLOCKED"]);
      expect(worker).not.toHaveBeenCalled();
      expect(controller.getOutputs()).toEqual([]);
      expect(revokeObjectURL).toHaveBeenCalledExactlyOnceWith("blob:test");
      expect(video.pause).toHaveBeenCalledOnce();
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

  it("preserves the abort code and releases the preview without creating an inference after abort", async () => {
    const video = new FakeVideo();
    const requestSeek = vi.fn();
    Object.defineProperty(video, "currentTime", { get: () => 0, set: requestSeek });
    const createObjectURL = vi.spyOn(URL, "createObjectURL").mockReturnValue("blob:test");
    const revokeObjectURL = vi.spyOn(URL, "revokeObjectURL").mockImplementation(() => undefined);
    const messages: string[] = [];
    const terminate = vi.fn();
    class FakeWorker extends EventTarget {
      terminate = terminate;
      postMessage(message: { type: string }): void {
        messages.push(message.type);
        if (message.type === "init") queueMicrotask(() => this.dispatchEvent(new MessageEvent("message", { data: { type: "ready" } })));
      }
    }
    const preview = { close: vi.fn() } as unknown as ImageBitmap;
    const inference = { close: vi.fn() } as unknown as ImageBitmap;
    let releasePreview!: (bitmap: ImageBitmap) => void;
    const createBitmap = vi.fn()
      .mockImplementationOnce(() => new Promise<ImageBitmap>((resolve) => { releasePreview = resolve; }))
      .mockResolvedValueOnce(inference);
    vi.stubGlobal("Worker", FakeWorker);
    vi.stubGlobal("createImageBitmap", createBitmap);
    const states: string[] = [];
    try {
      const { controller, abort } = createBrowserFrameController(
        video as unknown as HTMLVideoElement,
        new File(["synthetic"], "synthetic.webm"),
        { onState: (state, code) => states.push(code ? `${state}:${code}` : state), onProgress: () => undefined, onOutput: () => undefined }
      );
      const run = controller.start();
      await vi.waitFor(() => expect(video.load).toHaveBeenCalledOnce());
      video.dispatchEvent(new Event("loadedmetadata"));
      await vi.waitFor(() => expect(requestSeek).toHaveBeenCalledWith(0));
      video.dispatchEvent(new Event("seeked"));
      await vi.waitFor(() => expect(createBitmap).toHaveBeenCalledOnce());
      abort("UNEXPECTED_NETWORK_BLOCKED");
      releasePreview(preview);
      await run;
      await vi.waitFor(() => expect(states.at(-1)).toBe("failed:UNEXPECTED_NETWORK_BLOCKED"));

      expect(states).toEqual(["loading", "processing", "failed:UNEXPECTED_NETWORK_BLOCKED"]);
      expect(messages).toEqual(["init"]);
      expect(terminate).toHaveBeenCalledOnce();
      expect(preview.close).toHaveBeenCalledOnce();
      expect(createBitmap).toHaveBeenCalledOnce();
      expect(inference.close).not.toHaveBeenCalled();
      expect(controller.getOutputs()).toEqual([]);
    } finally {
      createObjectURL.mockRestore();
      revokeObjectURL.mockRestore();
      vi.unstubAllGlobals();
    }
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

describe("bounded media waits", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  for (const operation of ["load", "seek"] as const) {
    const event = operation === "load" ? "loadedmetadata" : "seeked";
    const failureCode = operation === "load" ? "MEDIA_LOAD_FAILED" : "MEDIA_SEEK_FAILED";
    const timeoutCode = operation === "load" ? "MEDIA_LOAD_TIMEOUT" : "MEDIA_SEEK_TIMEOUT";
    const setup = () => {
      const video = new FakeVideo();
      const add = vi.spyOn(video, "addEventListener");
      const remove = vi.spyOn(video, "removeEventListener");
      const revoke = vi.spyOn(URL, "revokeObjectURL").mockImplementation(() => undefined);
      const source = new VideoFrameSource(video as unknown as HTMLVideoElement, "blob:test");
      const start = () => operation === "load" ? source.load() : source.seek(500);
      const expectClean = () => {
        expect(vi.getTimerCount()).toBe(0);
        expect(remove.mock.calls).toEqual(add.mock.calls);
      };
      return { video, source, start, revoke, expectClean };
    };

    it(`times out stalled ${operation}, cleans listeners, and ignores late events`, async () => {
      const { video, source, start, revoke, expectClean } = setup();
      const settled = vi.fn();
      const result = start().then(settled, (error: Error) => {
        settled(error.message);
        return error.message;
      });
      await vi.advanceTimersByTimeAsync(MEDIA_WAIT_TIMEOUT_MS - 1);
      expect(settled).not.toHaveBeenCalled();
      await vi.advanceTimersByTimeAsync(1);
      expect(await result).toBe(timeoutCode);
      expectClean();
      video.dispatchEvent(new Event(event));
      video.dispatchEvent(new Event("error"));
      await vi.runAllTimersAsync();
      expect(settled).toHaveBeenCalledExactlyOnceWith(timeoutCode);
      source.dispose();
      source.dispose();
      expect(revoke).toHaveBeenCalledExactlyOnceWith("blob:test");
    });

    it(`accepts slow ${operation} completion before the deadline`, async () => {
      const { video, source, start, expectClean } = setup();
      const result = start();
      await vi.advanceTimersByTimeAsync(MEDIA_WAIT_TIMEOUT_MS - 1);
      video.dispatchEvent(new Event(event));
      expect(await result).toEqual(operation === "load"
        ? { durationSeconds: 2, width: 1920, height: 1080 }
        : 500);
      expectClean();
      await vi.runAllTimersAsync();
      source.dispose();
    });

    it(`clears the ${operation} watchdog on media error`, async () => {
      const { video, source, start, expectClean } = setup();
      const result = start();
      const rejected = expect(result).rejects.toThrow(failureCode);
      video.dispatchEvent(new Event("error"));
      await rejected;
      expectClean();
      source.dispose();
    });

    it(`disposes pending ${operation} without timeout or late completion`, async () => {
      const { video, source, start, revoke, expectClean } = setup();
      const result = start();
      const rejected = expect(result).rejects.toThrow("MEDIA_SOURCE_DISPOSED");
      source.dispose();
      await rejected;
      expectClean();
      video.dispatchEvent(new Event(event));
      video.dispatchEvent(new Event("error"));
      await vi.runAllTimersAsync();
      expect(revoke).toHaveBeenCalledExactlyOnceWith("blob:test");
      await expect(start()).rejects.toThrow("MEDIA_SOURCE_DISPOSED");
      expectClean();
    });

    for (const exit of ["timeout", "cancel"] as const) {
      it(`releases a controller's stalled ${operation} on ${exit} without late updates`, async () => {
        const { video, source, revoke } = setup();
        if (operation === "seek") {
          vi.spyOn(source, "load").mockResolvedValue({ durationSeconds: 2, width: 1920, height: 1080 });
          video.currentTime = 0.5;
        }
        const states: string[] = [];
        const onOutput = vi.fn();
        const close = vi.fn(async () => undefined);
        const controller = new FrameProcessingController({
          createSource: () => source,
          createProcessor: () => ({
            initialize: async () => undefined,
            process: async () => { throw new Error("UNEXPECTED_INFERENCE"); },
            close
          })
        }, {
          onState: (state, code) => states.push(code ? `${state}:${code}` : state),
          onProgress: () => undefined,
          onOutput
        });
        const run = controller.start();
        await vi.advanceTimersByTimeAsync(0);
        expect(vi.getTimerCount()).toBe(1);
        if (exit === "cancel") await controller.cancel();
        else await vi.advanceTimersByTimeAsync(MEDIA_WAIT_TIMEOUT_MS);
        await run;
        const expected = ["loading", ...(operation === "seek" ? ["processing"] : []),
          exit === "cancel" ? "cancelled" : `failed:${timeoutCode}`];
        expect(states).toEqual(expected);
        expect(vi.getTimerCount()).toBe(0);
        expect(revoke).toHaveBeenCalledExactlyOnceWith("blob:test");
        expect(close).toHaveBeenCalledOnce();
        video.dispatchEvent(new Event(event));
        video.dispatchEvent(new Event("error"));
        await vi.runAllTimersAsync();
        expect(states).toEqual(expected);
        expect(onOutput).not.toHaveBeenCalled();
        expect(controller.getOutputs()).toEqual([]);
      });
    }

    it(`sanitizes synchronous ${operation} errors and clears the watchdog`, async () => {
      const { video, source, start, expectClean } = setup();
      if (operation === "load") {
        video.load.mockImplementationOnce(() => { throw new Error("private file details"); });
      } else {
        Object.defineProperty(video, "currentTime", {
          get: () => 0,
          set: () => { throw new Error("private file details"); }
        });
      }
      await expect(start()).rejects.toThrow(failureCode);
      expectClean();
      source.dispose();
    });
  }

  it("registers metadata listeners before loading, including synchronous completion", async () => {
    const video = new FakeVideo();
    video.load.mockImplementation(() => video.dispatchEvent(new Event("loadedmetadata")));
    const source = new VideoFrameSource(video as unknown as HTMLVideoElement, "blob:test");
    await expect(source.load()).resolves.toEqual({ durationSeconds: 2, width: 1920, height: 1080 });
    expect(vi.getTimerCount()).toBe(0);
  });

  it("does not accept the target time as complete while the video is still seeking", async () => {
    const video = new FakeVideo();
    video.currentTime = 0.5;
    Object.assign(video, { seeking: true });
    const source = new VideoFrameSource(video as unknown as HTMLVideoElement, "blob:test");
    const result = source.seek(500);
    expect(vi.getTimerCount()).toBe(1);
    video.dispatchEvent(new Event("seeked"));
    await expect(result).resolves.toBe(500);
    expect(vi.getTimerCount()).toBe(0);
  });

  it("waits for a decoded seek even at the initial zero position", async () => {
    const video = new FakeVideo();
    const source = new VideoFrameSource(video as unknown as HTMLVideoElement, "blob:test");
    const result = source.seek(0);
    const settled = vi.fn();
    void result.then(settled);
    await Promise.resolve();
    expect(settled).not.toHaveBeenCalled();
    expect(vi.getTimerCount()).toBe(1);
    video.dispatchEvent(new Event("seeked"));
    await expect(result).resolves.toBe(0);
    expect(vi.getTimerCount()).toBe(0);
  });
});
