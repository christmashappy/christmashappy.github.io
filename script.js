// script.js

// 1) Toggle the "open" state on .present (flips the box lid)
const present = document.querySelector('.present');
present.addEventListener('click', () => {
  present.classList.toggle('open');
});

// 2) Flip the card front by adding/removing .flipped
const flipBtn = document.querySelector('.flip-btn');
const cardFront = document.querySelector('.card-front');

flipBtn.addEventListener('click', (e) => {
  e.stopPropagation(); // Don’t bubble up to .present
  cardFront.classList.toggle('flipped');
});

// 3) Simple snow animation (IIFE)
(function () {
  'use strict';

  const canvas = document.querySelector('canvas');
  const ctx = canvas.getContext('2d');

  let width, height, lastNow;
  let snowflakes = [];
  let maxSnowflakes = 100;

  function init() {
    resize();
    render((lastNow = performance.now()));
  }

  function render(now) {
    requestAnimationFrame(render);

    const elapsed = now - lastNow;
    lastNow = now;

    ctx.clearRect(0, 0, width, height);

    // Create new snowflakes until we reach max
    if (snowflakes.length < maxSnowflakes) {
      snowflakes.push(new Snowflake());
    }

    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    snowflakes.forEach((s) => s.update(elapsed));
  }

  class Snowflake {
    constructor() {
      this.spawn(true);
    }

    spawn(anyY = false) {
      this.x = rand(0, width);
      this.y = anyY ? rand(-50, height + 50) : rand(-50, -10);
      this.xVel = rand(-0.05, 0.05);
      this.yVel = rand(0.02, 0.1);
      this.size = rand(7, 12);
    }

    update(elapsed) {
      const xForce = rand(-0.001, 0.001);
      if (Math.abs(this.xVel + xForce) < 0.075) {
        this.xVel += xForce;
      }

      this.x += this.xVel * elapsed;
      this.y += this.yVel * elapsed;

      // Respawn if out of view
      if (
        this.y - this.size > height ||
        this.x + this.size < 0 ||
        this.x - this.size > width
      ) {
        this.spawn();
      }

      this.render();
    }

    render() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size * 0.2, 0, Math.PI * 2, false);
      ctx.fill();
    }
  }

  function rand(min, max) {
    return min + Math.random() * (max - min);
  }

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    maxSnowflakes = Math.max(width / 10, 100);
  }

  window.addEventListener('resize', resize);
  window.addEventListener('load', init);
})();
