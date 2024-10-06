from typing import Optional, Self
from pydantic import BaseModel

class Record_v1(BaseModel):
    id: str
    date: int
    residents_home: Optional[int]
    residents_wash: Optional[int]
    homeworking: bool
    temperature: Optional[float]
    water: Optional[int]
    gaz_heat_on: bool
    gaz: Optional[int]
    wood_heat_on: bool
    wood_bag_open: bool
    elec_night: Optional[int]
    elec_day: Optional[int]
    homeworkers: Optional[int]
    user_id: Optional[str]

    def parse(value: dict) -> Self:
        temperature = value['temperature']
        if value['temperature'] is None or value['temperature'] == '':
            temperature = None
        return Record_v1(
            id=value["id"],
            date=value["date"],
            residents_home=value["residents_home"],
            residents_wash=value["residents_wash"],
            homeworking=value["homeworking"],
            temperature=temperature,
            water=value["water"] if value["water"] != '' else None,
            gaz_heat_on=value["gaz_heat_on"],
            gaz=value["gaz"] if value["gaz"] != '' else None,
            wood_heat_on=value["wood_heat_on"],
            wood_bag_open=value["wood_bag_open"],
            elec_night=value["elec_night"] if value["elec_night"] != '' else None,
            elec_day=value["elec_day"] if value["elec_day"] != '' else None,
            homeworkers=value["homeworkers"],
            user_id=value["user_id"] if 'user_id' in value.keys() else None
        )
