# Calculator

A browser-based calculator built as part of [The Odin Project's Foundations course](https://www.theodinproject.com/lessons/foundations-calculator).

## Live Demo

View the live site here:
https://vinogola.github.io/calculator/

## Overview

A standard four-function calculator that supports chained calculations, decimal input,
backspace, and full keyboard control alongside mouse clicks. Built with vanilla HTML, CSS,
and JavaScript — no frameworks or libraries.

## How to Use

1. Open the page — the display starts at `0`.
2. Click the buttons, or use your keyboard: digits, `+ - * /`, `.` for decimal, `Enter` for
   `=`, `Backspace` for DEL, and `Escape` for AC.
3. Chain calculations by pressing another operator right after a result — the displayed
   result becomes the start of the next calculation.
4. Dividing by zero shows a message instead of `Infinity`.

## Key Features

- All four basic operations, with chained calculations (e.g. `5 + 3 - 2 =`)
- Decimal input, guarded against multiple decimal points in one number
- Backspace (DEL) to remove the last digit entered
- Full keyboard support — one shared handler processes both clicks and key presses
- Divide-by-zero shown as a message instead of `Infinity`
- Display rounds long decimals for readability, while the underlying state keeps full
  precision so chained calculations don't lose accuracy

## What I Learned

- **State-driven rendering.** The display never gets written to directly — every input
  updates a single state object first, then one function renders whatever that state
  currently holds. Keeping those two steps separate, in that order, fixed a bug where the
  screen showed `12+5` while the calculation still had nothing, and stops the whole class of
  bugs where the display and the actual calculation can disagree.
- **Reusing one handler for two input types.** Clicking a button and pressing a key are
  different events, but once each one resolves down to a `digit`/`operator` value, they can
  both hand off to the exact same processing function. That meant adding keyboard support
  required zero duplicated calculation logic.
- **`keydown` vs `keypress`.** I built the keyboard listener on `keypress` first, then found
  through testing that `keypress` never fires at all for keys like `Escape` or `Backspace` —
  it only fires for keys that produce a character. Switching to `keydown` fixed it, since
  that event fires for every key.
- **`event.key` vs `event.code`.** `key` reports the character produced (so `Shift` changes
  it), while `code` reports the physical key regardless of modifiers. For this calculator
  `key` was the right choice everywhere, including `Enter`, since it treats the main and
  numpad Enter keys as the same value.
- **Why `preventDefault` has to live in the listener.** I first tried resolving special keys
  like `Escape` inside a small helper function, but calling `preventDefault()` there failed —
  the helper only receives the key string, not the event object. `preventDefault` can only be
  called where the event itself is available.
- **Floating-point precision.** JavaScript numbers can't represent most decimals exactly
  (`70.2 - 50` gives `20.200000000000003`). Rounding only the copy shown on the display, and
  never the state itself, keeps chained calculations accurate.

## Challenges I Struggled With

- **Consecutive operators and chained calculations.** A flag read to decide whether to
  evaluate could get overwritten earlier in the same click, silently breaking a chained
  calculation like `5 + 3 - 2 =`. Tracing execution order within a single event handler,
  step by step, was what surfaced it.
- **One value meaning two different things.** Early on, an emptied number field and a
  freshly-typed `0` were both represented the same way, which caused real bugs once
  backspace was added. Settling on `null` as the single "nothing here yet" value, distinct
  from any real number, fixed the whole cluster of issues at once.
- **A silently dropped decimal point.** After adding keyboard support, typing `.` on the
  keyboard did nothing — the key-to-digit lookup simply didn't have a case for it. It never
  threw an error, so it only showed up because I tested typing a decimal number directly
  rather than assuming it worked.

## Getting Started

1. Clone this repo:

   ```bash
   git clone https://github.com/vinogola/calculator.git
   ```

2. Open `index.html` in your browser, or use the live demo link above.

## Acknowledgements

- [The Odin Project](https://www.theodinproject.com/) for the curriculum and project brief
