import { afterEach, describe, expect, it, vi } from "vitest";
import { LocalVideoPreview, PREVIEW_LOAD_TIMEOUT_MS } from "../../src/local-video-preview";

class FakeVideo extends EventTarget {
  src = "";
  paused = true;
  currentTime = 0;
  duration = 2;
  load = vi.fn();
  pause = vi.fn(() => { this.paused = true; this.dispatchEvent(new Event("pause")); });
  play = vi.fn(async () => { this.paused = false; this.dispatchEvent(new Event("play")); });
  removeAttribute() { this.src = ""; }
  replaceWith = vi.fn();
}
class FakeButton extends EventTarget { disabled = true; textContent = ""; }
function surface() {
  const video = new FakeVideo();
  const status = { textContent: "" };
  const button = new FakeButton();
  const intervalButton = new FakeButton();
  const root = {
    querySelector: (selector: string) => selector === "#local-video-preview" ? video
      : selector === "#local-preview-status" ? status : selector === "[data-preview-toggle]" ? button
      : selector === "[data-interval-preview]" ? intervalButton : null
  } as unknown as ParentNode;
  return { video, status, button, intervalButton, root };
}
function setup() {
  vi.useFakeTimers();
  const create = vi.spyOn(URL, "createObjectURL").mockReturnValueOnce("blob:first").mockReturnValue("blob:second");
  const revoke = vi.spyOn(URL, "revokeObjectURL").mockImplementation(() => undefined);
  return { preview: new LocalVideoPreview(), file: new File(["synthetic"], "clip.webm"), create, revoke };
}
afterEach(() => { vi.restoreAllMocks(); vi.useRealTimers(); });

