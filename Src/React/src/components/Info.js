import React, { Component } from 'react'; 
import CsvElements from "./CsvElements.js"
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import Loader from "react-loader-spinner"; 
import ReactJsAlert from "reactjs-alert"
class Info extends Component { 
    state={   
        done:false, //changes to true when API returns results
        error:''
    }
    statistics = {  //saves the results from API
        notraces: null,
        noevents: null, 
        tracelist:null,
        startactivities:[],
        endactivities:[],
        variants:[]
      }
    Infobuild(){
        
      const data = new FormData(); 
      data.append('filename',this.props.data);  
      data.append('folder',this.props.folder);
      if(this.props.data.includes('.csv')){  
                  if(this.props.value.seperator.length>0){
                    data.append('seperator',this.props.value.seperator);
                  }
                  if (document.getElementById('caseconcept')!==null){
                    data.append('caseconcept',document.getElementById('caseconcept').value);  
                  }
                  if (document.getElementById('startevent')!==null){
                    data.append('startevent',document.getElementById('startevent').value);  
                  }
                  if (document.getElementById('timestamp')!==null){
                    data.append('timestamp',document.getElementById('timestamp').value);  
                  }
                  if (document.getElementById('conceptname')!==null){
                    data.append('conceptname',document.getElementById('conceptname').value);  
                  }
    }
      fetch((window.globalConfig['serverURL'] || { siteName: process.env.REACT_APP_SERVER_URL})+'/statistics', {
                                            method: 'POST',
                                            body: data,
      }).then(response => (response.json()))
      .then(data => {  
        if (data[0].api_error===undefined){ 
      this.statistics.notraces=data[0].notraces; 
 
      this.statistics.noevents=data[0].noevents;
      this.statistics.tracelist=data[0].tracelist;
      this.statistics.events=data[0].events;
      this.statistics.startactivities=data[0].startactivities;
      this.statistics.endactivities=data[0].endactivities;  
      this.statistics.variants=data[0].variants;  
      this.setState({error:''});
      this.setState({done:true}); //when API returns results
        }
        else{
          this.setState({done:true}); 
          this.setState({error:data[0].api_error});
        }
    });
    }
    // InfoCsv(){ 
    //   const data = new FormData(); 
    //   data.append('filename',this.props.data); //in case of csv changes columns 
    //   var caseconcept = document.getElementById('caseconcept').value; 
    //   var start_timestamp = document.getElementById('start_timestamp').value;  
    //   var timestamp = document.getElementById('timestamp').value; 
    //   var conceptname = document.getElementById('conceptname').value;   
    //   data.append('seperator',this.props.value.seperator);
    //   data.append('caseconcept',caseconcept);  
    //   data.append('startevent',start_timestamp);  
    //   data.append('timestamp',timestamp);  
    //   data.append('conceptname',conceptname);   
    //   data.append('folder',this.props.folder);
    //   fetch((window.globalConfig['serverURL'] || { siteName: process.env.REACT_APP_SERVER_URL})+'/csvstatistics', {
    //                                         method: 'POST',
    //                                         body: data,
    //   }).then(response => (response.json()))
    //   .then(data => { 
    //     if (data[0].error===undefined){
    //   this.statistics.notraces=data[0].notraces; 
    //   this.statistics.noevents=data[0].noevents;
    //   this.statistics.tracelist=data[0].tracelist;
    //   this.statistics.events=data[0].dictionary;
    //   this.statistics.startactivities=data[0].startactivities;
    //   this.statistics.endactivities=data[0].endactivities;  
    //   this.setState({done:true}); //when API returns results
    //     }
    // });
    // }
    converttostate = event =>{  
      
      this.Infobuild();  
    
    }
    render() {   
                var eventhtml;
                var starteventhmtl;
                var endeventhmtl;
                var tracelisthtml;
                var variantshml;
                if (this.props.data.includes(".xes")){  //until API returns response
                      if (this.state.done===false){
                          this.Infobuild();  //post request to API
                          return(<div> <Loader
                            type="ThreeDots"
                            color="#dc905e"
                            height={100}
                            width={100} 
                            /></div>) 
                      }
                      else{
                        if(this.state.error.length>0){
                          var errorstring=this.state.error.toString();
                          return(<div> 
                        
                                  <ReactJsAlert
                                      type="warning"   // success, warning, error, info
                                      title={errorstring}   // title you want to display
                                      status={true}   // true or false 
                                      color="#FF0000"
                                      button="Try Again"
                                      Close={() => this.setState({ status: false })}   // callback method for hide
                                  />
                          </div>);
                        }
                        else{
                            eventhtml=buildevent(this.statistics.events,this.statistics.noevents,1); //builds events 
                            starteventhmtl = buildactivities(this.statistics.startactivities,this.statistics.notraces,2);//builds start  events
                            endeventhmtl = buildactivities(this.statistics.endactivities,this.statistics.notraces,3);//builds end  events
                            tracelisthtml = buildtrace(this.statistics.tracelist,4);
                            variantshml = buildvariants(this.statistics.variants,5);
                          return(
                              <div>
                                  <p key='notraces' className='leaveroom'>    Number of traces = { this.statistics.notraces}</p>
                                  <p key='noevents' className='leaveroom'>    Number of events = { this.statistics.noevents}</p>  
                                      {tracelisthtml }
                                  <p key='events' className='leaveroom'>   Events:</p>
                                      {eventhtml} 
                                  <p key='sevents' className='leaveroom'>   Start Events:</p>
                                  {starteventhmtl} 
                                  <p  key='eevents'className='leaveroom'>   End Events:</p>
                                      {endeventhmtl} 
                                  <p  key='vevents'className='leaveroom'>   Variant Events:</p>
                                                {variantshml} 
                                                
   
                              </div>
                          ); 
                        }
                    }
              }
             else if (this.props.data.includes(".csv")){
                      if (this.state.done===false){  //until API returns response
                            return(  
                                <div>  <CsvElements data={this.props.value}></CsvElements> 
                                <button type="submit"  onClick={this.converttostate} className="btn btn-primary pull-right">Continue</button> </div> //in case of csv headers need to be provided
                                ) 
                      }
                      else{  
                        if(this.state.error.length>0){
                          errorstring=this.state.error.toString();
                          return(<div> 
                        
                                  <ReactJsAlert
                                      type="warning"   // success, warning, error, info
                                      title={errorstring}   // title you want to display
                                      status={true}   // true or false 
                                      color="#FF0000"
                                      button="Try Again"
                                      Close={() => this.setState({ status: false })}   // callback method for hide
                                  />
                          </div>);
                        }
                        else{
                            eventhtml=buildevent(this.statistics.events,this.statistics.noevents,1);
                            starteventhmtl = buildactivities(this.statistics.startactivities,this.statistics.notraces,2);
                            endeventhmtl = buildactivities(this.statistics.endactivities,this.statistics.notraces,3);
                            tracelisthtml = buildtrace(this.statistics.tracelist,4);
                            variantshml = buildvariants(this.statistics.variants,5);
                            return(<div>
                                          <div>
                                                <p key='notraces' className='leaveroom'>    Number of traces = { this.statistics.notraces}</p>
                                                <p key='noevents' className='leaveroom'>    Number of events = { this.statistics.noevents}</p>  
                                                {tracelisthtml }
                                                <p key='events' className='leaveroom'>   Events:</p>
                                                {eventhtml} 
                                                <p key='sevents' className='leaveroom'>   Start Events:</p>
                                                {starteventhmtl} 
                                                <p  key='eevents'className='leaveroom'>   End Events:</p>
                                                {endeventhmtl} 
                                                <p  key='vevents'className='leaveroom'>   Variant Events:</p>
                                                {variantshml} 
                                          </div>
                            </div>) 
                      }
                    }
                
              }
              else{
                return(<div>Please select a file from list</div>)
            } 
    }
}

