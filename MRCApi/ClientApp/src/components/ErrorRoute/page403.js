import React,{Component} from 'react'
import '../../css/page403.css'
import {createBrowserHistory} from 'history';
const history = createBrowserHistory();
class Page403 extends Component {
    constructor(props) {
        super(props)
    }
    render() {
        return (
            <div className="container_403">
                <div className="sub_container_403" >
                    <div style={{display: "flex",textAlign: "center",}}>
                        <div style={{color: "white",fontSize: "106px",marginLeft: "50px"}}>4</div>
                        <div>
                            <div className="lock"><div className="top"></div><div className="bottom"></div></div>
                        </div>
                        <div style={{color: "white",fontSize: "106px"}}>3</div>
                    </div>
                    <div>
                        <h2 style={{color: "white",fontFamily: "cursive"}}>Access Denied</h2>
                        <span className="support">
                            <a style={{
                                cursor: "pointer",
                                color: "white",
                                width: "112px",
                                fontSize: "29px",
                                fontFamily: "cursive"
                            }} onClick={() => history.goBack()}>Go Back</a>
                        </span>
                    </div>
                </div>
            </div>
        )
    }
}

export default Page403