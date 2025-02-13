import React,{Component } from "react";
import { Container} from "react-bootstrap";
const stylePass={
        background:{
            backgroundImage: "url('../images/Background02.svg')" ,
            backgroundRepeat: 'no',
            height:'100%'
        }
    }
export  default class Banner extends Component{
    constructor(props){
        super(props);
        this.state={}
    }
    
    render(){
        return(
            <Container style={{marginBottom:'70px'}}>
               
            </Container>
        );
    }
}