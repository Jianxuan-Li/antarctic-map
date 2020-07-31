from django.db import connection


def dictfetchall(cursor):
    "Return all rows from a cursor as a dict"
    columns = [col[0] for col in cursor.description]
    return [
        dict(zip(columns, row))
        for row in cursor.fetchall()
    ]


def get_random_point():
    sql = '''
        SELECT
            gid, lon, lat, name,
            ST_X(geom), ST_Y(geom),
            ST_AsText(ST_Transform(geom, 4326)), geom
        FROM public.historic_sites
        OFFSET floor(random()*(select count(gid) from historic_sites))
        LIMIT 1
        '''
    with connection.cursor() as cursor:
        cursor.execute(sql)
        rows = dictfetchall(cursor)
    return rows
