import { Form, Tabs } from 'antd';
import { FormComponentProps } from 'antd/es/form';
import classNames from 'classnames';
import React, { Component } from 'react';

import { LoginRequestBody, RegisterRequestBody } from '@/services/login';

import styles from './index.less';
import LoginContext, { LoginContextProps } from './LoginContext';
import LoginItem, { LoginItemProps, LoginItemType } from './LoginItem';
import LoginSubmit from './LoginSubmit';
import LoginTab from './LoginTab';

export type TabType = 'login' | 'register';
export interface LoginProps {
    defaultActiveKey?: string;
    onTabChange?: (key: TabType) => void;
    style?: React.CSSProperties;
    onSubmit?: (
        error: unknown,
        values: LoginRequestBody | RegisterRequestBody
    ) => void;
    className?: string;
    form: FormComponentProps['form'];
    onCreate?: (form?: FormComponentProps['form']) => void;
    children: React.ReactElement<typeof LoginTab>[];
}

interface LoginState {
    tabs?: string[];
    type?: string;
    active?: { [key: string]: unknown[] };
}

class Login extends Component<LoginProps, LoginState> {
    public static Tab = LoginTab;

    public static Submit = LoginSubmit;

    public static LoginEmail: React.FunctionComponent<LoginItemProps>;

    public static LoginPassword: React.FunctionComponent<LoginItemProps>;

    public static RegisterEmail: React.FunctionComponent<LoginItemProps>;

    public static RegisterPhone: React.FunctionComponent<LoginItemProps>;

    public static RegisterName: React.FunctionComponent<LoginItemProps>;

    public static RegisterPassword: React.FunctionComponent<LoginItemProps>;

    public static RegisterConfirmPassword: React.FunctionComponent<LoginItemProps>;

    static defaultProps = {
        className: '',
        defaultActiveKey: '',
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        onTabChange: (): void => {},
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        onSubmit: (): void => {}
    };

    constructor(props: LoginProps) {
        super(props);
        this.state = {
            type: props.defaultActiveKey,
            tabs: [],
            active: {}
        };
    }

    componentDidMount(): void {
        const { form, onCreate } = this.props;
        if (onCreate) {
            onCreate(form);
        }
    }

    onSwitch = (type: string): void => {
        this.setState(
            {
                type
            },
            () => {
                const { onTabChange } = this.props;
                if (onTabChange) {
                    onTabChange(type as TabType);
                }
            }
        );
    };

    getContext: () => LoginContextProps = () => {
        const { form } = this.props;
        const { tabs = [] } = this.state;
        return {
            tabUtil: {
                addTab: (id: string): void => {
                    this.setState({
                        tabs: [...tabs, id]
                    });
                },
                removeTab: (id: string): void => {
                    this.setState({
                        tabs: tabs.filter(currentId => currentId !== id)
                    });
                }
            },
            form: { ...form },
            updateActive: (activeItem): void => {
                const { type = '', active = {} } = this.state;
                if (active[type]) {
                    active[type].push(activeItem);
                } else {
                    active[type] = [activeItem];
                }
                this.setState({
                    active
                });
            }
        };
    };

    handleSubmit = (e: React.FormEvent): void => {
        e.preventDefault();
        const { active = {}, type = '' } = this.state;
        const { form, onSubmit } = this.props;
        const activeFields = active[type] || [];
        if (form) {
            form.validateFields(
                activeFields as string[],
                { force: true },
                (err, values) => {
                    if (onSubmit) {
                        onSubmit(err, values);
                    }
                }
            );
        }
    };

    render(): JSX.Element {
        const { className, children } = this.props;
        const { type, tabs = [] } = this.state;
        const TabChildren: React.ReactComponentElement<typeof LoginTab>[] = [];
        const otherChildren: React.ReactElement<unknown>[] = [];
        React.Children.forEach(
            children,
            (
                child:
                    | React.ReactComponentElement<typeof LoginTab>
                    | React.ReactElement<unknown>
            ) => {
                if (!child) {
                    return;
                }
                if ((child.type as { typeName: string }).typeName === 'LoginTab') {
                    TabChildren.push(
                        child as React.ReactComponentElement<typeof LoginTab>
                    );
                } else {
                    otherChildren.push(child);
                }
            }
        );
        return (
            <LoginContext.Provider value={this.getContext()}>
                <div className={classNames(className, styles.login)}>
                    <Form onSubmit={this.handleSubmit}>
                        {tabs.length ? (
                            <React.Fragment>
                                <Tabs
                                    animated={false}
                                    className={styles.tabs}
                                    activeKey={type}
                                    onChange={this.onSwitch}
                                >
                                    {TabChildren}
                                </Tabs>
                                {otherChildren}
                            </React.Fragment>
                        ) : (
                            children
                        )}
                    </Form>
                </div>
            </LoginContext.Provider>
        );
    }
}

(Object.keys(LoginItem) as (keyof LoginItemType)[]).forEach(item => {
    Login[item] = LoginItem[item];
});

export default Form.create<LoginProps>()(Login);
