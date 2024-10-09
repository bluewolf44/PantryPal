import {useState, useEffect} from "react";
import {useParams} from 'react-router-dom';
import Modal from 'react-modal';
import axios from "axios";
import './css/feedback.css';

function GiveFeedback(){
    const [feedback, setFeedback] = useState('');
    const [recipe, setRecipe] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const { id } = useParams();

    useEffect(() => {
        console.log("test works");
        console.log("Shared ID:", id);
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

      // Function to handle feedback submission
      const handleSubmit = async (e) => {
          e.preventDefault();
          console.log("Submitting feedback for recipe ID: ", id);
          try {
              const response = await axios.post(`/api/sharedRecipe/${id}/feedback`, { feedback });
              console.log("Feedback submitted:", response.data);
          } catch (error) {
              console.error("Error submitting feedback:", error);
          }
      };
    return (
         <div className="recipe-content">
             <h2>Give Feedback</h2>
             <form onSubmit={handleSubmit}>
                 <textarea
                     value={feedback}
                     onChange={(e) => setFeedback(e.target.value)}
                     placeholder="Enter your feedback here..."
                 />
                 <button type="submit">Submit Feedback</button>
                 <button type="button" onClick={() => window.location.href = '/showRecipe'}>Back</button>
             </form>
         </div>
     );
    }
    
    export default GiveFeedback;