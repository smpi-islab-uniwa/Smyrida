import React, { Component } from 'react'; 
class CsvElements extends Component { 
      //dropdown with the columns the user wants to change
    render() {     
                var headeroptions=[]; 
                headeroptions =  selectheaderoptions(this.props.data.csvlist); 
                return(
                    <div>
                        <p key='caseconceptname_1'><span>Choose an element for case:concept:name</span></p>
                        <select className='csvheaders' id='caseconcept'>{headeroptions}</select>
                        <p key='conceptname_1'><span>Choose an element for concept:name</span></p>
                        <select className='csvheaders' id='conceptname'>{headeroptions}</select> 
                        <p key='startevent_1'><span>Choose an element for start_timestamp</span></p>
                        <select className='csvheaders' id='start_timestamp'>{headeroptions}</select>
                        <p key='time:timestamp_1'><span>Choose an element for time:timestamp</span></p>
                        <select className='csvheaders' id='timestamp'>{headeroptions}</select>
                      
                    </div>
                );
    }
}
function selectheaderoptions(str){    //fill the dropdown with the headers from API response
    var html=[]; 
    var elementdictionaries=[];
    elementdictionaries=String(str).split(',');  
    for(var i in elementdictionaries){
      html.push(<option key={i} value={elementdictionaries[i].toString()}>{elementdictionaries[i].toString()}</option>)
    } 
   
    return html;
  }

export default CsvElements;
