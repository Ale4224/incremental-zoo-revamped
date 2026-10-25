// Toast notifications and modal dialogs (replace alert() / confirm()).
import { h } from './dom.js';
import { icon } from './icons.js';

const TOAST_ICONS = {
  success: 'check',
  error: 'alert',
  warning: 'gavel',
  info: 'info',
  badge: 'trophy',
  species: 'sparkles',
  offer: 'swap',
};

let toastRoot;
const MAX_TOASTS = 5;

function root() {
  if (!toastRoot) {
    toastRoot = h('div', { class: 'toasts', 'aria-live': 'polite', 'aria-atomic': 'false' });
    document.body.append(toastRoot);
  }
  return toastRoot;
}

/**
 * toast({ kind, title, message, image, quote, duration })
 * Identical messages are merged instead of stacking.
 */
export function toast({ kind = 'info', title, message = '', image, quote, duration } = {}) {
  const container = root();
  const key = `${kind}|${title}|${message}`;
  const existing = [...container.children].find((t) => t.dataset.key === key);
  if (existing) {
    existing.classList.remove('nudge');
    void existing.offsetWidth;
    existing.classList.add('nudge');
    existing._restart?.();
    return existing;
  }

  const visual = image
    ? h('img', { class: 'toast-image', src: image, alt: '' })
    : h('span', { class: 'toast-icon' }, icon(TOAST_ICONS[kind] || 'info'));

  const close = h('button', { class: 'toast-close', type: 'button', 'aria-label': 'Dismiss' }, icon('x'));
  const el = h('div', { class: `toast toast-${kind}`, role: kind === 'error' ? 'alert' : 'status', dataset: { key } },
    visual,
    h('div', { class: 'toast-body' },
      title && h('div', { class: 'toast-title', text: title }),
      message && h('div', { class: 'toast-message', text: message }),
      quote && h('div', { class: 'toast-quote', text: quote }),
    ),
    close,
    h('div', { class: 'toast-timer' }),
  );

  const ms = duration ?? (kind === 'error' ? 3500 : kind === 'species' ? 9000 : 4500);
  let timer;
  const dismiss = () => {
    clearTimeout(timer);
    el.classList.add('leaving');
    el.addEventListener('animationend', () => el.remove(), { once: true });
    setTimeout(() => el.remove(), 400);
  };
  el._restart = () => {
    clearTimeout(timer);
    el.style.setProperty('--toast-ms', `${ms}ms`);
    const bar = el.querySelector('.toast-timer');
    bar.style.animation = 'none';
    void bar.offsetWidth;
    bar.style.animation = '';
    timer = setTimeout(dismiss, ms);
  };
  el.addEventListener('mouseenter', () => { clearTimeout(timer); el.classList.add('paused'); });
  el.addEventListener('mouseleave', () => { el.classList.remove('paused'); el._restart(); });
  close.addEventListener('click', dismiss);

  container.prepend(el);
  while (container.children.length > MAX_TOASTS) container.lastElementChild.remove();
  el._restart();
  return el;
}

/**
 * openModal({ title, subtitle, icon, tone, body, actions, dismissible, size, onClose })
 * actions: [{ label, kind: 'primary'|'danger'|'ghost', icon, onClick, disabled }]
 * An action's onClick may return false to keep the modal open.
 */
export function openModal({
  title, subtitle, icon: iconName, tone = 'default', body, actions = [],
  dismissible = true, size = 'md', onClose,
} = {}) {
  const dialog = h('dialog', { class: `modal modal-${size} tone-${tone}` });
  let closed = false;

  const close = (value) => {
    if (closed) return;
    closed = true;
    dialog.classList.add('closing');
    const finish = () => { dialog.close(); dialog.remove(); onClose?.(value); };
    dialog.addEventListener('animationend', finish, { once: true });
    setTimeout(finish, 250);
  };

  const buttons = actions.map((a) => {
    const btn = h('button', {
      class: `btn btn-${a.kind || 'ghost'}`,
      type: 'button',
      disabled: a.disabled || undefined,
      onClick: async () => {
        const result = await a.onClick?.(btn);
        if (result !== false) close(a.value ?? a.label);
      },
    }, a.icon && icon(a.icon), a.label);
    if (a.autofocus) btn.autofocus = true;
    return btn;
  });

  dialog.append(
    h('header', { class: 'modal-header' },
      iconName && h('span', { class: 'modal-icon' }, icon(iconName)),
      h('div', { class: 'modal-titles' },
        h('h2', { class: 'modal-title', text: title }),
        subtitle && h('p', { class: 'modal-subtitle', text: subtitle }),
      ),
      dismissible && h('button', {
        class: 'icon-btn modal-x', type: 'button', 'aria-label': 'Close', onClick: () => close(null),
      }, icon('x')),
    ),
    h('div', { class: 'modal-body' }, typeof body === 'string' ? h('p', { text: body }) : body),
    buttons.length ? h('footer', { class: 'modal-actions' }, buttons) : null,
  );

  dialog.addEventListener('cancel', (e) => {
    e.preventDefault();
    if (dismissible) close(null);
  });
  dialog.addEventListener('click', (e) => {
    if (dismissible && e.target === dialog) close(null);
  });

  document.body.append(dialog);
  dialog.showModal();
  return { close, el: dialog, buttons };
}

export function confirmDialog({ title, message, confirmLabel = 'Confirm', cancelLabel = 'Cancel', tone = 'default', icon: iconName = 'help', body } = {}) {
  return new Promise((resolve) => {
    let answer = false;
    openModal({
      title,
      icon: iconName,
      tone,
      body: body || message,
      actions: [
        { label: cancelLabel, kind: 'ghost' },
        { label: confirmLabel, kind: tone === 'danger' ? 'danger' : 'primary', autofocus: true, onClick: () => { answer = true; } },
      ],
      onClose: () => resolve(answer),
    });
  });
}
