from enum import StrEnum
from pathlib import Path


class ENV(StrEnum):
    DEV = 'local/test.json',
    PROD = 'prod/data.json'

class PATHS(StrEnum):
    STORAGE = './storage'

class STORES(StrEnum):
    FILE = 'file',
    REDIS = 'redis'

ACTIVE_STORES = [STORES.FILE.value, STORES.REDIS.value]
DEFAULT_STORE = STORES.FILE.value
METER_STORE = STORES.REDIS.value
STORAGE_PATH = PATHS.STORAGE
STORAGE_FILE = ENV.PROD
