// frontend/src/components/filters/base-filters/ChecklistExpandedListFilter.tsx
import React, { useState, useRef, useEffect } from 'react';
import useOutsideAlerter from '../../../hooks/useOutsideAlerter';
import FilterButton from './FilterButton';
import ApplyButton from '../buttons/ApplyButton';
import ClearButton from '../buttons/ClearButton';
import '../styles/checklistExpandedListFilter.css';

export type GroupOptions = {
  label: string;
  options: string[];
};

type ChecklistExpandedListFilterProps = {
  label: string;
  iconSrc: string;
  selectedIconSrc: string;
  iconAlt: string;
  groups: GroupOptions[];
  onChange: (selected: string[]) => void;
  initialSelected: string[];
};

const ChecklistExpandedListFilter: React.FC<
  ChecklistExpandedListFilterProps
> = ({
  label,
  iconSrc,
  selectedIconSrc,
  iconAlt,
  groups,
  onChange,
  initialSelected,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(
    () => Object.fromEntries(groups.map((g) => [g.label, false]))
  );
  const [selected, setSelected] = useState<Set<string>>(
    new Set(initialSelected)
  );
  const [applied, setApplied] = useState<Set<string>>(new Set(initialSelected));
  const wrapperRef = useRef<HTMLDivElement>(null);

  // One big ref object instead of many useRefs in a loop
  const parentCheckboxRefs = useRef<Record<string, HTMLInputElement | null>>(
    {}
  );

  useOutsideAlerter(wrapperRef, () => setIsOpen(false));

  // After every render, update checked + indeterminate on each parent checkbox
  useEffect(() => {
    groups.forEach((group) => {
      const ref = parentCheckboxRefs.current[group.label];
      if (!ref) return;

      const total = group.options.length;
      const picked = group.options.filter((o) => selected.has(o)).length;

      ref.checked = picked === total;
      ref.indeterminate = picked > 0 && picked < total;
    });
  }, [selected, groups]);

  const toggleGroup = (label: string) => {
    setExpandedGroups((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  const onChildToggle = (opt: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(opt)) {
        next.delete(opt);
      } else {
        next.add(opt);
      }

      return next;
    });
  };

  const onParentToggle = (group: GroupOptions) => {
    setSelected((prev) => {
      const next = new Set(prev);
      const allInGroup = group.options.every((o) => next.has(o));
      group.options.forEach((o) => {
        if (allInGroup) {
          next.delete(o);
        } else {
          next.add(o);
        }
      });
      return next;
    });
  };

  const apply = () => {
    setApplied(new Set(selected));
    onChange(Array.from(selected));
    setIsOpen(false);
  };
  const clearAll = () => {
    setSelected(new Set());
    setApplied(new Set());
    onChange([]);
    setIsOpen(false);
  };

  const isActive = applied.size > 0;

  return (
    <div className="filter checklist-expanded-filter" ref={wrapperRef}>
      <FilterButton
        onClick={() => setIsOpen((o) => !o)}
        variant={isActive ? 'selected' : 'primary'}
        iconSrc={isActive ? selectedIconSrc : iconSrc}
        iconAlt={iconAlt}
        label={label}
      />
      {isOpen && (
        <div className="checklist-expanded-popup">
          <p className="title">{label}</p>
          <div className="groups">
            {groups.map((group) => (
              <div className="group" key={group.label}>
                <div className="group-header">
                  <input
                    type="checkbox"
                    // assign into our central ref object
                    ref={(el) => {
                      parentCheckboxRefs.current[group.label] = el;
                    }}
                    onChange={() => onParentToggle(group)}
                  />
                  <span className="group-label">{group.label}</span>
                  <button
                    type="button"
                    className="toggle-btn"
                    onClick={() => toggleGroup(group.label)}
                  >
                    {expandedGroups[group.label] ? '▾' : '▸'}
                  </button>
                </div>
                {expandedGroups[group.label] && (
                  <div className="group-options">
                    {group.options.map((opt) => (
                      <label key={opt} className="option">
                        <input
                          type="checkbox"
                          checked={selected.has(opt)}
                          onChange={() => onChildToggle(opt)}
                        />
                        {opt}
                      </label>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="buttons">
            <ApplyButton onClick={apply} />
            <ClearButton onClick={clearAll} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ChecklistExpandedListFilter;
