from docx import Document
import random
from pdfrw import PdfReader, PdfWriter, IndirectPdfDict
import os
import json

def cleanDoc(fn):
    newNameArray = fn.split("_")
    randomWord = random.choice(rwl)
    newName = "_".join(newNameArray[:-1]) + "_" + randomWord + ".doc"
    print "Writing: " + newName
    os.rename('temp/'+fn, 'temp/c'+newName)
    return

def cleanDocx(fn):
    document = Document('temp/'+fn)
    core_properties = document.core_properties
    print(core_properties.author)
    print(core_properties.last_modified_by)
    core_properties.author = ""
    core_properties.last_modified_by = ""
    newNameArray = fn.split("_")
    randomWord = random.choice(rwl)
    newName = "_".join(newNameArray[:-1]) + "_" + randomWord + ".docx"
    print "Writing: " + newName
    document.save("temp/c"+newName)
    return

def cleanPdf(fn):
    document = PdfReader('temp/'+fn)
    writer = PdfWriter()
    writer.trailer = document
    writer.trailer.Info.Author = ""
    writer.trailer.Info.Creator = ""
    newNameArray = fn.split("_")
    randomWord = random.choice(rwl)
    newName = "_".join(newNameArray[:-1]) + "_" + randomWord + ".pdf"
    print "Writing: " + newName
    writer.write("temp/c"+newName)
    return

filenames = next(os.walk("temp/"))[2]

rwl = []
with open("randomWordList.json", "r") as rwlf:
    rwl = json.load(rwlf)

for fn in filenames:
    #don't want files with multiple formats
    if ((fn.count(".") > 1) or (fn.startswith('.'))):
        continue
    if (fn[-5:] == ".docx"):
        print "Cleaning DOCX: " + fn
        cleanDocx(fn)
    elif (fn[-4:] == ".doc"):
        print "Cleaning DOC: " + fn
        cleanDoc(fn)
    elif (fn[-4:] == ".pdf"):
        print "Cleaning PDF: " + fn
        cleanPdf(fn)
