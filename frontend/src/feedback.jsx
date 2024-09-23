import {useState, useEffect} from "react";
import {useParams} from 'react-router-dom';
import Modal from 'react-modal';
Modal.setAppElement('#root');
import axios from "axios";

function giveFeedback(){
    const [feedback, setFeedback] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const { id } = useParams();

    useEffect(() => {
        // get the ingredients that the recipe may use
        const getFeedback = async () => {
            try {
              setIsLoading(true);
              const response = await axios.get(`/api/getFeedback/${id}`);
              const parsedToJson = JSON.parse(response.data);
              setFeedback(parsedToJson);
            } catch (error) {
              console.log("Error in getting recipe by id: ", error);
            } finally {
              setIsLoading(false);
            }
        }
        getFeedback();
    },[id]);

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
        const response = await axios.post(`/api/updateFeedback`,data);
        window.location.href = '/'
    }

    return(
        <>
            {isLoading ?
                (<p>Loading...</p>) : (
                    <>
                       <h2>Give us your feedback:</h2>
                        <textarea value={feedback} onChange={handleChange}></textarea>
                        <button onClick={handleComplete}>Submit</button>
                    </>
                )
            }
        </>
    )