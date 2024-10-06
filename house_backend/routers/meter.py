from enum import StrEnum
import json
from pathlib import Path
from typing import Optional
from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel

from models.meter_v2 import Record_v2

router = APIRouter()

class ENV(StrEnum):
    DEV = 'test.json',
    PROD = 'data.json'
STORAGE_FILE = ENV.DEV

class Records(BaseModel):
    id: str
    record: Record_v2

def build_storage_filepath(file: str) -> Path:
    STORAGE_PATH = Path('./storage')
    filepath = Path(file)
    return Path(STORAGE_PATH / filepath)

async def read_data(file: str) -> list:
    storage_filepath = build_storage_filepath(file)
    with open(storage_filepath, 'r') as file:
        raw_data = json.load(file)
    if raw_data == '' or raw_data is None:
        return []
    return raw_data


async def write_data(data: list[Record_v2], storage_filepath: str, record: Optional[Record_v2] = None) -> Record_v2:
    with open(storage_filepath, 'w') as file:
        if record is not None:
            data.append(record.model_dump())
        json.dump(data, file)
        return record

async def fetch_record_with_id(data: list, id: str) -> Optional[Record_v2]:
    for record in data:
        record_parsed: Record_v2 = Record_v2.parse(record)
        if record_parsed.id == id:
            return record_parsed
    return None

@router.get('/all')
async def fetch_records(request: Request) -> dict[str, Record_v2]:
    data = {}
    raw_data: list = await read_data(STORAGE_FILE)
    if len(raw_data) == 0:
        return {}
    for record in raw_data:
        record_parsed: Record_v2 = Record_v2.parse(record)
        data[record_parsed.id] = record_parsed.model_dump()
    return data

@router.get('/{id}')
async def fetch_record(request: Request, id: str) -> Record_v2:
    try:
        raw_data: list = await read_data(STORAGE_FILE)
        if len(raw_data) == 0:
            raise Exception('Data not avalaible.')
        record_parsed = await fetch_record_with_id(raw_data, id)
        if record_parsed is not None:
            return record_parsed
        raise Exception(f'No record matches id {id}')
    except Exception as e:
        raise HTTPException(404, f'Record not found. {e}')

@router.post('/')
async def create_record(request: Request, record: Record_v2) -> Record_v2:
    try:
        input_value = await request.json()
        value: Record_v2 = Record_v2.model_validate(input_value)
        raw_data: list = await read_data(STORAGE_FILE)
        storage_filepath: Path = build_storage_filepath(STORAGE_FILE)
        # Check if record already exist
        record_parsed = await fetch_record_with_id(raw_data, value.id)
        if record_parsed is not None:
            raise Exception(f'Record with id = {value.id} already exist.')
        # Write down the new record
        record = await write_data(raw_data, storage_filepath, value)
        return record

    except Exception as e:
        raise HTTPException(500, f'Record not saved. {e}')

@router.put('/')
async def update_record(request: Request, record: Record_v2) -> Record_v2:
    try:
        print(type(record), record)
        input_value = await request.json()
        value: Record_v2 = Record_v2.model_validate(input_value)
        raw_data: list = await read_data(STORAGE_FILE)
        storage_filepath: Path = build_storage_filepath(STORAGE_FILE)
        # Check if record already exist
        record_parsed = await fetch_record_with_id(raw_data, value.id)
        if record_parsed is None:
            raise Exception(f'Record with id = {value.id} does not exist.')
        # Write down the new record
        data_without_record = list(filter(lambda record: record['id'] != value.id, raw_data))
        record = await write_data(data_without_record, storage_filepath, value)
        return record

    except Exception as e:
        raise HTTPException(500, f'Record not saved. {e}')

@router.delete('/{id}')
async def update_record(request: Request, id: str) -> str:
    try:
        raw_data: list = await read_data(STORAGE_FILE)
        storage_filepath: Path = build_storage_filepath(STORAGE_FILE)
        # Check if record already exist
        record_parsed = await fetch_record_with_id(raw_data, id)
        if record_parsed is None:
            raise Exception(f'Record with id = {id} does not exist.')
        # Write down the new record
        data_without_record = list(filter(lambda record: record['id'] != id, raw_data))
        await write_data(data_without_record, storage_filepath)
        return id

    except Exception as e:
        raise HTTPException(500, f'Record not saved. {e}')
