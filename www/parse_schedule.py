# -*- coding: utf-8 -*-

f = map(lambda x: x.strip("\n"), open("schedule.txt", "r").readlines())


result = []
row = {}
for i in f:
    if not i.startswith("*"):
        if row:
            result.append(row)
        if i.startswith("預備週"):
            row = {"week": i, "events": []}
        else:
            row = {"week": "第%s週" % (i), "events": []}

    else:
        row["events"].append(i.strip("*"))

print(result)