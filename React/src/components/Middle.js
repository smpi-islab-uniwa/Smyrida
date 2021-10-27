

import React, { Component } from 'react';  
import FirsTime from "./FirsTime.js"
import InductiveMiner from "./InductiveMiner.js"
import AlphaMiner from "./AlphaMiner.js"
import HeuristicMiner from "./HeuristicMiner.js"
import Frequency from "./Frequency.js"
import Meanduration from "./Meanduration.js"
import Traceduration from "./Traceduration.js"
import Activityduration from "./Activityduration.js"
import Conceptname from "./Conceptname.js"
import Info from "./Info.js"
import Converttocsv from "./Converttocsv.js"
import Converttoxes from "./Converttoxes.js"
import View from "./View.js"
import Replayresults from "./Replayresults.js"
import Alignments from "./Alignments.js"
import Login from "./Login.js"
import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import * as Cookies from "js-cookie"
import {
  Route, 
  HashRouter
} from "react-router-dom";
 
class Middle extends Component { 
  state={
    files:false,    //boolean if files exist
    specific:"" , //if user clicks on a file
    reload:false  //refresh state after headers are loaded 
  } 

  

  userfiles = {   //all files
    allfiles:[]
  }
  csvheaders= { //object of csv file header
    csvheaders:null,
    csvlist:null,
    seperator:';'
  } 
  
  logout=()=>{  
 //   this.userfiles.allfiles=[];
    Cookies.remove("session");
    Cookies.remove("hasfiles");
    Cookies.remove("files");
    this.setState({reload:true,files:false}); 
  }

