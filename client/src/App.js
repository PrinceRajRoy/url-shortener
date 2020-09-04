import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  
  const [urls, setUrls] = useState([]);

  useEffect(() => {
    axios.get('/api/urls')
      .then((res) => {
        setUrls(res.data);
      })
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const url = e.target.originalUrl.value;
    axios.post('/api/shortUrl', {
      originalUrl: url
    })
    .then((res) => setUrls([...urls, res.data]))
    .catch((err) => console.log("Error :", err))
  }

  const handleRedirect = (e, url) => {
    e.preventDefault();
    axios.get(`/api/${url}`)
      .then((res) => {
        window.location = res.data;
      });
  }

  return (
    <div className="App container mt-2">
      <h1>URL Shortener</h1>
      <form className="form-inline my-4" onSubmit={(e) => handleSubmit(e)}>
        <label htmlFor="originalUrl" className="sr-only">Url</label>
        <input type="url" name="originalUrl" placeholder="Url" id="originalUrl" className="form-control col mr-2" required/>
        <button type="submit" className="btn btn-success">Shrink</button>
      </form>
      <div className="table-responsive">
        <table className="table table-hover">
          <thead className="thead-dark">
            <tr>
              <th>Full URL</th>
              <th>Short URL</th>
              <th>Total Clicks</th>
            </tr>
          </thead>
          <tbody>
            {urls.map(el => (
              <tr key={el._id}>
                <td>
                  <a href={el.fullUrl}>{el.fullUrl}</a>
                </td>
                <td>
                  <a href='/' onClick={(e) => handleRedirect(e, el.shortUrl)}>{el.shortUrl}</a>
                </td>
                <td>
                  {el.clicks}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
