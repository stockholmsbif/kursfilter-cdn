// MultiSelectFilter.js
export function MultiSelectFilter({
  title,
  options,
  selected,
  onChange,
  disabled = false,
  searchable = false,
  placeholder = 'Sök...'
}) {
  const e = React.createElement;
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState('');
  const panelId = React.useMemo(() => `msf-${Math.random().toString(36).slice(2)}`, []);

  const rootRef = React.useRef(null);

  // Stäng vid klick utanför
  React.useEffect(() => {
    if (!open) return;
    const onDocClick = (ev) => {
      if (!rootRef.current?.contains(ev.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [open]);

  // Stäng på Escape
  React.useEffect(() => {
    if (!open) return;
    const onKey = (ev) => {
      if (ev.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  const toggle = (value) => {
    if (disabled) return;
    onChange(
      selected.includes(value)
        ? selected.filter((v) => v !== value)
        : [...selected, value]
    );
  };

  const clearAll = () => {
    if (disabled) return;
    onChange([]);
  };

  const filteredOptions = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter((opt) => String(opt).toLowerCase().includes(q));
  }, [options, query]);

    return e('div', { className: 'multiselect-filter', ref: rootRef },
  e('button', {
    className: 'multiselect-toggle',
    type: 'button',
    onClick: () => !disabled && setOpen((v) => !v),
    'aria-expanded': open ? 'true' : 'false',
    'aria-controls': panelId,
    disabled
  }, `${title} (${selected.length})`),

  open && e('div', { className: 'multiselect-options', id: panelId, role: 'listbox' },
    searchable &&
      e('input', {
        type: 'text',
        className: 'multiselect-search',
        placeholder,
        value: query,
        onChange: (ev) => setQuery(ev.target.value)
      }),

    // sprid varje option som eget child (inte en array som child)
    ...filteredOptions.map((opt) =>
      e('div', {
        key: opt,
        role: 'option',
        'aria-selected': selected.includes(opt) ? 'true' : 'false',
        className: 'multiselect-option' + (selected.includes(opt) ? ' selected' : ''),
        onClick: () => toggle(opt)
      }, String(opt))
    ),

    e('div', { className: 'multiselect-actions' },
      e('button', {
        className: 'multiselect-clear',
        type: 'button',
        onClick: clearAll,
        disabled: disabled || selected.length === 0
      }, 'Rensa alla val')
    )
  )
);


}
