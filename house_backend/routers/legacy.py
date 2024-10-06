import json
from pathlib import Path
from fastapi import APIRouter, Request

from models.meter_v1 import Record_v1

router = APIRouter()

@router.get('/all')
async def fetch_records(request: Request) -> list[Record_v1]:
    STORAGE_PATH = Path('./storage')
    filepath = Path('historic_data_raw.json')
    storage_filepath = Path(STORAGE_PATH / filepath)
    with open(storage_filepath, 'r') as file:
        data = []
        raw_data = json.load(file)
        for record in raw_data:
            data.append(Record_v1.parse(record).model_dump())
        return data
