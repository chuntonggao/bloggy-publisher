import { Checkbox, Icon } from 'antd';
import { CheckboxChangeEvent } from 'antd/es/checkbox';
import { FormComponentProps } from 'antd/es/form';
import { connect } from 'dva';
import React, { Component } from 'react';
import { AnyAction, Dispatch } from 'redux';
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale';

import { ConnectState } from '@/models/connect';
import { LoginRequestBody, RegisterRequestBody } from '@/services/login';

import LoginComponents, { TabType } from './components';
import styles from './style.less';

const {
    Tab,
    RegisterEmail,
    RegisterPassword,
    RegisterPhone,
    RegisterName,
    RegisterConfirmPassword,
    LoginEmail,
    LoginPassword,
    Submit
} = LoginComponents;

interface LoginProps {
    dispatch: Dispatch<AnyAction>;
    submitting?: boolean;
}
interface LoginState {
    activeTab: TabType;
    autoLogin: boolean;
}

class Login extends Component<LoginProps, LoginState> {
    loginForm: FormComponentProps['form'] | undefined | null = undefined;

    state: LoginState = {
        activeTab: 'login',
        autoLogin: true
    };

    changeAutoLogin = (e: CheckboxChangeEvent): void => {
        this.setState({
            autoLogin: e.target.checked
        });
    };

    handleSubmit = (
        err: unknown,
        values: LoginRequestBody | RegisterRequestBody
    ): void => {
        const { activeTab } = this.state;
        if (!err) {
            const { dispatch } = this.props;
            if (activeTab === 'login') {
                dispatch({
                    type: 'login/login',
                    payload: values as LoginRequestBody
                });
            } else if (activeTab === 'register') {
                dispatch({
                    type: 'login/register',
                    payload: values as RegisterRequestBody
                });
            }
        }
    };

    handlePressEnter = (e: React.KeyboardEvent<HTMLElement>): void => {
        e.preventDefault();
        if (this.loginForm) {
            this.loginForm.validateFields(this.handleSubmit);
        }
    };

    onTabChange = (activeTab: TabType): void => {
        this.setState({ activeTab });
    };

    render(): JSX.Element {
        const { submitting } = this.props;
        const { activeTab, autoLogin } = this.state;
        return (
            <div className={styles.main}>
                <LoginComponents
                    defaultActiveKey={activeTab}
                    onTabChange={this.onTabChange}
                    onSubmit={this.handleSubmit}
                    onCreate={(form?: FormComponentProps['form']): void => {
                        this.loginForm = form;
                    }}
                >
                    <Tab
                        key="login"
                        tab={formatMessage({
                            id: 'user-login.tab.login'
                        })}
                    >
                        <LoginEmail name="email" />
                        <LoginPassword
                            name="password"
                            onPressEnter={this.handlePressEnter}
                        />
                    </Tab>
                    <Tab
                        key="register"
                        tab={formatMessage({
                            id: 'user-login.tab.register'
                        })}
                    >
                        <RegisterEmail name="email" />
                        <RegisterName name="name" />
                        <RegisterPhone name="phone" />
                        <RegisterPassword name="password" />

                        <RegisterConfirmPassword
                            name="confirmPassword"
                            onPressEnter={this.handlePressEnter}
                        />
                    </Tab>
                    <div>
                        <Checkbox
                            checked={autoLogin}
                            onChange={this.changeAutoLogin}
                        >
                            <FormattedMessage id="user-login.login.remember-me" />
                        </Checkbox>
                        <a style={{ float: 'right' }} href="">
                            <FormattedMessage id="user-login.login.forgot-password" />
                        </a>
                    </div>
                    <Submit loading={submitting}>
                        <FormattedMessage
                            id={
                                activeTab === 'login'
                                    ? 'user-login.login.button'
                                    : 'user-login.register.button'
                            }
                        />
                    </Submit>
                    <div className={styles.other}>
                        <FormattedMessage id="user-login.login.sign-in-with" />
                        <Icon
                            type="github"
                            className={styles.icon}
                            theme="outlined"
                        />
                    </div>
                </LoginComponents>
            </div>
        );
    }
}

export default connect(({ loading }: ConnectState) => ({
    submitting: loading.effects['login/login'] || loading.effects['login/register']
}))(Login);
