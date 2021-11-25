import React, { Component } from 'react'; 
class Algorithmchoose extends Component { 
      
    render() {     
                return(
                    <div>
                         <p><span>Choose an algorithm</span></p>
                                        <select id='selectedalgo'>
                                              <option value='1'>Alpha Miner</option>
                                              <option value='2'>Inductive Miner</option>
                                              <option value='3'>Heuristics Miner</option>
                                        </select> 
                    </div>
                );
    }
}
 

export default Algorithmchoose;
