import styled from 'styled-components';

const StyledSearch = styled.main`
  display: flex;
  height: calc(100vh - 16px);
  padding: 8px;
  .inputs {
    margin-right: 8px;
    .input {
      margin-bottom: 8px;
      input {
        display: block;
        width: 200px;
      }
    }
  }
  .results {
    height: 100%;
    overflow: scroll;
    .list {
      margin-bottom: 8px;
    }
    .searchPath {
      margin-bottom: 8px;
      margin-left: 1px;
      margin-right: 1px;
      padding: 8px;
      box-shadow: 1px 1px 1px 1px #ddd;
    }
  }
  h3 {
    margin-top: 0;
    margin-bottom: 8px;
  }
  ul {
    padding: 0;
    margin: 0;
    list-style: none;
  }
`;

export default StyledSearch;
