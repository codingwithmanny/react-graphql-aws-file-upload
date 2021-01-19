// IMPORTS
// ------------------------------------------------------------
import React from 'react';
import {gql, useMutation} from '@apollo/client';

// Styled Components
import {MultiFileLocalUploadStyles} from './styles';

// Queries
/**
 *
 */
const UPLOAD_FILES = gql`
  mutation MultiUpload($files: [Upload]!) {
    multiUpload(files: $files) {
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
const MultiFileLocalUpload = () => {
  // State / Props
  const fileRef = React.createRef<any>();
  const abortRef = React.useRef<any>();
  const [files, setFiles] = React.useState<any>(null);
  const [progress, setProgress] = React.useState(0);
  const [bytes, setBytes] = React.useState<any>(null);

  // Functions
  /**
   *
   */
  const [uploadFiles, {data, loading, error}] = useMutation(UPLOAD_FILES, {
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
  const onSubmitForm = (event: React.FormEvent<HTMLFormElement>) => {
    // Start Upload
    uploadFiles({
      variables: {
        files,
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

    event.preventDefault();
  };

  /**
   *
   * @param event
   */
  const onChangeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFiles(event.target.files);
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
    setFiles(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [progress]);

  // Render
  return (
    <MultiFileLocalUploadStyles>
      <h3>Multi File Upload</h3>
      <form onSubmit={onSubmitForm}>
        <div className="form-group mb-3">
          <input
            required
            ref={fileRef}
            onChange={onChangeInput}
            className="form-control"
            type="file"
            name="files"
            multiple
            id="formFiles"
          />
        </div>
        {files && Object.keys(files)?.length > 0 ? (
          <div className="form-group mb-3">
            <p>
              <strong>
                <small>Files:</small>
              </strong>
            </p>
            <ul>
              {/* {files.map((file: any, key: number) => (
                <li key={`file-${key}`}>
                  <pre>
                    {JSON.stringify({name: file.name, size: file.size, type: file.type}, null, ' ')}
                  </pre>
                </li>
              ))} */}
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
            files,
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
    </MultiFileLocalUploadStyles>
  );
};

// EXPORTS
// ------------------------------------------------------------
export default MultiFileLocalUpload;
