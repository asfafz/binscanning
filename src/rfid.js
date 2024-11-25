import { useState, useEffect, useRef } from "react";

function Rfid() {
    const [searchText, setSearchText] = useState("");
    const [searchHistory, setSearchHistory] = useState([]);
    const [apiResults, setApiResults] = useState([]);
    const inputRef = useRef(null);

    // Focus on the input box when the component mounts
    useEffect(() => {
        inputRef.current.focus();
    }, []);

    // Function to handle API call
    const fetchApiResult = async (searchText) => {
        try {
            const response = await fetch(`https://dummyapi.online/api/movies/${searchText}`); // Replace with your API URL
            const result = await response.json();

            // Update the API results table
            setApiResults((prevResults) => [
                ...prevResults,
                { searchText, result },
            ]);

            // Remove the search term from the search history
            setSearchHistory((prevHistory) =>
                prevHistory.filter((term) => term !== searchText)
            );
        } catch (error) {
            console.error("Error fetching API:", error);

            // Update API results with an error message
            setApiResults((prevResults) => [
                ...prevResults,
                { searchText, result: "Error fetching result" },
            ]);

            // Remove the search term from the search history even if the API call fails
            setSearchHistory((prevHistory) =>
                prevHistory.filter((term) => term !== searchText)
            );
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" || e.keyCode === 13) {
            handleSearch();
        }
    };


    // Handle search submission
    const handleSearch = () => {
        if (searchText.trim()) {
            // Add search text to history
            setSearchHistory((prevHistory) => [...prevHistory, searchText]);
            // Call the API (async)
            fetchApiResult(searchText);
            // Clear the input field and re-focus
            setSearchText("");
            inputRef.current.focus();
        }
    };

    return (






        <div className="container-fluid mt-5">

            <div className="row">
                <div className="col-md-12"><div className="input-group mb-3">
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
                </div></div>
            </div>
            <div className="row">
                <div className="col-md-4"> <div class="card shadow-lg" style={{ width: "275px" }}>
                    <h5 className="card-title" style={{ backgroundColor: "#C6E7FF", padding: "3px" }}>Last Received Bin <span class="spinner-grow spinner-grow-sm"></span></h5>
                    <span style={{ textAlign: "center" }}><img src={bin} alt="Bin" width="200px" /></span>
                    <div className="card-body">
                        <p className="card-text">This is some information below the image. Everything is center-aligned for a clean and simple layout.</p>
                    </div>
                </div>
                </div>
                <div className="col-md-8">

                    {searchHistory.length > 0 && (
                        <table className="table table-bordered">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Search Text</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {searchHistory.map((text, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{text}</td>
                                        <td>Loading...</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}


                    {apiResults.length > 0 && (
                        <table className="table table-bordered">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>BIN</th>
                                    <th>API Result</th>
                                </tr>
                            </thead>
                            <tbody>
                                {apiResults.map((item, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{item.searchText}</td>
                                        <td>{JSON.stringify(item.result.movie)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>


        </div>
    );
}


export default Rfid;



