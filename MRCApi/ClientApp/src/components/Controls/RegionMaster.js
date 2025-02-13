import React, { useState } from "react";
import { MultiSelect } from "primereact/multiselect";
import { Dropdown } from "primereact/dropdown";
export function RegionApp(parent) {
  const [area, setArea] = useState(parent.state.area);
  const [region, setRegion] = useState(parent.state.region);
  const [province, setProvince] = useState(parent.state.province);
  const [district, setDistrict] = useState(parent.state.district);
  const classCols =
    parent.props.RegionClass !== undefined
      ? parent.props.RegionClass
      : "p-field p-col-12 p-md-3 p-sm-6";
  const lstarea = [],
    lstregion = [],
    lstprovice = [],
    lstdistrict = [];
  const map1 = new Map(),
    map2 = new Map();
  const map3 = new Map(),
    map4 = new Map();
  if (parent.props.regions !== undefined && parent.props.regions.length > 0)
    for (const item of parent.props.regions) {
      if (parent.props.usearea === true && !map1.has(item.areaName)) {
        map1.set(item.areaName, true); // set any value to Map
        lstarea.push({
          value: item.areaName,
          name: item.areaName,
        });
      }
      if (!map3.has(item.provinceName)) {
        if ((area || area === 0) && item.areaName !== area) {
          continue;
        }
        map3.set(item.provinceName, true); // set any value to Map
        if (lstprovice.findIndex((e) => e.name === item.provinceName) < 0)
          lstprovice.push({
            value: item.provinceId,
            name: item.provinceName,
          });
      }
    }
  const onChangeArea = (e) => {
    setArea(e.value);
    setProvince([]);
    parent.handleChange(e.target.id, e.value);
  };
  const onChangeProvince = (e) => {
    console.log(e);
    setProvince(e.value);
    parent.handleChange(e.target.id, e.value);
  };
  // const onChangeRegion = (e) => {
  //     setRegion(e.value);
  //     parent.handleChange(e.target.id, e.value);
  //     setProvince([]);
  // };
  // const onChangeDistrict = (e) => {
  //     setDistrict(e.value);
  //     parent.handleChange(e.target.id, e.value);
  // };
  const uiarea = (
    <div key="area" className={classCols}>
      <label>{parent.props.language["area"] || "area"}</label>
      <Dropdown
        value={parent.state.area}
        options={lstarea}
        optionLabel="name"
        filter={true}
        style={{ width: "100%" }}
        key={lstarea.value}
        id="area"
        showClear
        onChange={onChangeArea}
        placeholder={
          parent.props.language["select_a_area"] || "l_select_a_area"
        }
      />
    </div>
  );
  // const uiregions = <div key="region" className={classCols}>
  //     <label>{parent.props.language["region"] || "region"}</label>
  //     <Dropdown value={region} options={lstregion}
  //         optionLabel="name" filter={true}
  //         style={{ width: '100%' }}
  //         id="region" showClear
  //         key={region}
  //         onChange={onChangeRegion}
  //         placeholder={parent.props.language["select_a_region"] || "l_select_a_region"} />
  // </div>
  const uiprovice = (
    <div key="province" className={classCols}>
      <label>{parent.props.language["province"] || "province"}</label>
      <MultiSelect
        value={parent.state.province}
        options={lstprovice}
        optionLabel="name"
        key={province}
        showClear
        id="province"
        filter
        style={{ width: "100%" }}
        onChange={onChangeProvince}
        placeholder={
          parent.props.language["select_a_province"] || "l_select_a_province"
        }
      />
    </div>
  );
  var controls = [];
  if (parent.props.usearea === true) controls.push(uiarea);
  // if (parent.props.useregion === true)
  //     controls.push(uiregions);
  if (parent.props.useprovince === true) controls.push(uiprovice);
  return controls;
}
