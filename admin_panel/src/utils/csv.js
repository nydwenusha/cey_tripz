// Quote every cell and neutralize spreadsheet formulas in untrusted text.
export const csvCell = (value) => {
  let text = String(value ?? '');
  if (typeof value !== 'number' && /^[\s\uFEFF]*[=+@-]/u.test(text)) text = `'${text}`;
  return `"${text.replaceAll('"', '""')}"`;
};

export const createCsv = (headers, rows) =>
  '\uFEFF' + [headers, ...rows].map((row) => row.map(csvCell).join(',')).join('\r\n');

export const downloadCsv = (filename, headers, rows) => {
  const url = URL.createObjectURL(new Blob([createCsv(headers, rows)], { type: 'text/csv;charset=utf-8;' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
};

// Fetch bounded pages sequentially, retaining the same filters for the whole export.
export const collectPages = async (fetchPage, key) => {
  const first = await fetchPage(1);
  const rows = [...(first.data[key] || [])];
  const lastPage = Number(first.data.pagination?.last_page || 1);
  for (let page = 2; page <= lastPage; page += 1) {
    const response = await fetchPage(page);
    rows.push(...(response.data[key] || []));
  }
  return rows;
};
