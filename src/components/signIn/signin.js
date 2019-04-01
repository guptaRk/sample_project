import React, { Component } from 'react';
import styles from './signin.css';
import FormField from '../widgets/FormField/formField';
class SignIn extends Component {
    state = {
        registerError:'',
        loading:false,
        formdata:{
            email:{
                element:'input',
                value:'',
                config:{
                    name:'email_input',
                    type:'email',
                    placeholder:'Enter Your Email'
                },
                validation:{
                    required:true,
                    email:true
                },
                valid:false,
                touched:false,
                validationMessage:''
            },
            password:{
                element:'input',
                value:'',
                config:{
                    name:'password_input',
                    type:'password',
                    placeholder:'Enter Your Password'
                },
                validation:{
                    required:true,
                    password:true
                },
                valid:false,
                touched:false,
                validationMessage:''
            }
        }
    }

    componentWillMount(){
        fetch('/checkToken')
          .then(res => {
              console.log(res);
            if (res.status === 200) {
              this.props.history.push('/profile');
            }
          })
    }
    
    updateForm = (element) => {
        let newfd={
            ...this.state.formdata
        }
        let newe={
            ...newfd[element.id]
        }
        newe.value=element.event.target.value;

        if(element.blur){
            let validData = this.validate(newe);
            newe.valid=validData[0];
            newe.validationMessage=validData[1];
        }
        newe.touched = element.blur;
        newfd[element.id]=newe;
        this.setState({
            formdata:newfd
        })
    }
    
    validate = (element) =>{
        let error = [true,''];

        if(element.validation.email){
            const valid = /\S+@\S+\.\S+/.test(element.value);
            const message = `${!valid ? 'Must be a valid email':''}`; 
            error= !valid ? [valid,message] : error;
        }

        if(element.validation.password){
            const valid = element.value.length >= 5;
            const message = `${!valid ? 'Must be greater than 5':''}`; 
            error= !valid ? [valid,message] : error;
        }

        if(element.validation.required){
            const valid = element.value.trim() !=='';
            const message = `${!valid ? 'The field is required':''}`; 
            error= !valid ? [valid,message] : error;
        }
        return error;
    }


    submitForm = (event,type) => {
        event.preventDefault();

        if(type != null){

                let dataToSubmit = {};
                let formIsValid = true;

                for(let key in this.state.formdata){
                    dataToSubmit[key]=this.state.formdata[key].value;
                }

                for(let key in this.state.formdata){
                    formIsValid = this.state.formdata[key].valid && formIsValid;
                }

                if(formIsValid){
                    this.setState({
                        loading: true,
                        registerError:''
                    })
                    if(type){
                        fetch('/api/authenticate', {
                            method: 'POST',
                            body: JSON.stringify(dataToSubmit),
                            headers: {
                              'Content-Type': 'application/json'
                            }
                          })
                          .then(res => {
                              console.log(res);
                            if (res.status === 200) {
                              this.props.history.push('/profile');
                            } else {
                               return res.json();
                            }
                          })
                          .then(data => (
                                this.setState({
                                loading: false,
                                registerError: data.error
                                })
                            ))
                          .catch(err => {
                            this.setState({
                                loading: false,
                                registerError:'Error Occured!'
                            })
                          });
                    } else {
                        //register
                        fetch('/api/register', {
                            method: 'POST',
                            body: JSON.stringify(dataToSubmit),
                            headers: {
                              'Content-Type': 'application/json'
                            }
                          })
                          .then(res => {
                              console.log(res);
                            if (res.status === 200) {
                                 this.setState({
                                     loading: false,
                                     registerError: 'Successfully Registerd!'
                                 })
                            } else {
                               return res.json();
                            }
                          })
                          .then(data => {
                              if(data && data.msg){
                                    this.setState({
                                    loading: false,
                                    registerError: data.msg
                                    })
                                }
                                else{
                                }
                          })
                          .catch(err => 
                            console.log(err));
                    }
                }

                
        }
    }

    submitButton = () => (
        this.state.loading ?
        'loading...' :
        <div>
            <button onClick={(event)=>this.submitForm(event,false)}>Register Now</button>
            <button onClick={(event)=>this.submitForm(event,true)}>Log In</button>
        </div>
    )  
    
    showError = () => (
        this.state.registerError !== '' ?
        <div className={styles.error}>{this.state.registerError}</div>
        :
        null
    )

    render(){
        return (
            <div className={styles.logContainer}>
                <form onClick={(event)=>this.submitForm(event,null)}>
                    <h2>Register / Log in</h2>
                    <FormField
                        id={'email'}
                        formdata={this.state.formdata.email}
                        change={(element)=>this.updateForm(element)}
                    />
                    <FormField
                        id={'password'}
                        formdata={this.state.formdata.password}
                        change={(element)=>this.updateForm(element)}
                    />
                    { this.submitButton() }
                    { this.showError() }
                </form>
            </div>
        )
    }
} 
export default SignIn;