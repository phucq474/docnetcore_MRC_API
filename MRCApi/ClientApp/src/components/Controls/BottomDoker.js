import React,{Component} from 'react';
import Dock from "react-osx-dock";
class BottomDock extends Component{
render(){
    return(
        <div>
        <Dock width={800} magnification={1} magnifyDirection="up">
            {["/images/a", "/images/b", "/images/c", "/images/d", "/images/e"].map((item, index) => (
              <Dock.Item width={100} key={index} onClick={() => console.log(item)}>
                <img src={`${item}.png`} />
              </Dock.Item>
            ))}
          </Dock>
          </div>
    );
    }
}
export default BottomDock;