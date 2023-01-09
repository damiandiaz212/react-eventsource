import random
import json

mock_amt = 25
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
        self.airline = random.choice(airlines)
        self.id = random.randint(1111,9999)
        self.status = status[2]
        self.depart = random.choice(airports)
        self.arrive = random.choice(airports)
    def toJSON(self):
        return json.dumps(self, default=lambda o: o.__dict__, 
            sort_keys=True, indent=4)

class FlightSystem:
    def __init__(self):
        self.flights = []
        for i in range(mock_amt):
            self.flights.append(Flight())
    def update(self):
        amt = random.randint(1, mock_amt-1)
        updated_indices = set()
        while len(updated_indices) < amt:
            updated_indices.add(random.randint(0, mock_amt-1))
        for i in updated_indices:
            self.flights[i].status = random.choice(status)
        updated_flights = [self.flights[i] for i in updated_indices]
        return [f.toJSON() for f in updated_flights]