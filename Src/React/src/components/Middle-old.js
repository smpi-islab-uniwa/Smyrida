import React, { useEffect, Component } from 'react';  
import FirsTime from "./FirsTime.js"
import InductiveMiner from "./InductiveMiner.js"
import AlphaMiner from "./AlphaMiner.js"
import HeuristicMiner from "./HeuristicMiner.js"
import Frequency from "./Frequency.js"
import Meanduration from "./Meanduration.js"
import Traceduration from "./Traceduration.js"
import Variantscount from "./Variantscount.js"
import Variants from "./Variants.js"
import Activityduration from "./Activityduration.js"
import Conceptname from "./Conceptname.js"
import Info from "./Info.js"
import Converttocsv from "./Converttocsv.js"
import Converttoxes from "./Converttoxes.js"
import View from "./View.js"
import Replayresults from "./Replayresults.js"
import Alignments from "./Alignments.js"
import LeftMenu from "./LeftMenu.js"

import Login from "./Login.js"
import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import * as Cookies from "js-cookie"
import { ReactComponent as Logo } from '../logo.svg';

import {
  Route, 
  Link,
  HashRouter,

} from "react-router-dom";
 
class Middle extends Component { 




  state={
        //boolean if files exist
    specific:"" , //if user clicks on a file
    reload:false  //refresh state after headers are loaded 
  } 

  
  csvheaders= { //object of csv file header
    csvheaders:null,
    csvlist:null,
    seperator:';'
  } 

  userfiles = {   //all files
    allfiles:[]
  }
  
  Updateheaders = (csvlist,csvsep) => {
        this.csvheaders.csvlist=csvlist;
        this.csvheaders.seperator=csvsep;
        this.setState({reload:true});
} 
  
  logout=()=>{  
 //   this.userfiles.allfiles=[];
    Cookies.remove("session");
    Cookies.remove("hasfiles"); 
    this.setState({reload:true}); 
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
 
    clear = ()=>{
      
    }

    callbackFunctionSelect = (childData) => {  
      this.setState({specific:childData});
    }

  callbackFunction = (childData) => {  
    if(childData!==null){ 
        if(childData.includes(".xes")){
          this.userfiles.allfiles[childData]=true;
          Cookies.set("hasfiles",true);   
        }
        if(childData.includes(".csv")){ 
          this.userfiles.allfiles[childData]=false;
          Cookies.set("hasfiles",true);   
        } 
        var url =  window.location.href;  
        if (url.includes("tocsv")){
          url = url.replace("tocsv", "mainmenu"); 
        }
        else if (url.includes("toxes")){ 
          url = url.replace("toxes", "mainmenu"); 
        }
        else if (url.includes("upload")){
          url = url.replace("upload", "mainmenu"); 
        }
        window.location.href = url;
        window.location.reload(false); 
        
  } 
//redirect to mainmenu after the file convertion

 


  };

  callbackFunctionUser = (childData) => {     
   //  Cookies.set("session", childData);
     this.GetFileNames();
  };



  

  render() {  
  
  
   
  if (Cookies.get("session") !== undefined) {     
  if (Cookies.get("hasfiles")==='true'){ //if main menu has files   
  return (
      <div>
         <HashRouter>

         <div id = 'logo'>
       <img src='../logo.png'  height="150"/>
       </div>
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
              <div className="dropdown hideelemnt"><button className="dropbtn"> Visualizations </button>
                    <div className="dropdown-content "> 
                    <a href="#/frequency">Activities Frequency</a>
                    <a href="#/meanduration">Activities Mean Duration</a>           
                    <a href="#/conceptname">Activities over time</a>                                   
                    <a href="#/activityduration">Activities Duration over time</a>  
                    <a href="#/traceduration">Traces Duration over time</a>   
                    <a href="#/variants">Variants</a>                                           
                    <a href="#/variantscount">Variants Frequency</a>                       
                    </div>
                  </div>
              </li>
              <li><div className="dropdown hideelemnt"><button className="dropbtn"> Conformance Checking</button>
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
              <LeftMenu parentCallback = {this.callbackFunctionSelect} parentCallback2={this.Updateheaders} />
              
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
              <Route path="/variants" component={() => <Variants value={this.csvheaders}  folder={Cookies.get("session")}  data={this.state.specific} parentCallback = {this.callbackFunction}   />} />    
              <Route path="/variantscount" component={() => <Variantscount value={this.csvheaders}  folder={Cookies.get("session")}  data={this.state.specific} parentCallback = {this.callbackFunction}   />} />    
              <Route path="/info" component={() => <Info value={this.csvheaders}  folder={Cookies.get("session")}  data={this.state.specific}/>} />
              <Route path="/view" component={() => <View  folder={Cookies.get("session")}  value={this.csvheaders.seperator} data={this.state.specific}/>} />
              <Route path="/alignments" component={() => <Alignments value={this.csvheaders}  folder={Cookies.get("session")}  data={this.state.specific} parentCallback = {this.callbackFunction}   />} />  
                        
           </div> 
            </div>
        </HashRouter>
      </div>



    ); 
  }else{ //shows the upload screen
    //this.GetFileNames();
    return (
      <div>
         <HashRouter>
         <div id='logo'>
       <img src='../logo.png'  height="150"/>
       </div>
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
