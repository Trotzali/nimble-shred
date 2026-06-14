# Spec — Encyclopedia stuck-filter fix (#26)

**Type:** READ-ONLY trace + surgical fix. No edits, no git, index.html untouched.
**Audited against:** committed/on-disk `index.html` (current).
**Symptom (#26):** an Encyclopedia filter that won't clear/reset — same shape as the old Builder "13-exercise" regression (persisted multi-select state + chips not re-synced on open).

---

## 1. The surfaces involved
- **Markup** `#view-encyclopedia` (`:1680-1714`): a search box, then chip rows — **only the "All" chip is statically `class="chip active"` (`:1689`)**; every other chip is plain `class="chip"`. Chips call `filterEncyclopedia('Chest'|'Cable'|'Cardio'|…)`; list renders into `#encyclopedia-list` (`:1714`).
- **Toggle:** `filterEncyclopedia(category)` (`:5637-5679`) — multi-select state machine over `appState.encyclopediaFilters` (mirrors the Builder's `filterBuilder`).
- **Render:** `renderEncyclopedia()` (`:5681-5749`) — reads `appState.encyclopediaFilters`, AND-combines muscle/equip/style(bucket) groups, renders the list + count.
- **Entry points that call render:** `window.onload` (`:3274`/`:3341`), `switchTab('encyclopedia')` (`:3411`), `searchEncyclopedia()` (`:5751`).

## 2. State + persistence (the load-bearing facts)
1. **`filterEncyclopedia` never calls `saveAppState`** — it mutates `appState.encyclopediaFilters` in memory only.
2. **`saveAppState()` serialises the WHOLE object** — `localStorage.setItem('nimbleState_v45', JSON.stringify(appState))` (`:3364-3366`). So the moment *any other* action calls `saveAppState` (starting a workout, completing a day, editing a plan day, changing weight unit, …) it **snapshots the current `encyclopediaFilters`** as a side effect.
3. **`loadAppState` restores the whole object**, so on the next launch `appState.encyclopediaFilters` comes back as whatever it was last snapshotted to — e.g. `['Cardio']`.
4. **Nothing ever reconciles the chip `.active` DOM classes with that state.** `renderEncyclopedia` filters the *list* but does not touch chip classes; `switchTab`/`onload` call render without resetting state or syncing chips; the static HTML always shows "All" active.

## 3. Root cause
**The chip `.active` UI and `appState.encyclopediaFilters` desynchronise, and the toggle logic keys off the state — not the visible chip — so the obvious "clear" actions behave backwards.**

Concretely, after a reload (or cloud restore) where the filter was incidentally persisted as a non-`['all']` value (§2.2–2.3):
- **DOM** (fresh from static HTML): "All" chip `.active`, the real filter chip **not** active.
- **State:** `encyclopediaFilters = ['Cardio']`.
- **`renderEncyclopedia`** (`:5705`) sees `!includes('all')` → filters the list to Cardio (~17 of 177). So the user sees **"All" highlighted but a filtered list** → "the filter is stuck / won't clear."
- The toggle reads **state**, not the visible class:
  - Tapping the Cardio chip (which *looks off*): `indexOf('Cardio') > -1` → **splice removes it** (`:5663`) → empty → back to `['all']` → shows everything. The chip you tapped to *enable* the filter actually cleared it.
  - Tapping a different chip (e.g. Chest, looks off): `includes('all')` is false, so it **ADDs** to the hidden `['Cardio']` → `['Cardio','Chest']` → AND-narrowed/empty result, not the "just Chest" the user expected.
- The **only** reliable clear — tapping "All" — already *looks* active, so users read it as a no-op and don't try it. Hence "won't clear/reset."

This is exactly the **old Builder 13-exercise regression** shape: a persisted multi-select filter whose chips aren't re-synced on open, leaving a stuck/wrong filter. The Builder was fixed by resetting its filter state on open; the Encyclopedia never got the equivalent.

> Note: even without reload, `switchTab('encyclopedia')` (`:3411`) calls `renderEncyclopedia()` with **no reset and no chip-sync** — so the same desync reappears any time state and DOM diverge (e.g. cloud restore mid-session).

## 4. Minimal surgical fix

### Fix A — reset Encyclopedia filters on open (RECOMMENDED — matches the Builder fix)
Make the tab always open clean, with DOM and state in agreement. Add one helper and call it from the two open paths.

```js
function resetEncyclopediaFilters() {
    appState.encyclopediaFilters = ['all'];
    var v = document.getElementById('view-encyclopedia');
    if (!v) return;
    v.querySelectorAll('.chip').forEach(function(c){ c.classList.remove('active'); });
    var allChip = v.querySelector(".chip[onclick*=\"'all'\"]");
    if (allChip) allChip.classList.add('active');
    var s = document.getElementById('encyclopedia-search'); if (s) s.value = '';
}
```
Wire it in:
- `switchTab` (`:3411`): `if(tab === 'encyclopedia') { resetEncyclopediaFilters(); renderEncyclopedia(); }`
- `window.onload` (`:3274` / `:3341`): call `resetEncyclopediaFilters()` immediately before the initial `renderEncyclopedia()` (or simply rely on the switchTab path if the encyclopedia isn't the default tab — it isn't; Coach is).

**Why this is the right minimal fix:** it guarantees no stuck filter can survive a reload, cloud restore, or tab switch; DOM and state always agree on entry; it resets both the chip classes **and** the search box (which has the same persistence-of-text-vs-state subtlety). Mirrors the proven Builder behaviour (open → clean slate). Trade-off: a deliberately-set filter is not preserved across tab switches — expected and acceptable for a browse tool.

### Fix B — sync chips to state every render (ALTERNATIVE — preserves the filter)
If preserving the user's last filter is desired, instead make the UI honest: at the top of `renderEncyclopedia` reflect state onto the chips so the toggle never acts backwards.
```js
// inside renderEncyclopedia(), after the Array guard:
var v = document.getElementById('view-encyclopedia');
if (v) v.querySelectorAll('.chip').forEach(function(c){
    var m = c.getAttribute('onclick').match(/filterEncyclopedia\('([^']+)'\)/);
    var cat = m && m[1];
    c.classList.toggle('active', cat && appState.encyclopediaFilters.indexOf(cat) > -1);
});
```
This keeps persistence and fixes the desync at the single render choke point (no `switchTab`/`onload` change). More code than A; the only thing it buys is filter persistence, which an encyclopedia doesn't need — hence A is recommended.

**Pick one (A recommended). Do not ship both** — A wipes state on open, making B's sync moot.

## 5. Out of scope / adjacent (note only, don't bundle)
- `filterEncyclopedia` not calling `saveAppState` is *incidental* to the bug — the wholesale `saveAppState` from other flows is what persists the filter. Fix A makes persistence irrelevant; no need to change save behaviour.
- The same persisted-but-unsynced pattern could affect any future static-chip filter; consider the §4 helper pattern as the house style. Not part of #26.

## 6. Test gate
1. Open Encyclopedia → tap **Cardio** → list filters to Cardio, Cardio chip active, All inactive.
2. Trigger a `saveAppState` (e.g. start+end a quick workout, or edit a plan day) so `encyclopediaFilters=['Cardio']` is persisted.
3. **Reload the app**, open Encyclopedia → **with Fix A:** list shows all 177, "All" active, Cardio inactive — clean. (Pre-fix: list stuck on ~17 Cardio while "All" looks active.)
4. Switch to another tab and back to Encyclopedia → opens to "All", no residual filter (Fix A).
5. Tap a filter, then tap "All" → clears to all every time; chip `.active` matches the list.
6. Search box: type a term, switch away and back → box cleared, full list (Fix A).
7. Regression: multi-select still works in-session (Chest + Cable → intersection); count + "no exercises match" empty state unchanged.

---

## 7. Summary
- **Root cause:** chip `.active` DOM never reconciled with `appState.encyclopediaFilters`; `saveAppState` persists the filter wholesale (`:3365`) while the static HTML + render show "All" active — so after reload/restore the toggle keys off hidden state and the obvious clear actions act backwards → "stuck filter." Same shape as the Builder 13-exercise regression.
- **Fix (minimal, recommended):** `resetEncyclopediaFilters()` (state `['all']` + clear chip `.active` + restore "All" active + clear search), called from `switchTab('encyclopedia')` (`:3411`) and `window.onload`. Encyclopedia always opens clean.
- **Alternative:** sync chips→state at the top of `renderEncyclopedia` (preserves the filter). One of the two — not both.

---

*Signed off — T5, terminal pts/T5, 2026-06-14 20:47 AEST (10:47 UTC). Read-only: no edits, no git, index.html untouched.*
