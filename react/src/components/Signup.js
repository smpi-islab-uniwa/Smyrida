import React, { Component } from 'react';  
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMailBulk } from '@fortawesome/free-solid-svg-icons'
import { faLock } from '@fortawesome/free-solid-svg-icons'
 

class Signup extends Component { 
       
      state = {
        isvalid:false,
        mail:""    
      }  
   
      onFileChange = event => {  
        // if((event.target.files[0].name.includes('.xes'))||(event.target.files[0].name.includes('.csv'))){ //save only xes or csv files on state
        //       document.getElementById('selectedfilename').innerText=(event.target.files[0].name);
        //       this.file.selectedfile = event.target.files[0] ;
        //       this.file.filename=event.target.files[0].name; 
        // }
     };   
     signupbtn = event => {    
          
            if((document.querySelector('#usermail').value.length>0)&&(document.querySelector('#userpassword').value.length>0)){
                  if (ValidateEmail(document.querySelector('#usermail'))===false){
                    document.querySelector('#mailspan').classList.remove("visiblehidden"); 
                    document.querySelector('#mailspan').classList.add("visibleenable"); 
                    return;
                  }

                  if(document.querySelector('#userpassword').value!==document.querySelector('#userpassword2').value){
                    document.querySelector('#passwordspan').classList.remove("visiblehidden"); 
                    document.querySelector('#passwordspan').classList.add("visibleenable"); 
                    document.querySelector('#passwordspan').textContent="Please insert the same passwords";
                    return;
                  }
                  if(document.querySelector('#userpassword').value.length<6){
                    document.querySelector('#passwordspan').classList.remove("visiblehidden"); 
                    document.querySelector('#passwordspan').classList.add("visibleenable"); 
                    document.querySelector('#passwordspan').textContent="The password must have more than 6 characters";
                    return;
                  }

                  const data = new FormData(); 
                  data.append('usermail', document.querySelector('#usermail').value); 
                  data.append('password',document.querySelector('#userpassword').value);   
                  fetch((window.globalConfig['serverURL'] || { siteName: process.env.REACT_APP_SERVER_URL})+'/createuser', {
                  method: 'POST',
                  body: data,
                  }).then(response => (response.json()))
                  .then(data => {   
                    if (data[0].api_error===undefined){  
                      this.props.parentCallback();
                    }
                    else{  
                      document.querySelector('#mailexists').textContent=data[0].api_error; 
                      document.querySelector('#mailexists').classList.add("visibleenable"); 
                    }
                  }).catch((error) => { 
                 //   document.getElementById('selectedfilename').innerText=("500 Internal Server Error");
                  });
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
                    document.querySelector('#passwordspan').textContent="Please fill password";
                    return;
                  }
                }
               
     }
     changemail(event)
     {  
        document.querySelector('#mailexists').classList.add("visiblehidden"); 
        document.querySelector('#mailexists').classList.remove("visibleenable"); 
        document.querySelector('#mailspan').classList.add("visiblehidden"); 
        document.querySelector('#mailspan').classList.remove("visibleenable"); 
     }

       changepass(event)
     { 
      document.querySelector('#passwordspan').classList.add("visiblehidden"); 
      document.querySelector('#passwordspan').classList.remove("visibleenable"); 
     }
     
     return = () => {
        this.props.parentCallback();
     }
      render() {          
        if (this.state.isvalid === false){         // shows the file upload box
          
          return (
            <div className="centeredlogin"> 
                <div className="backgroundlogin">
                    <h1 className="loginpadlr">Member Signup</h1>
                    
                    <div   id="usernamediv" className="form-group textSingupmail">  
                        <FontAwesomeIcon className="fontawesomeposition" icon={faMailBulk} />
                        <input id="usermail" className="form-control" type="text" onBlur={this.changemail} placeholder="E-mail"></input>
                        <span id="mailspan" className="visiblehidden" >Please provide a valid mail</span>
                    </div>
                    <div   id="passworddiv" className="form-group textSinguppass">  
                        <FontAwesomeIcon className="fontawesomeposition" icon={faLock} />
                        <input id="userpassword" className="form-control" placeholder="Password"  onBlur={this.changepass}  type="password" ></input>
                    </div>
                    <div   id="passworddiv" className="form-group textSinguppass2">  
                        <FontAwesomeIcon className="fontawesomeposition" icon={faLock} />
                        <input id="userpassword2" className="form-control" placeholder="Retype Password"  onBlur={this.changepass}  type="password" ></input>
                    </div>
                    <span id="passwordspan" className="visiblehidden"  >Password</span>
                    <p id="mailexists" className="visiblehidden" >Usermail Already exists!</p>
                    <div className="fixsignupos"> 
                      <center>
                      <input type="button" id="signupbtn" className="returnbtn"  onClick={this.return} value="Back to Login"></input>
                      <input type="button" id="signupbtn" className="loginbtn"  onClick={this.signupbtn} value="Create Account"></input>
                      
                      </center>
                    </div>
                     
                    </div>
                   
            </div>
          );
        }
        else{   

               this.props.parentCallback(this.state.mail);
              return(
                <div></div>)
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
  
    
export default Signup;
