import React,{Component} from 'react'
import '../../css/Error.css'
class Page404 extends Component {
    constructor(props) {
        super(props)
    }
    render() {
        return (
            <div>
                <div className="container_404">
                    <div className="scene">
                        <div className="overlay"></div>
                        <div className="overlay"></div>
                        <div className="overlay"></div>
                        <div className="overlay"></div>
                        <span className="bg-403">404</span>
                        <div className="text">
                            <span className="pnf">Page Not Found</span>
                            <span className="goback">
                                <a style={{cursor: "pointer"}} onClick={() => this.props.history.goBack()}>Go Back</a>
                            </span>
                        </div>
                        <div className="lock"></div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Page404