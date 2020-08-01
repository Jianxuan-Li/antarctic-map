import os
import json


def write_to_file(geojson_obj, cutline_file):
    # Write a geo json object to a file
    try:
        os.remove(cutline_file)
    except FileNotFoundError:
        pass

    with open(cutline_file, 'w') as f:
        content = json.dumps(geojson_obj, indent=4)
        f.write(content)
