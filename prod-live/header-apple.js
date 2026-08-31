(() => {
  // Hub ressources : servi a la racine de SON domaine, mais ce n'est pas l'accueil
  // du site. Sans ce garde-fou, le script marque "Accueil" comme page active.
  const isResourceHub = /(^|\.)ressources\./.test(window.location.hostname)
    || document.querySelector('.bar-nav .bar-link[aria-current="page"]') !== null;
  const isHome = !isResourceHub && /(?:^|\/)index\.html$|\/$/.test(window.location.pathname);
  document.querySelectorAll('.site-bar__mark[aria-current]').forEach((mark) => mark.removeAttribute('aria-current'));
  document.querySelectorAll('.site-bar .bar-nav').forEach((nav) => {
    if (nav.querySelector('.bar-link[href="/"]')) return;
    const link = document.createElement('a');
    link.className = 'bar-link';
    link.href = '/';
    link.textContent = 'Accueil';
    if (isHome) link.setAttribute('aria-current', 'page');
    nav.insertBefore(link, nav.querySelector('.bar-link'));
  });

  const bar = document.querySelector('.site-bar');
  const menu = document.querySelector('.bar-menu');
  if (bar && menu) {
    const pill = bar.querySelector('.site-bar__pill');
    const syncMenuState = () => {
      const open = menu.classList.contains('is-open');
      bar.classList.toggle('menu-open', open);
      if (pill) pill.style.setProperty('--header-divider-opacity', open ? '0' : '.45');
    };
    new MutationObserver(syncMenuState).observe(menu, { attributes: true, attributeFilter: ['class'] });
    syncMenuState();
  }
})();
