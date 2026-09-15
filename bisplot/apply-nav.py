#!/usr/bin/env python3
"""Stamp the nav.js <script> tag into every sheet in this folder.

The `.dc.html` artboards are generated output — a canvas re-export replaces them
wholesale and strips the tag. Re-run this after every export:

    python3 apply-nav.py

Idempotent: a sheet that already loads nav.js is left alone. nav.js itself and
index.html are hand-written and survive an export; they are included here only so
one command covers the whole set.
"""

import io
import os
import sys

TAG = '<script src="nav.js" defer></script>'

SHEETS = [
    'index.html',
    '1_Brand_Whole_System.dc.html',
    '2_Brand_Bisplot.dc.html',
    '3_Brand_SmartAI.dc.html',
    '4_Brand_BusinessAI.dc.html',
    '5_Brand_HouseOfVibes.dc.html',
    '5b_Brand_HouseOfVibes_Samaritan.dc.html',
    '6_Mascotte.dc.html',
    '7_Business_Model.html',
    '8_Funnels.html',
]


def stamp(path):
    """Insert TAG immediately before </body>. Returns a one-word status."""
    if not os.path.exists(path):
        return 'missing'

    with io.open(path, encoding='utf-8') as fh:
        src = fh.read()

    if 'nav.js' in src:
        return 'already'

    marker = '</body>'
    idx = src.rfind(marker)
    if idx == -1:
        return 'no-body'

    # match the indentation of the line </body> sits on
    line_start = src.rfind('\n', 0, idx) + 1
    indent = src[line_start:idx]
    if indent.strip():
        indent = ''

    with io.open(path, 'w', encoding='utf-8') as fh:
        fh.write(src[:idx] + indent + TAG + '\n' + src[idx:])
    return 'stamped'


def main():
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    counts = {}
    for name in SHEETS:
        status = stamp(name)
        counts[status] = counts.get(status, 0) + 1
        print('%-44s %s' % (name, status))

    print('\n' + ', '.join('%d %s' % (v, k) for k, v in sorted(counts.items())))
    if counts.get('missing') or counts.get('no-body'):
        sys.exit(1)


if __name__ == '__main__':
    main()
