from typing import Optional
from fastapi import HTTPException

from common.datastore import Datastore
from common.storage import Storage
from config.constants import ACTIVE_STORES
from mods.record_model import RecordModel
from models.meter_v2 import Record_v2


class RecordController():

    __model: RecordModel
    stores: Storage

    def __init__(self):
        datastore: Datastore = Datastore(*ACTIVE_STORES)
        self.stores = datastore.get()

        self.__model = RecordModel(self.stores)

    async def post(self, record):
        record_validated: Record_v2 = Record_v2.model_validate(record)
        record_exist = await self.__model.exists(record_validated.id)
        if record_exist:
            return ValueError(f'Record {record_validated.id} already exist.')
        result = await self.__model.create(record_validated)
        return result

    async def one(self, id: str) -> Record_v2:
        record_exist = await self.__model.exists(id)
        if not record_exist:
            return ValueError(f'Record {id} does not exist.')
        result = await self.__model.get(id)
        if len(result) > 0:
            record = result[0].model_dump()
            return record
        return KeyError(f'Record {id} could not be fetched.')

    async def all(self) -> list[Record_v2]:
        records = await self.__model.get()
        return records

    async def put(self, record):
        record_validated: Record_v2 = Record_v2.model_validate(record)
        record_exist = await self.__model.exists(record_validated.id)
        if not record_exist:
            return ValueError(f'Record {record_validated.id} does not exist.')
        result = await self.__model.put(record_validated)
        return result

    async def delete(self, id: str):
        record_exist = await self.__model.exists(id)
        if not record_exist:
            return ValueError(f'Record {id} does not exist.')
        result = await self.__model.delete(id)
        return result
