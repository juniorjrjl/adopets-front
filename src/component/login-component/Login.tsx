import AuthorizationClient from '../../rest/AuthorizationClient';
import React, {Component } from 'react';
import { Input, Button, notification, Row, Col, Layout } from 'antd';
import 'antd/dist/antd.css';
import './login.css'
import history from '../../navigation/history';
import { OrganizationUser } from '../../rest/type/request/organization-user';
import { SessionKey } from '../../constants/session-key';
const  { Header, Content} = Layout;

export interface IProps { }

export interface IState {
    user: OrganizationUser
}

export class Login extends Component<IProps, IState>{


    constructor(props: IProps){
        super(props);
        this.state = {
            user: new  OrganizationUser()
        }
        this.login = this.login.bind(this);
    }

    public componentDidMount(): void{
        this.authorizeApp();
    }

    private async authorizeApp(){
        await AuthorizationClient.requestSession()
        .then(r => {
            if (r.data.data){
                sessionStorage.setItem(SessionKey.APP_KEY, r.data.data.access_key);
            }else{
                this.notify("error", "Error", "Unexpected error to authenticate, please contact a system administrator");
            }
        })
        .catch(() => this.notify("error", "Error", "Unexpected error, please contact a system administrator"))
        .finally(() => this.authorizeApp());
    }

    private notify(type: 'success' | 'info' | 'error' | 'warning', title: string, detail: string){
        notification[type]({message: title, description: detail});
    }

    private async login(){
        await AuthorizationClient.authorizeUser(this.state.user)
            .then(r =>{
                if (r.data.data){
                    sessionStorage.setItem(SessionKey.CURRENT_USER, r.data.data.organization_user.first_name + 
                                           " " + 
                                           r.data.data.organization_user.last_name);
                    sessionStorage.setItem(SessionKey.ACCESS_TOKEN, r.data.data.access_key);
                    history.push("/pets")
                }else{
                    this.notify("error", "Error", r.data.message);
                }
            })
            .catch(() => this.notify("error", "Error", "Unexpected error, please contact a system administrator"))
            .finally(() => this.authorizeApp());
    }

    private changeUser(e: React.ChangeEvent<HTMLInputElement>, property: "email" | "password"){
        e.persist();
        this.setState(prevState => {
            let user = Object.assign({}, prevState.user);
            user[property] = e.target.value;
            return { user };
        });
    }

    render(){
        return <div id="container">
            <Header id="login-header"></Header>
                <Content id="content">
                    <Row type="flex">
                        <Col span={6} offset={8}>
                            <h1>Welcome to Adopets</h1>
                        </Col>
                    </Row>
                    <Row type="flex">
                        <Col span={6} offset={8}>
                            <Input placeholder="Login" 
                                   value={this.state.user.email} 
                                   onChange={e => this.changeUser(e, "email")}/>
                        </Col>
                    </Row>
                    <Row type="flex">
                        <Col span={6} offset={8}>
                            <Input.Password placeholder="Password" 
                            value={this.state.user.password} 
                            onChange={e => this.changeUser(e, "password")} />
                        </Col>
                    </Row>
                    <Row type="flex">
                        <Col span={6} offset={8}>
                            <Button type="primary" shape="round" icon="login" block onClick={this.login}>
                                Login
                            </Button>
                        </Col>
                    </Row>
                </Content>
            </div>
    }
}