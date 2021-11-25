import React, { Component } from 'react';  
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMailBulk } from '@fortawesome/free-solid-svg-icons'
import { faLock } from '@fortawesome/free-solid-svg-icons'
import {
  Route, 
  HashRouter
} from "react-router-dom";
import Signup from "./Signup.js" 
import * as Cookies from "js-cookie"

class Login extends Component { 
      
      loginuser={
        mail:""
      }
      
      state = {
        isvalid:false,
        mail:"",
        signup:false    
      }  
   
      onFileChange = event => {  
        // if((event.target.files[0].name.includes('.xes'))||(event.target.files[0].name.includes('.csv'))){ //save only xes or csv files on state
        //       document.getElementById('selectedfilename').innerText=(event.target.files[0].name);
        //       this.file.selectedfile = event.target.files[0] ;
        //       this.file.filename=event.target.files[0].name; 
        // }
     };   
     loginbtnClick = event => {    
            
      if((document.querySelector('#usermail').value.length>0)&&(document.querySelector('#userpassword').value.length>0)){
       
            if((document.querySelector('#usermail').value.length>0)&&(document.querySelector('#userpassword').value.length>0)){
                  const data = new FormData(); 
                  data.append('usermail', document.querySelector('#usermail').value); 
                  data.append('password',document.querySelector('#userpassword').value);   
                  fetch((window.globalConfig['serverURL'] || { siteName: process.env.REACT_APP_SERVER_URL})+'/authenticate', {
                  method: 'POST',
                  body: data,
                  }).then(response => (response.json()))
                  .then(data => {    
                    if ((data[0].error===undefined)&&(data[0].api_error===undefined)){  
                      this.loginuser.mail = data[0].success; 
                      Cookies.set("session", this.loginuser.mail); 
                      Cookies.set("hasfiles", data[0].hasfiles);
                      this.setState({ isvalid: true }); 
                    }
                    else{ 
                      document.querySelector('#apispan').classList.remove("visiblehidden"); 
                      document.querySelector('#apispan').classList.add("visibleenable"); 
                    }
                  }).catch((error) => { 
                 //   document.getElementById('selectedfilename').innerText=("500 Internal Server Error");
                  });
                }
              }
              else{
                if(document.querySelector('#usermail').value.length===0){ 
                  document.querySelector('#mailspan').classList.remove("visiblehidden"); 
                  document.querySelector('#mailspan').classList.add("visibleenable"); 
                  return;
                }
                if(document.querySelector('#userpassword').value.length===0){
                  document.querySelector('#passwordspan').classList.remove("visiblehidden"); 
                  document.querySelector('#passwordspan').classList.add("visibleenable");  
                  return;
                }
              }
     }

     redirect= event => {    
      this.setState({ signup: true}); 
     }
     callbackFunction = event => {
      this.setState({ signup: false}); 
     }
     changemail(event)
     { 
        document.querySelector('#mailspan').classList.add("visiblehidden"); 
        document.querySelector('#mailspan').classList.remove("visibleenable"); 
        document.querySelector('#apispan').classList.add("visiblehidden"); 
        document.querySelector('#apispan').classList.remove("visibleenable"); 
     }

       changepass(event)
     { 
      document.querySelector('#passwordspan').classList.add("visiblehidden"); 
      document.querySelector('#passwordspan').classList.remove("visibleenable"); 
      document.querySelector('#apispan').classList.add("visiblehidden"); 
      document.querySelector('#apispan').classList.remove("visibleenable"); 
     }
     
     
     sendData = () => {
        this.props.parentCallback(this.file.filename);
     }
      render() {          
       if(this.state.signup===false){
        if (this.state.isvalid === false){          
          
          return (
            <div className="centeredlogin" > 
                <div className="backgroundlogin">
                    <h1 className="loginpadlr">Member Login</h1>
                    
                    <div   id="usernamediv" className="form-group textlogin">  
                        <FontAwesomeIcon className="fontawesomeposition" icon={faMailBulk} />
                        <input id="usermail" className="form-control" type="text" onBlur={this.changemail} placeholder="E-mail"></input>
                        <span id="mailspan" className="visiblehidden" >Please provide a valid mail</span>
                    </div>

                    <div   id="passworddiv" className="form-group passlogin">  
                        <FontAwesomeIcon className="fontawesomeposition" icon={faLock} />
                        <input id="userpassword" className="form-control" placeholder="Password"  onBlur={this.changepass}  type="password" ></input>
                        <span id="passwordspan" className="visiblehidden" >Please provide a valid password</span>
                    </div>
                    <span id="apispan" className="visiblehidden" >Please enter a correct mail or password</span>
                    <center>
                    <input type="button" id="loginbtn" className="loginbtn"  onClick={this.loginbtnClick} value="Login"></input>
                    </center>
                    <div>
                      <span>Don't have an account. </span><a onClick={this.redirect} href="#newacc" >Signup here</a> 
                    </div>
                     
                    </div>
                   
            </div>
          );
        }
        else{   
              this.props.parentCallback(this.loginuser.mail);
              return(
                <div></div>)
        }
    }
    else{
         return(<div>
             <HashRouter>
            <Route path="/newacc" component={() => <Signup parentCallback = {this.callbackFunction}  />} />
            </HashRouter>
         </div>) 
    }
  }      
            
  }//CLASS END  
 
   
  
    
export default Login;
