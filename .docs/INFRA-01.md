# INFRA-01 — index.html Setup

## Task
Update `index.html` to add the Plus Jakarta Sans font import and correct meta tags.

## Output Contract
- **Modify:** `index.html`
- **Do NOT touch:** anything else

---

## Requirements

### 1. Font Import
Add this inside `<head>`, before any other `<link>` tags:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
```

This import must appear ONCE globally — never import it again in any component or CSS file.

### 2. Meta Tags
Ensure `<head>` contains:

```html
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<meta name="description" content="MeetPro — AI-powered video conferencing and intelligent interview platform." />
<title>MeetPro</title>
```

### 3. Nothing Else Changes
- Do not touch `<script>` tags
- Do not touch `<div id="root">`
- Do not add any other links or scripts

---

## Completion
1. List modified file with one-line summary
2. Mark `INFRA-01` as `[x]` in ROADMAP.md
3. Write: `TASK COMPLETE — AWAITING HUMAN REVIEW`
4. STOP