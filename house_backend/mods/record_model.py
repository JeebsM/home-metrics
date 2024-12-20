from pathlib import Path
from typing import Optional
from config.constants import DEFAULT_STORE, METER_STORE
from common.storage import Storage
from models.meter_v2 import Record_v2


class RecordModel:

    stores: list[Storage]

    def __init__(self, stores):
        self.stores = stores
        main_stores = list(filter(lambda store: store.storage_type == METER_STORE, stores))
        main_store = main_stores[0] if len(main_stores) > 0 else DEFAULT_STORE
        self.meter_store: Storage = main_store

    async def filter_record(self, data: list, id: str) -> Optional[Record_v2]:
        for record in data:
            record_parsed: Record_v2 = Record_v2.parse(record)
            if record_parsed.id == id:
                return record_parsed
        return None

    async def exists(self, id: str, data: Optional[list] = None) -> bool:
        if data is None:
            data = await self.meter_store.get()
            if len(data) == 0:
                data = await self.meter_store.get(id)
        record = await self.filter_record(data, id)
        if record is not None:
            return True
        return False

    async def create(self, record: Record_v2) -> Record_v2:
        record_str = record.model_dump()
        await self.meter_store.set(record.id, record_str)
        return record

    async def get(self, id: Optional[str] = None) -> list[Record_v2]:
        records = await self.meter_store.get(id)
        if id is not None:
            record: Optional[Record_v2] = await self.filter_record(records, id)
            if record is None:
                return ValueError(f'Record {id} does not exist.')
            return [record]
        records = await self.meter_store.get()
        return records

    async def put(self, record: Record_v2) -> Record_v2:
        record_str = record.model_dump()
        success = await self.meter_store.delete(record.id)
        if not success:
            return RuntimeError(f'edit delete while updating.')
        success = await self.meter_store.set(record.id, record_str)
        if not success:
            return RuntimeError(f'edit insertion after delete while updating.')
        return record

    async def delete(self, id: str) -> str:
        success = await self.meter_store.delete(id)
        if not success:
            return RuntimeError(f'Delete of record {id} went wrong.')
        return id

