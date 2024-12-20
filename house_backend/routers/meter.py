from enum import StrEnum
import json
from pathlib import Path
from typing import Optional
from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel

from controllers.record_controller import RecordController
from models.meter_v2 import Record_v2

router = APIRouter()

class Records(BaseModel):
    id: str
    record: Record_v2

@router.get('/all')
async def fetch_records(request: Request) -> dict[str, Record_v2]:
    controller = RecordController()
    records = await controller.all()
    result = {}
    for record in records:
        record_parsed: Record_v2 = Record_v2.parse(record)
        result[record_parsed.id] = record_parsed.model_dump()
    if isinstance(result, Exception):
        raise HTTPException(status_code=404, detail=f'Could not get records: {result}')
    return result

@router.get('/{id}')
async def fetch_record(request: Request, id: str) -> Record_v2:
    controller = RecordController()
    result = await controller.one(id)
    if isinstance(result, Exception):
        raise HTTPException(status_code=404, detail=f'Could not get record: {result}')
    return result

@router.post('/')
async def create_record(request: Request, record: Record_v2) -> Record_v2:
    controller = RecordController()
    input_value = await request.json()
    result = await controller.post(input_value)
    if isinstance(result, Exception):
        raise HTTPException(status_code=404, detail=f'Could not create record: {result}')
    return result

@router.put('/')
async def update_record(request: Request, record: Record_v2) -> Record_v2:
    controller = RecordController()
    input_value = await request.json()
    result = await controller.put(input_value)
    if isinstance(result, Exception):
        raise HTTPException(status_code=404, detail=f'Could not edit record: {result}')
    return result

@router.delete('/{id}')
async def delete_record(request: Request, id: str) -> str:
    controller = RecordController()
    result = await controller.delete(id)
    if isinstance(result, Exception):
        raise HTTPException(status_code=404, detail=f'Could not delete record: {result}')
    return result
