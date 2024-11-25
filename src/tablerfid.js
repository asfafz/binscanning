import React, { useState, useEffect } from "react";
import "./box.css"



const Tablerfid = ({ incommingdata, tableno }) => {
    
    const [Count, setCount] = useState(0);
    const [filteredData, setFilteredData] = useState([]);

    useEffect(() => {
        // Calculate count based on filtered data
        const count = incommingdata.reduce((total, item) => {
            if (item.result.length > 0) {
                return total + item.result.filter(data => data.TABLE_ID === tableno).length;
            }
            return total;
        }, 0);

        setCount(count);
    }, [incommingdata, tableno]);


    useEffect(() => {
        // Filter and transform data for the specified table number
        const dataForTable = incommingdata.reduce((result, item) => {
            if (item.result.length > 0) {
                const matchingData = item.result.filter(data => data.TABLE_ID === tableno);
                return [...result, ...matchingData];
            }
            return result;
        }, []);

        setFilteredData(dataForTable.reverse());
    }, [incommingdata, tableno]); 

return (
    <div>
        <div className="card">
            <h6 className="card-title" style={{ backgroundColor: "#C6E7FF", padding: "2px" }}>
                Table # {tableno} {Count > 0 && (<span className="badge" style={{ backgroundColor: "white", color: "black" }}>{Count}</span>)}
            </h6>
            <div className="card-body scrollable" style={{ maxHeight: "100px", overflowY: "auto", padding: "0px" }}>
            {filteredData.length > 0 ? (
                <ul>
                    {filteredData.map((data, index) => (
                        <li className="list-group-item" style={{ textTransform: "uppercase", fontSize:"13px"}} key={index}  >
                            {data.RFID} - {data.CTIME}
                        </li>
                    ))}
                </ul>
            ) : ( "" )}
            </div>
        </div>
    </div>
);
};

export default Tablerfid;