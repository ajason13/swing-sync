export function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => {
    const replacements: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    };
    return replacements[character] ?? character;
  });
}

export function formatRemoteDataClass(dataClass: string): string {
  return dataClass
    .split("-")
    .map((part, index) => (index > 0 && part === "and" ? part : part[0].toUpperCase() + part.slice(1)))
    .join(" ");
}

export function formatSwingCardWarning(warning: string): string {
  const labels: Record<string, string> = {
    NO_KEYFRAMES_SELECTED: "No keyframes were selected.",
    KEYFRAME_UNAVAILABLE: "One or more keyframes are unavailable.",
    METRICS_UNAVAILABLE: "Metrics are unavailable.",
    PHASE_REVIEW_REQUIRED: "Phase review is required before metrics should be interpreted.",
    PROMPT_LIMITED_EVIDENCE: "Evidence is limited; do not infer missing values."
  };
  return labels[warning] ?? warning;
}