  GetFileNames=()=>{ 
    const data = new FormData();  
    this.userfiles.allfiles=[];
   data.append('folder',   Cookies.get("session"));   
    fetch((window.globalConfig['serverURL'] || { siteName: process.env.REACT_APP_SERVER_URL})+'/getfilenames', {
                                      method: 'POST' ,
                                      body: data
    }).then(response => (response.json()))
      .then(data => {  
        var hasfiles =false;
        if (data[0].error===undefined){ 
          for (var x in data[0].filenames){
            hasfiles=true; 

            if (data[0].filenames[x].includes('xes')){    //value of xes files in dictionary is true else false
              this.userfiles.allfiles[data[0].filenames[x]]=true
         
              }else{
              this.userfiles.allfiles[data[0].filenames[x]]=false
              }
          }
          if (hasfiles===true){     
            Cookies.set("hasfiles",true); 
            this.setState({files:true}); 
          } 
          else{
            this.setState({reload:true});
          }
        }
        else{
          this.setState({reload:true});
        }
    });
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
                this.setState({reload:true});
                }
            });
    }
    clear = ()=>{
      
    }
  callbackFunction = (childData) => {  
    if(childData!==null){
        if(childData.includes(".xes")){
          this.userfiles.allfiles[childData]=true;
          this.setState({files:true});
          Cookies.set("hasfiles",true); 
        }
        if(childData.includes(".csv")){
          this.userfiles.allfiles[childData]=false;
          this.setState({files:true});
          Cookies.set("hasfiles",true); 
        } 
  }
  };

  callbackFunctionUser = (childData) => {     
     Cookies.set("session", childData);
     this.GetFileNames();
  };

  changecolor = event => {   
          var all = document.getElementsByClassName("filelistitem");
          for (var i=0;i<all.length;i++){
            all[i].classList.remove("greenfont");
          } 
          var specific =  document.getElementById(event);
          specific.classList.add("greenfont"); 
          this.setState({specific:specific.innerHTML});
          if(specific.innerHTML.includes(".csv")){ 
            this.Getheaders(specific.innerHTML);
          }
  };

  render() {  
    var sidetable = []; 
   
  if (Cookies.get("session") !== undefined) {   
  if (Boolean(Cookies.get("hasfiles"))===true){ //if main menu has files  
  if (this.state.files===true){ //if main menu has files
  return (
      <div>
         <HashRouter>
           
       <ul className="header">
              
              <li>
                <div className="dropdown hideelemnt"><button className="dropbtn"> File </button>
                    <div className="dropdown-content">
                      <a href="#/upload">Upload</a> 
                      <a href="#/toxes">Convert to xes</a> 
                      <a href="#/tocsv">Convert to csv</a> 
                      <a href="#/view">View</a> 
                      <a href="#/info">Info</a>  
                    </div>
                  </div> 
              </li>
              <li>  
                  <div  className="dropdown hideelemnt"><button className="dropbtn"> Discover Model </button>
                    <div className="dropdown-content">
                      <a href="#/alphaminer">Alpha Miner</a> 
                      <a href="#/hminer">Heuristics Miner</a>  
                      <a href="#/iminer">Inductive Miner</a>  
                    </div>
                  </div>
                </li>
              <li>
              <div className="dropdown hideelemnt"><button className="dropbtn"> Statistics </button>
                    <div className="dropdown-content "> 

                    <div className="dropdown2 hideelemnt"><button className="dropbtn dropevents"> Events </button>
                    {/* <div className="dropdown-content2 dropdown-contentevents"> 
                           <a className="frequency" href="#/frequency">Frequency</a>
                    
                    </div> */}
                    <a className="frequency" href="#/frequency">Frequency</a>
                    <a href="#/activityduration">Activity Duration</a>  
                    <a href="#/conceptname">Concept Name</a>   
                    <a href="#/meanduration">Mean Durations</a>   
                    <a href="#/traceduration">Trace Durations</a>   
                    </div>
                    </div>
                  </div>
              </li>
              <li><div className="dropdown hideelemnt"><button className="dropbtn"> Conformance </button>
                  <div className="dropdown-content "> 
                        <a href="#/replayresults">Replay Results</a>  
                        <a href="#/Alignments">Alignments</a>   
              </div>
              </div>
              </li>
              <li className="logout">
                  <a href="#/"  className="logoutspan" onClick={this.logout}>Log Out</a>
              </li>
            </ul>
            <div className="sidenav movelike10"> 
              <div className="sidebar" >
              <div className="w3-sidebar w3-light-grey w3-bar-block" > 
                    <h3 className="w3-bar-item">Files</h3>
                    <div><p className="chooseseperatordiv">Choose sepeartor</p><input id='selectedsep' className='selectedsep' onChange={() => this.Getheadersep()} /> </div>
                    {Object.entries(this.userfiles.allfiles).map(([key, value]) => {
                            sidetable.push(<div key={key} className=" w3-button"><span id={key} onClick={() => this.changecolor(key)} className="w3-bar-item filelistitem">{key}</span></div> );
                            return false;
                          })} 
                    {sidetable} 
                    </div>
              </div>
              
              </div><div className="main">  
            <div className="content contentwidth">  
              <Route path="/replayresults" component={() => <Replayresults value={this.csvheaders} folder={Cookies.get("session")} data={this.state.specific} parentCallback = {this.callbackFunction}   />} />
              <Route path="/toxes" component={() => <Converttoxes value={this.csvheaders}  folder={Cookies.get("session")}  data={this.state.specific} parentCallback = {this.callbackFunction}   />} />
              <Route path="/tocsv" component={() => <Converttocsv  data={this.state.specific}  folder={Cookies.get("session")}  parentCallback = {this.callbackFunction}   />} />
              <Route path="/upload" component={() => <FirsTime   folder={Cookies.get("session")}  parentCallback = {this.callbackFunction}   />} />
              <Route path="/alphaminer" component={() => <AlphaMiner  folder={Cookies.get("session")}  value={this.csvheaders} data={this.state.specific}/>} />
              <Route path="/hminer" component={() => <HeuristicMiner  folder={Cookies.get("session")}  value={this.csvheaders}  data={this.state.specific}/>} />
              <Route path="/iminer" component={() => <InductiveMiner  folder={Cookies.get("session")}  value={this.csvheaders}   data={this.state.specific}/>} />
              <Route path="/frequency" component={() => <Frequency  folder={Cookies.get("session")}  value={this.csvheaders}  data={this.state.specific}/>} />
              <Route path="/activityduration" component={() => <Activityduration value={this.csvheaders}  folder={Cookies.get("session")}  data={this.state.specific} parentCallback = {this.callbackFunction}   />} />    
              <Route path="/conceptname" component={() => <Conceptname value={this.csvheaders}  folder={Cookies.get("session")}  data={this.state.specific} parentCallback = {this.callbackFunction}   />} />    
              <Route path="/meanduration" component={() => <Meanduration value={this.csvheaders}  folder={Cookies.get("session")}  data={this.state.specific} parentCallback = {this.callbackFunction}   />} />    
              <Route path="/traceduration" component={() => <Traceduration value={this.csvheaders}  folder={Cookies.get("session")}  data={this.state.specific} parentCallback = {this.callbackFunction}   />} />    
              <Route path="/info" component={() => <Info value={this.csvheaders}  folder={Cookies.get("session")}  data={this.state.specific}/>} />
              <Route path="/view" component={() => <View  folder={Cookies.get("session")}  value={this.csvheaders.seperator} data={this.state.specific}/>} />
              <Route path="/alignments" component={() => <Alignments value={this.csvheaders}  folder={Cookies.get("session")}  data={this.state.specific} parentCallback = {this.callbackFunction}   />} />  
                        
           </div> 
            </div>
        </HashRouter>
      </div>
    );
    }else{
      this.GetFileNames();
      return(<div><Loader
        type="ThreeDots"
        color="#dc905e"
        height={100}
        width={100} 
        /></div>);
    }
  }else{ //shows the upload screen
    //this.GetFileNames();
    return (
      <div>
         <HashRouter>
       <ul className="header">
             <li>
                <div className="dropdown"><button className="dropbtn"> File </button>
                    <div className="dropdown-content">
                      <a href="#/mainmenu">Upload</a>  
                    </div>
                  </div> 
              </li>
              <li className="logout">
                  <a className="logoutspan" href="#/" onClick={this.logout}>Log Out</a>
              </li>
            </ul> 
            <div className="content">
                 
            <Route path="/mainmenu" component={() => <FirsTime folder={Cookies.get("session")} parentCallback = {this.callbackFunction}   />} />
              {/* <Route path="/stuff" component={Stuff}/>
              <Route path="/contact" component={Contact}/> */}
            </div>
        </HashRouter>
      </div>
    );
  }
}
else{  
  return (
    <div>
    <HashRouter>
  
       <div className="content">
            
       <Route path="/" component={() => <Login  parentCallback = {this.callbackFunctionUser}   />} />
         {/* <Route path="/stuff" component={Stuff}/>
         <Route path="/contact" component={Contact}/> */}
       </div>
   </HashRouter>
 </div>


//     <div>
//     <HashRouter>
  
//        <div className="content">
            
//        <Route path="/mainmenu" component={() => <Login  parentCallback = {this.callbackFunctionUser}   />} />
//          {/* <Route path="/stuff" component={Stuff}/>
//          <Route path="/contact" component={Contact}/> */}
//        </div>
//    </HashRouter>
//  </div>
  );
}
}
}  
export default Middle;
