import { URL, getToken, b64EncodeUnicode } from "../Utils/Helpler";
const initialState = {
  list: [],
  categories: [],
  productCates: [],
  listProductPrice: [],
  insertProductPrice: [],
  updateProductPrice: [],
  saveProductPrice: [],
  exportProductPrice: [],
  importProductPrice: [],
  productPermissions: [],
  Action: "",
  urlFile: [],
  loading: false,
  linkfile: "",
  errors: {},
  insertProduct: [],
  getListProduct: [],
  getListProductType: [],
};
export const ProductCreateAction = {
  GetCategory: (accId) => async (dispatch, getState) => {
    const url = URL + "ProductCategories/getlist";
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: getToken(),
        accId: accId || "",
      },
    };
    const response = await fetch(url, requestOptions);
    const listCategory = await response.json();
    dispatch({ type: "GET_LIST_CATEGORY", listCategory });
  },
  GetProduct: (data) => async (dispatch, getState) => {
    const url = URL + "product/Filter";
    const requestOptions = {
      method: "POST",
      headers: {
        Authorization: getToken(),
        "Content-Type": "application/json",
      },
      body: "'" + JSON.stringify(data) + "'",
    };
    const response = await fetch(url, requestOptions);
    const results = await response.json();
    dispatch({ type: "GET_LIST_PRODUCT", results });
  },
  GetTemplate: () => async (dispatch, getState) => {
    const url = URL + "product/Template";
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: getToken(),
      },
    };
    const response = await fetch(url, requestOptions);
    const results = await response.json();
    dispatch({ type: "GET_TEMPLATE", results });
  },
  ExportProduct: (data) => async (dispatch, getState) => {
    const url = URL + "product/Export";
    const requestOptions = {
      method: "POST",
      headers: {
        Authorization: getToken(),
        "Content-Type": "application/json",
      },
      body: "'" + JSON.stringify(data) + "'",
    };
    const response = await fetch(url, requestOptions);
    const exportProduct = await response.json();
    dispatch({ type: "EXPORT_PRODUCT", exportProduct });
  },
  SaveProduct: (data) => async (dispatch, getState) => {
    const url = URL + "product/save";
    const requestOptions = {
      method: "POST",
      headers: {
        Authorization: getToken(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };
    const response = await fetch(url, requestOptions);
    const results = await response.text();
    dispatch({ type: "POST_SAVE_PRODUCT", results });
  },
  GetProductCate: () => async (dispatch, getState) => {
    const url = URL + "product/GetList";
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: getToken(),
      },
    };
    const response = await fetch(url, requestOptions);
    const productCates = await response.json();
    dispatch({ type: "GET_LIST_ProductCate", productCates });
  },
  GetList_ProductPermission: (data) => async (dispatch, getState) => {
    const url = URL + "product/getList_ProductPermission";
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: getToken(),
        para: data,
      },
    };
    const response = await fetch(url, requestOptions);
    const productPermissions = await response.json();
    dispatch({ type: "GET_LIST_ProductPermission", productPermissions });
  },
  Export_ProductPermission: (data) => async (dispatch, getState) => {
    const url = URL + "product/export_ProductPermission";
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: getToken(),
        para: data,
      },
    };
    const response = await fetch(url, requestOptions);
    const urlFile = await response.json();
    dispatch({ type: "GET_File_ProductPermission", urlFile });
  },
  PostImportFile: (data) => async (dispatch, getState) => {
    const url = URL + "product/import";
    const formData = new FormData();
    formData.append("fileUpload", data.file);
    const requestOptions = {
      method: "POST",
      headers: {
        Authorization: getToken(),
      },
      body: formData,
    };
    const response = await fetch(url, requestOptions);
    const results = await response.json();
    dispatch({ type: "IMPORT_FILE_PRODUCT", results });
  },
  //// Product - Price
  FilterProductPrice: (data) => async (dispatch, getState) => {
    const url = URL + "ProductPrice/Filter";
    const resquestOption = {
      method: "GET",
      headers: {
        Authorization: getToken(),
        JsonData: JSON.stringify(data),
      },
    };
    const response = await fetch(url, resquestOption);
    const listProductPrice = await response.json();
    dispatch({ type: "Filter_Product_Price", listProductPrice });
  },
  InsertProductPrice: (data) => async (dispatch, getState) => {
    const url = URL + "ProductPrice/Insert";
    const resquestOption = {
      method: "POST",
      headers: {
        Authorization: getToken(),
        "Content-type": "application/json",
      },
      body: "'" + JSON.stringify(data) + "'",
    };
    const response = await fetch(url, resquestOption);
    const insertProductPrice = await response.json();
    dispatch({ type: "Insert_Product_Price", insertProductPrice });
  },
  UpdateProductPrice: (data, index) => async (dispatch, getState) => {
    const url = URL + "ProductPrice/Update";
    const resquestOption = {
      method: "POST",
      headers: {
        Authorization: getToken(),
        "Content-type": "application/json",
      },
      body: "'" + JSON.stringify(data) + "'",
    };
    const response = await fetch(url, resquestOption);
    const updateProductPrice = await response.json();
    const payload = { updateProductPrice, index };
    dispatch({ type: "Update_Product_Price", payload });
  },
  DeleteProductPrice: (priceId, index) => async (dispatch, getState) => {
    const url = URL + "ProductPrice/Delete";
    const resquestOption = {
      method: "POST",
      headers: {
        Authorization: getToken(),
        id: priceId,
      },
    };
    const response = await fetch(url, resquestOption);
    const deleteProductPrice = await response.json();
    const payload = { deleteProductPrice, index };
    dispatch({ type: "Delete_Product_Price", payload });
  },
  ImportProductPrice: (ifile, accountName) => async (dispatch, getState) => {
    const url = URL + "ProductPrice/Import";
    const formData = new FormData();
    formData.append("ifile", ifile);
    const resquestOption = {
      method: "POST",
      headers: {
        Authorization: getToken(),
        AccountName: accountName,
      },
      body: formData,
    };
    const response = await fetch(url, resquestOption);
    const importProductPrice = await response.json();
    dispatch({ type: "Import_Product_Price", importProductPrice });
  },
  ExportProductPrice: (accountName, data) => async (dispatch, getState) => {
    const url = URL + "ProductPrice/Export";
    const resquestOption = {
      method: "GET",
      headers: {
        Authorization: getToken(),
        JsonData: JSON.stringify(data),
        AccountName: accountName,
      },
    };
    const response = await fetch(url, resquestOption);
    const exportProductPrice = await response.json();
    dispatch({ type: "Export_Product_Price", exportProductPrice });
  },
  TemplateProductPrice: (accountName) => async (dispatch, getState) => {
    const url = URL + "ProductPrice/Template";
    const resquestOption = {
      method: "GET",
      headers: {
        Authorization: getToken(),
        AccountName: accountName,
      },
    };
    const response = await fetch(url, resquestOption);
    const templateProductPrice = await response.json();
    dispatch({ type: "Template_Product_Price", templateProductPrice });
  },
  SaveProductPrice: (Action, data, index) => async (dispatch, getState) => {
    const url = URL + "ProductPrice/Save";
    const requestOptions = {
      method: "POST",
      headers: {
        Authorization: getToken(),
        "Content-type": "application/json",
        Action: Action,
      },
      body: "'" + JSON.stringify(data) + "'",
    };
    const response = await fetch(url, requestOptions);
    const saveProductPrice = await response.json();
    const payload = { saveProductPrice, Action, index };
    dispatch({ type: "Save_Product_Price", payload });
  },
  /////////
  InsertProduct: (data) => async (dispatch, getState) => {
    const url = URL + "Product/Insert";
    // const formData = await new FormData();
    // for (let i = 0; i < files.length; i++) {
    //     await formData.append("ifile", files[i])
    // }
    const requestOptions = {
      method: "POST",
      headers: {
        Authorization: getToken(),
        "Content-Type": "application/json",
      },
      body: "'" + JSON.stringify(data) + "'",
    };
    const response = await fetch(url, requestOptions);
    const insertProduct = await response.json();
    dispatch({ type: "Insert_Product", insertProduct });
  },
  UpdateProduct: (data) => async (dispatch, getState) => {
    const url = URL + "Product/Update";
    const requestOptions = {
      method: "POST",
      headers: {
        Authorization: getToken(),
        "Content-Type": "application/json",
      },
      body: "'" + JSON.stringify(data) + "'",
    };
    const response = await fetch(url, requestOptions);
    const updateProduct = await response.json();
    dispatch({ type: "Update_Product", updateProduct });
  },
  UpdatePhoToProduct:
    (ifile, productId, PhotoSource, PhotoNew, indexMax, folder, typeAction) =>
    async (dispatch, getState) => {
      const url = URL + "Product/UpdatePhoto";
      const formData = await new FormData();
      if (ifile) {
        if (typeAction === "update") {
          await formData.append("ifile", ifile);
        } else {
          for (let i = 0; i < ifile.length; i++) {
            await formData.append("ifile", ifile[i]);
          }
        }
      }
      const requestOptions = {
        method: "POST",
        headers: {
          Authorization: getToken(),
          productId: productId,
          PhotoSource: PhotoSource,
          PhotoNew: PhotoNew,
          indexMax: indexMax,
          folder: folder,
        },
        body: formData,
      };
      const response = await fetch(url, requestOptions);
      const updatePhotoProduct = await response.json();
      dispatch({ type: "Update_Photo_Product", updatePhotoProduct });
    },
  GetListProduct: (data) => async (dispatch, getState) => {
    const url = URL + "Product/GetList";
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: getToken(),
      },
    };
    const response = await fetch(url, requestOptions);
    const getListProduct = await response.json();
    dispatch({ type: "Get_List_Product", getListProduct });
  },
  GetListProductType: () => async (dispatch, getState) => {
    const url = URL + "Product/ListProductType";
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: getToken(),
      },
    };
    const response = await fetch(url, requestOptions);
    const getListProductType = await response.json();
    dispatch({ type: "Get_List_Product_Type", getListProductType });
  },
};
export const reducer = (state, action) => {
  state = state || initialState;
  let list = state.list;
  let listProductPrice = state.listProductPrice;
  switch (action.type) {
    case "GET_LIST_CATEGORY": {
      return {
        ...state,
        loading: action.loading,
        errors: action.errors,
        linkfile: "",
        categories: action.listCategory,
      };
    }
    case "IMPORT_FILE_PRODUCT": {
      return {
        ...state,
        importProduct: action.results,
      };
    }
    case "GET_TEMPLATE": {
      return {
        ...state,
        getTemplate: action.results,
      };
    }
    case "POST_SAVE_PRODUCT": {
      return {
        ...state,
        loading: action.loading,
        linkfile: "",
        errors: action.results,
      };
    }
    case "GET_LIST_PRODUCT": {
      return {
        ...state,
        loading: action.loading,
        linkfile: "",
        errors: "Success " + action.results.length,
        list: action.results,
      };
    }
    case "GET_LIST_ProductCate": {
      return {
        ...state,
        loading: action.loading,
        errors: action.errors,
        productCates: action.productCates,
      };
    }
    case "GET_LIST_ProductPermission": {
      return {
        ...state,
        loading: action.loading,
        errors: action.errors,
        productPermissions: action.productPermissions,
      };
    }
    case "GET_File_ProductPermission": {
      return {
        ...state,
        loading: action.loading,
        errors: action.errors,
        urlFile: action.urlFile,
      };
    }
    //// Product-Price
    case "Filter_Product_Price": {
      return {
        ...state,
        listProductPrice: action.listProductPrice,
      };
    }
    case "Insert_Product_Price": {
      if (
        typeof action.insertProductPrice === "object" &&
        action.insertProductPrice[0] &&
        action.insertProductPrice[0].alert == "1"
      ) {
        listProductPrice = action.insertProductPrice;
      }
      return {
        ...state,
        insertProductPrice: action.insertProductPrice,
        listProductPrice: listProductPrice,
      };
    }
    case "Update_Product_Price": {
      if (
        typeof action.payload.updateProductPrice === "object" &&
        action.payload.updateProductPrice[0] &&
        action.payload.updateProductPrice[0].alert == "1"
      ) {
        let result = action.payload.updateProductPrice[0];
        Object.assign(listProductPrice[action.payload.index], result);
      }
      return {
        ...state,
        updateProductPrice: action.payload.updateProductPrice,
        listProductPrice: listProductPrice,
      };
    }
    case "Save_Product_Price": {
      if (
        typeof action.payload.saveProductPrice === "object" &&
        action.payload.saveProductPrice[0] &&
        action.payload.saveProductPrice[0].response === "1"
      ) {
        if (action.payload.Action === "UPDATE") {
          let result = action.payload.saveProductPrice[0];
          Object.assign(listProductPrice[action.payload.index], result);
        } else if (action.payload.Action === "DELETE") {
          listProductPrice.splice(action.payload.index, 1);
        } else if (action.payload.Action === "INSERT") {
          listProductPrice = action.payload.saveProductPrice;
        } else {
          return false;
        }
      }
      return {
        ...state,
        saveProductPrice: action.payload.saveProductPrice,
        listProductPrice: listProductPrice,
      };
    }
    case "Import_Product_Price": {
      return {
        ...state,
        importProductPrice: action.importProductPrice,
      };
    }
    case "Export_Product_Price": {
      return {
        ...state,
        exportProductPrice: action.exportProductPrice,
      };
    }
    case "Delete_Product_Price": {
      if (
        action.payload.deleteProductPrice &&
        action.payload.deleteProductPrice.status === 1
      ) {
        listProductPrice.splice(action.payload.index, 1);
      }
      return {
        ...state,
        deleteProductPrice: action.payload.deleteProductPrice,
        listProductPrice: listProductPrice,
      };
    }
    case "Template_Product_Price": {
      return {
        ...state,
        templateProductPrice: action.templateProductPrice,
      };
    }
    ///////
    case "Insert_Product": {
      if (
        typeof action.insertProduct === "object" &&
        action.insertProduct[0] &&
        action.insertProduct[0].alert == "1"
      ) {
        list = action.insertProduct;
      }
      return {
        ...state,
        insertProduct: action.insertProduct,
        list: list,
      };
    }
    case "Update_Product": {
      if (
        typeof action.updateProduct === "object" &&
        action.updateProduct[0] &&
        action.updateProduct[0].alert == "1"
      ) {
        let index = list.findIndex((e) => e.id === action.updateProduct[0].id);
        Object.assign(list[index], action.updateProduct[0]);
      }
      return {
        ...state,
        updateProduct: action.updateProduct,
        list: list,
      };
    }
    case "Update_Photo_Product": {
      return {
        ...state,
        updatePhotoProduct: action.updatePhotoProduct,
      };
    }
    case "EXPORT_PRODUCT": {
      return {
        ...state,
        exportProduct: action.exportProduct,
      };
    }
    case "Get_List_Product": {
      return {
        ...state,
        getListProduct: action.getListProduct,
      };
    }
    case "Get_List_Product_Type": {
      return {
        ...state,
        getListProductType: action.getListProductType,
      };
    }
    default:
      return state;
  }
};
