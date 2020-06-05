import { Avatar, Card, Divider, notification, Popconfirm, Table, Tag } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import React, { Fragment } from 'react';
import { AnyAction, Dispatch } from 'redux';
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale';

import { emptyArticle, IArticle } from '@/models/article';
import { ConnectState } from '@/models/connect';
import { IUser } from '@/models/user';
import { GetArticleListRequestBody } from '@/services/article';

import ArticleDetail from './ArticleDetail';
import ArticleListToolbar from './ArticleListToolbar';

interface ArticleListProps {
    loading?: boolean;
    articleList: IArticle[];
    dispatch: Dispatch<AnyAction>;
    userId: IUser['_id'];
}

export type Mode = 'list' | 'create' | 'edit';

interface ArticleListState {
    mode: Mode;
    selectedArticle: IArticle;
}

class ArticleList extends React.Component<ArticleListProps, ArticleListState> {
    state = { mode: 'list' as Mode, selectedArticle: emptyArticle };

    componentDidMount(): void {
        this.props.dispatch({
            type: 'article/getArticleList',
            payload: {
                user: this.props.userId,
                isVisitor: false
            } as GetArticleListRequestBody
        });
    }

    setMode = (mode: Mode): void => {
        this.setState({ mode });
    };

    showComments = (): void => {
        notification.info({
            message: formatMessage({ id: 'article.not-implemented' })
        });
    };

    handleDelete = (): void => {
        notification.info({
            message: formatMessage({ id: 'article.not-implemented' })
        });
    };

    handleEdit = (record: IArticle): void => {
        this.setState({
            mode: 'edit',
            selectedArticle: record
        });
    };

    render(): JSX.Element {
        const { loading, articleList } = this.props;
        const { mode, selectedArticle } = this.state;
        if (mode === 'create') {
            return (
                <ArticleDetail
                    type="create"
                    article={emptyArticle}
                    setParentMode={this.setMode}
                />
            );
        } else if (mode === 'edit') {
            return (
                <ArticleDetail
                    type="edit"
                    article={selectedArticle}
                    setParentMode={this.setMode}
                />
            );
        } else {
            // mode === 'list'

            const columns = [
                {
                    title: formatMessage({ id: 'article.title' }),

                    dataIndex: 'title'
                },

                {
                    title: formatMessage({ id: 'article.backgroundImage' }),

                    dataIndex: 'imgUrl',
                    render: (imgUrl: IArticle['imgUrl']): JSX.Element => (
                        <Avatar shape="square" src={imgUrl} size={40} icon="user" />
                    )
                },
                {
                    title: formatMessage({ id: 'article.categories' }),
                    dataIndex: 'categories',

                    render: (categories: IArticle['categories']): JSX.Element => (
                        <span>
                            {categories.map(category => (
                                <Tag color="cyan" key={category._id}>
                                    {category.name}
                                </Tag>
                            ))}
                        </span>
                    )
                },

                {
                    title: formatMessage({ id: 'article.state' }),
                    dataIndex: 'isDraft',

                    render: (isDraft: IArticle['isDraft']): JSX.Element => {
                        if (isDraft) {
                            return (
                                <Tag color="red">
                                    <FormattedMessage id="article.draft" />
                                </Tag>
                            );
                        } else {
                            return (
                                <Tag color="green">
                                    <FormattedMessage id="article.public" />
                                </Tag>
                            );
                        }
                    }
                },
                {
                    title: formatMessage({ id: 'article.views-likes-comments' }),

                    dataIndex: 'meta',
                    render: (meta: IArticle['meta']): JSX.Element => (
                        <div>
                            <span>{meta.numViews}</span> -{' '}
                            <span>{meta.numLikes}</span> -{' '}
                            <span>{meta.numComments}</span>
                        </div>
                    )
                },

                {
                    title: formatMessage({ id: 'article.createdOn' }),
                    dataIndex: 'createdOn',
                    sorter: true,
                    render: (createdOn: IArticle['createdOn']): JSX.Element => (
                        <span>
                            {moment(createdOn).format('YYYY-MM-DD HH:mm:ss')}
                        </span>
                    )
                },

                {
                    title: formatMessage({ id: 'article.updatedOn' }),
                    dataIndex: 'updatedOn',
                    sorter: true,
                    render: (updatedOn: IArticle['updatedOn']): JSX.Element => (
                        <span>
                            {moment(updatedOn).format('YYYY-MM-DD HH:mm:ss')}
                        </span>
                    )
                },
                {
                    title: formatMessage({ id: 'article.operations' }),

                    render: (text: string, record: IArticle): JSX.Element => (
                        <div>
                            <Fragment>
                                <a onClick={(): void => this.handleEdit(record)}>
                                    <FormattedMessage id="article.edit" />
                                </a>
                            </Fragment>
                            <Divider type="vertical" />
                            <Fragment>
                                <a onClick={this.showComments}>
                                    <FormattedMessage id="article.comments" />
                                </a>
                            </Fragment>
                            <Divider type="vertical" />
                            <Fragment>
                                <a
                                    href="#"
                                    // eslint-disable-next-line react/jsx-no-target-blank
                                    target="_blank"
                                >
                                    <FormattedMessage id="article.view" />
                                </a>
                            </Fragment>
                            <Divider type="vertical" />
                            <Popconfirm
                                title={formatMessage({
                                    id: 'article.confirm-delete'
                                })}
                                onConfirm={this.handleDelete}
                            >
                                {/* eslint-disable-next-line no-script-url */}
                                <a href="javascript:;">
                                    <FormattedMessage id="article.delete" />
                                </a>
                            </Popconfirm>
                        </div>
                    )
                }
            ];
            return (
                <Card bordered={false}>
                    <div className="">
                        <ArticleListToolbar setParentMode={this.setMode} />
                        <Table
                            size="middle"
                            loading={loading}
                            rowKey={(record: IArticle): string => record._id}
                            columns={columns}
                            bordered
                            dataSource={articleList}
                        />
                    </div>
                </Card>
            );
        }
    }
}

export default connect(({ article, loading, user }: ConnectState) => ({
    articleList: article.articleList,
    userId: user.currentUser._id,
    loading: loading.models.article && loading.models.user
}))(ArticleList);