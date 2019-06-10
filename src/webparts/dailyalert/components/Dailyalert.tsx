import * as React from 'react';
import styles from './Dailyalert.module.scss';
import { IDailyalertProps } from './IDailyalertProps';
import { escape } from '@microsoft/sp-lodash-subset';

export interface IState {  
  alertMessage: string;
  messages: string[];  
} 

export default class Dailyalert extends React.Component<IDailyalertProps, IState> {

  private clickCount: number =  0;
  
  constructor(props:IDailyalertProps) {
    super(props);
    this.state = {
      alertMessage :'',
      messages:[]
    };

    

    this.RetrieveSPAlertMessagesData();
    this.clickCount = 0;

    
  }


  public render(): React.ReactElement<IDailyalertProps> {
    return (
      <div className={ styles.dailyalert }>
        <div className={styles.alertBox}>
          <div className={styles.alertInfo}>
            <div></div>
            <span className={styles.dailyAlertBadge}>Daily Alerts</span>
            <button className={styles.buttonArrow} onClick={this.LeftButtonClick}>&lt;</button>
            &nbsp;
            <button className={styles.buttonArrow} onClick={this.RightButtonClick}>&gt;</button>
            <span className={styles.message}>{this.state.alertMessage}</span>
          </div>
        </div>
       
      </div>
    );
  }

  private RightButtonClick = () => {  
    if(this.clickCount < this.state.messages.length - 1){
      this.clickCount++;
    }
    this.setState({alertMessage:this.state.messages[this.clickCount]});
  }

  private LeftButtonClick= () => {
    if(this.clickCount !== 0){
      this.clickCount--;
    }
    this.setState({alertMessage:this.state.messages[this.clickCount]});
  }

  private RetrieveSPAlertMessagesData(){    
    var reactHandler = this;    

    var spRequest = new XMLHttpRequest();    
    spRequest.open('GET', "https://appdevtgs.sharepoint.com/_api/web/lists/getbytitle('DailyAlerts')/items?$select=Title",true);    
    spRequest.setRequestHeader("Accept","application/json");  
                        
    spRequest.onreadystatechange = () => {    
          
        if (spRequest.readyState === 4 && spRequest.status === 200){          
            var result = JSON.parse(spRequest.responseText); 
            let messages = result.value.map(o=>o.Title);   
            reactHandler.setState({    
                messages: messages,
                alertMessage: messages[0] 
            });    
        }    
        else if (spRequest.readyState === 4 && spRequest.status !== 200){    
            console.log('Error Occured !');    
        }    
    };
    
    spRequest.send(); 
       
} 
}
