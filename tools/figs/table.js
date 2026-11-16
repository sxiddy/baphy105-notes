// node tools/figs/table.js figs-svg [id ...]
// Writes the slide text tables as phone-size SVG "stacked tables": each slide row becomes a block with a
// bold heading, then one line per column (column name in its accent colour, then the value). Long values wrap
// by hand: give an array of lines. Specs live in tools/figs/tables/*.js (module.exports = {id, cols, rows}).
const fs = require('fs'), path = require('path');
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function render(spec) {
  const W = 600, lh = 30, labelX = 14, valX = spec.valX || 160;
  let y = 0, out = [];
  if (spec.title) {
    y += 34;
    out.push(`<text x="300" y="${y}" text-anchor="middle" font-size="28" font-weight="700" class="dt">${esc(spec.title)}</text>`);
    y += 14;
  }
  spec.rows.forEach((row, ri) => {
    if (ri > 0 || spec.title) { y += 12; out.push(`<path d="M0 ${y}H${W}" class="ds3" stroke-width="2"/>`); }
    if (row.head) {
      y += 36;
      out.push(`<text x="${labelX}" y="${y}" font-size="26" font-weight="700" class="dt">${esc(row.head)}</text>`);
    }
    row.cells.forEach((cell, ci) => {
      const col = spec.cols[ci], lines = Array.isArray(cell) ? cell : [cell];
      y += (ci === 0 && !row.head ? 34 : lh + 4);
      out.push(`<text x="${labelX}" y="${y}" font-size="22" font-weight="700" class="${col.cls}">${esc(col.name)}</text>`);
      lines.forEach((ln, li) => {
        if (li) y += lh;
        out.push(`<text x="${valX}" y="${y}" font-size="22" class="${row.valCls || 'dt2'}${row.mono ? ' mono' : ''}">${esc(ln)}</text>`);
      });
    });
  });
  y += 14;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 ${y}">\n  ${out.join('\n  ')}\n</svg>\n`;
}

if (require.main === module) {
  const outDir = process.argv[2] || 'figs-svg', want = process.argv.slice(3);
  const dir = path.join(__dirname, 'tables');
  for (const f of fs.readdirSync(dir).filter((f) => f.endsWith('.js'))) {
    const spec = require(path.join(dir, f));
    if (want.length && !want.includes(spec.id)) continue;
    fs.writeFileSync(path.join(outDir, spec.id + '.svg'), render(spec));
    console.log('wrote', spec.id);
  }
}
module.exports = { render };
