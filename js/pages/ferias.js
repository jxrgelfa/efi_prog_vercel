import { renderNavbar } from '../components/navbar.js';
import { renderFooter } from '../components/footer.js';
import { dataService } from '../services/dataService.js';
import { renderFairCard } from '../components/fairCard.js';

document.addEventListener('DOMContentLoaded', () => {
  renderNavbar();
  renderFooter();

  const allFairs = dataService.getFairs();
  const grid = document.getElementById('fairs-list-grid');
  const filterBtns = document.querySelectorAll('.fair-filter-btn');

  function render(filter = 'all') {
    let filtered = allFairs;
    if (filter !== 'all') {
      filtered = allFairs.filter(f => f.status === filter);
    }
    grid.innerHTML = filtered.map(f => renderFairCard(f)).join('');
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => {
        b.className = 'fair-filter-btn px-4 py-2 rounded-xl text-xs font-bold bg-sand/30 dark:bg-slate-800 text-ink dark:text-white hover:bg-sand/60';
      });
      btn.className = 'fair-filter-btn px-4 py-2 rounded-xl text-xs font-bold bg-accent text-white shadow-xs';
      render(btn.getAttribute('data-filter'));
    });
  });

  render();
});