function buildevent(dictionary,noevents,number){ 
      
    var  eventhtml=[];
    var  htmlhead=[]; 
    var  htmlbody=[];
    var  thead = 'stat_'+number;
    var totalevents=0;
    for (var i in dictionary) {   
      totalevents+=parseInt(dictionary[i]);
    }
    htmlhead.push(<thead key={thead}><tr key={`${number}?${0}`}><td>Name</td><td>  Number of Events </td><td> Percentage </td></tr></thead>)
    for ( i in dictionary) {   
                  const trkey='tr_'+number+'_'+i;
                  const trkey2 = trkey+'_2';
                  const trkey3 = trkey+'_3'; 
                  htmlbody.push(<tr key={`${number}?${i}`}><td key={trkey}>{i}</td><td key={trkey2}>   {dictionary[i].toString()} </td><td key={trkey3} >  {(100*parseInt(dictionary[i])/parseInt(totalevents)).toFixed(3).toString()}  %</td></tr>)
                  
          } 
    const tablekey='table_'+number;
        eventhtml.push(<table key={tablekey} className='resultstable'>{htmlhead}<tbody>{htmlbody}</tbody></table>)
    return eventhtml; 
  }

  function buildactivities(dictionary,notraces,number){ 
      
    const  eventhtml=[];
    const  htmlhead=[]; 
    const  htmlbody=[];
    const  thead = 'stat_'+number;
    htmlhead.push(<thead key={thead}><tr key={`${number}?${0}`}><td>Name</td><td>  Number of Traces </td><td> Percentage </td></tr></thead>)
    for (var i in dictionary) {   
                  const trkey='tr_'+number+'_'+i;
                  const trkey2 = trkey+'_2';
                  const trkey3 = trkey+'_3';
                  htmlbody.push(<tr key={`${number}?${i}`}><td key={trkey}>{i}</td><td key={trkey2}>   {dictionary[i].toString()} </td><td key={trkey3} >  {(100*parseInt(dictionary[i])/parseInt(notraces)).toFixed(3).toString()}  %</td></tr>)
                  
          } 
    const tablekey='table_'+number;
        eventhtml.push(<table key={tablekey} className='resultstable'>{htmlhead}<tbody>{htmlbody}</tbody></table>)
    return eventhtml; 
  }

  function buildvariants(dictionary,number){ 
      
    const  eventhtml=[];
    const  htmlhead=[]; 
    const  htmlbody=[];
    const  thead = 'stat_'+number;
    htmlhead.push(<thead key={thead}><tr key={`${number}?${0}`}><td>Variant</td></tr></thead>)
    for (var i in dictionary) {    
                  htmlbody.push(<tr key={`${number}?${i}`}><td>{dictionary[i].variant.toString()}</td></tr>)
                  
          } 
    const tablekey='table_'+number;
        eventhtml.push(<table key={tablekey} className='resultstable'>{htmlhead}<tbody>{htmlbody}</tbody></table>)
    return eventhtml; 
  }
  

  function buildtrace(str){
    var html="";
    if (str != null){
      str = str.replaceAll("[","");
      str = str.replaceAll("]","");
      str = str.replaceAll("{","");
      str = str.replaceAll("}","");
      str = str.replaceAll("'","");
      str = str.replaceAll('"',''); 
      html = 'Structure = ' + str.split(',')[0] + ":" + str.split(',')[1];
      return html;
    } 
  } 

export default Info;
