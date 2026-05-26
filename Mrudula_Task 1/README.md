# Calculator Project

A fully functional calculator built with HTML, CSS, and JavaScript.

## Project Structure

```
calculator/
├── index.html          ← Main HTML file (structure & layout)
├── css/
│   └── style.css       ← All styling (grid, buttons, display, colours)
├── js/
│   └── calculator.js   ← All logic (state, calculations, event listeners)
└── README.md           ← This file
```

## How to Run

1. Open the `calculator` folder in **VS Code**
2. Install the **Live Server** extension (by Ritwick Dey) if you haven't already
3. Right-click `index.html` → **"Open with Live Server"**
4. The calculator opens in your browser at `http://127.0.0.1:5500`

Alternatively, just double-click `index.html` to open it directly in any browser.

---

## Features

| Feature             | Description                                      |
|---------------------|--------------------------------------------------|
| Basic operations    | Addition, Subtraction, Multiplication, Division  |
| Chained operations  | `5 + 3 × 2` evaluates step by step              |
| Toggle sign (±)     | Flip between positive and negative               |
| Percentage (%)      | Convert current number to a percentage           |
| Decimal support     | Enter decimal numbers with `.`                   |
| Division by zero    | Shows "Error" instead of crashing                |
| Keyboard support    | Full keyboard input (see table below)            |
| Responsive design   | Adapts to smaller screen widths                  |

### Keyboard Shortcuts

| Key(s)          | Action               |
|-----------------|----------------------|
| `0` – `9`       | Enter digits         |
| `+` `-` `*` `/` | Operators            |
| `Enter` or `=`  | Calculate result     |
| `.`             | Decimal point        |
| `%`             | Percentage           |
| `Backspace`     | Delete last digit    |
| `Escape`        | Clear all (C)        |

---

## JavaScript Concepts Used

- **Variables** — `let` for mutable state (`currentValue`, `operator`, etc.)
- **Functions** — Each action has its own named function (`handleNumber`, `handleOperator`, etc.)
- **Event Listeners** — `addEventListener("click", ...)` and `addEventListener("keydown", ...)`
- **Loops** — `forEach` to attach listeners to all number and operator buttons
- **if / else if / else** — Keyboard handler and sign toggle logic
- **switch statement** — Clean operator dispatch inside `calculate()`
- **DOM manipulation** — `textContent`, `classList.add/remove`, `querySelector`
- **Template literals** — Building the expression display string
- **Data attributes** — `data-num` and `data-op` on HTML buttons

---

## CSS Concepts Used

- **CSS Grid** — `grid-template-columns: repeat(4, 1fr)` for the button layout
- **Flexbox** — Centering the calculator on the page and aligning display text
- **CSS Variables** — Colours and spacing defined once, reused everywhere
- **Pseudo-classes** — `:hover` and `:active` for interactive button feedback
- **Media queries** — `@media (max-width: 380px)` for responsive sizing
- **Transitions** — Smooth colour and transform changes on button press
