import {useState, useEffect} from "react";
import {useParams} from 'react-router-dom';
import Modal from 'react-modal';
import axios from "axios";
import './css/feedback.css';

function GiveFeedback(){
    const [feedback, setFeedback] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const { id } = useParams();

    useEffect(() => {
        console.log("test works");
        getRecipe();
    },[id]);

    const getRecipe = async () => {
        try {
            const response = await axios.get(`/api/getRecipes/${id}`);
            setFeedback(response.data);
            setIsLoading(false);
        } catch (error) {
            console.log("Error in getting recipe from backend: ", error);
        }
    };

    const handleChange = (e) => {
        e.preventDefault();
        setFeedback(e.target.value);
    };

    const handleComplete = async () =>
    {
        //Create the json what will be sent
        const data = {
            feedback: feedback
        }
        const response = await axios.post(`/api/giveFeedback/${id}`,data);
        window.location.href = '/sharedRecipes'
    }

    return(
        <div className="recipe-card">
        {isLoading ? (
            <p>Loading...</p>
        ) : (
            <>
                <h2>Give us your feedback:</h2>
                <textarea value={feedback} onChange={handleChange}></textarea>
                {/* Buttons inside a container to use hover effect */}
                <div className="recipe-buttons">
                    <button onClick={handleComplete}>Submit</button>
                    <button>Another Action</button>
                </div>
            </>
        )}
        </div>
        );
    }
    
    export default GiveFeedback;