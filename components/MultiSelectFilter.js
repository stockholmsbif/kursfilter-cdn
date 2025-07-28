export function MultiSelectFilter({ title, options, selected, onChange }) {
  const e = React.createElement;
  const [open, setOpen] = React.useState(false);

  const toggle = (value) => {
    onChange(selected.includes(value)
      ? selected.filter(v => v !== value)
      : [...selected, value]);
  };

  const clearAll = () => onChange([]);

  return e('div', { className: 'multiselect-filter' },
    e('button', {
      className: 'multiselect-toggle',
      onClick: () => setOpen(!open)
    }, `${title} (${selected.length})`),

    open && e('div', { className: 'multiselect-options' },
      options.map(opt =>
        e('div', {
          key: opt,
          className: 'multiselect-option' + (selected.includes(opt) ? ' selected' : ''),
          onClick: () => toggle(opt),
          style: { backgroundColor: '#fff', color: '#333' }
        }, opt)
      ),
      e('button', {
        className: 'multiselect-clear',
        onClick: clearAll
      }, 'Rensa alla val')
    )
  );
}
