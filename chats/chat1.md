# Eisenhower Matrix Task App

_Started 2026-06-30 04:42 UTC_

---

## User

Design a task management web app built around the Eisenhower Matrix.
The core of the app is a 2x2 grid sorting tasks by urgency and importance:

Do First (Urgent + Important)
Schedule (Not Urgent + Important)
Delegate (Urgent + Not Important)
Eliminate (Not Urgent + Not Important)

Please explore:

A clean main view where users can add tasks and drag them between quadrants
Visual distinction between quadrants (color, weight, or labeling) that reinforces priority at a glance
A quick way to add a task and assign it to a quadrant
How a task looks: title, optional due date, maybe a checkbox to complete
An empty state that guides a first-time user

Focus mode: Add a focus mode that highlights the 'Do First' quadrant while phasing out (dimming/de-emphasizing) the other three. The other quadrants stay phased out until every item in 'Do First' is completed — then the full matrix returns to normal. Show how the transition into and out of focus mode feels.
Completed items: Done items are not shown inside the quadrants. When a task is checked off, it leaves its quadrant and moves to a single shared "Done" list that lives outside the main matrix (e.g. a collapsible panel or sidebar). This list is shared across all four quadrants. Consider showing where a completed task originally came from (e.g. a small quadrant tag).
Feel free to entertain a few different directions for the overall feel — e.g. minimalist and focused, playful and colorful, or dashboard-style with stats. Show me a couple of options so I can compare.

## Assistant

I'll explore this as wireframes (per the Wireframe skill you attached) — rough, low-fi layouts to map the design space before committing. A few quick questions first so the directions are useful.

_[tool: questions_v2]_

## User

Questions answered:
- platform: Desktop web (wide canvas)
- directions: Minimalist & focused, Calm / paper-like
- options_count: 3
- quadrant_distinction: Explore a few options
- focus_transition: Dim / fade opacity, Decide for me, Explore a few options
- done_panel: Explore a few options
- add_task: Explore a few options
- task_fields: Decide for me
- states_to_show: Empty / first-time state, Quick-add open, All of these, Focus mode transition steps, Done panel expanded, Focus mode ON

## Assistant

Sketching three directions as low-fi wireframes. Let me build the wireframe canvas.

_[tool: dc_write]_

_[tool: ready_for_verification]_

Three directions sketched as low-fi wireframes, side by side:

- **1a — Minimal · weight = priority**: monochrome, priority shown by visual weight (Do First heaviest → Eliminate faded), top add-bar + segmented quadrant picker, Done as collapsible right sidebar.
- **1b — Paper · soft color**: warm paper canvas, muted tint per quadrant, add inline inside each quadrant, Done as bottom drawer.
- **1c — Structured · numbered + ⌘K**: ranked stripes (1→4) with count chips, natural-language command bar, Done as right slide-out — slightly dashboard-y.

Each column shows main view, empty/first-run, quick-add, focus mode (with a transition strip showing the fade → focused → return), and the expanded Done list with origin tags.

Tell me which to take to hi-fi, or mix elements across them.

## User

I like option 1a.

In the done section, we don't need to know where it came from. If it was "Do first, "schedule, "delegate" or "eliminate".

We could explore the idea further of having two tabs at the top. One for "DO" which enters the fade mode and focus on do first, then once all that's done, it moves towards Schedule than delegate then eliminate. 

The option we want to have at the top is "Plan" which enters this mode where it allows to add new tasks, move tasks between quadrants or edit delete them. 

In do mode, all you can do is complete tasks. One at a time.

## Assistant

Got it — 1a is the base. Let me explore the Plan/Do tab model in a new round (Done loses the origin tag; Do mode steps through quadrants in priority order, complete-only).

_[tool: read_file]_

_[tool: dc_html_str_replace]_

_[tool: ready_for_verification]_

Added round 2 (at the top) exploring the Plan/Do model on 1a's look:

