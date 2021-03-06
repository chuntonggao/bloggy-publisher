import { Avatar, Icon, Menu, Spin } from 'antd';
import { ClickParam } from 'antd/es/menu';
import { connect } from 'dva';
import React from 'react';
import { router } from 'umi';
import { FormattedMessage } from 'umi-plugin-react/locale';

import { ConnectProps, ConnectState } from '@/models/connect';
import { IUser } from '@/models/user';

import HeaderDropdown from '../HeaderDropdown';
import styles from './index.less';

export interface GlobalHeaderRightProps extends ConnectProps {
    currentUser?: IUser;
    menu?: boolean;
}

class AvatarDropdown extends React.Component<GlobalHeaderRightProps> {
    onMenuClick = (event: ClickParam): void => {
        const { key } = event;

        if (key === 'logout') {
            const { dispatch } = this.props;
            if (dispatch) {
                dispatch({
                    type: 'login/logout'
                });
            }

            return;
        }
        router.push(`/account/${key}`);
    };

    render(): JSX.Element {
        const { currentUser = { avatar: '', name: '' }, menu } = this.props;

        const menuHeaderDropdown = (
            <Menu
                className={styles.menu}
                selectedKeys={[]}
                onClick={this.onMenuClick}
            >
                {menu && (
                    <Menu.Item key="center">
                        <Icon type="user" />
                        <FormattedMessage
                            id="menu.avatar.center"
                            defaultMessage="account center"
                        />
                    </Menu.Item>
                )}
                {menu && (
                    <Menu.Item key="settings">
                        <Icon type="setting" />
                        <FormattedMessage
                            id="menu.avatar.settings"
                            defaultMessage="account settings"
                        />
                    </Menu.Item>
                )}
                {menu && <Menu.Divider />}

                <Menu.Item key="logout">
                    <Icon type="logout" />
                    <FormattedMessage id="menu.avatar.logout" />
                </Menu.Item>
            </Menu>
        );

        return currentUser && currentUser.name ? (
            <HeaderDropdown overlay={menuHeaderDropdown}>
                <span className={`${styles.action} ${styles.account}`}>
                    <Avatar
                        size="small"
                        className={styles.avatar}
                        src={currentUser.avatar}
                        alt="avatar"
                    />
                    <span className={styles.name}>{currentUser.name}</span>
                </span>
            </HeaderDropdown>
        ) : (
            <Spin size="small" style={{ marginLeft: 8, marginRight: 8 }} />
        );
    }
}
export default connect(({ user }: ConnectState) => ({
    currentUser: user.currentUser
}))(AvatarDropdown);
