import 'antd/dist/antd.css';
import './login.css'
import ClientAuthorization from '../../rest/client-authorization';
import React, {Component, FormEvent } from 'react';
import { Input, Button, Row, Col, Layout, Form } from 'antd';
import { FormComponentProps } from 'antd/es/form';
import history from '../../navigation/history';
import { OrganizationUser } from '../../rest/type/request/organization-user';
import { SessionKey } from '../../constants/session-key';
import PageKey from '../../constants/page-key';
import Notification from '../notify/notification';
const  { Header, Content} = Layout;

export interface IProps extends FormComponentProps { }

export interface IState { }

class LoginBuilder extends Component<IProps, IState>{

    constructor(props: IProps){
        super(props);
        this.login = this.login.bind(this);
    }

    public componentDidMount(): void{
        this.authorizeApp();
        this.props.form.validateFields();
    }

    private async authorizeApp(){
        await ClientAuthorization.requestSession()
        .then(r => {
            if (r.data.data){
                localStorage.setItem(SessionKey.APP_KEY, r.data.data.access_key);
            }else{
                Notification.sendNotification("error", "Error", "Unexpected error to authenticate, please contact a system administrator");
            }
        })
        .catch(() => {
            Notification.sendNotification("error", "Error", "Unexpected error, please contact a system administrator");
            this.authorizeApp();
        })
    }

    private login(event: FormEvent<HTMLFormElement>){
        event.preventDefault();
        this.props.form.validateFields((_err: any, values: {email: string, password: string}) => {
             ClientAuthorization.authorizeUser(new OrganizationUser(values.email,values.password))
            .then(r =>{
                if (r.data.data){
                    localStorage.setItem(SessionKey.CURRENT_USER, r.data.data.organization_user.first_name + 
                                           " " + 
                                           r.data.data.organization_user.last_name);
                    localStorage.setItem(SessionKey.ACCESS_TOKEN, r.data.data.access_key);
                    history.push(PageKey.PET_SEARCH);
                }else{
                    Notification.sendNotification("error", "Error", r.data.message);
                }
            })
            .catch(() => Notification.sendNotification("error", "Error", "Unexpected error, please contact a system administrator"))
            .finally(() => this.authorizeApp());
          });
    }

    private hasErrors(fieldsError: any): boolean{
        return Object.keys(fieldsError).some(field => fieldsError[field]);
    }

    render(){

        const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;

        const emailError = isFieldTouched('email') && getFieldError('email');
        const passwordError = isFieldTouched('password') && getFieldError('password');
        return <div id="container">
            <Header id="login-header"></Header>
                <Content id="login-content">
                    <Form onSubmit={this.login}>
                        <Row type="flex">
                            <Col span={6} offset={8}>
                                <h1>Welcome to Adopets</h1>
                            </Col>
                        </Row>
                        <Row type="flex">
                            <Col span={6} offset={8}>
                                <Form.Item validateStatus={emailError ? "error" : ""} help={emailError || ""}>
                                    {
                                        getFieldDecorator("email", 
                                        {
                                            validateTrigger: ['onBlur'],
                                            rules: [
                                            {
                                                required: true, message: 'Please input your e-mail'
                                            },
                                            {
                                                type: 'email',
                                                message: 'Please input a valid e-mail',
                                            }]
                                        }
                                    )
                                    (<Input autoFocus placeholder="Login" />)

                                    }
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row type="flex">
                            <Col span={6} offset={8}>
                                <Form.Item validateStatus={passwordError ? "error" : ""} help={passwordError || ""}>
                                    {
                                        getFieldDecorator("password",
                                        {
                                            validateTrigger: ['onBlur'],
                                            rules: [{
                                                    required: true, message: 'Please input your password'
                                            }]
                                        })
                                        (<Input.Password placeholder="Password" />)
                                    }
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row type="flex">
                            <Col span={6} offset={8}>
                                <Form.Item>
                                    <Button type="primary" 
                                            shape="round" 
                                            icon="login" 
                                            htmlType="submit" 
                                            disabled={this.hasErrors(getFieldsError())}
                                            block>
                                        Login
                                    </Button>
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                </Content>
            </div>
    }
}

export const Login = Form.create<IProps>({})(LoginBuilder);