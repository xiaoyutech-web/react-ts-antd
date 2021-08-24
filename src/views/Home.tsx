/* 描述: 首页
 */

import * as React from "react";
import { Descriptions } from "antd";
import DocumentTitle from "react-document-title";
import {
  Drawer,
  Button,
  Table,
  Space,
  Pagination,
  message,
  Select,
  Form,
  Input,
  DatePicker,
} from "antd";
import { StarOutlined, StarTwoTone, PlusOutlined } from "@ant-design/icons";
import { ColumnsType } from "antd/es/table";
import moment from "moment";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "@/styles/home.less";
import {
  queryTaskList,
  addTask,
  editTask,
  updateTaskStatus,
  updateMark,
  deleteTask,
} from "@/utils/api";

class Home extends React.Component<any> {
  constructor(props: any) {
    super(props);
    this.state = {
      total: 0,
      pageNo: 1,
      pageSize: 10,
      loading: false,
      textBtn: "提交",
      title: "添加任务",
      currentRowData: {
        id: -1,
        title: "",
        date: "",
        content: "",
      },
      visible: false,
      dataSource: [],
      status: null, // 0：待办 1：完成 2：删除
    };
  }

  componentDidMount() {
    console.log("componentDidMount===");
  }

  componentWillUnmount() {
    console.log("componentWillUnmount===");
  }

  render() {
    const {} = this.state;
    const { Option } = Select;

    return (
      <DocumentTitle title={"首页"}>
        <div className="home-container">
          <Header curActive={"/"} />

          <div className="content clearfix">
            <Descriptions title="个人信息" column={1} bordered>
              <Descriptions.Item label="部门">融合通信系统部</Descriptions.Item>
              <Descriptions.Item label="团队名">XX战队</Descriptions.Item>
              <Descriptions.Item label="成员">
                xx,xxxx,xx,xx,xx
              </Descriptions.Item>
            </Descriptions>
          </div>
          <Footer />
        </div>
      </DocumentTitle>
    );
  }
}

export default Home;
