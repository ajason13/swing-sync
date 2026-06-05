# Safety Terms and Educational Use Draft

**DRAFT - pending legal/human review; not for release.**

This document is product-compliance draft language for human and legal review.
It is not legal advice, does not guarantee enforceability, and should be
reviewed before release.

## Intended Use

Swing Sync provides local-first, educational golf swing feedback. It is designed
to help users observe movement patterns and practice general skill awareness.
It is not medical advice, physical therapy, rehabilitation guidance, injury
diagnosis, pain triage, or professional athletic instruction.

Raw swing video must remain on the user's device by default. Any future remote
model, cloud storage, or coach-review feature must require a separate opt-in
flow before raw swing video leaves the device.

## Assumption of Risk Draft

Golf practice, swing changes, exercise, and physical movement involve risk.
Those risks may include soreness, strain, falls, impact injuries, equipment
injuries, aggravation of an existing condition, or other injury. Users should
practice in a safe location, warm up appropriately, stop if they feel pain,
dizziness, numbness, weakness, or unusual discomfort, and consult a qualified
professional before changing activity if they have health, mobility, or injury
concerns.

By using Swing Sync for analysis, the user acknowledges that golf practice and
movement changes are voluntary activities and that they are responsible for
deciding whether to participate, how intensely to practice, and whether to seek
professional medical, fitness, or coaching guidance.

## Release of Liability Draft

To the maximum extent permitted by applicable law, the user agrees that Swing
Sync, its maintainers, contributors, and distributors are not responsible for
injury, loss, or damage arising from the user's practice, swing changes,
equipment use, training decisions, or reliance on educational feedback provided
by the app.

This draft release should not be read as waiving rights that cannot legally be
waived. It is intended as review-ready product language and must be evaluated
for the jurisdictions and release context where Swing Sync is offered.

## Educational Feedback Boundary

User-facing copy and AI coaching output must:

- describe feedback as educational information only;
- avoid presenting feedback as medical advice, pain diagnosis, rehabilitation,
  physical therapy, or professional athletic instruction;
- avoid guarantees of injury prevention, performance improvement, or swing
  correctness;
- encourage users to stop activity if pain or concerning symptoms occur; and
- direct users with pain, injury, medical conditions, or safety concerns to a
  qualified medical professional or qualified golf coach as appropriate.

## Consent Gate Requirement

Before the first swing analysis, the app must block analysis until the user has
explicitly acknowledged all of the following:

- Swing Sync is for educational use only.
- Swing Sync is not medical advice, pain diagnosis, rehabilitation guidance, or
  professional athletic instruction.
- Golf practice and movement changes involve risk, and the user accepts
  responsibility for deciding whether and how to practice.
- The user should stop if they feel pain or concerning symptoms and seek
  qualified help when appropriate.
- Raw swing video stays on the device by default unless the user separately
  opts in to a feature that sends it elsewhere.

The consent gate should store only the minimum local acknowledgement state
needed to avoid repeated prompts. It should not upload consent records or raw
video by default.

The consent gate must be accessible and usable. It should not depend on rigid
scroll-completion mechanics as the only evidence of review unless legal/human
review specifically approves that interaction.

## AI Coach Prompt Constraints

Future AI coach prompts and system instructions must include constraints that:

- prohibit diagnosing pain, injuries, medical conditions, mobility limits, or
  causes of symptoms;
- prohibit medical triage, rehabilitation plans, therapy exercises, or
  treatment instructions;
- prohibit aggressive mechanical prescriptions such as forcing range of motion,
  training through pain, or making abrupt high-load changes;
- frame suggestions as optional, low-intensity, educational observations;
- recommend stopping activity when pain, numbness, dizziness, weakness, or
  unusual discomfort is present;
- recommend qualified medical review for pain, injury, or health concerns; and
- recommend qualified coaching review for sport-specific instruction beyond
  general educational feedback.

Automated guardrails, keyword filters, system prompts, or output checks should
be treated as defense-in-depth controls. They do not guarantee that all unsafe
or adversarial requests will be caught, especially in client-side or local-first
execution contexts.

## Review Checklist

- [ ] Legal/human reviewer approved assumption-of-risk language.
- [ ] Legal/human reviewer approved release-of-liability language.
- [ ] Consent gate blocks first analysis before acknowledgement.
- [ ] Consent gate does not upload raw swing video or consent records by
      default.
- [ ] AI coaching prompt constraints reject pain diagnosis and rehabilitation
      advice.
- [ ] AI coaching prompt constraints reject unsafe or aggressive movement
      prescriptions.
- [ ] Gemini research disposition reviewed and accepted, revised, deferred, or
      rejected for each major recommendation.
