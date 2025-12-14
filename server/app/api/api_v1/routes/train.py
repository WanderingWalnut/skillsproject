from fastapi import FastAPI, UploadFile, File, HTTPException
import pandas as pd
from io import StringIO
import uuid


@app.post("/upload")
async def upload_csv(file: UploadFile = File(...)):
    # Validate if it's a csv file
    if not file.filename_lower().endswith(".csv"):
        raise HTTPException(status_code=400, detail="Please upload a .csv file")
    
    # Read the content of the csv file
    content = await file.read()

    try:
        text = content.decode("utf-8")
    
    except UnicodeDecodeError:
        raise HTTPException(status_code=400, detail="CSV is not UTF-8 encoded")
    
    # Parse the PDF using pandas
    df = pd.read_csv(StringIO(text))
    
