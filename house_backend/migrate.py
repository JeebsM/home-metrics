from datetime import datetime
import json
from pathlib import Path
from typing import TypeVar
from rich import print

from models.meter_v1 import Record_v1
from models.meter_v2 import Record_v2

T = TypeVar('T')
STORAGE_PATH = Path('./storage/prod')

def read_raw_data() -> dict:
    filepath = Path('historic_data_raw.json')
    storage_filepath = Path(STORAGE_PATH / filepath)
    with open(storage_filepath, 'r') as file:
        raw_data: dict = json.load(file)
        return raw_data

def write_data(data: list[T], record_v: T):
    filepath = Path('data.json')
    storage_filepath = Path(STORAGE_PATH / filepath)
    data_json = []
    data_json = [record.model_dump() for record in data]
    with open(storage_filepath, 'w') as file:
        json.dump(data_json, file)

def parse_v1_data(raw_data: dict) -> list[Record_v1]:
    data: list[Record_v1] = []
    for rec in raw_data:
        temperature = rec['temperature']
        if rec['temperature'] is None or rec['temperature'] == '':
            temperature = None
        new_rec: Record_v1 = Record_v1(
            id=rec['id'],
            date=rec['date'],
            residents_home=rec['residents_home'],
            homeworking=rec['homeworking'],
            homeworkers=rec['homeworkers'],
            user_id=rec['user_id'] if 'user_id' in rec.keys() else None,
            gaz=rec['gaz'] if rec['gaz'] != '' else None,
            elec_night=rec['elec_night'] if rec['elec_night'] != '' else None,
            elec_day=rec['elec_day'] if rec['elec_day'] != '' else None,
            water=rec['water'] if rec['water'] != '' else None,
            wood_heat_on=rec['wood_heat_on'],
            temperature=temperature,
            residents_wash=rec['residents_wash'],
            wood_bag_open=rec['wood_bag_open'],
            gaz_heat_on=rec['gaz_heat_on'],
        )
        data.append(new_rec)
    return data

def migrate_v1_to_v2(v1: list[Record_v1]) -> list[Record_v2]:
    data = []
    for old in v1:
        old: Record_v1
        rec_date = datetime.fromtimestamp(old.date/1000.0).strftime("%Y-%m-%d")
        id = datetime.fromtimestamp(old.date/1000.0).strftime("%Y%m%d")
        insert_timestamp = str(old.date)
        rec: Record_v2 = Record_v2(
            id=id,
            insert_timestamp=insert_timestamp,
            record_date=rec_date,
            meter='v1',
            temperature=old.temperature,
            residents=old.residents_home,
            wash=None,
            dish=None,
            shower=old.residents_wash,
            houseworking=old.homeworking,
            gaz_heat=old.gaz_heat_on,
            wood_heat=old.wood_heat_on,
            wood_bag=old.wood_bag_open,
            day_kwh=old.elec_day,
            night_kwh=old.elec_night,
            liters=old.water,
            cubic_meter=old.gaz
        )
        data.append(rec)
    return data

def main():
    print('Data migration tool for House Metric')
    raw_data: dict = read_raw_data()
    print(f'Raw data loaded: {len(raw_data)} records found.')
    data_v1: list[Record_v1] = parse_v1_data(raw_data)
    sample_v1: Record_v1 = list(filter(lambda rec: rec.id == '060CSFJ4374Ze94lBZlz', data_v1))[0]
    print(f'Raw data parsed: {len(data_v1)} records found.')
    print(f'Sample V1:')
    print(sample_v1)
    data_v2: list[Record_v2] = migrate_v1_to_v2(data_v1)
    sample_v2: Record_v2 = list(filter(lambda rec: rec.id == '20240324', data_v2))[0]
    print(f'V1 data migrated to V2: {len(data_v2)} records found.')
    print(f'Sample V2:')
    print(sample_v2)
    write_data(data_v2, Record_v2)

if __name__ == '__main__':
    main()