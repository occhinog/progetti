#!/usr/bin/env python3
"""Turn a raw canvas export into the published set.

The canvas exports artboards under its own numbering and without the navigation.
This script applies both transforms, in order:

  1. Renumber — the published reading order is Structure, Business model, Funnels,
     then the brand sheets. The canvas knows nothing about that order, so every
     export arrives with the old numbers and has to be remapped.
  2. Stamp nav.js into every sheet.

Run it after every export:

    python3 post-export.py

Idempotent: files already at their published name are left alone, and a sheet that
already loads nav.js is skipped.
"""

import io
import os
import sys

TAG = '<script src="nav.js" defer></script>'

# canvas export name -> published name
RENAMES = {
    '2_Brand_Bisplot.dc.html': '4_Brand_Bisplot.dc.html',
    '3_Brand_SmartAI.dc.html': '5_Brand_SmartAI.dc.html',
    '4_Brand_BusinessAI.dc.html': '6_Brand_BusinessAI.dc.html',
    '5_Brand_HouseOfVibes.dc.html': '7_Brand_HouseOfVibes.dc.html',
    '5b_Brand_HouseOfVibes_Samaritan.dc.html': '7b_Brand_HouseOfVibes_Samaritan.dc.html',
    '6_Mascotte.dc.html': '8_Mascotte.dc.html',
}

# published reading order — must match the SHEETS array in nav.js
SHEETS = [
    'index.html',
    '1_Brand_Whole_System.dc.html',
    '2_Business_Model.html',
    '3_Funnels.html',
    '4_Brand_Bisplot.dc.html',
    '5_Brand_SmartAI.dc.html',
    '6_Brand_BusinessAI.dc.html',
    '7_Brand_HouseOfVibes.dc.html',
    '7b_Brand_HouseOfVibes_Samaritan.dc.html',
    '8_Mascotte.dc.html',
]


def renumber():
    """Apply RENAMES via temp names, so 2->4 cannot clobber an existing 4."""
    pending = [(src, dst) for src, dst in RENAMES.items() if os.path.exists(src)]
    if not pending:
        print('renumber: nothing to do — already at published names')
        return
    for src, _ in pending:
        os.rename(src, 'tmp__' + src)
    for src, dst in pending:
        os.rename('tmp__' + src, dst)
        print('renumber: %-44s -> %s' % (src, dst))


def stamp(path):
    if not os.path.exists(path):
        return 'missing'
    with io.open(path, encoding='utf-8') as fh:
        src = fh.read()
    if 'nav.js' in src:
        return 'already'
    idx = src.rfind('</body>')
    if idx == -1:
        return 'no-body'
    line_start = src.rfind('\n', 0, idx) + 1
    indent = src[line_start:idx]
    if indent.strip():
        indent = ''
    with io.open(path, 'w', encoding='utf-8') as fh:
        fh.write(src[:idx] + indent + TAG + '\n' + src[idx:])
    return 'stamped'


def main():
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    renumber()
    print()
    counts = {}
    for name in SHEETS:
        status = stamp(name)
        counts[status] = counts.get(status, 0) + 1
        print('nav: %-44s %s' % (name, status))
    print('\n' + ', '.join('%d %s' % (v, k) for k, v in sorted(counts.items())))
    if counts.get('missing') or counts.get('no-body'):
        sys.exit(1)


if __name__ == '__main__':
    main()
