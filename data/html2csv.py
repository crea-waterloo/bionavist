import re

def main():
    print('Converting HTML to CSV...')

    regexp = re.compile(
        r"<p>MATCH: "
        r"(?P<triple>[-<>/\"a-zA-Z\d\. ]+)"
        r" <a href=\'"
        r"(?P<href>[:/a-zA-Z%\"\d\.]+)"
        r"\'>link</a></p>"
    )

    bolded_re1 = re.compile(
        r"<b>\""
        r"(?P<subject>[-a-zA-Z\d\. ]+)"
        r"\"</b> "
        r"\"(?P<predicate>[-a-zA-Z\d]+)\" "
        r"\"(?P<object>[-a-zA-Z\d\. ]+)\""
    )

    bolded_re2 = re.compile(
        r"\"(?P<subject>[-a-zA-Z\d\. ]+)\" "
        r"\"(?P<predicate>[-a-zA-Z\d]+)\" "
        r"<b>\"(?P<object>[-a-zA-Z\d\. ]+)\"</b>"
    )

    not_found_count = 0
    with open('relations.csv', 'w') as o:
        with open('filterx.html') as f:
            for l in f:
                result = regexp.search(l)
                if result is None:
                    print('Pattern not found:')
                    print(l)
                    not_found_count += 1
                else:
                    subject = predicate = obj = keyword = ''
                    triple = result.group('triple')
                    matched = bolded_re1.search(triple)
                    if matched is None:
                        matched = bolded_re2.search(triple)
                        keyword = 2
                    else:
                        keyword = 0
                    subject = matched.group('subject')
                    predicate = matched.group('predicate')
                    obj = matched.group('object')
                    href = result.group('href')
                    o.write(';'.join([subject, predicate, obj, str(keyword), href]) + '\n')
                    # o.write('INSERT INTO filtered_relations VALUES ({}, {}, {}, {}, {});\n'.format(subject, predicate, obj, keyword, href))

    print('Not found: {}'.format(not_found_count))

if __name__ == '__main__':
    main()