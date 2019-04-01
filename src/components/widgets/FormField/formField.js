import React from 'react';
import styles from './formField.css';

const FormField = ({formdata,id,change}) => {

    const showError = () => {
        let errormsg = null;

        if(formdata.validation && !formdata.valid){
            errormsg=(
                <div className={styles.labelError}>
                    {formdata.validationMessage}
                </div>
            )
        }
        return errormsg;
    }

    const renderTemplate = () => {
        let formTemplate=null;
        
        switch(formdata.element){
            case('input'):
                formTemplate = (
                    <div>
                        <input
                            {...formdata.config}
                            value={formdata.value}
                            onBlur={(event)=>change({event,id,blur:true})}
                            onChange={(event)=>change({event,id,blur:false})}
                        />
                        {showError()}
                    </div>
                )
                break;
            default:
                formTemplate=null;

        }
        return formTemplate;

    }

    return (
        <div>
            {renderTemplate()}
        </div>
    )
}

export default FormField;