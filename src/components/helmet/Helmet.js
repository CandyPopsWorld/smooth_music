import React from 'react';
import { Helmet as HelmetComponent } from 'react-helmet';
function Helmet({title, description}) {
    return (
        <HelmetComponent>
            <title>{title}</title>
            <meta name='description' content={description}/>
        </HelmetComponent>
    );
}
export default Helmet;