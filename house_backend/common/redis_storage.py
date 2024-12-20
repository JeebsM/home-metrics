import json
from overrides import override
import redis

from common.storage import Storage


class RedisDatabase:

    db: redis.Redis
    _instance = None

    def __init__(class_):
        class_.db = redis.Redis(host='host.docker.internal', port=6379, db=0)

    def __new__(class_, *args, **kwargs):
        if not isinstance(class_._instance, class_):
            class_._instance = object.__new__(class_, *args, **kwargs)
        return class_._instance

    def get(class_):
        return class_.db


class RedisStorage(Storage):

    storage_type = 'redis'

    def __init__(self):
        redis_db = RedisDatabase()
        self.__db = redis_db.get()

    @override
    async def set(self, id, record) -> bool:
        record_str = json.dumps(record)
        success = self.__db.set(id, record_str)
        return True

    @override
    async def get(self, id = None) -> list:
        if id is None:
            return []
        record_str = self.__db.get(id)
        if record_str is None:
            return []
        record = json.loads(record_str)
        return [record]

    @override
    async def delete(self, id: str) -> bool:
        success =  self.__db.delete(id)
        return True

