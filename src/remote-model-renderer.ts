import {
  modelBlockedOutboundDataClasses,
  modelOutboundDataClasses
} from "./model-adapter-contract";
import { reviewedModelProviders } from "./model-consent";
import { formatRemoteDataClass } from "./render-utils";

export function renderRemoteModelReviewPanel(): string {
  const providerAvailable = reviewedModelProviders.length > 0;
  return `
    <section class="remote-model-panel" aria-labelledby="remote-model-heading">
      <div class="remote-model-panel__header">
        <div>
          <p class="placeholder-kicker">Optional remote review</p>
          <h4 id="remote-model-heading">Remote model review unavailable</h4>
        </div>
        <span class="stage-status">Unavailable</span>
      </div>
      <p>Remote model review is optional and requires a separately reviewed provider before any data can leave this device. Manual Swing Card export and Copy prompt do not require provider configuration.</p>
      <div role="group" aria-label="Remote model data disclosure">
      <dl class="remote-model-disclosure">
        <div>
          <dt>Remote provider</dt>
          <dd>${providerAvailable ? "Reviewed provider configured." : "No reviewed provider is configured."}</dd>
        </div>
        <div>
          <dt>Eligible data if remote review is enabled later with explicit consent</dt>
          <dd>${modelOutboundDataClasses.map(formatRemoteDataClass).join(", ")}</dd>
        </div>
        <div>
          <dt>Blocked from remote review</dt>
          <dd>${modelBlockedOutboundDataClasses.map(formatRemoteDataClass).join(", ")}</dd>
        </div>
      </dl>
      </div>
      <button class="secondary-action" type="button" disabled data-remote-model-send aria-describedby="remote-model-status">Remote review unavailable</button>
      <p class="action-note" id="remote-model-status" data-remote-model-status>Remote model review is unavailable until a provider is separately reviewed and configured.</p>
    </section>
  `;
}
