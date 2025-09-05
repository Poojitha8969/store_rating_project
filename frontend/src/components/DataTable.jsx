// frontend/src/components/DataTable.jsx
import React, { useState } from 'react';

export default function DataTable({ columns, rows, onSort }) {
  const [sort, setSort] = useState({ by: '', order: 'asc' });

  const headerClick = (key) => {
    const order = sort.by === key && sort.order === 'asc' ? 'desc' : 'asc';
    setSort({ by: key, order });
    onSort?.(key, order);
  };

  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="text-left">
          {columns.map((c) => (
            <th key={c.key} className="py-2 cursor-pointer" onClick={() => headerClick(c.key)}>
              {c.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r.id} className="border-t">
            {columns.map((c) => (
              <td key={c.key} className="py-2 pr-4">{c.render ? c.render(r) : r[c.key]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}