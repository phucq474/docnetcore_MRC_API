import React, { useState } from "react";
import { Dropdown } from "primereact/dropdown";
export function CategoryApp(parent) {
  const [divisionId, setDivision] = useState(parent.division);
  const [categoryId, setCate] = useState(parent.categoryId);
  const [brandId, setBrand] = useState(parent.brandId);
  const [subCateId, setSubcate] = useState(parent.subCateId);
  const [variantId, setVariant] = useState(parent.variantId);
  const lstdivision = [],
    lstcate = [],
    lstsubcate = [],
    lstvariant = [],
    lstbrand = [];
  const map1 = new Map(),
    map2 = new Map(),
    map3 = new Map(),
    map4 = new Map(),
    map5 = new Map();
  if (
    parent.props.categories !== undefined &&
    parent.props.categories.length > 0
  )
    for (const item of parent.props.categories) {
      // division
      if (parent.props.usedivision === true && !map1.has(item.divisionId)) {
        map1.set(item.divisionId, true); // set any value to Map
        lstdivision.push({
          value: item.divisionId,
          name: item.division,
        });
      }
      /// brand
      if (parent.props.usebrand === true && !map2.has(item.brandId)) {
        if (
          divisionId !== undefined &&
          divisionId !== "" &&
          item.divisionId !== parent.state.divisionId
        ) {
          continue;
        }
        map2.set(item.brandId, true);
        lstbrand.push({
          value: item.brandId,
          name: item.brand,
        });
      }
      //category
      if (parent.props.usecate === true && !map3.has(item.categoryId)) {
        if (
          divisionId !== undefined &&
          divisionId !== "" &&
          item.divisionId !== parent.state.divisionId
        ) {
          continue;
        }
        if (
          brandId !== undefined &&
          brandId !== "" &&
          item.brandId !== parent.state.brandId
        ) {
          continue;
        }
        map3.set(item.categoryId, true); // set any value to Map
        lstcate.push({
          value: item.categoryId,
          name: item.category,
        });
      }
      // subcate
      if (parent.props.usesubcate === true && !map4.has(item.subCatId)) {
        if (
          divisionId !== undefined &&
          divisionId !== "" &&
          item.divisionId !== parent.state.divisionId
        ) {
          continue;
        }
        if (
          brandId !== undefined &&
          brandId !== "" &&
          item.brandId !== parent.state.brandId
        ) {
          continue;
        }
        if (
          categoryId !== undefined &&
          categoryId !== "" &&
          item.categoryId !== parent.state.categoryId
        ) {
          continue;
        }
        map4.set(item.subCatId, true); // set any value to Map
        lstsubcate.push({
          value: item.subCatId,
          name: item.subCategory,
        });
      }
      // variant
      if (parent.props.usevariant === true && !map5.has(item.variantId)) {
        //filter
        if (
          divisionId !== undefined &&
          divisionId !== "" &&
          item.divisionId !== parent.state.divisionId
        ) {
          continue;
        }
        if (
          brandId !== undefined &&
          brandId !== "" &&
          item.brandId !== parent.state.brandId
        ) {
          continue;
        }
        if (
          categoryId !== undefined &&
          categoryId !== "" &&
          item.categoryId !== parent.state.categoryId
        ) {
          continue;
        }
        // if (subCateId !== undefined && subCateId !== null && item.subCatId !== parent.state.subCateId) {
        //     continue;
        // }
        if (item.variantId === null || item.variantId === 0) {
          continue;
        }
        map5.set(item.variantId, true); // set any value to Map
        lstvariant.push({
          value: item.variantId,
          name: item.variant,
        });
      }
    }
  const onChangeDivision = (e) => {
    setDivision(e.value);
    setBrand(0);
    setCate(0);
    setSubcate(0);
    setVariant(0);
    parent.handleChange(e.target.id, e.value);
    parent.handleChange("brandId", 0);
    parent.handleChange("categoryId", 0);
    parent.handleChange("subCatId", 0);
    parent.handleChange("variantId", 0);
  };
  const onChangeBrand = (e) => {
    setBrand(e.value);
    setCate(0);
    setSubcate(0);
    setVariant(0);
    parent.handleChange(e.target.id, e.value);
    parent.handleChange("categoryId", 0);
    parent.handleChange("subCatId", 0);
    parent.handleChange("variantId", 0);
  };
  const onChangeCate = (e) => {
    setCate(e.value);
    setSubcate(0);
    setVariant(0);
    parent.handleChange(e.target.id, e.value);
    parent.handleChange("subCatId", 0);
    parent.handleChange("variantId", 0);
  };
  const onChangeSubCate = (e) => {
    setSubcate(e.value);
    setVariant(0);
    parent.handleChange(e.target.id, e.value);
    parent.handleChange("variantId", 0);
  };
  const onChangeVariant = (e) => {
    setVariant(e.value);
    parent.handleChange(e.target.id, e.value);
  };

  let className = "p-field p-col-12 p-md-6 p-lg-3";
  if (parent.className) {
    className = parent.className;
  } else if (parent.dialog === true)
    className = "p-field p-col-12 p-md-4 p-sm-6";
  if (parent.dialog === "p-md-6") className = "p-field p-col-12 p-md-6  p-sm-6";
  const uidivision = (
    <div key="division" className={className}>
      <label>{parent.props.language["division"] || "l_division"}</label>
      <Dropdown
        value={parent.state.divisionId}
        key={parent.state.divisionId}
        options={lstdivision}
        id="divisionId"
        showClear
        optionLabel="name"
        style={{ width: "100%" }}
        onChange={onChangeDivision}
        placeholder={
          parent.props.language["select_a_division"] || "l_select_a_division"
        }
        disabled={parent.isDisabled}
        filter
      />
    </div>
  );
  const uibrand = (
    <div key="brand" className={className}>
      <label>{parent.props.language["brand"] || "l_brand"} </label>
      <Dropdown
        value={parent.state.brandId}
        key={
          parent.state.brandId === undefined || parent.state.brandId === null
            ? "33233"
            : parent.state.brandId.toString()
        }
        options={lstbrand}
        id="brandId"
        showClear
        optionLabel="name"
        style={{ width: "100%" }}
        onChange={onChangeBrand}
        placeholder={
          parent.props.language["select_a_brand"] || "l_select_a_brand"
        }
        disabled={parent.isDisabled}
        filter
      />
    </div>
  );
  const uicate = (
    <div key="category" className={className}>
      <label>
        {parent.props.language["category"] || "category"}
        {parent.forProduct ? " Product" : ""}
      </label>
      <Dropdown
        value={parent.state.categoryId}
        options={lstcate}
        optionLabel="name"
        style={{ width: "100%" }}
        id="categoryId"
        showClear
        key={parent.state.categoryId}
        onChange={onChangeCate}
        placeholder={
          parent.props.language["select_a_category"] || "l_select_a_category"
        }
        disabled={parent.isDisabled}
        filter
      />
      <small className="p-invalid p-d-block">{parent.errorCate || ""}</small>
    </div>
  );
  const uisubcate = (
    <div key="subcate" className={className}>
      <label>{parent.props.language["subcategory"] || "subcategory"}</label>
      <Dropdown
        value={parent.state.subCatId}
        options={lstsubcate}
        optionLabel="name"
        key={parent.state.subCatId}
        showClear
        id="subCatId"
        style={{ width: "100%" }}
        onChange={onChangeSubCate}
        placeholder={
          parent.props.language["select_a_subcategory"] ||
          "l_select_a_subcategory"
        }
        disabled={parent.isDisabled}
        filter
      />
    </div>
  );
  const uivariant = (
    <div key="variant" className={className}>
      <label>{parent.props.language["variant"] || "l_variant"} </label>
      <Dropdown
        value={parent.state.variantId}
        key={parent.state.variantId}
        options={lstvariant}
        id="variantId"
        showClear
        optionLabel="name"
        style={{ width: "100%" }}
        onChange={onChangeVariant}
        placeholder={
          parent.props.language["select_a_variant"] || "l_select_a_variant"
        }
        disabled={parent.isDisabled}
        filter
      />
    </div>
  );

  var controls = [];
  if (parent.props.usedivision === true) controls.push(uidivision);
  if (parent.props.usebrand === true) controls.push(uibrand);
  if (parent.props.usecate === true && lstcate !== null && lstcate.length > 0)
    controls.push(uicate);
  if (
    parent.props.usesubcate === true &&
    lstsubcate !== null &&
    lstsubcate.length > 0
  )
    controls.push(uisubcate);
  if (
    parent.props.usevariant === true &&
    lstvariant !== null &&
    lstvariant.length > 0
  )
    controls.push(uivariant);
  return controls;
}
