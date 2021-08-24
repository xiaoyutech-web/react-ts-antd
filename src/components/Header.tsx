 /* 描述: 头部header模板
 */

import React, { useState } from 'react';
// import { NavLink } from 'react-router-dom';
import { Menu, Dropdown, Modal, Form, Button, Input, message } from 'antd';
import store from '@/store';
import { logout } from '@/store/actions';
import { DownOutlined } from '@ant-design/icons';
import logo from '@/assets/logo_head.png';
import avatar from '@/assets/avatar.jpg';
import '@/styles/header.less';
import { resetPwd } from '@/utils/api';
import { validPass } from '@/utils/valid';

interface Values {
    oldPassword: string,
    newPassword: string,
    confirmPassword: string
}

interface IProps {
    loading: boolean,
    visible: boolean,
    onOk: (values: Values) => void,
    onCancel: () => void
}

const formItemLayout = {
    labelCol: {
      sm: { span: 6 },
    },
    wrapperCol: {
      sm: { span: 12 },
    },
}

const ModifyUserForm: React.FC<IProps> = ({
    loading,
    visible,
    onOk,
    onCancel
}) => {
    const [form] = Form.useForm();

    const handleOk = () => {
        form.validateFields()
        .then((values: any) => {
            onOk(values);
        })
        .catch(info => {
            console.log('Validate Failed:', info);
        })
    }    

    const handleCancel = () => {
        form.resetFields();
        onCancel();
    }

    return (
        <Modal
            visible={ visible }
            centered
            title="修改密码"
            okText="确认"
            cancelText="取消"
            onCancel={ handleCancel }
            onOk={ handleOk }
            footer={[
                <Button key="back" onClick={ handleCancel }>取消</Button>,
                <Button key="submit" type="primary" loading={ loading } onClick={ handleOk }>确认</Button>,
              ]}
        >
            <Form
                form={form}
                {...formItemLayout}
                name="form_in_modal"
            >
                <Form.Item
                    label="旧密码"
                    name="oldPassword"
                    rules={[{ required: true, message: '请输入旧密码' }]}
                >
                    <Input type="password" placeholder="请输入旧密码" maxLength={ 20 } />
                </Form.Item>
                <Form.Item 
                    label="新密码"
                    name="newPassword"
                    rules={[{ required: true, message: '请输入新密码' }]}
                >
                    <Input type="password" placeholder="请输入新密码" maxLength={ 20 } />
                </Form.Item>
                <Form.Item 
                    label="确认新密码"
                    name="confirmPassword"
                    rules={[{ required: true, message: '请再次确认新密码' }]}
                >
                    <Input type="password" placeholder="请再次确认新密码" maxLength={ 20 } />
                </Form.Item>
            </Form>
        </Modal>
    )
}


const Header = (props: any) => {
    const [visible, setVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const { curActive } = props;
    console.log('props===', props)

    const onOk = (values: Values) => {
        console.log('Received values of form: ', values);

        if (!validPass(values.oldPassword)) {
            message.error("旧密码应为8到20位字母或数字！");
            return false;
        } else if (!validPass(values.newPassword)) {
            message.error("新密码应为8到20位字母或数字！");
            return false;
        } else if (!validPass(values.confirmPassword)){
            message.error("确认密码有误");
            return false;
        } else if (values.confirmPassword !== values.newPassword){
            message.error("两次密码不一致");
            return false;
        }
        
        setLoading(true);
        console.log((store.getState() as any).user.data)
        let username = (store.getState() as any).user.data.userData.username;

        let data = {
            username: username,
            oldPassword: values.oldPassword,
            newPassword: values.confirmPassword
        }

        resetPwd(data)
        .then((res: any) => {
            console.log('修改密码===', res)
            setLoading(false);
            if (res.code === 0) {
                setVisible(false);
                message.success('修改密码成功');
            } else {
                message.error(res.msg);
            }
        })
        .catch(() => {
            setLoading(false); 
        })
    }

    const onCancel = () => {
        setVisible(false);
    }

    const onClick = (e: any) => {
        // console.log(e.key)
        if (e.key === '1') {
            setVisible(true);
        } else {
            store.dispatch(logout());
        }
    };
    
    const menu = (
        <Menu onClick={ onClick }>
            <Menu.Item key="1">修改密码</Menu.Item>
            <Menu.Item key="2">退出</Menu.Item>
        </Menu>
    );

    return (
        <div className="header-container">
            <div className="header">
                <div className="section">
                    <img src={ logo } alt="logo" />
                    <ul>
                        <li>
                            <a href="/" rel="noopener noreferrer" className={ curActive }>首页</a>
                        </li>
                        <li>
                            <a href="/audit" target="_self" rel="noopener noreferrer"  className={ curActive }>产品评审</a>
                        </li>
                        <li>
                            <a href="/rank" target="_self" rel="noopener noreferrer"  >排名</a>
                        </li>
                      </ul>
                </div>

                <Dropdown overlay={ menu }>
                    <a className="dropdown-link" href="/#" onClick={ e => e.preventDefault() }>
                        <span className="username">{ (store.getState() as any).user.data.userData.username }</span>
                        <img className="avatar" src={ avatar } alt="" />
                        <DownOutlined />
                    </a>
                </Dropdown>
            </div>

     
            <ModifyUserForm
                visible={ visible }
                loading={ loading }
                onOk={ onOk }
                onCancel={ onCancel }
            />

        </div>
    )
}

export default Header
