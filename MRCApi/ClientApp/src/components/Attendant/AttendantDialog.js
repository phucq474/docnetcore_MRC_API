import React, { Component } from 'react'
import { connect } from 'react-redux';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import './attendant.css'
import { AttendantCreateAction } from '../../store/AttendantController';
import ShiftDropDownList from '../Controls/ShiftDropDownList';
import { Dropdown } from 'primereact/dropdown';

class AttendantDialog extends Component {
    getItemStyle = (isDragging, draggableStyle) => ({
        userSelect: 'none',
        ...draggableStyle,
    });
    getListStyle = isDraggingOver => ({
        display: 'flex',
        overflow: 'auto',
    });
    handleDisplayCopyButtons = (e, idx) => {
        let copyButton = document.querySelectorAll(".copy_button")
        let rectImage = document.querySelectorAll(".attendant_image")[idx].getBoundingClientRect();
        let x = e.clientX - rectImage.left;
        let y = e.clientY - rectImage.top;
        if (x > 220) x = 220
        if (y > 300) y = 300
        if (copyButton[idx].style.display === "block") {
            copyButton[idx].style.display = "none";
        } else {
            copyButton[idx].style.display = "block";
            copyButton[idx].style.top = `${y}px`;
            copyButton[idx].style.left = `${x}px`;
        }
    }
    render() {
        const { stateName, displayDialog, displayFooterAction, handleDialog, handleDialogConfirm, handleChangeForm, inputValues,
            handleActionFunction, dialogStateName, handleInputFileChange, handleCloneImage, handleDisplayImageEditor,
            onDragEnd, isLoading, handleChangeDropDown, shiftOption, accId
        } = this.props
        const shiftDrop = shiftOption;
        let result = [];
        if (shiftDrop.length > 0) {
            shiftDrop.forEach(element => {
                result.push({ name: element.shiftName, value: element.shiftCode });
            });
        }
        return (
            <React.Fragment>
                <Dialog header={`${inputValues.shopName} - ${inputValues.fullName}`} visible={displayDialog} style={{ width: '95vw' }} position="top" footer={displayFooterAction(null, dialogStateName, true)} onHide={() => handleDialog(false, dialogStateName)}>
                    <div className="p-col-12 p-md-5 p-sm-5">
                        <label>{this.props.language["shift"] || "l_shift"}</label>
                        <div>
                            <Dropdown value={inputValues.shiftCode ? inputValues.shiftCode : ""}
                                options={result} onChange={(e) => handleChangeForm(e.value, stateName, "shiftCode")}
                                optionLabel="name" filter showClear filterBy="name" style={{ width: '100%' }}
                                placeholder={this.props.language["select_shift_code"] || "l_select_shift_code"} />
                        </div>
                    </div>
                    <div style={{ display: "flex", justifyContent: "center" }}>
                        <DragDropContext onDragEnd={onDragEnd} >

                            <Droppable droppableId="droppable" direction="horizontal">
                                {(provided, snapshot) => (
                                    <div
                                        ref={provided.innerRef}
                                        style={this.getListStyle(snapshot.isDraggingOver)}
                                        {...provided.droppableProps}>
                                        {
                                            inputValues.cardDatas && inputValues.cardDatas.map((e, idx) => (
                                                <Draggable key={e.idDragDrop} draggableId={e.idDragDrop} index={idx} isDragDisabled={isLoading ? true : false}>
                                                    {(provided, snapshot) => (
                                                        <div
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                            style={this.getItemStyle(
                                                                snapshot.isDragging,
                                                                provided.draggableProps.style
                                                            )}>
                                                            <div className="p-mr-2" >
                                                                <Card style={{ width: '20em' }} className="ui-card-shadow">

                                                                    <div className="p-d-flex p-flex-column  p-jc-center p-ai-center" style={{ overflowX: 'hidden' }} >
                                                                        <div className="p-d-flex" style={{ width: "100%" }}>
                                                                            <InputText value={inputValues[`checkType${idx}`] || ""} onChange={(e) => handleChangeForm(e.target.value, stateName, `checkType${idx}`)} disabled={true} style={{ width: "45%" }} />
                                                                            <input type="time" value={inputValues[`date${idx}`] || ""} onChange={(e) => { handleChangeForm(e.target.value, stateName, `date${idx}`) }}
                                                                                style={{ width: "40%", background: "none", color: "inherit", fontSize: "1.1em", cursor: "pointer" }} disabled={e.isImageChanged} />
                                                                            <Button icon="pi pi-image" className="p-button-warning" onClick={async () => {
                                                                                await handleDisplayImageEditor(true, "displayImageEditor", { imageForEdit: e.prevEditedImage ? e.prevEditedImage : e.photo, indexImage: idx, insertAll: false, shouldUpdate: e.shouldImageUpdate, dialog: dialogStateName, photo: e.photo })
                                                                            }} style={{ width: "15%" }}></Button>
                                                                        </div>
                                                                        <div className="attendant_container" >
                                                                            <img src={e.photo || ""} className={inputValues.classImage} />
                                                                            <input type="file" accept="image/*" className={inputValues.classInputFile} onChange={() => handleInputFileChange(idx, "update")} />
                                                                            <Button className="copy_button_container" onClick={(e) => this.handleDisplayCopyButtons(e, idx)} />
                                                                            <div className="copy_button">
                                                                                <div className="p-d-flex p-flex-column">
                                                                                    {(idx !== 0 && inputValues.cardDatas[0].shouldImageUpdate) && (
                                                                                        <button className="copy_button_child" onClick={() => handleCloneImage(idx, inputValues.cardDatas[0].photo)}>0</button>
                                                                                    )}
                                                                                    {(idx !== 1 && inputValues.cardDatas[1].shouldImageUpdate) && (
                                                                                        <button className="copy_button_child" onClick={() => handleCloneImage(idx, inputValues.cardDatas[1].photo)}>1</button>
                                                                                    )}
                                                                                    {(idx !== 2 && inputValues.cardDatas[2].shouldImageUpdate) && (
                                                                                        <button className="copy_button_child" onClick={() => handleCloneImage(idx, inputValues.cardDatas[2].photo)}>2</button>
                                                                                    )}
                                                                                    {(idx !== 3 && inputValues.cardDatas.length > 3 && inputValues.cardDatas[3].shouldImageUpdate) && (
                                                                                        <button className="copy_button_child" onClick={() => handleCloneImage(idx, inputValues.cardDatas[3].photo)}>3</button>
                                                                                    )}
                                                                                    {(idx !== 4 && inputValues.cardDatas.length > 4 && inputValues.cardDatas[4].shouldImageUpdate) && (
                                                                                        <button className="copy_button_child" onClick={() => handleCloneImage(idx, inputValues.cardDatas[4].photo)}>4</button>
                                                                                    )}
                                                                                    {(idx !== 5 && inputValues.cardDatas.length > 5 && inputValues.cardDatas[5].shouldImageUpdate) && (
                                                                                        <button className="copy_button_child" onClick={() => handleCloneImage(idx, inputValues.cardDatas[5].photo)}>5</button>
                                                                                    )}
                                                                                    {(idx !== 6 && inputValues.cardDatas.length > 6 && inputValues.cardDatas[6].shouldImageUpdate) && (
                                                                                        <button className="copy_button_child" onClick={() => handleCloneImage(idx, inputValues.cardDatas[6].photo)}>6</button>
                                                                                    )}
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        <div className="p-d-flex" style={{ width: '100%' }}>
                                                                            {e.shouldImageUpdate && (
                                                                                <Button icon="pi pi-trash" className="p-button-danger p-button-outlined" onClick={() => handleDialogConfirm(true, "displayDialogDeleteItem", { index: idx })} style={{ width: "50%" }} />
                                                                            )}
                                                                            <Button icon={`pi ${!e.isImageChanged ? "pi-save" : "pi-plus"}`} className="p-button-info p-button-outlined" onClick={() => handleActionFunction(idx, e.shouldImageUpdate)} style={{ width: `${e.shouldImageUpdate ? "50%" : "100%"}` }}
                                                                                disabled={e.isImageChanged}
                                                                            />
                                                                        </div>
                                                                        <small className="p-invalid p-d-block">{inputValues[`errorDate${idx}`] || ""}</small>
                                                                    </div>
                                                                </Card>
                                                            </div>
                                                        </div>
                                                    )}
                                                </Draggable>
                                            ))}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </DragDropContext>
                    </div>
                </Dialog >
            </React.Fragment >
        )
    }
}
function mapStateToProps(state) {
    return {
        language: state.languageList.language,

    }
}
function mapDispatchToProps(dispatch) {
    return {
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(AttendantDialog);
