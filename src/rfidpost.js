import { useState, useEffect, useRef } from "react";
import bin from './assets/images/bin.png';
import success from './assets/images/success.png';
import fail from './assets/images/failed.png';


function Rfidpost() {
    const [searchText, setSearchText] = useState("");
    const [searchHistory, setSearchHistory] = useState([{}]);
    const [apiResults, setApiResults] = useState([]);
    const inputRef = useRef(null);

    // Focus on the input box when the component mounts
    useEffect(() => {
        inputRef.current.focus();
    }, []);

    // Function to handle API call
    const fetchApiResult = async (rfid) => {
        try {
            const response = await fetch("http://192.168.225.34/agvtest/api/agv/binboxinfo", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json", // Ensure the server knows the request body is JSON
                },
                body: JSON.stringify({ rfid }), // Send the RFID as a JSON object
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const result = await response.json();

            // Update the API results table
            if (result.length !== 0) {
                setApiResults((prevResults) => [
                    ...prevResults,
                    { rfid, result },
                ]);

                setSearchHistory((prevHistory) => [
                    ...prevHistory,
                    { term: searchText, status: "success" } // Add term with success
                ]);

            }
            else {

                console.log(searchText)
                setSearchHistory((prevHistory) => [
                    ...prevHistory,
                    { term: searchText, status: "Invalid" } // Add term with invalid
                ]);
            }






        } catch (error) {
            console.error("Error fetching API:", error);

            // Update API results with an error message
            setApiResults((prevResults) => [
                ...prevResults,
                { rfid, result: "Error fetching result" },
            ]);



        }
    };

    // Handle search submission
    const handleSearch = () => {
        if (searchText.trim()) {
            // Add search text to history
            // setSearchHistory((prevHistory) => [...prevHistory, searchText]);
            // Call the API with the RFID parameter
            fetchApiResult(searchText);
            // Clear the input field and re-focus
            setSearchText("");
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
            <div className="row">
                <div className="col-md-12">
                    <div className="input-group mb-3">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Bin Identification"
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            onKeyDown={handleKeyDown} // Trigger search on Enter
                            ref={inputRef}
                        />
                        <button className="btn btn-primary" onClick={handleSearch}>
                            Go
                        </button>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-md-4">
                    <div className="card shadow-lg" style={{ width: "300px" }}>
                        <h5 className="card-title" style={{ backgroundColor: "#C6E7FF", padding: "3px" }}>
                            Last Received Bin
                        </h5>

                        {apiResults.length > 0 ? (
                            <span style={{ textAlign: "center" }}>
                                <img src={bin} alt="Bin" width="200px" />
                            </span>) : ("")
                        }

                        <div className="card-body">
                            <p className="card-text">


                                {apiResults.length > 0 && (
                                    <table className="table table-bordered">
                                        <tr>
                                            <th colSpan={2}>
                                                <h4><span className="spinner-grow spinner-grow-sm"></span> Moved to: Table # 2</h4>
                                            </th>
                                        </tr>


                                        {(() => {
                                            const lastApiResult = apiResults[apiResults.length - 1]; // Get the last API result
                                            if (lastApiResult.result.length > 0) {
                                                const lastResult = lastApiResult.result[lastApiResult.result.length - 1]; // Get the last item in the nested result
                                                return (
                                                    <tbody>
                                                        <tr><td>RFID</td>  <td>{lastResult.RFID}</td></tr>
                                                        <tr><td>BIN QTY</td> <td>{lastResult.BIN_QTY}</td></tr>
                                                        <tr><td>STYLE CODE</td> <td>{lastResult.STYLECODE}</td></tr>
                                                        <tr><td>TABLE NAME</td>  <td>{lastResult.TABLE_NAME}</td></tr>
                                                    </tbody>
                                                );
                                            } else {
                                                return (
                                                    <tr>
                                                        <td colSpan={5}>No data available</td>
                                                    </tr>
                                                );
                                            }
                                        })()}

                                    </table>
                                )}


                            </p>
                        </div>
                    </div>
                    <br />
                    <div className="card shadow-lg" style={{ width: "300px", maxHeight: "400px", overflowY: "auto" }}>
                        <h5 className="card-title" style={{ backgroundColor: "#F6F7C4", padding: "3px" }}>
                            Scanning Queue
                        </h5>
                        <span style={{ textAlign: "center" }}>
                        </span>
                        <div className="card-body">
                            <p className="card-text">

                                {searchHistory.length > 0 && (
                                    <table className="table table-bordered" >
                                        <thead>
                                            <tr>
                                                <th>Bin #</th>
                                                <th>Status</th>

                                            </tr>
                                        </thead>
                                        <tbody>
                                            {[...searchHistory].reverse().map((item, index) => (


                                                <tr key={index}>
                                                    <td>{item.term}</td>
                                                    <td>{item.status === "success" ? (
                                                        <img src={success} alt="Success" width="15px" />
                                                        
                                                    ) : item.status === "Invalid" ? (
                                                        <img src={fail} alt="Failed" width="15px" />
                                                    ) : null}</td>
                                                </tr>

                                            ))}
                                        </tbody>
                                    </table>
                                )}


                            </p>
                        </div>
                    </div>
                </div>


                <div className="col-md-8">

                    {apiResults.length > 0 && (
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
                    )}
                </div>
            </div>
        </div>
    );
}

export default Rfidpost;