describe("local preview lifecycle", () => {
  it("reports decoded duration once, previews the interval and pauses at its end", async () => {
    const { file } = setup();
    const onDuration = vi.fn();
    const preview = new LocalVideoPreview(onDuration);
    const ui = surface();
    preview.mount(ui.root, file, { startSeconds: 0.5, endSeconds: 1.5 });
    expect(ui.intervalButton.disabled).toBe(true);
    ui.video.dispatchEvent(new Event("loadeddata"));
    ui.video.dispatchEvent(new Event("loadeddata"));
    expect(onDuration).toHaveBeenCalledExactlyOnceWith(2);
    expect(ui.intervalButton.disabled).toBe(false);
    ui.intervalButton.dispatchEvent(new Event("click"));
    await Promise.resolve();
    expect(ui.video.currentTime).toBe(0.5);
    expect(ui.video.paused).toBe(false);
    ui.video.currentTime = 1;
    ui.video.dispatchEvent(new Event("timeupdate"));
    expect(ui.video.paused).toBe(false);
    ui.video.currentTime = 1.6;
    ui.video.dispatchEvent(new Event("timeupdate"));
    expect(ui.video.currentTime).toBe(1.5);
    expect(ui.video.paused).toBe(true);
    preview.close();
  });

  it("stops interval playback on edits, disables invalid selections, and detaches retired controls", async () => {
    const { preview, file } = setup();
    const ui = surface();
    preview.mount(ui.root, file, { startSeconds: 0.5, endSeconds: 1.5 });
    ui.video.dispatchEvent(new Event("loadeddata"));
    ui.intervalButton.dispatchEvent(new Event("click"));
    await Promise.resolve();
    const next = surface();
    preview.mount(next.root, file, { startSeconds: 1.5, endSeconds: 1 });
    expect(ui.video.paused).toBe(true);
    expect(next.intervalButton.disabled).toBe(true);
    ui.intervalButton.dispatchEvent(new Event("click"));
    next.intervalButton.dispatchEvent(new Event("click"));
    expect(ui.video.play).toHaveBeenCalledOnce();
    preview.close();
    expect(vi.getTimerCount()).toBe(0);
  });

  it("reports an interval play rejection and ignores stale interval playback callbacks", async () => {
    const { preview, file } = setup();
    const ui = surface();
    preview.mount(ui.root, file, { startSeconds: 0.5, endSeconds: 1.5 });
    ui.video.dispatchEvent(new Event("loadeddata"));
    ui.video.play.mockRejectedValueOnce(new Error("private detail"));
    ui.intervalButton.dispatchEvent(new Event("click"));
    await Promise.resolve();
    expect(ui.status.textContent).toContain("PREVIEW_PLAY_FAILED");
    expect(ui.status.textContent).not.toContain("private detail");
    preview.close();
    ui.video.dispatchEvent(new Event("timeupdate"));
    expect(ui.video.src).toBe("");
  });

  it("plays and pauses without pose processing and preserves the media element across capture rerenders", async () => {
    const { preview, file, create } = setup();
    const first = surface();
    preview.mount(first.root, file);
    expect(first.button.disabled).toBe(true);
    first.video.dispatchEvent(new Event("loadeddata"));
    expect(first.button.disabled).toBe(false);
    first.button.dispatchEvent(new Event("click"));
    await Promise.resolve();
    expect(first.video.play).toHaveBeenCalledOnce();
    expect(first.button.textContent).toBe("Pause preview");
    first.video.currentTime = 0.5;
    const next = surface();
    preview.mount(next.root, file);
    expect(next.video.replaceWith).toHaveBeenCalledWith(first.video);
    expect(create).toHaveBeenCalledOnce();
    expect(first.video.currentTime).toBe(0.5);
    next.button.dispatchEvent(new Event("click"));
    expect(first.video.pause).toHaveBeenCalledOnce();
    expect(next.button.textContent).toBe("Play preview");
    preview.close();
  });

  it("releases replaced, cleared and departed media exactly once and ignores stale events", () => {
    const { preview, file, revoke } = setup();
    const old = surface();
    preview.mount(old.root, file);
    const next = surface();
    preview.mount(next.root, new File(["other"], "other.webm"));
    expect(old.video.src).toBe("");
    expect(old.video.pause).toHaveBeenCalledOnce();
    expect(revoke).toHaveBeenCalledExactlyOnceWith("blob:first");
    old.video.dispatchEvent(new Event("loadeddata"));
    old.video.dispatchEvent(new Event("error"));
    expect(next.status.textContent).toContain("Loading");
    preview.mount({ querySelector: () => null } as unknown as ParentNode);
    preview.close();
    expect(next.video.src).toBe("");
    expect(revoke.mock.calls).toEqual([["blob:first"], ["blob:second"]]);
    expect(vi.getTimerCount()).toBe(0);
  });

  it.each(["error", "timeout", "load-throw", "url-throw"])("reports useful sanitized guidance and releases resources for %s", (failure) => {
    const { preview, file, revoke, create } = setup();
    const ui = surface();
    if (failure === "load-throw") ui.video.load.mockImplementationOnce(() => { throw new Error("sensitive"); });
    if (failure === "url-throw") create.mockReset().mockImplementationOnce(() => { throw new Error("sensitive"); });
    preview.mount(ui.root, file);
    if (failure === "error") ui.video.dispatchEvent(new Event("error"));
    if (failure === "timeout") vi.advanceTimersByTime(PREVIEW_LOAD_TIMEOUT_MS);
    expect(ui.status.textContent).toContain(failure === "timeout" ? "PREVIEW_LOAD_TIMEOUT" : "PREVIEW_LOAD_FAILED");
    expect(ui.status.textContent).toContain("Choose another local video");
    expect(ui.status.textContent).not.toContain("sensitive");
    expect(ui.button.disabled).toBe(true);
    expect(ui.video.src).toBe("");
    expect(revoke).toHaveBeenCalledTimes(failure === "url-throw" ? 0 : 1);
    ui.video.dispatchEvent(new Event("loadeddata"));
    expect(ui.button.disabled).toBe(true);
    preview.close();
    expect(vi.getTimerCount()).toBe(0);
  });

  it("cancels the load watchdog on readiness and reports a rejected play without an unhandled rejection", async () => {
    const { preview, file } = setup();
    const ui = surface();
    preview.mount(ui.root, file);
    ui.video.dispatchEvent(new Event("loadeddata"));
    vi.advanceTimersByTime(PREVIEW_LOAD_TIMEOUT_MS);
    expect(ui.button.disabled).toBe(false);
    ui.video.play.mockRejectedValueOnce(new Error("sensitive browser detail"));
    ui.button.dispatchEvent(new Event("click"));
    await Promise.resolve();
    expect(ui.status.textContent).toContain("PREVIEW_PLAY_FAILED");
    expect(ui.status.textContent).not.toContain("sensitive");
    preview.close();
  });

  it("ignores a stale rejected play after replacement", async () => {
    const { preview, file } = setup();
    const old = surface();
    let reject!: (error: Error) => void;
    old.video.play.mockImplementationOnce(() => new Promise<void>((_resolve, fail) => { reject = fail; }));
    preview.mount(old.root, file);
    old.video.dispatchEvent(new Event("loadeddata"));
    old.button.dispatchEvent(new Event("click"));
    const next = surface();
    preview.mount(next.root, new File(["next"], "next.webm"));
    reject(new Error("stale"));
    await Promise.resolve();
    expect(next.status.textContent).toContain("Loading");
    preview.close();
  });
});
