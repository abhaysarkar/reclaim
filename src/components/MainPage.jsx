

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ReactPaginate from 'react-paginate';

const MainPage = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchName, setSearchName] = useState('');
  const [searchTopic, setSearchTopic] = useState('');
  const [searchLevel, setSearchLevel] = useState('');
  const [searchPlatform, setSearchPlatform] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [showAddNewModal, setShowAddNewModal] = useState(false);
  const [showReviseModal, setShowReviseModal] = useState(false);
  const [newProblem, setNewProblem] = useState({
    name: '',
    topic: '',
    level: '',
    link: '',
    platform: ''
  });
  const [randomProblem, setRandomProblem] = useState(null);
  const itemsPerPage = 8;

  useEffect(() => {
    axios.get('http://localhost:5000/show-all')
               
      .then(response => {
        setData(response.data);
        setFilteredData(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the data!', error);
      });
  }, []);

  useEffect(() => {
    filterData();
  }, [searchName, searchTopic, searchLevel, searchPlatform]);

  const filterData = () => {
    const filtered = data.filter(item =>
      item.name.toLowerCase().includes(searchName.toLowerCase()) &&
      item.topic.toLowerCase().includes(searchTopic.toLowerCase()) &&
      item.level.toLowerCase().includes(searchLevel.toLowerCase()) &&
      item.platform.toLowerCase().includes(searchPlatform.toLowerCase())
    );
    setFilteredData(filtered);
    setCurrentPage(0); // Reset to first page on new search
  };

  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
  };

  const offset = currentPage * itemsPerPage;
  const currentPageData = filteredData.slice(offset, offset + itemsPerPage);
  const pageCount = Math.ceil(filteredData.length / itemsPerPage);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProblem(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:5000/add-new-problem', newProblem)
      .then(response => {
        setData([...data, response.data]);
        setFilteredData([...data, response.data]);
        setShowAddNewModal(false);
        setNewProblem({
          name: '',
          topic: '',
          level: '',
          link: '',
          platform: ''
        });
      })
      .catch(error => {
        console.error('There was an error adding the new problem!', error);
      });
  };

  const handleReviseClick = () => {
    axios.get('http://localhost:5000/get-random-one')
      .then(response => {
        setRandomProblem(response.data);
        setShowReviseModal(true);
      })
      .catch(error => {
        console.error('There was an error fetching the random problem!', error);
      });
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center">Problem List</h2>
      <div className="row mb-3">
        <div className="col-auto">
          <button className="btn btn-success" onClick={handleReviseClick}>Revise</button>
        </div>
        <div className="col-auto">
          <button className="btn btn-success" onClick={() => setShowAddNewModal(true)}>Add New</button>
        </div>
        <div className="col">
          <input
            type="text"
            className="form-control"
            placeholder="Search by Name"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
          />
        </div>
        <div className="col">
          <input
            type="text"
            className="form-control"
            placeholder="Search by Topic"
            value={searchTopic}
            onChange={(e) => setSearchTopic(e.target.value)}
          />
        </div>
        <div className="col">
          <input
            type="text"
            className="form-control"
            placeholder="Search by Level"
            value={searchLevel}
            onChange={(e) => setSearchLevel(e.target.value)}
          />
        </div>
        <div className="col">
          <input
            type="text"
            className="form-control"
            placeholder="Search by Platform"
            value={searchPlatform}
            onChange={(e) => setSearchPlatform(e.target.value)}
          />
        </div>
      </div>
      <table className="table table-striped table-hover">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Topic</th>
            <th>Level</th>
            <th>Platform</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {currentPageData.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.name}</td>
              <td>{item.topic}</td>
              <td>{item.level}</td>
              <td>{item.platform}</td>
              <td>
                <a href={item.link} target="_blank" rel="noopener noreferrer">
                  <button type="button" className="btn btn-primary">View</button>
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <ReactPaginate
        previousLabel={'previous'}
        nextLabel={'next'}
        breakLabel={'...'}
        breakClassName={'break-me'}
        pageCount={pageCount}
        marginPagesDisplayed={2}
        pageRangeDisplayed={5}
        onPageChange={handlePageClick}
        containerClassName={'pagination'}
        subContainerClassName={'pages pagination'}
        activeClassName={'active'}
        className="pagination justify-content-center"
        pageClassName="page-item"
        pageLinkClassName="page-link"
        previousClassName="page-item"
        previousLinkClassName="page-link"
        nextClassName="page-item"
        nextLinkClassName="page-link"
        breakLinkClassName="page-link"
        activeLinkClassName="active"
      />

      {/* Bootstrap Modal for Add New Problem */}
      {showAddNewModal && (
        <div className="modal fade show" style={{ display: 'block' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add New Problem</h5>
                <button type="button" className="btn-close" onClick={() => setShowAddNewModal(false)}></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleFormSubmit}>
                  <div className="mb-3">
                    <label htmlFor="name" className="form-label">Name</label>
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      name="name"
                      value={newProblem.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="topic" className="form-label">Topic</label>
                    <input
                      type="text"
                      className="form-control"
                      id="topic"
                      name="topic"
                      value={newProblem.topic}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="level" className="form-label">Level</label>
                    <input
                      type="text"
                      className="form-control"
                      id="level"
                      name="level"
                      value={newProblem.level}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="link" className="form-label">Link</label>
                    <input
                      type="url"
                      className="form-control"
                      id="link"
                      name="link"
                      value={newProblem.link}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="platform" className="form-label">Platform</label>
                    <input
                      type="text"
                      className="form-control"
                      id="platform"
                      name="platform"
                      value={newProblem.platform}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-primary">Submit</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bootstrap Modal for Revise Problem */}
      {showReviseModal && (
        <div className="modal fade show" style={{ display: 'block' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Revise Problem</h5>
                <button type="button" className="btn-close" onClick={() => setShowReviseModal(false)}></button>
              </div>
              <div className="modal-body">
                {randomProblem && (
                  <div>
                    <h4 className="text-center">{randomProblem.name}</h4>
                    <p><strong>Topic:</strong> {randomProblem.topic}</p>
                    <p><strong>Level:</strong> {randomProblem.level}</p>
                    <p><strong>Platform:</strong> {randomProblem.platform}</p>
                    <a href={randomProblem.link} target="_blank" rel="noopener noreferrer">
                      <button type="button" className="btn btn-primary">View Problem</button>
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MainPage;
