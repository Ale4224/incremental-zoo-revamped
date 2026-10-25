// Tiny DOM helpers.

// h('button', { class: 'btn', onClick: fn, text: 'Go' }, child1, child2)
export function h(tag, props = {}, ...children) {
  const el = document.createElement(tag);
  for (const [key, value] of Object.entries(props)) {
    if (value == null || value === false) continue;
    if (key === 'class') el.className = value;
    else if (key === 'text') el.textContent = value;
    else if (key === 'value') el.value = value;
    else if (key === 'html') el.innerHTML = value;
    else if (key === 'style' && typeof value === 'object') Object.assign(el.style, value);
    else if (key === 'dataset') Object.assign(el.dataset, value);
    else if (key.startsWith('on') && typeof value === 'function') {
      el.addEventListener(key.slice(2).toLowerCase(), value);
    } else if (key in el && typeof value !== 'string') el[key] = value;
    else el.setAttribute(key, value === true ? '' : value);
  }
  append(el, children);
  return el;
}

function append(el, children) {
  for (const child of children.flat(Infinity)) {
    if (child == null || child === false) continue;
    el.append(child instanceof Node ? child : document.createTextNode(String(child)));
  }
}

// Only touch the DOM when the value actually changes.
export function setText(el, value) {
  const v = String(value);
  if (el.textContent !== v) el.textContent = v;
}

export function setStyle(el, prop, value) {
  if (el.style.getPropertyValue(prop) !== value) el.style.setProperty(prop, value);
}

export function toggle(el, cls, on) {
  if (el.classList.contains(cls) !== Boolean(on)) el.classList.toggle(cls, Boolean(on));
}

export function setDisabled(el, disabled, reason = '') {
  toggle(el, 'is-disabled', disabled);
  const v = disabled ? 'true' : 'false';
  if (el.getAttribute('aria-disabled') !== v) el.setAttribute('aria-disabled', v);
  if (reason !== undefined && el.dataset.tip !== reason) {
    if (reason) el.dataset.tip = reason;
    else delete el.dataset.tip;
  }
}

// Restart a CSS animation class.
export function flash(el, cls, ms = 700) {
  el.classList.remove(cls);
  void el.offsetWidth;
  el.classList.add(cls);
  clearTimeout(el[`_${cls}`]);
  el[`_${cls}`] = setTimeout(() => el.classList.remove(cls), ms);
}
