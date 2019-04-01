import React,{ Component } from 'react';

class Home extends Component{
    state = {
        email:'',
        password:'',
        loading:true,
    }
    componentWillMount(){
        fetch('/api/data')
        .then(res => {
            if (res.status === 200) {
              return res.json();
            } else {
              const error = new Error(res.error);
              throw error;
            }
          })
          .then(data => (
            this.setState({ loading: false,email:data.email,password:data.password})
          ))
          .catch(err => {
            console.error(err);
          });
    }

    show = () => (
        this.state.loading ?
        'loading...' :
        <div >
            <h2>EMAIL:  {this.state.email}</h2>
            <h2>PASSWORD: {this.state.password}</h2>
        </div>
    )  

    fn = () => {
        fetch('/api/logout')
        .then(res => {
            if (res.status === 200) {
                this.props.history.push('/sign-in');
            } else {
              const error = new Error(res.error);
              throw error;
            }
          })
          .catch(err => {
            console.error(err);
          });
    }
        
    render() {
        return (
            <div style={{'margin':'30px'}}>
                {this.show()}
                <button onClick={this.fn}>LOG OUT</button>
            </div>
        )
    }
    
} 
export default Home;