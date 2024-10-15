import {useState, useEffect, React} from "react";
import { useParams, useNavigate } from 'react-router-dom';
import Modal from 'react-modal';
import axios from "axios";
import './css/feedback.css';
import Alert from './modals/alert';


function GiveFeedback(){
    const [feedback, setFeedback] = useState('');
    const [recipe, setRecipe] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const { id } = useParams();
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        console.log("test works");
        console.log("Shared ID:", id);
        getRecipe(id);
    },[id]);

    const getRecipe = async () => {
        try {
            const response = await axios.get(`/api/getSharedRecipe/${id}`);
            console.log("Recipe data:", response.data);
            setIsLoading(false);
        } catch (error) {
            console.log("Error in getting recipe from backend: ", error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Submitting feedback for recipe ID: ", id);
        try {
            const response = await axios.post(`/api/sharedRecipe/${id}/feedback`,
                { feedback },
                { headers: { "Content-Type": "application/json" } }
            );
            console.log("Feedback submitted:", response.data);
            setAlertMessage("Feedback successfully submitted!");
            setShowAlert(true);
            setTimeout(() => setShowAlert(false), 5000);
        } catch (error) {
            console.error("Error submitting feedback:", error);
            setAlertMessage("Failed to submit feedback.");
            setShowAlert(true);
            setTimeout(() => setShowAlert(false), 5000);
        }
    };
    return (
         <div className="recipe-content1">
             <h2>Give Feedback</h2>

             {showAlert && (
                <div className={`alert ${alertMessage.includes("Failed") ? "alert-error" : "alert-success"}`}>
                    {alertMessage}
                </div>
            )}



             <form onSubmit={handleSubmit}>
                 <textarea
                     value={feedback}
                     onChange={(e) => setFeedback(e.target.value)}
                     placeholder="Enter your feedback here..."
                 />
                 <div className="recipe-buttons">
                 <button type="submit">Submit Feedback</button>
                 <button type="button" onClick={() => window.location.href = '/sharedRecipes'}>Back</button>
                 </div>
             </form>
         </div>
     );
    }
    
    export default GiveFeedback;