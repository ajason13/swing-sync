// Source-video seconds, never rebased to the beginning of the selected interval.
export interface AnalysisInterval {
  startSeconds: number;
  endSeconds: number;
}

export function isValidAnalysisInterval(duration: number, interval: AnalysisInterval): boolean {
  return Number.isFinite(duration) && duration > 0 && Number.isFinite(duration * 1000) &&
    Number.isFinite(interval.startSeconds) && Number.isFinite(interval.endSeconds) &&
    interval.startSeconds >= 0 && interval.startSeconds < interval.endSeconds &&
    interval.endSeconds <= duration;
}
