const { ipcRenderer } = window.require('electron');
import React, { useState } from 'react';
import StyledSearch from './StyledSearch';

export default function Search() {
  const [query, setQuery] = useState('');
  const [dir, setDir] = useState(
    '/Users/KyleGoss/go/src/github.com/kgwebsites/dewey/app'
  );
  const [include, setInclude] = useState('');
  const [exclude, setExclude] = useState(
    'node_modules|.git/|dist|/api|.bundle|.lock|yarn|.zip'
  );
  const [files, setFiles] = useState([]);
  const [results, setResults] = useState([]);

  const [invalidDirErr, setInvalidDirErr] = useState(false);
  const [queryTooShortErr, setQueryTooShortErr] = useState(false);

  const noErrors = !invalidDirErr && !queryTooShortErr;

  function setQueryHandler({ target: { value } }) {
    setQuery(value);
    setQueryTooShortErr(!value || value.length <= 2);
  }

  function setDirHandler({ target: { value } }) {
    setDir(value);
    ipcRenderer.send('api-validPath-req', value);
    ipcRenderer.on('api-validPath-res', (_, res) => setInvalidDirErr(!res));
  }

  function search(value = query) {
    if (noErrors) {
      ipcRenderer.send('api-search-req', {
        dir,
        query: value,
        exclude,
        include
      });
      ipcRenderer.on('api-search-res', (_, res) => {
        setFiles(res.files || []);
        setResults(res.searchResults || []);
        console.log(res);
      });
    }
  }

  function parseMarks(res) {
    let marksReplaced = res.replace(/<mark>/gi, '[$]<mark>');
    marksReplaced = marksReplaced.replace(/<\/mark>/gi, '</mark>[$]');
    const marks = marksReplaced.split('[$]');

    return marks.map(mark => {
      if (mark.includes('<mark>'))
        return <span dangerouslySetInnerHTML={{ __html: mark }} />;
      return <span>{mark}</span>;
    });
  }

  function openPath(e) {
    const { path } = e.target.dataset;
    ipcRenderer.send('api-openPath-req', path);
  }

  return (
    <StyledSearch>
      <div className="inputs">
        <div className="input">
          <label htmlFor="search">Search</label>
          <input
            type="text"
            id="search"
            value={query}
            onChange={setQueryHandler}
          />
          {queryTooShortErr && (
            <div className="error">Search must be > 2 characters</div>
          )}
        </div>
        <div className="input">
          <label htmlFor="directory">Directory</label>
          <input
            type="text"
            value={dir}
            onChange={setDirHandler}
            id="directory"
          />
          {invalidDirErr && <div className="error">Invalid directory</div>}
        </div>
        <div className="input">
          <label htmlFor="include">Include</label>
          <input
            type="text"
            value={include}
            onChange={({ target: { value } }) => setInclude(value)}
            id="include"
          />
        </div>
        <div className="input">
          <label htmlFor="exclude">Exclude</label>
          <input
            type="text"
            value={exclude}
            onChange={({ target: { value } }) => setExclude(value)}
            id="exclude"
          />
        </div>
        <button
          type="button"
          onClick={() => search(query)}
          disabled={!noErrors}
        >
          Search
        </button>
      </div>
      <div className="results">
        <h3>File Names {files.length > 0 && `- ${files.length} Results`}</h3>
        <ul className="list">
          {files.length === 0 && <div>No file names found</div>}
          {files.map(file => (
            <li key={file.path}>
              <a href="#" onClick={openPath} data-path={file.path}>
                {file.relPath}
              </a>
            </li>
          ))}
        </ul>
        <h3>
          Search Results {results.length > 0 && `- ${results.length} Results`}
        </h3>
        <ul className="list">
          {results.length === 0 && <div>No results found</div>}
          {results.map(searchPath => (
            <li key={searchPath.path} className="searchPath">
              <a href="#" onClick={openPath} data-path={searchPath.path}>
                {searchPath.relPath}
              </a>
              <ul>
                {searchPath.Results.map(res => (
                  <li key={res.line}>
                    <code>
                      <strong>{res.line}:</strong> {parseMarks(res.result)}
                    </code>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </StyledSearch>
  );
}
