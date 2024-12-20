from typing import Optional, TypeVar

from models.meter_v2 import Record_v2

T = TypeVar("T")

class Storage:

    storage_stype: str

    async def set(self, id: str, record: str) -> bool:
        raise NotImplementedError()

    async def get(self, id: Optional[str] = None) -> list[T]:
        raise NotImplementedError()

    async def delete(self, id: str) -> bool:
        raise NotImplementedError()
