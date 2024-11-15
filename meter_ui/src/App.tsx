import { getDefaultRecord } from "./models/Record";
import {
  faBolt,
  faBucket,
  faDashboard,
  faFire,
  faHouse,
  faMaskVentilator,
  faMoon,
  faPen,
  faPeopleGroup,
  faShirt,
  faShower,
  faSink,
  faSun,
  faWater,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import AddButton from "./components/buttons/AddButton";
import DeleteButton from "./components/buttons/DeleteButton";
import InfoButton from "./components/buttons/InfoButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getRecord, saveRecord, Result, getLastRecord } from "./mods/DataStore";
import axios from "axios";

function App() {
  let defaultRecord = getDefaultRecord();
  const [record, setRecord] = useState(defaultRecord);
  const [recordExist, setRecordExist] = useState(0);
  const [infoMessage, setInfoMessage] = useState("");
  const [displayTimeout] = useState(3000);

  function getRecordColor() {
    if (recordExist == 1) return "green";
    if (recordExist == -1) return "red";
    return "gray";
  }

  const handleDateChange = (date: string) => {
    let id = date.replace(/\-/gi, "");
    let result_record: Result = getRecord(id);
    let resultLastRecord: Result = getLastRecord();
    // First try to fetch record based on chosen date
    if (result_record.isSucces() && result_record.record) {
      setRecord(result_record.record);
      setRecordExist(1);
    } // Then try to fetch the last record
    else if (resultLastRecord.isSucces() && resultLastRecord.record) {
      let lastRecord = resultLastRecord.record;
      setRecord({
        ...lastRecord,
        id: id,
        record_date: date,
        temperature: undefined,
        wash: 0,
        dish: 0,
        shower: 0,
      });
      setRecordExist(-1);
    } // Else populate with empty record
    else {
      setRecord({ ...defaultRecord, id: id, record_date: date });
      setRecordExist(-1);
    }
  };

  const toggleHouseWorking = () => {
    setRecord({ ...record, houseworking: !record.houseworking });
  };
  const addResident = () =>
    setRecord({ ...record, residents: record.residents + 1 });
  const deleteResident = () =>
    setRecord({
      ...record,
      residents: record.residents - 1 < 0 ? 0 : record.residents - 1,
    });

  const addWash = () => setRecord({ ...record, wash: record.wash + 1 });
  const deleteWash = () =>
    setRecord({ ...record, wash: record.wash - 1 < 0 ? 0 : record.wash - 1 });

  const addDish = () => setRecord({ ...record, dish: record.dish + 1 });
  const deleteDish = () =>
    setRecord({ ...record, dish: record.dish - 1 < 0 ? 0 : record.dish - 1 });

  const addShower = () => setRecord({ ...record, shower: record.shower + 1 });
  const deleteShower = () =>
    setRecord({
      ...record,
      shower: record.shower - 1 < 0 ? 0 : record.shower - 1,
    });

  const addTemperature = () =>
    setRecord({
      ...record,
      temperature:
        (record.temperature == undefined ? 0 : record.temperature) + 0.1,
    });
  const deleteTemperature = () =>
    setRecord({
      ...record,
      temperature:
        (record.temperature == undefined ? 0 : record.temperature) - 0.1,
    });
  const handleTemperatureChange = (value: string) => {
    let valueNum = parseFloat(value);
    setRecord({ ...record, temperature: valueNum });
  };

  const toggleWoodHeat = () => {
    setRecord({ ...record, wood_heat: !record.wood_heat });
  };
  const addWoodBag = () =>
    setRecord({ ...record, wood_bag: record.wood_bag + 1 });
  const deleteWoodBag = () =>
    setRecord({
      ...record,
      wood_bag: record.wood_bag - 1 < 0 ? 0 : record.wood_bag - 1,
    });

  const toggleGazHeat = () => {
    setRecord({ ...record, gaz_heat: !record.gaz_heat });
  };
  const addCubicMeter = () =>
    setRecord({
      ...record,
      cubic_meter:
        (record.cubic_meter == undefined ? 0 : record.cubic_meter) + 1,
    });
  const deleteCubicMeter = () =>
    setRecord({
      ...record,
      cubic_meter:
        (record.cubic_meter == undefined ? 0 : record.cubic_meter) - 1 < 0
          ? 0
          : (record.cubic_meter == undefined ? 0 : record.cubic_meter) - 1,
    });
  const handleCubicMetersChange = (value: string) => {
    let valueNum = parseInt(value);
    setRecord({ ...record, cubic_meter: valueNum });
  };

  const handleDayKwhChange = (value: string) => {
    let valueNum = parseInt(value);
    setRecord({ ...record, day_kwh: valueNum });
  };
  const handleNightKwhChange = (value: string) => {
    let valueNum = parseInt(value);
    setRecord({ ...record, night_kwh: valueNum });
  };
  const handleLitersChange = (value: string) => {
    let valueNum = parseInt(value);
    setRecord({ ...record, liters: valueNum });
  };

  const handleSave = () => {
    let result = saveRecord(record);
    setInfoMessage(result.message);
    setTimeout(() => setInfoMessage(""), displayTimeout);
    setRecordExist(1);
  };

  const handleClean = () => {
    setRecord({
      ...record,
      temperature: undefined,
      day_kwh: undefined,
      night_kwh: undefined,
      liters: undefined,
      cubic_meter: undefined,
    });
  };

  const handleRestore = (date: string) => {
    handleDateChange(date);
  };

  useEffect(() => {
    let ignore = false;
    let defaultRecord = getDefaultRecord();
    let uri = "meter/all";

    if (localStorage.getItem("records") != undefined) {
      let raw_records: string = localStorage.getItem("records") || '""';
      let records = JSON.parse(raw_records);
      setRecord(records);
    } else {
      axios
        .get(uri)
        .then((res) => {
          let records_str: string = JSON.stringify(res.data);
          localStorage.setItem("records", records_str);
          setRecord(res.data);
        })
        .catch((err) => {
          setInfoMessage(err.message);
          setTimeout(() => setInfoMessage(""), displayTimeout);
        });
    }

    if (!ignore) handleDateChange(defaultRecord.record_date);

    return () => {
      ignore = true;
    };
  }, []);

  return (
    <>
      <header>
        <div className="container-fluid">
          <nav className="container">
            <ul>
              <li>
                <FontAwesomeIcon
                  icon={faHouse}
                  size="3x"
                  color={getRecordColor()}
                />
              </li>
              <li>
                <FontAwesomeIcon icon={faDashboard} size="3x" />
              </li>
              <li>
                <input
                  type="date"
                  name="from-date"
                  id="from-date"
                  defaultValue={record.record_date}
                  onChange={(e) => handleDateChange(e.target.value)}
                />
              </li>
            </ul>
          </nav>
          <div
            className={
              infoMessage != "" ? "info_message" : "info_message hidden"
            }
          >
            <center>{infoMessage} test</center>
          </div>
        </div>
      </header>
      <main className="container-fluid">
        <div className="grid">
          <div role="group">
            <div className="check-box">
              <label htmlFor="houseworking">
                <input
                  type="radio"
                  name="houseworking"
                  id="house-working"
                  onClick={toggleHouseWorking}
                  onChange={toggleHouseWorking}
                  checked={record.houseworking}
                />
                {"     "}
                <FontAwesomeIcon icon={faPen} size="xl" />
              </label>
            </div>
            <div role="group">
              <DeleteButton operation={deleteResident}></DeleteButton>
              <InfoButton
                value={record.residents}
                icon={faPeopleGroup}
              ></InfoButton>
              <AddButton operation={addResident}></AddButton>
            </div>
          </div>
          <div role="group">
            <DeleteButton operation={deleteWash}></DeleteButton>
            <InfoButton value={record.wash} icon={faShirt}></InfoButton>
            <AddButton operation={addWash}></AddButton>
          </div>
          <div role="group">
            <DeleteButton operation={deleteDish}></DeleteButton>
            <InfoButton value={record.dish} icon={faSink}></InfoButton>
            <AddButton operation={addDish}></AddButton>
          </div>
          <div role="group">
            <DeleteButton operation={deleteShower}></DeleteButton>
            <InfoButton value={record.shower} icon={faShower}></InfoButton>
            <AddButton operation={addShower}></AddButton>
          </div>
          <div role="grid">
            <div role="group">
              <DeleteButton operation={deleteTemperature}></DeleteButton>
              <div className="unit celsius">
                <input
                  type="number"
                  name="temperature"
                  id="temperature-celsius"
                  value={
                    record.temperature == undefined ? "" : record.temperature
                  }
                  onChange={(e) => handleTemperatureChange(e.target.value)}
                />
              </div>
              <AddButton operation={addTemperature}></AddButton>
            </div>
          </div>
        </div>
        <hr />
        <div className="grid">
          <div role="group">
            <label htmlFor="night_kwh" className="input-box">
              <FontAwesomeIcon icon={faMoon} size="xl" />
              {"   "}
              <FontAwesomeIcon icon={faBolt} size="xl" />
            </label>
            <div className="unit kwh">
              <input
                type="number"
                name="night_kwh"
                id="night-kwh"
                value={record.night_kwh == undefined ? "" : record.night_kwh}
                onChange={(e) => handleNightKwhChange(e.target.value)}
              />
            </div>
          </div>
          <div role="group">
            <label htmlFor="day_kwh" className="input-box">
              <FontAwesomeIcon icon={faSun} size="xl" />
              {"   "}
              <FontAwesomeIcon icon={faBolt} size="xl" />
            </label>
            <div className="unit kwh">
              <input
                type="number"
                name="day_kwh"
                id="day-kwh"
                value={record.day_kwh == undefined ? "" : record.day_kwh}
                onChange={(e) => handleDayKwhChange(e.target.value)}
              />
            </div>
          </div>
          <div role="group">
            <label htmlFor="day_kwh" className="input-box">
              <FontAwesomeIcon icon={faWater} size="xl" />
            </label>
            <div className="unit liters">
              <input
                type="number"
                name="liters"
                id="water-liters"
                value={record.liters == undefined ? "" : record.liters}
                onChange={(e) => handleLitersChange(e.target.value)}
              />
            </div>
          </div>
        </div>
        <hr />
        <div className="grid">
          <div role="group">
            <div className="check-box">
              <label htmlFor="wood_heat">
                <input
                  type="radio"
                  name="wood_heat"
                  id="wood-heat"
                  onClick={toggleWoodHeat}
                  onChange={toggleWoodHeat}
                  checked={record.wood_heat}
                />
                {"     "}
                <FontAwesomeIcon icon={faFire} size="xl" />
              </label>
            </div>
            <div role="group">
              <DeleteButton operation={deleteWoodBag}></DeleteButton>
              <InfoButton value={record.wood_bag} icon={faBucket}></InfoButton>
              <AddButton operation={addWoodBag}></AddButton>
            </div>
          </div>
          <div role="group">
            <div className="check-box">
              <label htmlFor="gaz_heat">
                <input
                  type="radio"
                  name="gaz_heat"
                  id="gaz-heat"
                  onClick={toggleGazHeat}
                  onChange={toggleGazHeat}
                  checked={record.gaz_heat}
                />
                {"  "}
                <FontAwesomeIcon icon={faMaskVentilator} size="xl" />
              </label>
            </div>
            <div role="group">
              <DeleteButton operation={deleteCubicMeter}></DeleteButton>
              <input
                type="number"
                name="cubic_meters"
                id="cubic-meters"
                value={
                  record.cubic_meter == undefined ? "" : record.cubic_meter
                }
                onChange={(e) => handleCubicMetersChange(e.target.value)}
              />
              <AddButton operation={addCubicMeter}></AddButton>
            </div>
          </div>
        </div>
        <div className="grid" role="group">
          <button className="add" onClick={handleSave}>
            Save
          </button>
          <button className="clean" onClick={handleClean}>
            Clean
          </button>
          <button
            className="delete"
            onClick={() => handleRestore(record.record_date)}
          >
            Restore
          </button>
        </div>
      </main>
      <footer></footer>
    </>
  );
}

export default App;
