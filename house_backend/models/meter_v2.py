from datetime import datetime
import os
from typing import Optional, Self
from pydantic import BaseModel

class Record_v2(BaseModel):
    id: str
    record_date: str
    residents: int
    shower: int
    houseworking: bool
    temperature: Optional[float]
    liters: Optional[int]
    gaz_heat: bool
    cubic_meter: Optional[int]
    wood_heat: bool
    wood_bag: int
    night_kwh: Optional[int]
    day_kwh: Optional[int]
    wash: Optional[int]
    dish: Optional[int]
    meter: str = os.getenv('VERSION')
    insert_timestamp: str

    def parse(value: dict) -> Self:
        insert_timestamp = str(value["insert_timestamp"])
        rec_date = datetime.fromtimestamp(int(value["insert_timestamp"])/1000.0).strftime("%Y-%m-%d")
        return Record_v2(
            id=value["id"],
            insert_timestamp=insert_timestamp,
            record_date=rec_date,
            meter='v2',
            temperature=value["temperature"],
            residents=value["residents"],
            wash=value["wash"],
            dish=value["dish"],
            shower=value["shower"],
            houseworking=value["houseworking"],
            gaz_heat=value["gaz_heat"],
            wood_heat=value["wood_heat"],
            wood_bag=value["wood_bag"],
            day_kwh=value["day_kwh"],
            night_kwh=value["night_kwh"],
            liters=value["liters"],
            cubic_meter=value["cubic_meter"]
        )