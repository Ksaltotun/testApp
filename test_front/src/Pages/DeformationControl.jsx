import { useState, useEffect } from "react";
import { ORIGIN } from "../mock_origin";
import Spinner from "react-bootstrap/Spinner";


export function DeformationControl() {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [deformation, setDeformation] = useState([]);

const stages = ['O','I', 'II', 'III', 'IV']

  useEffect(() => {
    fetch(`${ORIGIN}/api/measurements?${new URLSearchParams({id: 'deformation'})}`)
      .then((res) => res.json())
      .then(
        (result) => {
          setIsLoaded(true);
          setDeformation(result.data);
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
    <table>
      <thead>
        <tr>
          <th>Дата и время измерения</th>
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
