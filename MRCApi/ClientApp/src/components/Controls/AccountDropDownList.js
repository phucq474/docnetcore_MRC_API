import React, { useEffect, useState } from "react";
import { AccountCreateAction as Action } from "../../store/AccountController";
import { Dropdown } from "primereact/dropdown";
import { useDispatch, useSelector, connect } from "react-redux";
import { MultiSelect } from "primereact/multiselect";
import { getAccountId } from "../../Utils/Helpler";

const defaultProps = {
  id: null,
  value: null,
  className: "p-field p-col-12 p-md-3 p-sm-6",
};
export function AccountDropDownList(props) {
  const { list } = useSelector((state) => state.account);
  const dispatch = useDispatch();

  function fetchData() {
    dispatch(Action.GetList());
  }
  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e) => {
    props.onChange(e.target.id, e.target.value || null);
  };
  const template = () => {
    const listOption = [];
    if (list) {
      list.forEach((element) => {
        listOption.push({
          name: element.accountName,
          value: element.id,
        });
      });
    }
    return props.mode === "multi" ? (
      <div className={props.className}>
        <label>Account</label>
        <MultiSelect
          value={props.value}
          id={props.id}
          style={{ width: "100%", backgroundColor: "#FFC000", color: "black" }}
          options={listOption}
          onChange={handleChange}
          optionLabel="name"
          placeholder="Chọn site"
          showClear={props.showClear}
          filter
          filterBy="name"
          disabled={props.disabled}
        />
      </div>
    ) : (
      <div className={props.className}>
        <label>Account</label>
        <Dropdown
          value={props.value}
          id={props.id}
          style={{ width: "100%", backgroundColor: "#FFC000", color: "black" }}
          options={listOption}
          onChange={handleChange}
          optionLabel="name"
          placeholder="Chọn site"
          showClear={props.showClear}
          filter
          filterBy="name"
          disabled={props.disabled}
        />
      </div>
    );
  };

  return getAccountId() === 0 ? template() : null;
}
AccountDropDownList.defaultProps = defaultProps;
