import React, { useEffect, useRef, useState } from "react";
import "./Application.scss";

interface IFlight {
  flight: string;
  duration: string;
  destination: string;
  status: string;
}

const Application = () => {

  const [data, setData] = useState([]);
  const dataRef = useRef(data);

  useEffect(() => {
    fetch('http://localhost:5000/init')
      .then((res) => res.json())
      .then((data) => {
        let flightData: IFlight[] = [];
        data.map((entry: any) => {
          const flight = JSON.parse(entry) as IFlight
          flightData = [...flightData, flight];
        })
        setData(flightData);
      });
    // Server-Side Events
    const sse = new EventSource('http://localhost:5000/stream')
    sse.onmessage = (e) => updateFlightStatus(e)
    sse.onerror = (e) => { console.error('error!') }
    return () => {
      sse.close();
    }
  }, []);

  useEffect(() => {
    dataRef.current = data;
  }, [data])

  const updateFlightStatus = ((message: any) => {
    if (data) {
      console.log(message)
      const updatedFlight = JSON.parse(message.data)
      const newData = dataRef.current.map((entry) => {
        if (entry.flight === updatedFlight.flight) {
          return { ...entry, status: updatedFlight.status };
        }
        return entry;
      })
      setData(newData);
    }
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CANCELLED':
        return '#F81F2E'
      case 'DELAYED':
        return '#FFB300'
      case 'ON-TIME':
        return '#2CB33E'
      case 'DEPARTED':
        return '#7442CB'
      case 'ARRIVED':
        return '#2250FF'
    }
  }

  return (
    <section>
    <div className="tbl-header">
        <table cellPadding="0" cellSpacing="0" border={0}>
          <thead>
            <tr>
              <th>Flight</th>
              <th>Duration</th>
              <th>Destination</th>
              <th>Status</th>
            </tr>
          </thead>
        </table>
      </div>
      <div className="tbl-content">
        <table cellPadding={'0'} cellSpacing={'0'} border={0}>
          <tbody>
            {data.map((flight: IFlight) => {
              return (
                <tr key={flight.flight}>
                  <td>{flight.flight}</td>
                  <td>{flight.duration}</td>
                  <td>{flight.destination}</td>
                  <td style={{
                    fontWeight: '600',
                    color: getStatusColor(flight.status),
                  }}>
                    • {flight.status}
                    </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default Application;
