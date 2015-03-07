import re
import json

def wrap_in_braces(l):
    s = '{'
    for item in l:
        s += str(item) + ','
    if len(l) > 0:
        s = s[:-1]
    s += '}'
    return s


def main():
    print('Outputing body anatomy tree...')

    flat_tree = {}
    sorted_flat_tree = []
    rows = []

    with open('anatomy_flat.json') as f:
        json_obj = json.load(f)
        flat_tree = json_obj[0]

    for id, node in flat_tree.items():
        if not id:
            id = '0'
        names = [s for s in node['0']]
        children = [int(c) for c in node['2'] if c]
        sorted_flat_tree.append([id, names, children])

    sorted_flat_tree = sorted(sorted_flat_tree, key=lambda tup: int(tup[0]))

    for node in sorted_flat_tree:
        # clean " character in some names
        node[1] = [re.sub('"', '', name) for name in node[1]]

        # wrap each name in SQL wildcard (%)
        keywords = list(map(lambda name: '%' + name + '%', node[1]))
        rows.append((node[0], wrap_in_braces(node[1]), wrap_in_braces(node[2]), wrap_in_braces(keywords)))
        print(keywords)

    with open('anatomy.csv', 'w') as o:
        for r in rows:
            o.write(';'.join(r) + '\n')

if __name__ == '__main__':
    main()