# Smyrida

This master thesis deals with the development of a web service application (web API) which will use the functions of process mining that have already been implemented in python with library pm4py. A web interface was also developed which calls with http requests the web service in which the user can apply process mining techniques online. In this environment there is the possibility of selecting event logs and applying multiple process automatic retrieval algorithms by selecting various parameters based on the algorithm. The interface allows the user to select parameters for the corresponding procedures.

The field of process mining provides tools and techniques to increase the overall knowledge of a (business) process, by means of analyzing the event data stored during the execution of the process. Process mining received a lot of attention from both academia and industry, which led to the development of several commercial and open-source process mining tools. 

For this project an API was developed so the user can get various data such as petri nets, event dictionaries and others on his browser with a GET method and also return this data to a website with a POST method. This master thesis API was developed in python because it is a powerful language for data analysis and provides many ready-made and useful libraries. For the development of this API flask was used (https://flask.palletsprojects.com/en/1.1.x/).

To Run this API you must:

1) First setup Python 
2) Install anaconda https://www.anaconda.com/products/individual#windows
3) Install PM4PY with the following command: pip install pm4py-2.2.4
4) Intall Flask cors with the command: pip install -U flask-cors
5) Install Plotly with the command: pip install plotly 
6) Download api.py and change os.environ['IP'] with the IP and port you want 
7) Create an empty file named valid in the same path with the api.py
8) Run API with the command python api.py

To run the web Interface you can find guide in the following link:
https://github.com/smpi-islab-uniwa/Smyrida/tree/main/React
