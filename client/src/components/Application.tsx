import React, { useEffect, useState } from "react";
import "./Application.scss";

interface IFlight {
  flight: string;
  duration: string;
  destination: string;
  status: string;
}


const Application: React.FC = () => {

  const [data, setData] = useState<IFlight[]>([]);

  useEffect(() => {
    fetch('http://localhost:5000/init')
    .then((res) => res.json())
    .then((data) => {
      const arr: IFlight[] = []
      data.map((d: any) => arr.push(JSON.parse(d) as IFlight))
      setData(arr)
    });

    const sse = new EventSource('http://localhost:5000/stream', { withCredentials: true })
    sse.onmessage = (e) => updateData(e);

    return () => {
      sse.close();
    }

  },[])

  const updateData = (e: any) => {
    const data = JSON.parse(e.data);
    console.log(data)
  }

  const getStatusBackground = (status: string) => {
    switch(status) {
      case 'CANCELLED':
        return 'darkslategrey'
      case 'DELAYED':
        return '#F1C40F'
      case 'ON-TIME':
        return '#27AE60'
      case 'DEPARTED':
        return '#5499C7'
      case 'ARRIVED':
        return '#E74C3C'
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
                    backgroundColor: getStatusBackground(flight.status),
                    color: 'white'
                  }}>
                    {flight.status}
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
