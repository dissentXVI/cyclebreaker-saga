---
title: The Cyclebreaker Saga
---

<div class="home-hero">
  <p class="home-tagline">A world built on a titan's bones, a war older than memory, new threats being summoned forth, an empire growing, and four strangers standing between what is and what will be.</p>
</div>

<div class="home-story-link">
  <a href="Chronicles/The Story So Far...." class="story-button">
    <span class="story-icon">⟡</span>
    <span class="story-text">
      <strong>The Story So Far...</strong>
      <em>Begin at the beginning. Six arcs of war, loss, and unlikely hope.</em>
    </span>
    <span class="story-arrow">→</span>
  </a>
</div>

---

## Explore the Wiki

<div class="section-grid">

  <a href="Characters/_Player Characters" class="section-card">
    <div class="card-icon">⚔</div>
    <div class="card-body">
      <strong>The Party</strong>
      <span>Ariesa. Frog. Gothmog. Laena. The four Chosen of Aspiria.</span>
    </div>
  </a>

  <a href="Characters" class="section-card">
    <div class="card-icon">👁</div>
    <div class="card-body">
      <strong>Characters</strong>
      <span>Allies, adversaries, merchants, monarchs, and monsters.</span>
    </div>
  </a>

  <a href="Locations" class="section-card">
    <div class="card-icon">🗺</div>
    <div class="card-body">
      <strong>Locations</strong>
      <span>City-states, forgotten ruins, cursed bogs, and alpine keeps.</span>
    </div>
  </a>

  <a href="Chronicles" class="section-card">
    <div class="card-icon">📜</div>
    <div class="card-body">
      <strong>Chronicles</strong>
      <span>Session notes, interludes, lore drops, and echoes from the past.</span>
    </div>
  </a>

  <a href="Organizations" class="section-card">
    <div class="card-icon">⚜</div>
    <div class="card-body">
      <strong>Organizations</strong>
      <span>Guilds, knightly orders, cults, criminal syndicates, and courts.</span>
    </div>
  </a>

  <a href="World Encyclopedia" class="section-card">
    <div class="card-icon">✦</div>
    <div class="card-body">
      <strong>World Encyclopedia</strong>
      <span>Deities, paragons, magic, history, materials, and cosmology.</span>
    </div>
  </a>

  <a href="Maps" class="section-card">
    <div class="card-icon">◈</div>
    <div class="card-body">
      <strong>Maps</strong>
      <span>Interactive maps of Halinor, Eldamar, and beyond.</span>
    </div>
  </a>

</div>

<style>
/* ── Hero ─────────────────────────────────────────────── */
.home-hero {
  padding: 2.5rem 0 1.5rem;
  border-bottom: 1px solid var(--lightgray);
}
.home-tagline {
  font-size: 1.15rem;
  line-height: 1.7;
  color: var(--gray);
  font-style: italic;
  max-width: 680px;
  margin: 0;
}

/* ── Story So Far Button ─────────────────────────────── */
.home-story-link {
  margin: 1.75rem 0;
}
.story-button {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.4rem;
  border: 2px solid var(--secondary);
  border-radius: 4px;
  text-decoration: none !important;
  background: color-mix(in srgb, var(--secondary) 8%, transparent);
  transition: background 0.2s, border-color 0.2s;
  max-width: 560px;
}
.story-button:hover {
  background: color-mix(in srgb, var(--secondary) 16%, transparent);
  border-color: var(--tertiary);
}
.story-icon {
  font-size: 1.6rem;
  color: var(--secondary);
  flex-shrink: 0;
}
.story-text {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}
.story-text strong {
  font-size: 1rem;
  color: var(--dark);
}
.story-text em {
  font-size: 0.82rem;
  color: var(--gray);
  font-style: normal;
}
.story-arrow {
  margin-left: auto;
  font-size: 1.2rem;
  color: var(--secondary);
  flex-shrink: 0;
}

/* ── Section Grid ────────────────────────────────────── */
.section-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 0.85rem;
  margin: 1.5rem 0 2rem;
}
.section-card {
  display: flex;
  align-items: flex-start;
  gap: 0.85rem;
  padding: 1rem 1.1rem;
  border: 1px solid var(--lightgray);
  border-radius: 4px;
  text-decoration: none !important;
  transition: border-color 0.2s, transform 0.15s, box-shadow 0.2s;
  background: var(--light);
}
.section-card:hover {
  border-color: var(--secondary);
  transform: translateY(-2px);
  box-shadow: 0 4px 16px color-mix(in srgb, var(--darkgray) 12%, transparent);
}
.card-icon {
  font-size: 1.4rem;
  flex-shrink: 0;
  margin-top: 0.1rem;
}
.card-body {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}
.card-body strong {
  font-size: 0.9rem;
  color: var(--dark);
}
.card-body span {
  font-size: 0.78rem;
  color: var(--gray);
  line-height: 1.4;
}
</style>
