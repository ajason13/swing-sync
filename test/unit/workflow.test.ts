import { describe, expect, it } from "vitest";
import { getNextWorkflowStep, getWorkflowStep, workflowSteps } from "../../src/workflow";

describe("analysis workflow model", () => {
  it("opens directly to capture and includes every required placeholder state", () => {
    expect(workflowSteps.map((step) => step.id)).toEqual([
      "capture",
      "processing",
      "review",
      "export"
    ]);
    expect(getWorkflowStep("capture").label).toBe("Capture or upload");
  });

  it("advances through the workflow without moving beyond export", () => {
    expect(getNextWorkflowStep("capture").id).toBe("processing");
    expect(getNextWorkflowStep("processing").id).toBe("review");
    expect(getNextWorkflowStep("review").id).toBe("export");
    expect(getNextWorkflowStep("export").id).toBe("export");
  });
});
