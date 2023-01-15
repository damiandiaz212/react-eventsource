from json import JSONEncoder
import random
import json

mock_amt = 15
airlines = ['DLTA', 'AMRA', 'JETB', 'SPRT', 'UNTD', 'SWST']
status = ['CANCELLED', "DELAYED", 'ON-TIME', 'DEPARTED', "ARRIVED"]
airports = [
    'JFK', 'LGA', 'LGX', 'MCO', 
    'ATL', 'DFW', 'DEN', 'ORD', 
    'LAX','CLT', 'CAN', 'CTU', 
    'MIA','EWR', 'DEL', 'PHX'
]

class Flight:
    def __init__(self):
        self.flight = random.choice(airlines) + '-' + str(random.randint(1111,9999))
        self.destination = random.choice(airports)
        self.duration = str(random.randint(1, 7)) + 'H ' + str(random.randint(10, 55)) + 'M'
        self.status = status[2]

class FlightEncoder(JSONEncoder):
    def default(self, o):
        return o.__dict__

class FlightSystem:
    def __init__(self):
        self.flights = []
        for i in range(mock_amt):
            self.flights.append(Flight())
    def update(self):
        _flight = random.choice(self.flights).flight
        _status = random.choice(status)
        return f'\"flight\": \"{_flight}\", \"status\": \"{_status}\"'
    def toJson(self):
        return [FlightEncoder().encode(f) for f in self.flights]