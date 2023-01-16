
from flask import Flask, Response, jsonify
from flask_cors import CORS
import json
from Mock import FlightSystem
import time
import datetime
import random

app = Flask(__name__)
CORS(app)

flight_system = FlightSystem()

@app.route('/init')
def init():
    return flight_system.toJson()

@app.route('/stream')
def stream():
    def get_data():
        while True:
            message = 'event: message\n'
            message += "data: {" + flight_system.update() + "}\n\n"
            yield message
            time.sleep(random.randint(1, 1))
    return Response(get_data(), mimetype='text/event-stream')

if __name__ == '__main__':
    app.run(debug=True)