# _parked_features.md — captured, not yet built

Parked while the reskin + scoped backlog complete. Each gets its own phased build later.

## Multi-select FOCUS/GOAL — "build muscle + shred fat" (recomp)
- Model: **goalPrimary + goalSecondary** weighted blend (NOT free select-all). Already in `_spec_assessment.md` schema.
- Behaviour: keep the primary's rep schemes/volume, accent with the secondary (e.g. hypertrophy primary + fatloss secondary → add density/conditioning, preserve muscle).
- **Bound to 2** (primary + one accent). Blending opposing goals (max strength + max conditioning) produces incoherent prescription.
- HONEST caveat to surface in UI: fat loss is mostly a calorie deficit the app can't see or control. The app's "shred" role = preserve muscle + raise work capacity during a deficit, not *cause* fat loss.

## Multi-select TYPE — "back + legs" custom combo
- Smart Picker change: let workout-type be multi-select; the picker splits the exercise budget across the chosen areas, balanced, within session length.
- **Bound to ~2 areas** — beyond that it's just Full Body (already exists) or too long to cover anything well.
- Touches generation logic (not a UI toggle) → its own phased build with device gates.
- Sits between single-type and Full Body.

**Status:** parked until after the reskin. Recomp blend already designed (assessment, T3 trace); multi-type needs a Smart Picker spec when we get to it.
