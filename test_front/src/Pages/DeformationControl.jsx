import { useState, useEffect } from "react";
import { ORIGIN } from "../mock_origin";
import Spinner from "react-bootstrap/Spinner";
import { Modal, Button } from "react-bootstrap";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
} from 'recharts';


export function DeformationControl() {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [deformation, setDeformation] = useState([]);
  const [trendData, setTrendData] = useState([]);
  const [deformationFiltered, setDeformationFiltered] = useState([]);
  const [sortOrder, setOrder] = useState(true);
  const [modalShow, setModalShow] = useState(false);


async function getTrend(){
  const response = await fetch(`${ORIGIN}/api/measurements/trend?${new URLSearchParams({id: 'deformation'})}`)
  const data = (await response.json()).data;
  const points = data.points
  const chartArr = []
  
  for(let key in points){
    console.log(key)
    chartArr.push({
      name: new Date(key).toLocaleString("ru").slice(0, -10),
      'тренд': points[key]
    })
  }

  setTrendData(chartArr)
  setModalShow(true)
  console.dir(chartArr)
}  
const stages = ['O','I', 'II', 'III', 'IV']

  useEffect(() => {
    fetch(`${ORIGIN}/api/measurements?${new URLSearchParams({id: 'deformation'})}`)
      .then((res) => res.json())
      .then(
        (result) => {
          setIsLoaded(true);
          setDeformation(result.data);
          setDeformationFiltered(result.data);
          
        },

        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      );
  }, []);


  return isLoaded ? (
    error ? null : <div className="fred">
    <h3>DeformationControl</h3>
    <div className="filter">
    <Button variant="info" onClick={() => {
            getTrend()
      
    }}>
        Построить график
      </Button>
    </div>
   

      <Modal
        show={modalShow}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Смещение по деформационной марке
          </Modal.Title>
        </Modal.Header>
        <Modal.Body size={'xl'}>
          <div className="chart">
          <ResponsiveContainer width="100%" height="100%">
        <LineChart
          width={500}
          height={300}
          data={trendData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="тренд" stroke="#8884d8" activeDot={{ r: 8 }} />
          <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
        </LineChart>
      </ResponsiveContainer> 
          </div>
                
        </Modal.Body>
        <Modal.Footer> 
       
          <Button variant="danger" onClick={() => setModalShow(false)}>Закрыть</Button>
        </Modal.Footer>
      </Modal>
    <table>
      <thead>
        <tr>
          <th onClick={()=>{
           
           setDeformation([...deformationFiltered.sort((first, sec)=>{
                if (sortOrder) {
                  setOrder(!sortOrder)
                  return first.time > sec.time ? 1 : -1
                } else {
                  setOrder(!sortOrder)
                  return first.time > sec.time ? -1 : 1
                }
              })])
            }}>Дата и время измерения</th>
          <th>Цикл измерения</th>
          <th>Отметка, м</th>
          <th className="delta">{"\u{0394}"}, м</th>
        </tr>
      </thead>
      <tbody>
     
          {deformation.map((point, index) => (
            <tr key={index}>
              <th>{new Date(point.time).toLocaleString("ru").slice(0, -3)}</th>
              <td>{stages[Math.floor(Math.random() * 4)]}</td>
              <td>{point.data.value}</td>
              <td>{point.data.delta}</td>
            </tr>
          ))}

      </tbody>
    </table>
  </div>
  ) : (
    <Spinner animation="border" role="status" variant="primary">
      <span className="visually-hidden">Загрузка...</span>
    </Spinner>
  );
}
