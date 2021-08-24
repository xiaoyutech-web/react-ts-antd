/* 描述: 排名
 */

import * as React from "react";
import DocumentTitle from "react-document-title";
import { Column ,Line} from "@ant-design/charts";
import { useState, useEffect } from 'react';
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
import { StarOutlined, StarTwoTone, ExportOutlined } from "@ant-design/icons";
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
import { formatDate, formatTime } from "@/utils/valid";

interface Task {
  id: number;
  title: string;
  content: string;
  gmt_expire: number;
  status: number;
  is_major: any;
}

interface Values {
  id?: number;
  title: string;
  date: any;
  content: string;
}

interface IState {
  total: number;
  pageNo: number;
  pageSize: number;
  loading: boolean;
  textBtn: string;
  title: string;
  visible: boolean;
  currentRowData: Values;
  status: any;
  columns: ColumnsType<Task>;
  dataSource: Task[];
}

interface IProps {
  title: string;
  textBtn: string;
  visible: boolean;
  currentRowData: Values;
  onSubmitDrawer: (values: Values, type: number) => void;
  onCloseDrawer: () => void;
}

class Rank extends React.Component<any, IState> {
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
      columns: [
        {
          title: "序号",
          key: "id",
          align: "center",
          render: (text: any, record: any, index: number) => {
            let num = (this.state.pageNo - 1) * 10 + index + 1;
            return num;
          },
        },
        {
          title: "部门",
          dataIndex: "title",
          width: 150,
          key: "title",
          render: (text: any, record: any, index: number) => {
            const fav = this.state.dataSource[index].is_major;
            const style = {
              cursor: "pointer",
              fontSize: "16px",
            };

            const icon =
              fav === 0 ? (
                <StarOutlined style={style} />
              ) : (
                <StarTwoTone style={style} twoToneColor="#f50" />
              );

            return (
              <div>
                <span onClick={() => this.toggleFav(record, index)}>
                  {icon}
                </span>{" "}
                {record.title}
              </div>
            );
          },
        },
        {
          title: "被评审产品",
          dataIndex: "content",
          key: "content",
        },
        {
          title: "被评审模块",
          dataIndex: "content",
          key: "content",
        },
        {
          title: "产品质量综合得分",
          dataIndex: "status",
          key: "status",
          width: 150,
          render: (text: any, record: any) => {
            const txt =
              record.status === 0 ? "0" : record.status === 1 ? "100" : "50";
            return txt;
          },
        },
        {
          title: "产品质量投票得分",
          dataIndex: "status",
          key: "status",
          width: 150,
          render: (text: any, record: any) => {
            const txt =
              record.status === 0 ? "0" : record.status === 1 ? "100" : "50";
            return txt;
          },
        },
        {
          title: "总分",
          dataIndex: "status",
          key: "status",
          width: 150,
          render: (text: any, record: any) => {
            const txt =
              record.status === 0 ? "0" : record.status === 1 ? "100" : "50";
            return txt;
          },
        },
        {
          title: "提交日期",
          dataIndex: "gmt_expire",
          key: "gmt_expire",
          render: (text: any, record: any) => formatTime(record.gmt_expire),
        },
      ],
    };
  }

  componentDidMount() {
    console.log("componentDidMount===");
    this.getTaskList();
  }

  componentWillUnmount() {
    console.log("componentWillUnmount===");
  }

  // 重要或不重要
  toggleFav = (record: any, index: number) => {
    if (record.status === 2) {
      message.error("数据已删除");
    } else {
      // is_major: 0:不重要 1:重要
      let data = {
        id: record.id,
        is_major: this.state.dataSource[index].is_major === 0 ? 1 : 0,
      };

      updateMark(data).then((res: any) => {
        console.log("操作标记===", res);
        if (res.code === 0) {
          this.setState(
            {
              pageNo: 1,
            },
            () => {
              this.getTaskList();
              message.success("更新标记成功");
            }
          );
        } else {
          message.error(res.msg);
        }
      });
    }
  };

  // 获取任务列表数据
  getTaskList = () => {
    const { pageNo, pageSize, status } = this.state;
    this.setState({
      loading: true,
    });

    let params = {
      pageNo: pageNo,
      pageSize: pageSize,
      status: status,
    };

    queryTaskList(params)
      .then((res: any) => {
        console.log("任务列表===", res);
        this.setState({
          loading: false,
        });

        if (res.code === 0 && res.data) {
          this.setState({
            dataSource: res.data.rows,
            total: res.data.total,
          });
        } else {
          this.setState({
            dataSource: [],
            total: 0,
          });
        }
      })
      .catch(() => {
        this.setState({
          loading: false,
        });
      });
  };

  // 添加任务对话框
  addTask = () => {
    console.log("添加任务===");
    this.setState({
      title: "添加任务",
      textBtn: "提交",
      visible: true,
      currentRowData: {
        id: -1,
        title: "",
        date: "",
        content: "",
      },
    });
  };

  // 编辑任务对话框
  editTask = (record: any, index: number) => {
    console.log("编辑任务===", record);
    this.setState({
      title: "编辑任务",
      textBtn: "保存",
      visible: true,
      currentRowData: {
        id: record.id,
        title: record.title,
        date: moment(record.gmt_expire),
        content: record.content,
      },
    });
  };

  // 删除任务
  removeTask = (id: number) => {
    console.log("删除任务===");
    let data = {
      id: id,
      status: 2,
    };

    deleteTask(data).then((res: any) => {
      console.log("删除任务===", res);
      if (res.code === 0) {
        this.setState(
          {
            pageNo: 1,
          },
          () => {
            this.getTaskList();
            message.success("任务删除成功");
          }
        );
      } else {
        message.error(res.msg);
      }
    });
  };

  // 完成/待办任务
  completeTask = (record: any) => {
    console.log("完成/待办任务===");
    let status = record.status === 0 ? 1 : record.status === 1 ? 0 : null;

    let data = {
      id: record.id,
      status: status,
    };

    updateTaskStatus(data).then((res: any) => {
      console.log("操作状态===", res);
      if (res.code === 0) {
        this.setState(
          {
            pageNo: 1,
          },
          () => {
            this.getTaskList();
            message.success("更新任务状态成功");
          }
        );
      } else {
        message.error(res.msg);
      }
    });
  };

  // 提交添加或编辑表单
  onSubmit = (values: Values, type: number) => {
    console.log("表单提交===", values);
    const { currentRowData } = this.state;
    if (type === 1) {
      let data = {
        title: values.title,
        gmt_expire: moment(values.date).valueOf(),
        content: values.content,
      };

      addTask(data)
        .then((res: any) => {
          console.log("添加任务===", res);
          this.setState({
            visible: false,
          });
          if (res.code === 0) {
            this.setState(
              {
                pageNo: 1,
              },
              () => {
                this.getTaskList();
                message.success(`新增任务 <${values.title}> 成功`);
              }
            );
          } else {
            message.error(res.msg);
          }
        })
        .catch(() => {
          this.setState({
            visible: false,
          });
        });
    } else if (type === 2) {
      let data = {
        id: currentRowData.id,
        title: values.title,
        gmt_expire: moment(values.date).valueOf(),
        content: values.content,
      };

      editTask(data)
        .then((res: any) => {
          console.log("编辑任务===", res);
          this.setState({
            visible: false,
          });
          if (res.code === 0) {
            this.setState(
              {
                pageNo: 1,
              },
              () => {
                this.getTaskList();
                message.success(`更新任务 <${values.title}> 成功`);
              }
            );
          } else {
            message.error(res.msg);
          }
        })
        .catch(() => {
          this.setState({
            visible: false,
          });
        });
    }
  };

  // 关闭任务对话框
  onClose = () => {
    this.setState({
      visible: false,
      currentRowData: {
        id: -1,
        title: "",
        date: "",
        content: "",
      },
    });
  };

  // 页码改变的回调，返回改变后的页码
  changePage = (pageNo: number) => {
    console.log("pageNo=", pageNo);
    this.setState(
      {
        pageNo,
      },
      () => {
        this.getTaskList();
      }
    );
  };

  // 筛选任务状态
  handleChange = (value: number) => {
    console.log("任务状态筛选===", typeof value === "string");
    this.setState(
      {
        status: typeof value === "string" ? null : value,
        pageNo: 1,
      },
      () => {
        this.getTaskList();
      }
    );
  };

  render() {
    const {
      total,
      pageNo,
      pageSize,
      loading,
      dataSource,
      columns,
      visible,
      title,
      textBtn,
      currentRowData,
    } = this.state;
    const { Option } = Select;
    var data = [
      {
        type: "家具家电",
        sales: 38,
      },
      {
        type: "粮油副食",
        sales: 52,
      },
      {
        type: "生鲜水果",
        sales: 61,
      },
      {
        type: "美容洗护",
        sales: 145,
      },
      {
        type: "母婴用品",
        sales: 48,
      },
      {
        type: "进口食品",
        sales: 38,
      },
      {
        type: "食品饮料",
        sales: 38,
      },
      {
        type: "家庭清洁",
        sales: 38,
      },
    ];
    const config: any =  {
      data: data,
      xField: "type",
      yField: "sales",
      label: {
        position: "middle",
        style: {
          fill: "#FFFFFF",
          opacity: 0.6,
        },
      },
      xAxis: {
        label: {
          autoHide: true,
          autoRotate: false,
        },
      },
      meta: {
        type: { alias: "类别" },
        sales: { alias: "销售额" },
      },
    };
    return (
      <DocumentTitle title={"排名"}>
        <div className="home-container">
          <Header curActive={"/rank"} />

          <div className="content clearfix">
            <div className="list">
              <h2>排名前十</h2>
              <div className="list-right">
                <Space size="middle">
                  <Select
                    size="large"
                    onChange={this.handleChange}
                    style={{ width: 160 }}
                    allowClear
                    placeholder="请筛选部门"
                  >
                    <Option value="">全部</Option>
                    <Option value={0}>待办</Option>
                  </Select>
                  <Button type="primary" size="large" onClick={this.addTask}>
                    <ExportOutlined /> 导出
                  </Button>
                </Space>
              </div>
            </div>
            <Column  style={{padding:50}} {...config} /> 
          
            <Table
              bordered
              rowKey={(record) => record.id}
              dataSource={dataSource}
              columns={columns}
              loading={loading}
              pagination={false}
            />
            <Pagination
              className="pagination"
              total={total}
              style={{ display: loading && total === 0 ? "none" : "" }}
              showTotal={(total) => `共 ${total} 条数据`}
              onChange={this.changePage}
              current={pageNo}
              showSizeChanger={false}
              defaultPageSize={pageSize}
              hideOnSinglePage={false}
            />
          </div>

          <Footer />
        </div>
      </DocumentTitle>
    );
  }
}

export default Rank;
