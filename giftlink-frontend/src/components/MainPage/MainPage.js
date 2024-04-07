import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { urlConfig } from '../../config'; // Importing the URL configuration from the config file

function MainPage() {
    const [gifts, setGifts] = useState([]); // Initializing state to hold the gifts data
    const navigate = useNavigate(); // Hook for navigation within the application

    // Fetching gifts from the backend API when the component mounts
    useEffect(() => {
        // Async function to fetch gifts
        const fetchGifts = async () => {
            try {
                let url = `${urlConfig.backendUrl}/api/gifts`; // Constructing the URL for fetching gifts
                const response = await fetch(url); // Making a GET request to the API
                if (!response.ok) {
                    // Handling errors if the response is not OK
                    throw new Error(`HTTP error; ${response.status}`);
                }
                const data = await response.json(); // Parsing the response body as JSON
                setGifts(data); // Updating the state with the received gifts data
            } catch (error) {
                console.log('Fetch error: ' + error.message); // Logging fetch errors
            }
        }
        fetchGifts(); // Invoking the fetchGifts function
    }, []);

    // Function to navigate to the details page of a gift
    const goToDetailsPage = (productId) => {
        navigate(`/app/product/${productId}`); // Redirecting to the details page with the product ID
    };

    // Function to format the timestamp of a gift
    const formatDate = (timestamp) => {
        const date = new Date(timestamp * 1000); // Converting timestamp to Date object
        return date.toLocaleDateString('default', { month: 'long', day: 'numeric', year: 'numeric' }); // Formatting the date
    };

    // Function to determine the CSS class based on the gift condition
    const getConditionClass = (condition) => {
        return condition === "New" ? "list-group-item-success" : "list-group-item-warning"; // Returning the CSS class based on the condition
    };

    return (
        <div className="container mt-5">
            <div className="row">
                {gifts.map((gift) => (
                    <div key={gift.id} className="col-md-4 mb-4">
                        <div className="card product-card">
                            {/* Displaying gift image or placeholder */}
                            <div className="image-placeholder">
                                {gift.image ? (
                                    <img src={gift.image} alt={gift.name} />
                                ) : (
                                    <div className="no-image-available">No Image Available</div>
                                )}
                            </div>
                            <div className="card-body">
                                {/* Displaying gift name */}
                                <h5 className="card-title">{gift.name}</h5>
                                <p className={`card-text ${getConditionClass(gift.condition)}`}>
                                    {gift.condition}
                                </p>
                                {/* Displaying formatted date */}
                                <p className="card-text">{formatDate(gift.date_added)}</p>
                                <button onClick={() => goToDetailsPage(gift.id)} className="btn btn-primary">
                                    View Details
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default MainPage;
