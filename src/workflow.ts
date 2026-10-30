export const workflowSteps = [
  {
    id: "capture",
    shortLabel: "Capture",
    label: "Choose a local video",
    description: "Choose a video, preview it, and select the interval to analyze. Acknowledge the safety terms before beginning analysis."
  },
  {
    id: "processing",
    shortLabel: "Process",
    label: "Processing",
    description: "Local analysis samples up to eight frames from your selected interval and estimates body poses. Wait for processing to finish, then review the provisional labels."
  },
  {
    id: "review",
    shortLabel: "Review",
    label: "Review",
    description: "Declare the video setup, inspect the provisional phase labels, and select event times where needed. Confirm your review when the assignments are ready. Experimental image measurements require confirmed phase review and are not exported."
  },
  {
    id: "export",
    shortLabel: "Export",
    label: "Export",
    description: "Save a Swing Card as PNG, print or save as PDF where supported, or copy its prompt. Sharing the result with another service is a separate action you control."
  }
] as const;

export type WorkflowStepId = (typeof workflowSteps)[number]["id"];

export function getWorkflowStep(id: WorkflowStepId) {
  return workflowSteps.find((step) => step.id === id) ?? workflowSteps[0];
}

export function getNextWorkflowStep(id: WorkflowStepId) {
  const currentIndex = workflowSteps.findIndex((step) => step.id === id);
  return workflowSteps[Math.min(currentIndex + 1, workflowSteps.length - 1)];
}
