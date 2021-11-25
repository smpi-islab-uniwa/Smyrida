import React, { Component } from 'react';    
import * as Cookies from "js-cookie"
class LeftMenu extends Component { 

    
    csvheaders= { //object of csv file header
      csvheaders:null,
      csvlist:null,
      seperator:';'
    } 

    state={
         specific:"" ,
         menu:false
    }
    userfiles = {   //all files
        allfiles:[],
        counter:0
      }

      Getheadersep =()=>{  
        if(this.state.specific!==''){
          this.Getheaders(this.state.specific); //if a file is selected get headers
 
        }
      }
      Getheaders = (file) => {
        const data = new FormData();  //get file headers from API
            data.append('filename',file);   
            data.append('seperator',document.getElementById('selectedsep').value);   
            data.append('folder',Cookies.get("session"));
            fetch((window.globalConfig['serverURL'] || { siteName: process.env.REACT_APP_SERVER_URL})+'/headers', {
                                              method: 'POST',
                                              body: data,
            }).then(response => (response.json()))
              .then(data => { 
                if (data[0].error===undefined){
                this.csvheaders.csvlist=data[0].dataheaderslist; 
                this.csvheaders.seperator=document.getElementById('selectedsep').value;
             
                 this.props.parentCallback2(this.csvheaders.csvlist,this.csvheaders.seperator);
                // this.setState({reload:true});
                }
            });
      } 

      changecolor = event => {   
        var all = document.getElementsByClassName("filelistitem");
        for (var i=0;i<all.length;i++){
          all[i].classList.remove("greenfont");
        } 
        var specific =  document.getElementById(event);
        specific.classList.add("greenfont");  
        this.props.parentCallback(specific.innerHTML);
        this.setState({specific:specific.innerHTML});
        if(specific.innerHTML.includes(".csv")){ 
          this.Getheaders(specific.innerHTML);
        }
};


    GetFileNames=()=>{ 
        const data = new FormData();  
        this.userfiles.allfiles=[];
       data.append('folder',   Cookies.get("session"));   
        fetch((window.globalConfig['serverURL'] || { siteName: process.env.REACT_APP_SERVER_URL})+'/getfilenames', {
                                          method: 'POST' ,
                                          body: data
        }).then(response => (response.json()))
          .then(data => {   
            var counter = 0;
            if (data[0].error===undefined){ 
              for (var x in data[0].filenames){ 
    
                if (data[0].filenames[x].includes('xes')){    //value of xes files in dictionary is true else false
                  this.userfiles.allfiles[data[0].filenames[x]]=true
             
                  }else{
                  this.userfiles.allfiles[data[0].filenames[x]]=false
                  }
                  counter+=1;
              }
              this.userfiles.counter=counter;
              this.setState({menu:true});
            } 
        });
      }



    render(){
        var sidetable = []; 

        if(this.state.menu){ 
            if (this.userfiles.counter>0){
                return(
                  <div className="w3-sidebar w3-light-grey w3-bar-block" > 
                  <h3 className="w3-bar-item">Files</h3>
                  <div><p className="chooseseperatordiv">Choose sepeartor</p><input id='selectedsep' className='selectedsep' onChange={() => this.Getheadersep()} /> </div> 
                <div>
                {Object.entries(this.userfiles.allfiles).map(([key, value]) => {
                sidetable.push(<div key={key} className=" w3-button"><span id={key} onClick={() => this.changecolor(key)} className="w3-bar-item filelistitem">{key}</span></div> );
                return false;
                })}   
                {sidetable} 
                </div> </div>);
            }
            else{
                return(<div></div>);
            }
        }
        else{
            this.GetFileNames();
            return(<div></div>);
        }

    }
            
} 
      
 
     
export default LeftMenu;
