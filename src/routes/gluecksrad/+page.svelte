<script lang="ts">
	import { onMount } from 'svelte'
	import { initGluecksrad } from './gluecksrad.js'

	const THREE_SRC = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js'

	let failed = $state(false)

	const loadThree = () =>
		new Promise<void>((resolve, reject) => {
			if ((window as any).THREE) return resolve()
			const existing = document.querySelector<HTMLScriptElement>(`script[src="${THREE_SRC}"]`)
			if (existing) {
				existing.addEventListener('load', () => resolve())
				existing.addEventListener('error', () => reject(new Error('three.js load failed')))
				return
			}
			const el = document.createElement('script')
			el.src = THREE_SRC
			el.async = true
			el.onload = () => resolve()
			el.onerror = () => reject(new Error('three.js load failed'))
			document.head.appendChild(el)
		})

	onMount(() => {
		loadThree()
			.then(() => initGluecksrad())
			.catch(() => (failed = true))
	})
</script>

<svelte:head>
	<title>TribeCLUB Glücksrad</title>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		href="https://fonts.googleapis.com/css2?family=Alfa+Slab+One&family=Inter+Tight:wght@400;500;600;700&family=Oswald:wght@600;700&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<div class="gluecksrad">
	<canvas class="foam-bg" id="foamBg" aria-hidden="true"></canvas>

	<div class="gr-app">
		<header class="masthead">
			<div>
				<div class="eyebrow">Los geht’s</div>
				<h1>TribeCLUB</h1>
			</div>
			<p class="tagline">
				Namen eintragen, abschütteln, fertig. Wer rausfällt, zeigt, was als Nächstes ansteht.
			</p>
		</header>

		<section class="panel" aria-label="Teilnehmer">
			<div class="panel-head">
				<h2>Teilnehmer</h2>
				<span class="count" id="count">0 im Rad</span>
			</div>

			<div class="entry">
				<textarea id="nameInput" rows="1" placeholder="Name eintragen" aria-label="Name eintragen"
				></textarea>
				<button class="btn-add" id="addBtn">Eintragen</button>
			</div>
			<p class="hint">Enter trägt ein, Umschalt+Enter macht eine neue Zeile.</p>

			<div class="tools">
				<button class="chip" id="allBtn">Alle ins Rad</button>
				<button class="chip" id="noneBtn">Alle raus</button>
				<button class="chip" id="clearBtn">Liste leeren</button>
			</div>

			<ul class="list" id="list"></ul>

			<label class="opt" for="rmChk">
				<span class="box" id="rmBox"
					><svg viewBox="0 0 12 12" aria-hidden="true"
						><path
							d="M1 6.2 4.3 9.5 11 2.8"
							fill="none"
							stroke="#35141D"
							stroke-width="2.2"
							stroke-linecap="round"
							stroke-linejoin="round"
						/></svg
					></span
				>
				<input type="checkbox" id="rmChk" class="sr" />
				Gewinner nach der Ziehung aus dem Rad nehmen
			</label>
		</section>

		<section class="stage-wrap">
			<div class="stage" id="stage">
				<button class="sound" id="soundBtn" title="Ton an/aus" aria-label="Ton an oder aus"
				></button>
			</div>
			<button class="btn-spin" id="spinBtn" title="Gedrückt halten, um Kraft aufzubauen"
				>Halten &amp; drehen</button
			>
			<p class="sr" id="live" aria-live="polite"></p>
		</section>
	</div>

	<div class="confetti" id="confetti" aria-hidden="true"></div>

	<div class="overlay" id="overlay">
		<div class="ticket" role="dialog" aria-modal="true" aria-labelledby="who">
			<img class="av-big" id="avatarBig" alt="" width="192" height="192" />
			<div class="lbl">Gewinner</div>
			<div class="who" id="who">—</div>
			<p class="sub" id="sub"></p>
			<div class="acts">
				<button class="t-btn t-primary" id="againBtn">Nochmal drehen</button>
				<button class="t-btn t-ghost" id="removeBtn">Aus dem Rad nehmen</button>
				<button class="t-btn t-ghost" id="closeBtn">Schließen</button>
			</div>
		</div>
	</div>

	{#if failed}
		<p class="load-error">
			Die 3D-Bibliothek konnte nicht geladen werden. Prüf die Internetverbindung und lade die Seite
			neu.
		</p>
	{/if}
</div>

<!--
	Bewusst global: Ein Grossteil der Elemente (.row, .flake, .av, .nm, .del, .empty-list)
	wird zur Laufzeit per JS erzeugt und traegt deshalb keinen Svelte-Scope-Hash.
	Alle Regeln sind auf .gluecksrad eingegrenzt, damit nichts in andere Routen leckt.
-->
<style>
	:global(.gluecksrad) {
		position: fixed;
		inset: 0;
		overflow-y: auto;
		z-index: 3;
	}

	:global(.gluecksrad .load-error) {
		position: relative;
		z-index: 4;
		padding: 24px;
		text-align: center;
		color: #d9a8b6;
	}

	:global {
		.gluecksrad {
			--ink: #35141d;
			--ink-2: #57212b;
			--ink-3: #783340;
			--brass: #ee99ae;
			--brass-dim: #c55451;
			--cream: #fff2f7;
			--cream-dim: #d9a8b6;
			--red: #a35150;
			--display: 'Alfa Slab One', 'Rockwell', 'Georgia', serif;
			--body: 'Inter Tight', 'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif;
			--mono: ui-monospace, 'SFMono-Regular', 'Menlo', monospace;
			--r: 10px;
		}
		.gluecksrad * {
			box-sizing: border-box;
		}
		.gluecksrad,
		.gluecksrad {
			height: 100%;
		}
		.gluecksrad {
			margin: 0;
			background: radial-gradient(120% 90% at 50% 8%, #87394c 0%, #57212b 46%, var(--ink) 100%);
			color: var(--cream);
			font-family: var(--body);
			font-size: 15px;
			line-height: 1.45;
			-webkit-font-smoothing: antialiased;
			overflow-x: hidden;
		}
		.gluecksrad::after {
			content: '';
			position: fixed;
			inset: 0;
			pointer-events: none;
			z-index: 1;
			background: radial-gradient(
				75% 60% at 50% 45%,
				rgba(0, 0, 0, 0) 40%,
				rgba(42, 10, 20, 0.58) 100%
			);
		}
		.gluecksrad .gr-app {
			position: relative;
			z-index: 2;
			max-width: 1180px;
			margin: 0 auto;
			padding: 22px 18px 40px;
			display: grid;
			grid-template-columns: 320px minmax(0, 1fr);
			gap: 26px;
			align-items: start;
		}
		@media (max-width: 880px) {
			.gluecksrad .gr-app {
				grid-template-columns: 1fr;
				gap: 18px;
				padding: 16px 14px 32px;
			}
		}
		.gluecksrad .masthead {
			grid-column: 1 / -1;
			display: flex;
			align-items: flex-end;
			justify-content: space-between;
			gap: 16px;
			flex-wrap: wrap;
		}
		.gluecksrad .eyebrow {
			font-family: var(--mono);
			font-size: 11px;
			letter-spacing: 0.22em;
			text-transform: uppercase;
			color: var(--brass);
			display: flex;
			align-items: center;
			gap: 9px;
		}
		.gluecksrad .eyebrow::before {
			content: '';
			width: 26px;
			height: 2px;
			background: var(--brass);
			display: block;
		}
		.gluecksrad h1 {
			font-family: var(--display);
			font-weight: 400;
			margin: 0.12em 0 0;
			font-size: clamp(34px, 6.4vw, 58px);
			line-height: 0.94;
			letter-spacing: -0.005em;
			color: var(--cream);
			text-shadow:
				0 2px 0 var(--brass-dim),
				0 3px 0 rgba(0, 0, 0, 0.35);
		}
		.gluecksrad .tagline {
			color: var(--cream-dim);
			font-size: 14px;
			max-width: 34ch;
			margin: 0;
		}
		.gluecksrad .panel {
			background: linear-gradient(180deg, rgba(120, 51, 64, 0.94), rgba(73, 27, 39, 0.94));
			border: 1px solid rgba(238, 153, 174, 0.3);
			border-radius: var(--r);
			padding: 16px;
			box-shadow: 0 18px 40px -24px rgba(0, 0, 0, 0.9);
		}
		.gluecksrad .panel-head {
			display: flex;
			align-items: baseline;
			justify-content: space-between;
			margin-bottom: 12px;
		}
		.gluecksrad .panel-head h2 {
			font-family: var(--body);
			font-size: 13px;
			font-weight: 600;
			text-transform: uppercase;
			letter-spacing: 0.14em;
			margin: 0;
			color: var(--cream);
		}
		.gluecksrad .count {
			font-family: var(--mono);
			font-size: 12px;
			color: var(--brass);
		}
		.gluecksrad .entry {
			display: flex;
			gap: 8px;
		}
		.gluecksrad textarea#nameInput {
			flex: 1;
			resize: none;
			min-height: 42px;
			max-height: 120px;
			background: rgba(53, 20, 29, 0.72);
			color: var(--cream);
			border: 1px solid rgba(255, 242, 247, 0.18);
			border-radius: 8px;
			padding: 11px 12px;
			font: inherit;
			font-size: 14px;
			line-height: 1.3;
		}
		.gluecksrad textarea#nameInput::placeholder {
			color: rgba(217, 168, 182, 0.72);
		}
		.gluecksrad textarea#nameInput:focus,
		.gluecksrad button:focus-visible,
		.gluecksrad .row:focus-visible {
			outline: 2px solid var(--brass);
			outline-offset: 2px;
		}
		.gluecksrad textarea#nameInput:focus {
			border-color: transparent;
		}
		.gluecksrad button {
			font: inherit;
			cursor: pointer;
			border: none;
			background: none;
			color: inherit;
		}
		.gluecksrad .btn-add {
			background: var(--brass);
			color: var(--ink);
			font-weight: 700;
			font-size: 14px;
			border-radius: 8px;
			padding: 0 14px;
			align-self: stretch;
			box-shadow: inset 0 -2px 0 rgba(0, 0, 0, 0.22);
		}
		.gluecksrad .btn-add:hover {
			background: #f5cde1;
		}
		.gluecksrad .hint {
			font-size: 12px;
			color: rgba(217, 168, 182, 0.88);
			margin: 8px 2px 0;
		}
		.gluecksrad .tools {
			display: flex;
			gap: 6px;
			flex-wrap: wrap;
			margin: 14px 0 10px;
		}
		.gluecksrad .chip {
			font-size: 12px;
			padding: 5px 10px;
			border-radius: 99px;
			border: 1px solid rgba(255, 242, 247, 0.22);
			color: var(--cream-dim);
		}
		.gluecksrad .chip:hover {
			border-color: var(--brass);
			color: var(--cream);
		}
		.gluecksrad .list {
			list-style: none;
			margin: 0;
			padding: 0;
			max-height: min(46vh, 380px);
			overflow: auto;
		}
		.gluecksrad .list::-webkit-scrollbar {
			width: 8px;
		}
		.gluecksrad .list::-webkit-scrollbar-thumb {
			background: rgba(238, 153, 174, 0.36);
			border-radius: 99px;
		}
		.gluecksrad .row {
			display: flex;
			align-items: center;
			gap: 10px;
			padding: 8px 6px;
			border-bottom: 1px solid rgba(255, 242, 247, 0.1);
			border-radius: 6px;
		}
		.gluecksrad .row:hover {
			background: rgba(255, 242, 247, 0.07);
		}
		.gluecksrad .box {
			width: 17px;
			height: 17px;
			flex: none;
			border-radius: 4px;
			border: 1.5px solid rgba(255, 242, 247, 0.38);
			display: grid;
			place-items: center;
		}
		.gluecksrad .row.on .box {
			background: var(--brass);
			border-color: var(--brass);
		}
		.gluecksrad .box svg {
			width: 11px;
			height: 11px;
			opacity: 0;
		}
		.gluecksrad .row.on .box svg {
			opacity: 1;
		}
		.gluecksrad .row .swatch {
			width: 5px;
			height: 26px;
			border-radius: 2px;
			flex: none;
			opacity: 0.25;
		}
		.gluecksrad .row.on .swatch {
			opacity: 1;
		}
		.gluecksrad .av {
			width: 26px;
			height: 26px;
			flex: none;
			border-radius: 5px;
			display: block;
			image-rendering: pixelated;
			image-rendering: crisp-edges;
			box-shadow: 0 0 0 1px rgba(255, 242, 247, 0.18);
			cursor: pointer;
		}
		.gluecksrad .row:not(.on) .av {
			filter: grayscale(0.85) opacity(0.55);
		}
		.gluecksrad .av:hover {
			box-shadow: 0 0 0 2px var(--brass);
		}
		.gluecksrad .row .nm {
			flex: 1;
			min-width: 0;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}
		.gluecksrad .row:not(.on) .nm {
			color: rgba(217, 168, 182, 0.62);
			text-decoration: line-through;
			text-decoration-thickness: 1px;
		}
		.gluecksrad .del {
			flex: none;
			width: 26px;
			height: 26px;
			border-radius: 6px;
			color: rgba(217, 168, 182, 0.74);
			font-size: 17px;
			line-height: 1;
		}
		.gluecksrad .del:hover {
			background: rgba(197, 84, 81, 0.24);
			color: #f5cde1;
		}
		.gluecksrad .empty-list {
			color: rgba(217, 168, 182, 0.78);
			font-size: 13px;
			padding: 14px 4px;
		}
		.gluecksrad .opt {
			display: flex;
			align-items: center;
			gap: 9px;
			margin-top: 14px;
			padding-top: 13px;
			border-top: 1px solid rgba(255, 242, 247, 0.14);
			font-size: 13px;
			color: var(--cream-dim);
			cursor: pointer;
		}
		.gluecksrad .opt .box {
			width: 16px;
			height: 16px;
		}
		.gluecksrad .stage-wrap {
			display: flex;
			flex-direction: column;
			align-items: center;
			gap: 14px;
		}
		.gluecksrad .stage {
			width: 100%;
			aspect-ratio: 1/0.72;
			max-height: min(60vh, 560px);
			position: relative;
			touch-action: manipulation;
		}
		@media (max-width: 880px) {
			.gluecksrad .stage {
				aspect-ratio: 1/0.8;
				max-height: 48vh;
			}
		}
		.gluecksrad .stage canvas {
			display: block;
			width: 100%;
			height: 100%;
		}
		.gluecksrad .btn-spin {
			font-family: var(--display);
			font-size: clamp(19px, 3.6vw, 25px);
			letter-spacing: 0.02em;
			color: var(--ink);
			background: linear-gradient(180deg, #f5cde1, var(--brass) 55%, #d8757b);
			padding: 13px 46px;
			border-radius: 99px;
			box-shadow:
				0 8px 0 -1px var(--brass-dim),
				0 20px 30px -14px rgba(0, 0, 0, 0.9);
			transition:
				transform 0.1s ease,
				box-shadow 0.1s ease;
		}
		.gluecksrad .btn-spin:active {
			transform: translateY(5px);
			box-shadow: 0 3px 0 -1px var(--brass-dim);
		}
		.gluecksrad .btn-spin[disabled] {
			opacity: 0.45;
			cursor: not-allowed;
			transform: none;
			box-shadow: 0 8px 0 -1px var(--brass-dim);
		}
		.gluecksrad .sound {
			position: absolute;
			top: 6px;
			right: 6px;
			width: 38px;
			height: 38px;
			border-radius: 99px;
			border: 1px solid rgba(255, 242, 247, 0.2);
			color: var(--cream-dim);
			display: grid;
			place-items: center;
		}
		.gluecksrad .sound:hover {
			color: var(--brass);
			border-color: var(--brass);
		}
		.gluecksrad .overlay {
			position: fixed;
			inset: 0;
			z-index: 20;
			display: grid;
			place-items: center;
			padding: 20px;
			background: rgba(42, 10, 20, 0.76);
			backdrop-filter: blur(3px);
			opacity: 0;
			pointer-events: none;
			transition: opacity 0.25s ease;
		}
		.gluecksrad .overlay.show {
			opacity: 1;
			pointer-events: auto;
		}
		.gluecksrad .ticket {
			position: relative;
			background: var(--cream);
			color: var(--ink-2);
			border-radius: 6px;
			padding: 26px 30px 22px;
			text-align: center;
			min-width: min(340px, 86vw);
			max-width: 440px;
			box-shadow: 0 30px 60px -20px rgba(0, 0, 0, 0.8);
			transform: scale(0.9) rotate(-1.5deg);
			transition: transform 0.3s cubic-bezier(0.2, 1.5, 0.4, 1);
			background-image: repeating-linear-gradient(
				45deg,
				rgba(197, 84, 81, 0.045) 0 8px,
				transparent 8px 16px
			);
		}
		.gluecksrad .overlay.show .ticket {
			transform: scale(1) rotate(-1.5deg);
		}
		.gluecksrad .ticket::before,
		.gluecksrad .ticket::after {
			content: '';
			position: absolute;
			top: 0;
			bottom: 0;
			width: 12px;
			background: radial-gradient(circle at center, var(--ink) 45%, transparent 46%) 0 0/12px 16px
				repeat-y;
		}
		.gluecksrad .ticket::before {
			left: -6px;
		}
		.gluecksrad .ticket::after {
			right: -6px;
		}
		.gluecksrad .ticket .av-big {
			width: min(148px, 42vw);
			height: min(148px, 42vw);
			image-rendering: pixelated;
			image-rendering: crisp-edges;
			display: block;
			margin: 2px auto 12px;
			border-radius: 10px;
			box-shadow:
				0 6px 0 rgba(163, 81, 80, 0.18),
				0 0 0 3px rgba(197, 84, 81, 0.12);
			animation: pop 0.45s cubic-bezier(0.2, 1.6, 0.4, 1) both;
		}
		@keyframes pop {
			from {
				transform: scale(0.4) rotate(-8deg);
				opacity: 0;
			}
			to {
				transform: scale(1) rotate(0);
				opacity: 1;
			}
		}
		@media (prefers-reduced-motion: reduce) {
			.gluecksrad .ticket .av-big {
				animation: none;
			}
		}
		.gluecksrad .ticket .lbl {
			font-family: var(--mono);
			font-size: 11px;
			letter-spacing: 0.28em;
			text-transform: uppercase;
			color: var(--brass-dim);
		}
		.gluecksrad .ticket .who {
			font-family: var(--display);
			font-size: clamp(28px, 7vw, 44px);
			line-height: 1.05;
			margin: 8px 0 4px;
			overflow-wrap: anywhere;
			color: var(--ink-2);
		}
		.gluecksrad .ticket .sub {
			font-size: 13px;
			color: #8e5967;
			margin: 0 0 18px;
		}
		.gluecksrad .ticket .acts {
			display: flex;
			gap: 8px;
			justify-content: center;
			flex-wrap: wrap;
		}
		.gluecksrad .t-btn {
			border-radius: 7px;
			padding: 9px 15px;
			font-size: 14px;
			font-weight: 600;
		}
		.gluecksrad .t-primary {
			background: var(--ink-2);
			color: var(--cream);
		}
		.gluecksrad .t-primary:hover {
			background: var(--ink-3);
		}
		.gluecksrad .t-ghost {
			border: 1px solid rgba(87, 33, 43, 0.28);
			color: var(--ink-2);
		}
		.gluecksrad .t-ghost:hover {
			background: rgba(238, 153, 174, 0.18);
		}
		.gluecksrad .confetti {
			position: fixed;
			inset: 0;
			z-index: 19;
			pointer-events: none;
			overflow: hidden;
		}
		.gluecksrad .flake {
			position: absolute;
			width: 9px;
			height: 14px;
			border-radius: 1px;
			will-change: transform;
		}
		.gluecksrad .sr {
			position: absolute;
			width: 1px;
			height: 1px;
			overflow: hidden;
			clip: rect(0 0 0 0);
		}
		@media (prefers-reduced-motion: reduce) {
			.gluecksrad .ticket {
				transition: none;
			}
		}
		.gluecksrad {
			--ink: #080709;
			--ink-2: #171216;
			--ink-3: #2a1b23;
			--brass: #ee91b2;
			--brass-dim: #9d3f62;
			--cream: #f6e9ef;
			--cream-dim: #c78da4;
			--red: #8f2948;
			--display: 'Oswald', 'Arial Narrow', Impact, sans-serif;
			--r: 12px;
		}
		.gluecksrad {
			background:
				radial-gradient(ellipse at 57% 48%, rgba(77, 24, 45, 0.22), transparent 37%),
				radial-gradient(ellipse at 16% 54%, rgba(255, 255, 255, 0.035), transparent 24%),
				linear-gradient(118deg, #070608 0%, #111013 45%, #050406 100%);
		}
		.gluecksrad::before {
			content: '';
			position: fixed;
			inset: 0;
			z-index: 0;
			pointer-events: none;
			opacity: 0.38;
			background-image:
				repeating-linear-gradient(19deg, rgba(255, 255, 255, 0.018) 0 1px, transparent 1px 5px),
				repeating-linear-gradient(103deg, rgba(0, 0, 0, 0.24) 0 2px, transparent 2px 7px),
				radial-gradient(circle at 25% 18%, rgba(255, 255, 255, 0.07) 0 1px, transparent 1.5px),
				radial-gradient(circle at 72% 63%, rgba(238, 145, 178, 0.08) 0 1px, transparent 1.8px);
			background-size:
				auto,
				auto,
				7px 7px,
				11px 11px;
			mix-blend-mode: screen;
		}
		.gluecksrad::after {
			background: radial-gradient(75% 64% at 54% 44%, transparent 25%, rgba(0, 0, 0, 0.72) 100%);
		}
		.gluecksrad .foam-bg {
			position: fixed;
			inset: 0;
			z-index: 1;
			width: 100%;
			height: 100%;
			pointer-events: none;
			opacity: 0.92;
			mix-blend-mode: normal;
			filter: saturate(0.92) contrast(1.12);
		}
		.gluecksrad .gr-app {
			max-width: 1280px;
			padding: 20px 24px 44px;
			grid-template-columns: 340px minmax(0, 1fr);
			gap: 20px 34px;
		}
		.gluecksrad .masthead {
			display: grid;
			grid-template-columns: 340px minmax(0, 1fr);
			gap: 34px;
			align-items: end;
		}
		.gluecksrad .masthead > div {
			padding-left: 2px;
		}
		.gluecksrad .eyebrow {
			color: var(--brass);
			font-size: 10px;
			letter-spacing: 0.24em;
		}
		.gluecksrad .eyebrow::before {
			width: 24px;
			height: 1px;
			box-shadow: 0 0 8px rgba(238, 145, 178, 0.5);
		}
		.gluecksrad h1 {
			display: inline-block;
			position: relative;
			margin: 0.05em 0 0;
			font-family: var(--display);
			font-style: italic;
			font-weight: 700;
			font-size: clamp(50px, 6vw, 72px);
			letter-spacing: -0.055em;
			line-height: 0.92;
			color: #e982a8;
			text-transform: none;
			transform: skewX(-5deg);
			text-shadow:
				2px 2px 0 #69273e,
				-1px -1px 0 #f1b2c9,
				0 0 20px rgba(238, 145, 178, 0.18);
		}
		.gluecksrad h1::after {
			content: '';
			position: absolute;
			inset: 5% 0 0;
			pointer-events: none;
			opacity: 0.62;
			background:
				radial-gradient(circle at 13% 18%, #090709 0 1.5px, transparent 2px),
				radial-gradient(circle at 67% 38%, #090709 0 1px, transparent 1.6px),
				radial-gradient(circle at 42% 78%, #090709 0 1.3px, transparent 1.9px);
			background-size:
				17px 13px,
				23px 19px,
				29px 17px;
			mix-blend-mode: multiply;
		}
		.gluecksrad .tagline {
			color: #d986a5;
			font-size: 14px;
			line-height: 1.5;
			max-width: 37ch;
			justify-self: end;
			align-self: center;
			margin-right: 52px;
			text-shadow: 0 0 12px rgba(238, 145, 178, 0.14);
		}
		.gluecksrad .panel {
			background: linear-gradient(155deg, rgba(27, 23, 27, 0.95), rgba(10, 9, 11, 0.96));
			border: 1px solid rgba(238, 145, 178, 0.48);
			box-shadow:
				inset 0 0 28px rgba(255, 255, 255, 0.018),
				0 22px 70px rgba(0, 0, 0, 0.55);
			padding: 17px 18px 15px;
		}
		.gluecksrad .panel-head {
			margin-bottom: 13px;
		}
		.gluecksrad .panel-head h2 {
			color: #f0a0bc;
			letter-spacing: 0.08em;
		}
		.gluecksrad .count {
			color: #f09abc;
		}
		.gluecksrad textarea#nameInput {
			background: linear-gradient(180deg, rgba(10, 8, 10, 0.92), rgba(23, 18, 22, 0.9));
			border-color: rgba(238, 145, 178, 0.28);
			color: #f8edf2;
			box-shadow: inset 0 2px 9px rgba(0, 0, 0, 0.5);
		}
		.gluecksrad textarea#nameInput::placeholder {
			color: #8e7882;
		}
		.gluecksrad .btn-add {
			background: linear-gradient(180deg, #f2a7c1, #dd7399);
			color: #24121a;
			box-shadow:
				inset 0 -2px 0 rgba(91, 28, 51, 0.4),
				0 0 15px rgba(238, 145, 178, 0.13);
		}
		.gluecksrad .btn-add:hover {
			background: linear-gradient(180deg, #f7bcd1, #eb8daf);
		}
		.gluecksrad .hint {
			color: #bd7d95;
		}
		.gluecksrad .chip {
			color: #d396ac;
			border-color: rgba(238, 145, 178, 0.27);
			background: rgba(255, 255, 255, 0.012);
		}
		.gluecksrad .chip:hover {
			color: #f8c5d7;
			border-color: #ee91b2;
			background: rgba(238, 145, 178, 0.07);
		}
		.gluecksrad .row {
			border-bottom-color: rgba(238, 145, 178, 0.12);
		}
		.gluecksrad .row:hover {
			background: rgba(238, 145, 178, 0.055);
		}
		.gluecksrad .row.on .box {
			box-shadow: 0 0 10px rgba(238, 145, 178, 0.28);
		}
		.gluecksrad .row .swatch {
			width: 3px;
			box-shadow: 0 0 7px currentColor;
		}
		.gluecksrad .list {
			max-height: min(49vh, 430px);
		}
		.gluecksrad .opt {
			border-top-color: rgba(238, 145, 178, 0.18);
			color: #c988a0;
		}
		.gluecksrad .stage-wrap {
			position: relative;
			isolation: isolate;
		}
		.gluecksrad .stage-wrap::before {
			content: '';
			position: absolute;
			z-index: -1;
			inset: 2% -5% 8% -9%;
			pointer-events: none;
			background:
				radial-gradient(
					circle at 93% 48%,
					transparent 0 7px,
					rgba(236, 91, 151, 0.34) 8px 10px,
					transparent 11px
				),
				radial-gradient(
					circle at 86% 31%,
					rgba(0, 0, 0, 0.94) 0 15px,
					rgba(224, 80, 140, 0.3) 16px 19px,
					transparent 21px
				),
				radial-gradient(
					circle at 76% 68%,
					rgba(0, 0, 0, 0.94) 0 9px,
					rgba(224, 80, 140, 0.28) 10px 12px,
					transparent 14px
				),
				radial-gradient(ellipse at 66% 53%, rgba(174, 45, 94, 0.34), transparent 47%);
			filter: blur(0.2px) drop-shadow(0 0 16px rgba(190, 45, 104, 0.16));
			opacity: 0.85;
		}
		.gluecksrad .stage {
			aspect-ratio: 1/0.69;
			max-height: min(64vh, 620px);
		}
		.gluecksrad .stage canvas {
			filter: drop-shadow(0 34px 24px rgba(0, 0, 0, 0.72))
				drop-shadow(0 0 10px rgba(230, 72, 137, 0.14));
		}
		.gluecksrad .sound {
			border-color: rgba(238, 145, 178, 0.38);
			color: #ed93b4;
			background: rgba(8, 7, 9, 0.55);
			box-shadow: 0 0 18px rgba(238, 145, 178, 0.08);
		}
		.gluecksrad .btn-spin {
			--charge: 0%;
			position: relative;
			overflow: hidden;
			isolation: isolate;
			min-width: 260px;
			padding: 12px 48px;
			border: 1px solid rgba(245, 176, 202, 0.62);
			color: #f5b6cd;
			text-transform: uppercase;
			font-style: italic;
			font-size: 30px;
			background:
				radial-gradient(circle at 20% 30%, rgba(255, 255, 255, 0.18) 0 1px, transparent 1.5px) 0
					0/11px 9px,
				linear-gradient(180deg, #75233f, #3c1726 58%, #211017);
			box-shadow:
				0 6px 0 #15090e,
				inset 0 0 18px rgba(238, 145, 178, 0.22),
				0 0 20px rgba(238, 145, 178, 0.15);
			border-radius: 24px;
		}
		.gluecksrad .btn-spin::before {
			content: '';
			position: absolute;
			z-index: -1;
			left: 4px;
			top: 4px;
			bottom: 4px;
			width: var(--charge);
			max-width: calc(100% - 8px);
			min-width: 0;
			border-radius: 19px;
			background: linear-gradient(90deg, rgba(238, 117, 170, 0.1), rgba(255, 161, 202, 0.5));
			box-shadow: 0 0 22px rgba(239, 78, 148, 0.42);
			transition: width 0.045s linear;
		}
		.gluecksrad .btn-spin.charging {
			transform: translateY(2px) scale(0.99);
			border-color: #f6a7c5;
			box-shadow:
				0 4px 0 #15090e,
				inset 0 0 24px rgba(238, 145, 178, 0.34),
				0 0 28px rgba(238, 82, 151, 0.27);
		}
		.gluecksrad .btn-spin:hover {
			filter: brightness(1.18);
		}
		.gluecksrad .btn-spin:active {
			box-shadow:
				0 2px 0 #15090e,
				inset 0 0 18px rgba(238, 145, 178, 0.28);
		}
		.gluecksrad .ticket {
			background: #151115;
			color: #f5e7ed;
			border: 1px solid rgba(238, 145, 178, 0.55);
			background-image: repeating-linear-gradient(
				25deg,
				rgba(255, 255, 255, 0.018) 0 1px,
				transparent 1px 5px
			);
		}
		.gluecksrad .ticket::before,
		.gluecksrad .ticket::after {
			background: radial-gradient(circle at center, #080709 45%, transparent 46%) 0 0/12px 16px
				repeat-y;
		}
		.gluecksrad .ticket .who {
			color: #f3a4c0;
			text-transform: uppercase;
			font-style: italic;
		}
		.gluecksrad .ticket .sub {
			color: #c78da4;
		}
		.gluecksrad .t-primary {
			background: #d86f96;
			color: #24121a;
		}
		.gluecksrad .t-primary:hover {
			background: #ee91b2;
		}
		.gluecksrad .t-ghost {
			color: #e6a6bd;
			border-color: rgba(238, 145, 178, 0.32);
		}
		@media (max-width: 880px) {
			.gluecksrad .gr-app {
				grid-template-columns: 1fr;
				padding: 16px 14px 32px;
			}
			.gluecksrad .masthead {
				grid-template-columns: 1fr;
				gap: 10px;
			}
			.gluecksrad .tagline {
				justify-self: start;
				margin-right: 0;
			}
			.gluecksrad .stage {
				aspect-ratio: 1/0.8;
				max-height: 52vh;
			}
		}
	}
</style>
