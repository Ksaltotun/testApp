import "./Table.css";
import { useEffect, useState } from "react";
import { ORIGIN } from "../mock_origin";
import Spinner from "react-bootstrap/Spinner";
import { Button, Modal } from "react-bootstrap";

export function ThermistorChain() {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [thermistor, setTermistor] = useState([]);
  const [thermistorFiltered, setTermistorFiltered] = useState([]);
  const [start, setStart] = useState(null);
  const [end, setEnd] = useState(null);
  const [sortOrder, setOrder] = useState(true);
  const [modalShow, setModalShow] = useState(false);
  const counts = [];
  for (let i = 0.5; i < 29; ) {
    counts.push(i);
    i += 0.5;
  }
  useEffect(() => {
    fetch(
      `${ORIGIN}/api/measurements?${new URLSearchParams({ id: "thermistor" })}`
    )
      .then((res) => res.json())
      .then(
        (result) => {
          setIsLoaded(true);
          setTermistor(result.data);
          setTermistorFiltered(result.data);
        },

        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      );
  }, []);

  return isLoaded ? (
    error ? null : (
      <>
        <h3>ThermistorChain</h3>
        <div className="filter">
          <Button variant="info" onClick={() => setModalShow(true)}>
            Применить фильтр
          </Button>

          <Modal
            show={modalShow}
            onHide={() => setModalShow(false)}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
          >
            <Modal.Header closeButton>
              <Modal.Title id="contained-modal-title-vcenter">
                Выберите даты для фильтра
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="boxForData">
                <div>
                  <span>Начало</span>
                  <input
                    type="date"
                    name="begin"
                    id="1"
                    onSelect={({ target }) => setStart(target.value)}
                  />
                </div>
                <div>
                  <span>Конец</span>
                  <input
                    type="date"
                    name="end"
                    id="2"
                    onSelect={({ target }) => setEnd(target.value)}
                  />
                </div>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="success"
                onClick={() => {
                  setTermistorFiltered([
                    ...thermistor.filter((item) => {
                      if (start && end) {
                        if (
                          new Date(item.time) > new Date(start) &&
                          new Date(item.time) < new Date(end)
                        )
                          return true;
                        return false;
                      }
                      return true;
                    }),
                  ]);
                  setModalShow(false);
                  setStart(null);
                  setEnd(null);
                }}
              >
                Выбрать
              </Button>
              <Button variant="danger" onClick={() => setModalShow(false)}>
                Закрыть
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
        <div className="fred">
          <div role="termistor" aria-labelledby="caption" tabIndex="0">
            <table>
              <thead>
                <tr>
                  <th
                    rowSpan={2}
                    id="prime"
                    onClick={() => {
                      setTermistor([
                        ...thermistorFiltered.sort((first, sec) => {
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
                    Дата и время измерений
                  </th>
                  <th rowSpan={2} id="prime">
                    T<sub>e</sub>
                  </th>
                  <th colSpan={counts.length} type={"special"}>
                    <span>Глубина, м</span>
                  </th>
                </tr>
                <tr>
                  {counts.map((item) => (
                    <th className="second" key={item}>
                      {item}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {thermistor.map((item, index) => (
                  <tr key={index}>
                    <th>
                      {new Date(item.time).toLocaleString("ru").slice(0, -3)}
                    </th>
                    <th>{item.averageTemperature.toFixed(2)}</th>
                    {counts.map((it, ind) => {
                      return (
                        <td key={it} className="cell">
                          {item.data[it] ? item.data[it].value.toFixed(2) : "-"}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </>
    )
  ) : (
    <Spinner animation="border" role="status" variant="primary">
      <span className="visually-hidden">Загрузка...</span>
    </Spinner>
  );
}
