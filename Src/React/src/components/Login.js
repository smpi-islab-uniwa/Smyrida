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

      message = "" //geo change
   
      onFileChange = event => {  
        // if((event.target.files[0].name.includes('.xes'))||(event.target.files[0].name.includes('.csv'))){ //save only xes or csv files on state
        //       document.getElementById('selectedfilename').innerText=(event.target.files[0].name);
        //       this.file.selectedfile = event.target.files[0] ;
        //       this.file.filename=event.target.files[0].name; 
        // }
     };   
     loginbtnClick = event => {    
            

       
            if((document.querySelector('#usermail').value.length>0)&&(document.querySelector('#userpassword').value.length>0)){
                  const data = new FormData(); 
                  data.append('usermail', document.querySelector('#usermail').value); 
                  data.append('password',document.querySelector('#userpassword').value);   
                  fetch((window.globalConfig['serverURL'] || { siteName: process.env.REACT_APP_SERVER_URL})+'/authenticate', {
                    method: 'POST',
                    body: data,
                  }).then(response => (response.json()))
                  .then(data => {    
                    console.log(data)
                    if ((data[0].error===undefined)&&(data[0].api_error===undefined)){  
                      this.loginuser.mail = data[0].success; 
                      Cookies.set("session", this.loginuser.mail); 
                      Cookies.set("hasfiles", data[0].hasfiles);
                      this.setState({ isvalid: true }); 
                    }
                    else{ 
                      
                      this.message = data[0].api_error //geo change
                      console.log(this.message)
                      document.querySelector('#apispan').innerHTML = this.message
                      document.querySelector('#apispan').classList.remove("visiblehidden"); 
                      document.querySelector('#apispan').classList.add("visibleenable");
                       
                    }
                  }).catch((error) => { 
                 //   document.getElementById('selectedfilename').innerText=("500 Internal Server Error");
                  });
            }
            else{
                if(document.querySelector('#usermail').value.length===0){ 
                  this.message =  'Please provide a mail'//geo change
                  console.log(this.message)
                  document.querySelector('#apispan').innerHTML = this.message
                  document.querySelector('#apispan').classList.remove("visiblehidden"); 
                  document.querySelector('#apispan').classList.add("visibleenable");
              return;
                }
                if(document.querySelector('#userpassword').value.length===0){
                  this.message =  'Please provide a password'//geo change
                  console.log(this.message)       
                  document.querySelector('#apispan').innerHTML = this.message
                  document.querySelector('#apispan').classList.remove("visiblehidden"); 
                  document.querySelector('#apispan').classList.add("visibleenable");
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
       if ((document.querySelector('#usermail').value.length>0)&&(ValidateEmail(document.querySelector('#usermail'))===false)){
        document.querySelector('#apispan').innerHTML = 'Please provide a valid mail'
        document.querySelector('#apispan').classList.remove("visiblehidden"); 
        document.querySelector('#apispan').classList.add("visibleenable"); 
       } 
       else{
        document.querySelector('#apispan').innerHTML = '';
       }
     }

    //  changepass(event)
    //  { 
    //   if (document.querySelector('#userpassword').value.length>0){
    //       document.querySelector('#apispan').innerHTML = 'Please provide a valid password'
    //       document.querySelector('#apispan').classList.remove("visiblehidden"); 
    //       document.querySelector('#apispan').classList.add("visibleenable"); 
    //     } 
    //     else{
    //       document.querySelector('#apispan').innerHTML = '';
    //     }
    //  }
     
     
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
                        
                    </div>

                    <div   id="passworddiv" className="form-group passlogin">  
                        <FontAwesomeIcon className="fontawesomeposition" icon={faLock} />
                        <input id="userpassword" className="form-control" placeholder="Password"  onBlur={this.changepass}  type="password" ></input>
                    </div>
                    
                    <span id="apispan" className="visiblehidden" >{this.message}</span> 
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
 
   
  function ValidateEmail(input) {

    var validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  
    if (input.value.match(validRegex)) {
   
      return true;
  
    } else { 
  
      return false;
  
    }
  
  }
    
    
export default Login;
