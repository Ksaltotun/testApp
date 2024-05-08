import "./Table.css";
import { useEffect, useState } from "react";
import { ORIGIN } from "../mock_origin";
import Spinner from "react-bootstrap/Spinner";

export function ThermistorChain() {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [thermistor, setTermistor] = useState([]);
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
        },

        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      );
  }, []);

  return isLoaded ? (
   error ? null :  <>
   <h3>ThermistorChain</h3>

   <div className="fred">
     <div role="termistor" aria-labelledby="caption" tabIndex="0">
       <table>
         <thead>
           <tr>
             <th rowSpan={2} id="prime">
               Дата и время измерений
             </th>
             <th rowSpan={2} id="prime">
               T<sub>e</sub>
             </th>
             <th colSpan={counts.length}>
               <span>Глубина, м</span>
             </th>
           </tr>
           <tr>
             {counts.map((item) => (
               <th className="second" key={item}>{item}</th>
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
  ) : (
    <Spinner animation="border" role="status" variant="primary">
      <span className="visually-hidden">Загрузка...</span>
    </Spinner>
  );
}
