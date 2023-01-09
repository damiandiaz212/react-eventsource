
from flask import Flask, Response
import json
from Mock import FlightSystem
import time
import random

app = Flask(__name__)

flight_system = FlightSystem()

@app.route('/init')
def init():
    return json.dumps([f.toJSON() for f in flight_system.flights])

@app.route('/stream')
def stream():
    def get_data():
        while True:
            time.sleep(random.randint(1, 5))
            yield json.dumps(flight_system.update())
    return Response(get_data(), mimetype='text/event-stream')