// IMPORTS
// ------------------------------------------------------------
import React from 'react';

// Presentation Component
import SingleFileLocalUpload from '../SingleFileLocalUpload';
import MultiFileLocalUpload from '../MultiFileLocalUpload';
import SingleFileStreamUpload from '../SingleFileStreamUpload';

// Style Components
import {AppStyles} from './styles';

// MAIN COMPONENT
// ------------------------------------------------------------
/**
 *
 */
const App = () => {
  // Render
  return (
    <AppStyles>
      <nav className="navbar navbar-dark bg-dark">
        <div className="container-fluid">
          <span className="navbar-brand">React GraphQL Uploader</span>
        </div>
      </nav>
      <main>
        <div className="container-fluid">
          <div className="row">
            <div className="col col-12 col-md-6 offset-md-3">
              <h2>React GraphQL AWS File Upload</h2>
              <p className="text-muted">An example of uploading files through GraphQL to AWS S3.</p>
              <hr />
              <SingleFileLocalUpload />
              <hr />
              <MultiFileLocalUpload />
              <hr />
              <SingleFileStreamUpload />
            </div>
          </div>
        </div>
      </main>
    </AppStyles>
  );
};

// EXPORTS
// ------------------------------------------------------------
export default App;
