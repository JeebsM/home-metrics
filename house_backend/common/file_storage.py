import json
from pathlib import Path
from typing import Optional

from overrides import override

from common.storage import Storage
from config.constants import STORAGE_FILE, STORAGE_PATH
from models.meter_v2 import Record_v2


class FileStorage(Storage):

    storage_type = 'file'
    __storage_filepath: str

    def __init__(self):
        storage_path = Path(STORAGE_PATH)
        storage_file = Path(STORAGE_FILE)
        self.__storage_filepath = Path(storage_path / storage_file)

    @override
    async def get(self, id: Optional[str] = None) -> list:
        result = []
        with open(self.__storage_filepath, 'r') as file:
            data = json.load(file)
            if data == '' or data is None:
                return result
            return data

    @override
    async def set(self, id: str, record: str) -> bool:
        data: list = await self.get()
        with open(self.__storage_filepath, 'w') as file:
            data.append(record)
            json.dump(data, file)
            return True

    @override
    async def delete(self, id: str) -> bool:
        records = await self.get()
        data_without_record = list(filter(lambda record: record['id'] != id, records))
        with open(self.__storage_filepath, 'w') as file:
            json.dump(data_without_record, file)
            return True
        return False
