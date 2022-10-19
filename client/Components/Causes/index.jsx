const React = require('react');

const Component = React.Component;

class CausesController {

  constructor(user){
    this.user = user;
  }

  async getCauses(){
    const resp = await fetch('/causes', {
      credentials: 'include'
    });
    const body = await resp.json();
    return body;
  }

  async createCause(causeObj) {
    const resp = await fetch('/causes/new', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify(causeObj)
    });
    const body = await resp.json();
    return body;
  }

}

class Cause extends Component {
  constructor(props) {
    super(props);
  }
  state = {  }
  render() { 
    return (
      <div>
        Cause: {this.props.cause.name}
      </div>
      );
  }
}
 
class Causes extends Component {

  constructor(props) {
    super(props);
    this.controller = new CausesController();
    this.onClickNewCause = this.onClickNewCause.bind(this);
    this.onClickCreateCause = this.onClickCreateCause.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  async componentDidMount(){
    const causes = await this.controller.getCauses();
    this.setState({...this.state, causes});
  }

  async onClickCreateCause(){
    console.log('create cause', this.state.newCause);

    const newCause = await this.controller.createCause({name: this.state.newCause});
    this.setState({...this.state, addCauseOpen: false, causes: this.state.causes.concat([newCause])});
  }

  onClickNewCause(){
    this.setState({...this.state, addCauseOpen: true})
  }

  onChange(e){
    const value = e.target.value;
    const name = e.target.name;
    this.setState({...this.state, [name]: value});
  }

  state = { causes: [] }

  render() { 
    return ( <div>
      <h1>My Causes</h1>
      <ul>
        {this.state.causes.map(cause=>(<Cause key={cause.id} cause={cause}/>))}
        {this.state.addCauseOpen ? 
           <><input type='text' onChange={this.onChange} name='newCause' placeholder='My Cause' /><button onClick={this.onClickCreateCause}> Submit </button></>
         :<li onClick={this.onClickNewCause}> New Cause +</li>
        }
      </ul>
    </div> );
  }

}
/* 
class Causes extends Component {
  state = {  } 
  render() { 
    return (<div>hello from causes</div>);
  }
}
*/

module.exports = Causes;