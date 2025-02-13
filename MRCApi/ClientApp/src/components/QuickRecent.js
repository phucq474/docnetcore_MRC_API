import React, { useState, useEffect, useRef } from 'react'
import { Button } from 'primereact/button'
import { DataView, DataViewLayoutOptions } from 'primereact/dataview'
import { BreadCrumb } from 'primereact/breadcrumb';
import moment from 'moment';
import { useSelector } from 'react-redux';
import { ConfirmPopup, confirmPopup } from 'primereact/confirmpopup';
export const QuickRecent = () => {
    const language = useSelector(state => state.languageList.language);
    const [layout, setLayout] = useState('grid');
    const [data, setData] = useState([])
    const [visible, setVisible] = useState(false);
    useEffect(() => {
        let list = JSON.parse(localStorage?.getItem("QRECENT") || '[]')
        list = list.sort((a, b) => moment(a?.sortRecent) - moment(b?.sortRecent))
        setData(list);
    }, [])
    const renderListItem = (item) => {
        let lstparent = JSON.parse(localStorage?.getItem("menuList") || '[]')
        let info = lstparent.filter(a => a.MenuId === item.ParentId)
        const parentName = info?.length > 0 ? info[0].MenuTitle : null;
        const siteMap = parentName !== null ? [{ label: parentName }, { label: item?.MenuTitle }] : [{ label: item?.MenuTitle }]
        return (
            <div className="p-col-12">
                <div style={{ padding: 10 }} className="p-shadow-7">
                    <div className="p-d-flex p-jc-between">
                        <BreadCrumb model={siteMap}
                            home={{ icon: 'pi pi-home', url: 'https://www.primefaces.org/primereact/showcase' }} />
                        <div className="p-d-flex p-jc-between">
                            <div style={{ paddingLeft: 10, fontSize: 12, fontStyle: 'italic', textAlign: 'left', alignSelf: 'center' }} className="p-mr-2">
                                {language["used"] || "l_used"} {moment(item.timeRecent).calendar()}
                            </div>
                            <Button icon="pi pi-arrow-circle-right" onClick={() => goPage(item.MenuUrl)}
                                label={language["go"] || "l_go"}></Button>
                        </div>
                    </div>
                </div >
            </div >
        );
    }
    const renderGridItem = (item) => {
        let lstparent = JSON.parse(localStorage?.getItem("menuList") || '[]')
        let info = lstparent.filter(a => a.MenuId === item.ParentId)
        const parentName = info?.length > 0 ? info[0].MenuTitle : null;
        const siteMap = parentName !== null ? [{ label: parentName }, { label: item?.MenuTitle }] : [{ label: item?.MenuTitle }]
        return (
            <div style={{ padding: 5 }} className="p-col-12 p-md-3">
                <div style={{ borderRadius: 15 }} className="p-shadow-7">
                    <div>
                        <BreadCrumb model={siteMap}
                            home={{ icon: 'pi pi-home', url: 'https://www.primefaces.org/primereact/showcase' }} />
                    </div>
                    <div className="row">
                        <div className="p-d-flex p-jc-between">
                            <div style={{ width: 70, height: 70, padding: 13 }}>
                                <i style={{ 'fontSize': '4em' }} className={item?.MenuIcon || "pi pi-folder-open"}></i>
                            </div>
                            <div style={{ alignSelf: 'center', fontStyle: 'italic', opacity: 0.7, paddingRight: 10 }}>{item?.MenuUrl.toLowerCase()}</div>
                        </div>
                        <div style={{ textAlign: 'right', paddingRight: 14, paddingBottom: 10 }}
                            className="p-d-flex p-jc-between">
                            <div style={{ paddingLeft: 10, fontSize: 12, fontStyle: 'italic', textAlign: 'left', alignSelf: 'center' }} className="p-mr-2">
                                {language["used"] || "l_used"} {moment(item.timeRecent).calendar()}
                            </div>
                            <Button onClick={() => goPage(item.MenuUrl)} icon="pi pi-arrow-circle-right" label={language["go"] || "l_go"}></Button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    const goPage = (href) => {
        window.location.href = href
    }
    const itemTemplate = (data, layout) => {
        if (!data) {
            return;
        }

        if (layout === 'list')
            return renderListItem(data);
        else if (layout === 'grid')
            return renderGridItem(data);
    }
    const renderHeader = () => {
        return (
            <div className="p-grid">
                <div className="p-col-12" style={{ textAlign: 'right', alignSelf: 'center' }}>
                    <div className="p-d-flex p-jc-between">
                        <div>
                            {language["recents"] || "l_recents"}
                        </div>
                        <div className="p-d-flex ">
                            <Button onClick={confirmDeleted} tooltip={language["clearhistory"] || "l_clearhistory"} type="button" icon="pi pi-trash" className="p-button-danger" />
                            <DataViewLayoutOptions layout={layout} onChange={(e) => setLayout(e.value)} />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    const accept = () => {
        localStorage.removeItem("QRECENT")
        setData([]);
    };


    const confirmDeleted = (event) => {
        confirmPopup({
            target: event.currentTarget,
            message: language["messager_clear"] || "l_messager_clear",
            icon: 'pi pi-exclamation-triangle',
            accept
        });
    };
    const header = renderHeader();
    return (
        <div style={{ padding: 10 }} className="dataview-demo">
            <ConfirmPopup target={document.getElementById('button')}
                visible={visible} onHide={() => setVisible(false)} message="Are you sure you want to proceed?"
                icon="pi pi-exclamation-triangle" accept={accept} />
            <div className="card">
                <DataView value={data} layout={layout} header={header}
                    itemTemplate={itemTemplate} rows={9} />
            </div>
        </div>
    )
}