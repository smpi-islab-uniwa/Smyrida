# Smyrida

https://github.com/smpi-islab-uniwa/Smyrida

The field of process mining provides tools and techniques to increase the overall knowledge of a process, by means of analyzing the event data stored during the execution of the process. Process mining involves analysis, discovery, monitoring and improvement of real processes. Event logs are files that record the activities carried out as the process ran alongside with the timestamp the activities ended or additionally the timestamp the activities started. Additional information about the activities can be recorded as attributes to enrich process context. By using the event logs, the process model of the real process can be discovered automatically using various algorithms. Furthermore, conformance analysis of the event log and the process model can extract information about how much the data from the event log fits with the process model that was discovered. Deadlocks and deviations can be revealed as value added information about the real process. In addition, projecting time information from event log to the discovered process models can reveal significant insights about the performance of the process. Analysing this information, various questions can be answered such as where and how the process can be optimized. 

Smyrida is a modular software system in the form of a web application with open APIs. The purpose of Smyrida software was to develop a system in order to help a user to apply process mining techniques.

To Run this API you must:

1) First setup Python 
2) Install anaconda https://www.anaconda.com/products/individual#windows
3) Install PM4PY with the following command: pip install pm4py-2.2.4
4) Intall Flask cors with the command: pip install -U flask-cors
5) Install Plotly with the command: pip install plotly 
6) Download api.py and change os.environ['IP'] with the IP and port you want 
7) Run API with the command python api.py

To run the web Interface you can find guide in the following link:
https://github.com/smpi-islab-uniwa/Smyrida/tree/main/React
