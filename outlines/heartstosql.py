import psycopg2
import os
from dotenv import load_dotenv

dbConnStr = ""
load_dotenv('../.env')
dbConnStr += "user=" + os.environ.get('PGUSER')
dbConnStr += " dbname=" + os.environ.get('PGDATABASE')
dbConnStr += " password=" + os.environ.get('PGPASSWORD')
dbConnStr += " port=" + os.environ.get('PGPORT')
dbConnStr += " host=" + 'toodope.cp34q5gi0b5f.us-east-1.rds.amazonaws.com'

# Connect to an existing database
#conn = psycopg2.connect("dbname=niharikasingh user=niharikasingh")
conn = psycopg2.connect(dbConnStr)
# Open a cursor to perform database operations
cur = conn.cursor()

with open('yr.txt') as hf:
    for line in hf:
        (docId, numHearts) = line.rstrip().split(" ")
        print "UPDATE outlinestable SET year = %s WHERE id = %s AND year IS NULL" %(numHearts, docId)
        try:
            cur.execute("UPDATE outlinestable SET year = %s WHERE id = %s AND year IS NULL", [numHearts, docId])
        except psycopg2.Error as e:
            print "---ERROR---"
            print e

# Close communication with the database
conn.commit()
cur.close()
conn.close()