- **2a — Plan mode**: the editing canvas. Plan/Do tabs up top, add bar + picker, drag/edit/delete cards. Done list now shows just title + time, no origin tag.
- **2b — Do mode (active quadrant)**: tabs flip to Do, a progression rail (Do First → Schedule → Delegate → Eliminate) walks one lit quadrant at a time with the rest faded; complete-only, empty quadrants auto-skip, then it returns to Plan.
- **2c — Do mode (single card)**: the literal "one at a time" — matrix shrinks to a corner map and one task card is surfaced with Done/Skip, next sliding up.

So you can compare 2b vs 2c for how Do mode feels. Tell me which Do experience you want, and I'll take Plan + that to hi-fi.

## User

2A & 2B seems the way to go. 

A few refinements:

In 2A:
* we should be able to add the task inside the quadrant. No need to be at the top.

## Assistant

In 2a, add-task moves inside each quadrant (dropping the top bar).

_[tool: dc_html_str_replace]_

_[tool: dc_html_str_replace]_

_[tool: dc_html_str_replace]_

_[tool: dc_html_str_replace]_

_[tool: ready_for_verification]_

Done — in 2a the top add bar is gone and each quadrant now has its own inline "＋ add task" row at the bottom, weighted to match the quadrant. 

Ready to take Plan + 2b Do mode to hi-fi whenever you are, or keep refining the wireframes.

## User

Actually, we can remove the idea of Plan <> Do.

naturally, the focus is always followed by the criteria order. But the user can always add tasks, manipulate existing ones at any time.

## Assistant

Simplifying — dropping Plan/Do tabs. One always-editable view, with Focus that auto-walks the priority order. New round on top.

_[tool: dc_html_str_replace]_

_[tool: ready_for_verification]_

Round 3 (top) drops the modes entirely:

- **3a — Always editable, Focus is a toggle**: one matrix you can add/drag/edit/delete in at any time. The Focus toggle sits top-right; off shows the full weighted matrix, on dims everything but the current priority quadrant and shows the auto-advancing rail (Do First → Schedule → Delegate → Eliminate). Editing stays live even while focused, and toggling off restores the full matrix.

Both states shown side by side. If 3a feels right, I'll build it out as a working hi-fi prototype.

## User

“take 3a to hi-fi” 

“show the focus fade animated” 

“add a tiny progress bar to the Do First header”

## Assistant

Taking 3a to a working hi-fi prototype — a real app with drag-and-drop, inline add/edit, animated focus fade, the progress bar on Do First, and a live Done panel. Building it as a new component.

_[tool: update_todos]_

_[tool: dc_write]_

_[tool: show_html]_

_[tool: show_html]_

Renders cleanly — weighted quadrants, the Do First progress bar (1 of 3 done), shared Done panel with no origin tags. Style strings apply correctly.

_[tool: update_todos]_

_[tool: ready_for_verification]_

Hi-fi prototype is live — **Quadrant.dc.html** (separate from the wireframes). It's a working app:

- **Weighted matrix** — Do First darkest/boldest down to a dashed, faded Eliminate; axis labels on the edges.
- **Add inside each quadrant** — the ＋ row opens an inline composer (title + optional due date, Enter to add).
- **Drag between quadrants** — cards lift while dragging; the target quadrant outlines as you hover.
- **Tasks** — title, due-date chip (Today/Overdue go accent), checkbox to complete, hover for edit/delete.
- **Focus mode** — the header toggle fades the other quadrants down and walks Do First → Schedule → Delegate → Eliminate, auto-advancing as each clears (empty ones skipped), then releases the full matrix with an "All clear" note. Editing stays live throughout.
- **Progress bar** on the Do First header (and the active focused quadrant).
- **Shared Done panel** — checked tasks leave their quadrant for one list, newest first, with restore/clear — no origin tag, as you asked.
- Everything persists; tweaks for accent color, focus dim level, and a compact layout.

Try toggling Focus and checking off the Do First items to watch it advance. Want me to tune anything — fade timing, the dim depth, card density — or take it further?

