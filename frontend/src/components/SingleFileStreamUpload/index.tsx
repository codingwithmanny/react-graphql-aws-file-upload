// IMPORTS
// ------------------------------------------------------------
import React from 'react';
import {gql, useMutation} from '@apollo/client';
// import axios from 'axios';

// Styled Components
import {SingleFileStreamUploadStyles} from './styles';

// Queries
/**
 *
 */
const UPLOAD_FILE = gql`
  mutation SingleUploadStream($file: Upload!) {
    singleUploadStream(file: $file) {
      filename
      mimetype
      encoding
    }
  }
`;

// MAIN COMPONENT
// ------------------------------------------------------------
/**
 *
 */
const SingleFileStreamUpload = () => {
  // State / Props
  const fileRef = React.createRef<any>();
  const abortRef = React.useRef<any>();
  const [file, setFile] = React.useState<any>(null);
  const [progress, setProgress] = React.useState(0);
  const [bytes, setBytes] = React.useState<any>(null);

  // Functions
  /**
   *
   */
  const [uploadFile, {data, loading, error}] = useMutation(UPLOAD_FILE, {
    onCompleted: (result) => {
      setProgress(100);
    },
    onError: (err) => {
      setProgress(0);
    },
  });

  /**
   *
   * @param event
   */
  const onSubmitForm = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // XHR EXAMPLE
    // const formData = new FormData();
    // formData.append('file', file);

    // const xhr = new XMLHttpRequest();

    // xhr.upload.onprogress = (ev) => {
    //   console.log(ev);
    //   setProgress((ev.loaded / ev.total) * 100);
    //   setBytes({
    //     loaded: ev.loaded,
    //     total: ev.total,
    //   });
    //   // const done = e.position || e.loaded
    //   // const total = e.totalSize || e.total;
    //   // const perc = (Math.floor(done/total*1000)/10);
    //   // if (perc >= 100) {
    //   //     setStatus('Done');
    //   // } else {
    //   //     setStatus(`${perc}%`);
    //   // }
    //   // setPercentage(perc);
    // };
    // xhr.open('POST', 'http://localhost:8080/upload');
    // xhr.send(formData);
    // // end XHR EXAMPLE

    // Start Upload
    uploadFile({
      variables: {
        file,
      },
      context: {
        fetchOptions: {
          useUpload: true,
          onProgress: (ev: ProgressEvent) => {
            setProgress((ev.loaded / ev.total) * 100);
            setBytes({
              loaded: ev.loaded,
              total: ev.total,
            });
          },
          onAbort: () => {
            setProgress(0);
            setBytes({
              loaded: 0,
              total: 0,
            });
          },
          onAbortPossible: (abortHandler: any) => {
            abortRef.current = abortHandler;
          },
        },
      },
    });
  };

  /**
   *
   * @param event
   */
  const onChangeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log(event.target.files?.[0].name);
    console.log(event.target.files?.[0]);
    setFile(event.target.files?.[0]);
  };

  /**
   *
   */
  const onClickAbort = () => {
    if (abortRef.current) {
      abortRef.current();
    }
  };

  // Hooks
  React.useEffect(() => {
    if (progress < 100) return;
    fileRef.current.value = null;
    setFile(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [progress]);

  // Render
  return (
    <SingleFileStreamUploadStyles>
      <h3>Single File Upload AWS S3</h3>
      <form onSubmit={onSubmitForm}>
        <div className="form-group mb-3">
          <input
            required
            ref={fileRef}
            onChange={onChangeInput}
            className="form-control"
            type="file"
            name="file"
            id="formFile"
          />
        </div>
        {file ? (
          <div className="form-group mb-3">
            <p>
              <strong>
                <small>Files:</small>
              </strong>
            </p>
            <ul>
              <li>
                <pre>
                  {JSON.stringify({name: file.name, size: file.size, type: file.type}, null, ' ')}
                </pre>
              </li>
            </ul>
          </div>
        ) : null}
        <div className="form-group">
          <button type="submit" className="btn btn-secondary mr-2">
            Upload
          </button>
          {progress > 0 && progress < 100 ? (
            <button onClick={onClickAbort} type="button" className="btn btn-danger">
              Cancel
            </button>
          ) : null}
        </div>
      </form>
      <br />
      <div className="progress">
        <div
          className={`progress-bar ${
            progress >= 100 ? 'bg-success' : 'progress-bar-striped progress-bar-animated'
          }`}
          role="progressbar"
          style={{width: `${progress}%`}}
        ></div>
      </div>
      <br />
      <p>
        <strong>Debug</strong>
      </p>
      <pre>
        {JSON.stringify(
          {
            loading,
            data: data || null,
            error: error || null,
            progress: progress || null,
            bytes: bytes || null,
            ref: fileRef?.current?.value,
          },
          null,
          ' ',
        )}
      </pre>
    </SingleFileStreamUploadStyles>
  );
};

// EXPORTS
// ------------------------------------------------------------
export default SingleFileStreamUpload;
