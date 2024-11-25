import { useState, useEffect, useRef } from "react";
import bin from './assets/images/bin.png';
import success from './assets/images/success.png';
import fail from './assets/images/failed.png';
import loading from './assets/images/loading.gif';
import "./rfid.css"
import reset from './assets/images/reset.png'
import wave from './assets/images/waves.gif'
import Tablerfid from "./tablerfid";



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
                            let result = await response.json();
                            // adding current time in returend json data.....

                            /*------------------------------------------------------*/
                                 const currentTime = new Date().toLocaleTimeString();
                                  
                                  result = result.map(row => ({
                                    ...row,          // Spread existing properties of the row
                                    CTIME: currentTime, // Add the current timestamp
                                }));
                                
                                console.log(result); 
                            /*------------------------------------------------------*/



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


    const resethistory = () => {
        setSearchHistory([{}])
        setSearchText(""); // Clear the input field
        inputRef.current.focus();

    }

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
                        <div className="card shadow-lg" style={{ width: "230px", maxHeight: "900px", overflowY: "auto" }}>
                            <h6 className="card-title" style={{ backgroundColor: "#F6F7C4", padding: "3px" }}>
                                Scanning Queue
                                &nbsp;
                         
                                <button type="button" class="btn btn-secondary btn-sm" onClick={resethistory} >Reset</button>
                            </h6>
                            <div className="card-body" style={{ textAlign: "left" }}>
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
                        <div className="card shadow-lg" style={{ width: "100%" }}>
                            <h5 className="card-title" style={{ backgroundColor: "#C6E7FF", padding: "3px" }}>
                                Received Bins
                            </h5>
                            <div className="card-body">
                                <p className="card-text">
                                    <table width="100%">
                                        <tr>
                                            <td> {apiResults.length > 0 && (
                                                <span style={{ textAlign: "center" }}>
                                                    <img src={bin} alt="Bin" width="200px" />
                                                </span>
                                            )}</td>
                                            <td>
                                                <table width="100%">
                                                    <tr>
                                                        <td>
                                                            {apiResults.length > 0 && (
                                                                <table className="table ">
                                                                    <tbody>
                                                                        {(() => {
                                                                            const lastApiResult = apiResults[apiResults.length - 1];
                                                                            if (lastApiResult.result.length > 0) {
                                                                                const lastResult = lastApiResult.result[lastApiResult.result.length - 1];
                                                                                return (
                                                                                    <>
                                                                                        <tr>
                                                                                            <td colSpan={6} align="left"><span className="binmessage">
                                                                                                {lastResult.TABLE_ID !== ""
                                                                                                    ? "Moved to table: " + lastResult.TABLE_ID
                                                                                                    : "Table is not assigned"}
                                                                                            </span></td>
                                                                                        </tr>
                                                                                        <tr className="table-light">
                                                                                            <td align="left"><b>RFID:</b></td><td align="left">{lastResult.RFID}</td>
                                                                                            <td align="left"><b>UNIT NO:</b></td><td align="left">{lastResult.UNITNO}</td>
                                                                                            <td align="left"><b>FLOW NO:</b></td><td align="left">{lastResult.FLOWNO}</td>
                                                                                        </tr>
                                                                                        <tr>
                                                                                            <td align="left"><b>BIN ID:</b></td ><td align="left">{lastResult.BIN_ID}</td>
                                                                                            <td align="left"><b>PO#:</b></td><td align="left">{lastResult.CUSTPO}</td>
                                                                                            <td align="left"><b>SIZE:</b></td><td align="left">{lastResult.SIZECODE}</td>
                                                                                        </tr>
                                                                                        <tr className="table-light">
                                                                                            <td align="left"><b>COLOR:</b></td><td align="left">{lastResult.COLORNAME}</td>
                                                                                            <td align="left"><b>BIN STATUS:</b></td><td align="left">{lastResult.BIN_STATUS}</td>
                                                                                            <td align="left"></td><td align="left"></td>
                                                                                        </tr>
                                                                                    </>
                                                                                );
                                                                            } else {
                                                                                return <span>No data available</span>;
                                                                            }
                                                                        })()}
                                                                    </tbody>
                                                                </table>
                                                            )}
                                                        </td>
                                                    </tr>
                                                </table>
                                            </td>
                                        </tr>
                                    </table>

                                    <br /><br />

                                    <table width="100%">

                                        <tr><td>    {apiResults.length > 0 && (
                                            <table width="100%">

                                                <tbody>


                                                    <tr>
                                                        <td valign="top">
                                                            <Tablerfid incommingdata={apiResults} tableno={"1"} />
                                                        </td>
                                                        <td valign="top">
                                                            <Tablerfid incommingdata={apiResults} tableno={"2"} />
                                                        </td>
                                                        <td valign="top">
                                                            <Tablerfid incommingdata={apiResults} tableno={"3"} />
                                                        </td>
                                                        <td valign="top">
                                                            <Tablerfid incommingdata={apiResults} tableno={"4"} />
                                                        </td>
                                                        <td valign="top">
                                                            <Tablerfid incommingdata={apiResults} tableno={"5"} />
                                                        </td>

                                                    </tr>

                                                    <tr><td><br></br></td></tr>
                                                    <tr>
                                                        <td valign="top">
                                                            <Tablerfid incommingdata={apiResults} tableno={"6"} />
                                                        </td>
                                                        <td valign="top">
                                                            <Tablerfid incommingdata={apiResults} tableno={"7"} />
                                                        </td>
                                                        <td valign="top">
                                                            <Tablerfid incommingdata={apiResults} tableno={"8"} />
                                                        </td>
                                                        <td valign="top">
                                                            <Tablerfid incommingdata={apiResults} tableno={"9"} />
                                                        </td>
                                                        <td valign="top">
                                                            <Tablerfid incommingdata={apiResults} tableno={"10"} />
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        )}</td></tr>
                                    </table>
                                </p>
                            </div>
                        </div>
                    </td>
                </tr>
            </table>
        </div>
    );
}

export default Rfidv2;
