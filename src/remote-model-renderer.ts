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
        <span class="stage-status">Off by default</span>
      </div>
      <p>Remote model review is optional and requires a separately reviewed provider before any data can leave this device. Manual Swing Card export and Copy prompt do not require provider configuration.</p>
      <dl class="remote-model-disclosure" aria-label="Remote model data disclosure">
        <div>
          <dt>Provider registry</dt>
          <dd>${providerAvailable ? "Reviewed provider configured." : "No reviewed provider is configured for this story."}</dd>
        </div>
        <div>
          <dt>Would send after future consent</dt>
          <dd>${modelOutboundDataClasses.map(formatRemoteDataClass).join(", ")}</dd>
        </div>
        <div>
          <dt>Will not send in SS-013</dt>
          <dd>${modelBlockedOutboundDataClasses.map(formatRemoteDataClass).join(", ")}</dd>
        </div>
      </dl>
      <button class="secondary-action" type="button" disabled data-remote-model-send>Remote review unavailable</button>
      <p class="action-note" data-remote-model-status role="status">Remote model review is unavailable until a provider is separately reviewed and configured.</p>
    </section>
  `;
}
