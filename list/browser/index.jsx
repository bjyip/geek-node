const Container = require('../component/container.jsx');
const React = require('react');
const ReactDOM = require('react-dom');

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      columns: window.reactInitData,
      filtType: window.reactInitFiltType,
      sortType: window.reactInitSortType
    }
  }
  render() {
    return (
      <Container
        columns={this.state.columns}
        filt={filtType => {
          fetch(`/data?sort=${this.state.sortType}&filt=${filtType}`)
            .then(res => res.json())
            .then(json => {
              this.setState({
                columns: json,
                filtType
              })
            })
        }}
        sort={sortType => {
          fetch(`/data?sort=${sortType}&filt=${this.state.filtType}`)
            .then(res => res.json())
            .then(json => {
              this.setState({
                columns: json,
                sortType
              })
            })
        }}
      />
    )
  }
}
ReactDOM.render(
  <App />,
  document.getElementById('reactapp')
)