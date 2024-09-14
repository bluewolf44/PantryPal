import Modal from 'react-modal';
import React, { useState, useEffect } from 'react';

Modal.setAppElement('#root');

function ShowRecipe() {

    const query = sessionStorage.getItem('currentQuery');

    return (
        <>
            <pre>{query}</pre>
            <button>Save</button>
            <button>Back</button>
        </>
    );
}

export default ShowRecipe;