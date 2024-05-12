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
  ResponsiveContainer,
} from "recharts";

export function DeformationControl() {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [deformation, setDeformation] = useState([]);
  const [trendData, setTrendData] = useState([]);
  const [deformationFiltered, setDeformationFiltered] = useState([]);
  const [sortOrder, setOrder] = useState(true);
  const [modalShow, setModalShow] = useState(false);

  async function getTrend() {
    setIsPending(true);
    const response = await fetch(
      `${ORIGIN}/api/measurements/trend?${new URLSearchParams({
        id: "deformation",
      })}`
    );
    const data = (await response.json()).data;
    const points = data.points;
    const trendData = [];
    const deltaData = [];
    const deltas = [];

    deformation.forEach((item) => {
      deltas.push(item.data.delta);
    });

    const Min = Math.min.apply(null, deltas);
    const Max = Math.max.apply(null, deltas);
    
    deformation.forEach((item) => {
      deltaData.push({
        name: new Date(item.time).toLocaleString("ru").slice(0, -10),
        delta: item.data.delta,
        deltaMax: Max,
        deltaMin: Min,
      });
    });

    for (let key in points) {
      trendData.push({
        name: new Date(key).toLocaleString("ru").slice(0, -10),
        trend: points[key],
      });
    }

    const chartArr = [
      {
        type: "delta_data",
        data: deltaData,
      },
      {
        type: "trend_data",
        data: trendData,
      },
    ];
    console.log(chartArr);
    setTrendData(chartArr);
    setIsPending(false);
    setModalShow(true);
  }
  const stages = ["O", "I", "II", "III", "IV"];

  useEffect(() => {
    fetch(
      `${ORIGIN}/api/measurements?${new URLSearchParams({ id: "deformation" })}`
    )
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
    error ? null : (
      <div className="fred">
        <h3>DeformationControl</h3>
        <div className="filter">
          <Button
            variant="info"
            onClick={() => {
              getTrend();
            }}
          >
            {isPending ? (
              <>
                <Spinner
                  as="span"
                  animation="grow"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />
                Загрузка...
              </>
            ) : (
              "Построить график"
            )}
          </Button>
        </div>

        <Modal
          show={modalShow}
          onHide={() => setModalShow(false)}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
              Смещение по деформационной марке
            </Modal.Title>
          </Modal.Header>
          <Modal.Body size={"xl"}>
            <div className="chart">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  width={500}
                  height={300}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" allowDuplicatedCategory={false} />
                  <YAxis
                    domain={[-0.1, 0.5]}
                    label={{
                      value: "Смещение (\u{0394}), м",
                      angle: -90,
                      position: "left",
                    }}
                  />

                  <Tooltip />
                  <Legend />
                  <Line
                    dataKey="delta"
                    type="monotone"
                    stroke="#4169E1"
                    activeDot={{ r: 8 }}
                    data={trendData[0] ? trendData[0]["data"] : []}
                    name={"Дельта,(\u{0394})"}
                  />
                  <Line
                    dataKey="deltaMax"
                    type="monotone"
                    strokeDasharray="5 5"
                    stroke="#D2691E"
                    activeDot={{ r: 8 }}
                    data={trendData[0] ? trendData[0]["data"] : []}
                    name={"max,(\u{0394})"}
                  />
                  <Line
                    dataKey="deltaMin"
                    type="monotone"
                    strokeDasharray="5 5"
                    stroke="#00FF00"
                    activeDot={{ r: 8 }}
                    data={trendData[0] ? trendData[0]["data"] : []}
                    name={"min,(\u{0394})"}
                  />
                  <Line
                    dataKey="trend"
                    type="monotone"
                    stroke="#8B008B"
                    activeDot={{ r: 8 }}
                    data={trendData[1] ? trendData[1]["data"] : []}
                    name="Тренд"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="danger" onClick={() => setModalShow(false)}>
              Закрыть
            </Button>
          </Modal.Footer>
        </Modal>
        <table>
          <thead>
            <tr>
              <th
                onClick={() => {
                  setDeformation([
                    ...deformationFiltered.sort((first, sec) => {
                      if (sortOrder) {
                        setOrder(!sortOrder);
                        return first.time > sec.time ? 1 : -1;
                      } else {
                        setOrder(!sortOrder);
                        return first.time > sec.time ? -1 : 1;
                      }
                    }),
                  ]);
                }}
              >
                Дата и время измерения
              </th>
              <th>Цикл измерения</th>
              <th>Отметка, м</th>
              <th className="delta">{"\u{0394}"}, м</th>
            </tr>
          </thead>
          <tbody>
            {deformation.map((point, index) => (
              <tr key={index}>
                <th>
                  {new Date(point.time).toLocaleString("ru").slice(0, -3)}
                </th>
                <td>{stages[Math.floor(Math.random() * 4)]}</td>
                <td>{point.data.value}</td>
                <td>{point.data.delta}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  ) : (
    <Spinner animation="border" role="status" variant="primary">
      <span className="visually-hidden">Загрузка...</span>
    </Spinner>
  );
}
