# -*- coding: utf-8 -*-

import boto3
from botocore.client import Config
import os
import psycopg2
from dotenv import load_dotenv
import textract

dbConnStr = ""
BN = ""
s3 = None
if ('PGUSER' in os.environ):
    dbConnStr += "user=" + os.environ['PGUSER']
    dbConnStr += " dbname=" + os.environ['PGDATABASE']
    dbConnStr += " password=" + os.environ['PGPASSWORD']
    dbConnStr += " port=" + os.environ['PGPORT']
    dbConnStr += " host=" + os.environ['PGHOST']
    BN = os.environ['S3_BUCKET']
else:
    load_dotenv('.env')
    dbConnStr += "user=" + os.environ.get('PGUSER')
    dbConnStr += " dbname=" + os.environ.get('PGDATABASE')
    dbConnStr += " password=" + os.environ.get('PGPASSWORD')
    dbConnStr += " port=" + os.environ.get('PGPORT')
    dbConnStr += " host=" + os.environ.get('PGHOST')
    BN = os.environ.get('S3_BUCKET')

LOCALDIR = 'outlines/temp/'
s3 = boto3.client('s3', 'us-east-2', config=Config(signature_version='s3v4'))
conn = psycopg2.connect(dbConnStr)
conn.set_session(autocommit=True)

for i in range(2989, 8891):
    cur = conn.cursor()

    try:
        cur.execute("SELECT * FROM outlinestable WHERE id=%s", [i])
    except psycopg2.Error as e:
        print ["ERROR retrieving entry with id", i]
        print e
        cur.close()
        continue

    id_details = cur.fetchone()
    if (id_details == None):
        cur.close()
        continue

    docname = id_details[1]
    try:
        s3.download_file(BN, docname, LOCALDIR+docname)
        text = textract.process(LOCALDIR+docname)
    except Exception as e:
        print ["ERROR getting text from file", docname]
        print e
        if os.path.exists(LOCALDIR+docname):
            os.remove(LOCALDIR+docname)
        cur.close()
        continue

    try:
        cur.execute("UPDATE outlinestable SET content=%s WHERE id=%s", [text, i])
    except Exception as e:
        print ["ERROR adding text for id", i]
        print e
        os.remove(LOCALDIR+docname)
        cur.close()
        continue

    # clean up
    os.remove(LOCALDIR+docname)
    cur.close()


conn.close()

# sample query
# SELECT id, ts_headline('english', content, plainto_tsquery('english', 'deepwater drilling')) FROM outlinestable WHERE to_tsvector('english', content) @@ plainto_tsquery('english', 'deepwater drilling');
# CREATE INDEX CONCURRENTLY content_idx ON outlinestable USING GIN (to_tsvector('english', content));
