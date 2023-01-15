import React, { useCallback, useEffect, useRef, useState } from "react";
import { useTable } from "react-table";
import "./Application.scss";

interface IFlight {
  flight: string;
  duration: string;
  destination: string;
  status: string;
}

const Application = () => {

  const [data, setData] = useState([]);
  const [ready, setReady] = useState(false);
  const dataRef = useRef(data);

  const columns = React.useMemo(
    () => [
      {
        Header: 'Flight',
        accessor: 'flight'
      },
      {
        Header: 'Duration',
        accessor: 'duration'
      },
      {
        Header: 'Destination',
        accessor: 'destination'
      },
      {
        Header: 'Status',
        accessor: 'status'
      },
    ],
    []
  );
  
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({
    columns,
    data,
  });

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
        setReady(true);
      });
  }, []);

  useEffect(() => {
    dataRef.current = data;
  }, [data])

  useEffect(() => {
    if (ready) {
      const sse = new EventSource('http://localhost:5000/stream')
      sse.onmessage = (e) => updateFlightStatus(JSON.parse(e.data))
      sse.onerror = (e) => { console.error('error!') }
    }
  }, [ready, data])

  const updateFlightStatus = ((update: IFlight) => {
    const newData = dataRef.current.map((entry) => {
      if (entry.flight === update.flight) {
        return { ...entry, status: update.status };
      }
      return entry;
    })
    setData(newData);
  });

  const getStatusBackground = (status: string) => {
    switch (status) {
      case 'CANCELLED':
        return 'black'
      case 'DELAYED':
        return 'darkyellow'
      case 'ON-TIME':
        return 'darkgreen'
      case 'DEPARTED':
        return 'darkblue'
      case 'ARRIVED':
        return 'darkred'
    }
  }

  return (
    <section>
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th
                  {...column.getHeaderProps()}
                  style={{
                    background: 'white',
                    color: 'black',
                    fontWeight: 'bold',
                  }}
                >
                  {column.render('Header')}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map(row => {
            prepareRow(row)
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map(cell => {
                  return (
                    <td
                      {...cell.getCellProps()}
                      style={{
                        color: 'white',
                        background: cell.column.Header === 'Status' ? getStatusBackground(cell.value) : 'black',
                      }}
                    >
                      {cell.render('Cell')}
                    </td>
                  )
                })}
              </tr>
            )
          })}
        </tbody>
      </table>
    </section>
  );
};

export default Application;
