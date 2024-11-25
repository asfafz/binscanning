import { useState, useEffect, useRef } from "react";
import bin from './assets/images/bin.png';
import success from './assets/images/success.png';
import fail from './assets/images/failed.png';
import loading from './assets/images/loading.gif';
import "./rfid.css"


function Rfidv2() {
    const [searchText, setSearchText] = useState("");
    const [searchHistory, setSearchHistory] = useState([]);
    const [apiResults, setApiResults] = useState([]);
    const inputRef = useRef(null);

    // Focus on the input box when the component mounts
    useEffect(() => {
        inputRef.current.focus();
    }, []);

    // Process searchHistory elements with "Loading" status
    useEffect(() => {
        const processLoadingItems = async () => {
            const updatedHistory = await Promise.all(
                searchHistory.map(async (item) => {
                    if (item.status === "Loading") {
                        try {

                            //    await new Promise((resolve) => setTimeout(resolve, 1000));


                            const response = await fetch("http://192.168.225.34/agvtest/api/agv/binboxinfo", {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                },
                                body: JSON.stringify({ rfid: item.term }),
                            });

                            if (!response.ok) {
                                throw new Error(`HTTP error! Status: ${response.status}`);
                            }

                            const result = await response.json();

                            if (result.length !== 0) {
                                setApiResults((prevResults) => [
                                    ...prevResults,
                                    { rfid: item.term, result },
                                ]);
                                return { ...item, status: "success" }; // Update status to success
                            } else {
                                return { ...item, status: "Invalid" }; // Update status to Invalid
                            }
                        } catch (error) {
                            console.error(`Error processing ${item.term}:`, error);
                            return { ...item, status: "Invalid" }; // Update status to Invalid on error
                        }
                    }
                    return item; // Return unchanged items
                })
            );

            setSearchHistory(updatedHistory); // Update search history
        };

        if (searchHistory.some((item) => item.status === "Loading")) {
            processLoadingItems();
        }
    }, [searchHistory]);

    // Handle search submission
    const handleSearch = () => {
        if (searchText.trim()) {
            // Add search text to history with "Loading" status
            setSearchHistory((prevHistory) => [
                ...prevHistory,
                { term: searchText, status: "Loading" },
            ]);

            setSearchText(""); // Clear the input field
            inputRef.current.focus();
        }
    };

    // Handle Enter key press
    const handleKeyDown = (e) => {
        if (e.key === "Enter" || e.keyCode === 13) {
            handleSearch();
        }
    };

    return (
        <div className="container-fluid mt-5">

            <table width="100%">

                <tr>
                    <td colSpan={2}>
                        <div className="input-group mb-3">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Bin Identification"
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                                onKeyDown={handleKeyDown}
                                ref={inputRef}
                            />
                            <button className="btn btn-primary" onClick={handleSearch}>
                                Go
                            </button>
                        </div>
                    </td>
                </tr>

                <tr>
                    <td width="300px" align="center" valign="top">
                        <div className="card shadow-lg" style={{ width: "300px", maxHeight: "900px", overflowY: "auto" }}>



                            <h5 className="card-title" style={{ backgroundColor: "#F6F7C4", padding: "3px" }}>
                                Scanning Queue
                            </h5>
                            <div className="card-body">
                                <p className="card-text">



                                {searchHistory.length > 0 && (
                                   <ul className="list-group list-group-flush scrollable-list">
                                          {[...searchHistory].reverse().map((item, index) => (
                                        <li class="list-group-item">{item.term}   {item.status === "success" ? (
                                            <img src={success} alt="Success" width="15px" />
                                        ) : item.status === "Invalid" ? (
                                            <img src={fail} alt="Failed" width="15px" />
                                        ) : item.status === "Loading" ? (
                                            <img src={loading} alt="Loading" width="18px" />
                                        ) : null}</li>
                                        ))}
                                    </ul>
                                )}








                                </p>
                            </div>
                        </div>
                    </td>
                    
                    
                    
                    
                    <td valign="top" width="100%">
                        
                        
                        
                        <table width="100%">
                            <tr><td>   
                                
                                
                                
                                <div className="card shadow-lg" style={{ width: "100%" }}>
                                <h5 className="card-title" style={{ backgroundColor: "#C6E7FF", padding: "3px" }}>
                                    Received Bins
                                </h5>
                                {apiResults.length > 0 && (
                                    <span style={{ textAlign: "center" }}>
                                        <img src={bin} alt="Bin" width="200px" />
                                    </span>
                                )}
                                <div className="card-body">
                                    <p className="card-text">
                                      
                                      
                                        {apiResults.length > 0 && (



                                            <table className="table table-bordered">
                                                <tbody>
                                                    {(() => {
                                                        const lastApiResult = apiResults[apiResults.length - 1];
                                                        if (lastApiResult.result.length > 0) {
                                                            const lastResult = lastApiResult.result[lastApiResult.result.length - 1];
                                                            return (
                                                                <>
                                                                    <tr><td>RFID</td><td>{lastResult.RFID}</td></tr>
                                                                    <tr><td>BIN QTY</td><td>{lastResult.BIN_QTY}</td></tr>
                                                                    <tr><td>STYLE CODE</td><td>{lastResult.STYLECODE}</td></tr>
                                                                    <tr><td>TABLE NAME</td><td>{lastResult.TABLE_NAME}</td></tr>
                                                                </>
                                                            );
                                                        } else {
                                                            return <tr><td colSpan={2}>No data available</td></tr>;
                                                        }
                                                    })()}
                                                </tbody>
                                            </table>
                                        )}
                                    </p>
                                </div>
                            </div>
                            
                            
                            
                            </td></tr>
                            <tr><td>    {apiResults.length > 0 && (
                                <table className="table table-bordered">
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>RFID</th>
                                            <th>BIN QTY</th>
                                            <th>STYLE CODE</th>
                                            <th>TABLE NAME</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {apiResults.map((item, index) => (
                                            item.result.length > 0 ? (
                                                item.result.map((data, subIndex) => (
                                                    <tr key={`${index}-${subIndex}`}>
                                                        <td>{index + 1}</td>
                                                        <td>{data.RFID}</td>
                                                        <td>{data.BIN_QTY}</td>
                                                        <td>{data.STYLECODE}</td>
                                                        <td>{data.TABLE_NAME}</td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr key={index}>
                                                    <td colSpan={5}>No data available</td>
                                                </tr>
                                            )
                                        ))}
                                    </tbody>
                                </table>
                            )}</td></tr>
                        </table>




                    </td>
                </tr>
            </table>
        </div>
    );
}

export default Rfidv2;
