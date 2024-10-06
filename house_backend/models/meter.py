from pydantic import BaseModel

from .meter_v2 import Record_v2

class Collection(BaseModel):
    id: str
    record: Record_v2

class Record():
    pass
