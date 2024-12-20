from typing import  TypeVar
from common.file_storage import FileStorage
from common.redis_storage import RedisStorage

S = TypeVar("S")

class Datastore:

    stores: list[S] = []
    __strategies = {
        "file": FileStorage(),
        "redis": RedisStorage(),
    }

    def __init__(self, *args, **kwargs):
        for strategy in args:
            self.stores.append(self.__strategies[strategy])

    def get(self):
        return self.stores